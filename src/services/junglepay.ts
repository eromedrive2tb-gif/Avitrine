import { db } from '../db';
import { paymentGateways, plans, checkouts } from '../db/schema';
import { eq } from 'drizzle-orm';

// --- Types ---

export interface PixChargeRequest {
  customerName: string;
  customerEmail: string;
  customerDocument: string;
  customerPhone: string;
  totalAmount: number; // em centavos
  planId: number;
  orderBump: boolean;
}

export interface PixChargeResponse {
  success: true;
  transactionId: number;
  pixQrCode: string;
  pixUrl: string;
  expirationDate: string;
  status: string;
}

export interface PixChargeError {
  success: false;
  error: string;
  code: 'GATEWAY_NOT_CONFIGURED' | 'GATEWAY_INACTIVE' | 'INVALID_DATA' | 'API_ERROR' | 'UNEXPECTED_RESPONSE' | 'CARD_REFUSED';
}

export type PixChargeResult = PixChargeResponse | PixChargeError;

// --- Credit Card Types ---

export interface CardChargeRequest {
  customerName: string;
  customerEmail: string;
  customerDocument: string;
  customerPhone: string;
  totalAmount: number; // em centavos
  planId: number;
  orderBump: boolean;
  cardHash: string; // Token gerado pelo JunglePagamentos.encrypt()
  installments: number;
}

export interface CardChargeResponse {
  success: true;
  transactionId: number;
  status: string;
  cardLastDigits: string;
  cardBrand: string;
  installments: number;
}

export type CardChargeResult = CardChargeResponse | PixChargeError;

// Resposta da API JunglePay
interface JunglePayTransactionResponse {
  id: number;
  status: string;
  amount: number;
  secureUrl?: string;
  installments?: number;
  pix?: {
    qrcode: string;
    expirationDate: string;
    end2EndId?: string | null;
    receiptUrl?: string | null;
  };
  card?: {
    id: number;
    brand: string;
    holderName: string;
    lastDigits: string;
    expirationMonth: number;
    expirationYear: number;
  };
  refusedReason?: {
    code: string;
    message: string;
  } | null;
  customer?: any;
  items?: any[];
}

// --- Service ---

export class JunglePayService {

  /**
   * Verifica se JunglePay está configurado e ativo
   */
  static async getActiveGateway() {
    const [gateway] = await db
      .select()
      .from(paymentGateways)
      .where(eq(paymentGateways.name, 'JunglePay'))
      .limit(1);

    return gateway;
  }

  /**
   * Gera a autenticação Basic Auth para a API JunglePay
   */
  static generateAuthHeader(secretKey: string): string {
    const credentials = `${secretKey}:x`;
    // Usando btoa para base64 encode (disponível no Bun)
    const base64Credentials = btoa(credentials);
    return `Basic ${base64Credentials}`;
  }

  /**
   * Remove caracteres especiais do CPF (000.000.000-00 -> 00000000000)
   */
  static sanitizeDocument(document: string): string {
    return document.replace(/\D/g, '');
  }

  /**
   * Remove caracteres especiais do telefone ((00) 00000-0000 -> 0000000000)
   */
  static sanitizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Busca o plano pelo ID
   */
  static async getPlanById(planId: number) {
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, planId))
      .limit(1);

    return plan;
  }

  /**
   * Cria uma cobrança PIX via JunglePay
   */
  static async createPixCharge(request: PixChargeRequest): Promise<PixChargeResult> {
    // 1. Verificar se JunglePay está configurado e ativo
    const gateway = await this.getActiveGateway();

    if (!gateway) {
      return {
        success: false,
        error: 'Gateway JunglePay não está configurado no sistema.',
        code: 'GATEWAY_NOT_CONFIGURED'
      };
    }

    if (!gateway.isActive) {
      return {
        success: false,
        error: 'Gateway JunglePay está configurado mas não está ativo.',
        code: 'GATEWAY_INACTIVE'
      };
    }

    if (!gateway.secretKey) {
      return {
        success: false,
        error: 'Chave secreta da JunglePay não está configurada.',
        code: 'GATEWAY_NOT_CONFIGURED'
      };
    }

    // 2. Validar dados obrigatórios
    if (!request.customerName || !request.customerEmail || !request.customerDocument) {
      return {
        success: false,
        error: 'Dados do cliente incompletos: nome, email e CPF são obrigatórios.',
        code: 'INVALID_DATA'
      };
    }

    if (!request.totalAmount || request.totalAmount <= 0) {
      return {
        success: false,
        error: 'Valor total inválido.',
        code: 'INVALID_DATA'
      };
    }

    // 3. Buscar informações do plano
    const plan = await this.getPlanById(request.planId);

    if (!plan) {
      return {
        success: false,
        error: 'Plano não encontrado.',
        code: 'INVALID_DATA'
      };
    }

    // 4. Montar o payload para a API JunglePay
    const items: Array<{ title: string; unitPrice: number; quantity: number; tangible: boolean }> = [
      {
        title: plan.name,
        unitPrice: plan.price,
        quantity: 1,
        tangible: false
      }
    ];

    // Adicionar order bump se incluído
    if (request.orderBump) {
      items.push({
        title: 'Acesso Antecipado Premium',
        unitPrice: 1990, // R$ 19,90
        quantity: 1,
        tangible: false
      });
    }

    const payload = {
      paymentMethod: 'pix',
      amount: request.totalAmount,
      customer: {
        name: request.customerName,
        email: request.customerEmail,
        phone: this.sanitizePhone(request.customerPhone),
        document: {
          number: this.sanitizeDocument(request.customerDocument),
          type: 'cpf'
        }
      },
      items,
      pix: {
        expiresInDays: 1
      },
      postbackUrl: process.env.BASE_URL 
        ? `${process.env.BASE_URL}/api/webhook/junglepay`
        : undefined
    };

    // 5. Fazer a chamada HTTP para a API JunglePay
    try {
      const response = await fetch('https://api.junglepagamentos.com/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.generateAuthHeader(gateway.secretKey)
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[JunglePay] API Error:', response.status, errorData);
        return {
          success: false,
          error: `Erro na API JunglePay: ${response.status} - ${errorData}`,
          code: 'API_ERROR'
        };
      }

      const data: JunglePayTransactionResponse = await response.json();

      // 6. Validar resposta
      if (!data.pix || !data.pix.qrcode) {
        console.error('[JunglePay] Resposta inesperada:', data);
        return {
          success: false,
          error: 'Resposta da API JunglePay não contém dados do PIX.',
          code: 'UNEXPECTED_RESPONSE'
        };
      }

      // 7. Criar registro do checkout no banco
      await db.insert(checkouts).values({
        planId: request.planId,
        paymentMethod: 'pix',
        orderBump: request.orderBump,
        totalAmount: request.totalAmount,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerDocument: this.sanitizeDocument(request.customerDocument),
        customerPhone: this.sanitizePhone(request.customerPhone),
        status: 'pending'
      });

      // 8. Retornar dados do PIX
      return {
        success: true,
        transactionId: data.id,
        pixQrCode: data.pix.qrcode,
        pixUrl: data.secureUrl || '',
        expirationDate: data.pix.expirationDate,
        status: data.status
      };

    } catch (error: any) {
      console.error('[JunglePay] Request Error:', error);
      return {
        success: false,
        error: `Erro ao conectar com JunglePay: ${error.message}`,
        code: 'API_ERROR'
      };
    }
  }

  /**
   * Cria uma cobrança de cartão de crédito via JunglePay
   */
  static async createCardCharge(request: CardChargeRequest): Promise<CardChargeResult> {
    // 1. Verificar se JunglePay está configurado e ativo
    const gateway = await this.getActiveGateway();

    if (!gateway) {
      return {
        success: false,
        error: 'Gateway JunglePay não está configurado no sistema.',
        code: 'GATEWAY_NOT_CONFIGURED'
      };
    }

    if (!gateway.isActive) {
      return {
        success: false,
        error: 'Gateway JunglePay está configurado mas não está ativo.',
        code: 'GATEWAY_INACTIVE'
      };
    }

    if (!gateway.secretKey) {
      return {
        success: false,
        error: 'Chave secreta da JunglePay não está configurada.',
        code: 'GATEWAY_NOT_CONFIGURED'
      };
    }

    // 2. Validar dados obrigatórios
    if (!request.customerName || !request.customerEmail || !request.customerDocument) {
      return {
        success: false,
        error: 'Dados do cliente incompletos: nome, email e CPF são obrigatórios.',
        code: 'INVALID_DATA'
      };
    }

    if (!request.cardHash) {
      return {
        success: false,
        error: 'Token do cartão não foi fornecido.',
        code: 'INVALID_DATA'
      };
    }

    if (!request.totalAmount || request.totalAmount <= 0) {
      return {
        success: false,
        error: 'Valor total inválido.',
        code: 'INVALID_DATA'
      };
    }

    // 3. Buscar informações do plano
    const plan = await this.getPlanById(request.planId);

    if (!plan) {
      return {
        success: false,
        error: 'Plano não encontrado.',
        code: 'INVALID_DATA'
      };
    }

    // 4. Montar o payload para a API JunglePay
    const items: Array<{ title: string; unitPrice: number; quantity: number; tangible: boolean }> = [
      {
        title: plan.name,
        unitPrice: plan.price,
        quantity: 1,
        tangible: false
      }
    ];

    // Adicionar order bump se incluído
    if (request.orderBump) {
      items.push({
        title: 'Acesso Antecipado Premium',
        unitPrice: 1990, // R$ 19,90
        quantity: 1,
        tangible: false
      });
    }

    const payload = {
      paymentMethod: 'credit_card',
      amount: request.totalAmount,
      installments: request.installments || 1,
      card: {
        hash: request.cardHash
      },
      customer: {
        name: request.customerName,
        email: request.customerEmail,
        phone: this.sanitizePhone(request.customerPhone),
        document: {
          number: this.sanitizeDocument(request.customerDocument),
          type: 'cpf'
        }
      },
      items,
      postbackUrl: process.env.BASE_URL 
        ? `${process.env.BASE_URL}/api/webhook/junglepay`
        : undefined
    };

    // 5. Fazer a chamada HTTP para a API JunglePay
    try {
      console.log('[JunglePay] Processando cartão de crédito...');
      
      const response = await fetch('https://api.junglepagamentos.com/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.generateAuthHeader(gateway.secretKey)
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[JunglePay] API Error:', response.status, errorData);
        return {
          success: false,
          error: `Erro na API JunglePay: ${response.status} - ${errorData}`,
          code: 'API_ERROR'
        };
      }

      const data: JunglePayTransactionResponse = await response.json();
      console.log('[JunglePay] Resposta:', data.status, data.id);

      // 6. Verificar se foi recusado
      if (data.status === 'refused') {
        const reason = data.refusedReason?.message || 'Cartão recusado pela operadora';
        console.error('[JunglePay] Cartão recusado:', reason);
        return {
          success: false,
          error: reason,
          code: 'CARD_REFUSED'
        };
      }

      // 7. Criar registro do checkout no banco
      await db.insert(checkouts).values({
        planId: request.planId,
        paymentMethod: 'credit_card',
        orderBump: request.orderBump,
        totalAmount: request.totalAmount,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerDocument: this.sanitizeDocument(request.customerDocument),
        customerPhone: this.sanitizePhone(request.customerPhone),
        status: data.status === 'paid' ? 'paid' : 'pending'
      });

      // 8. Retornar dados do cartão
      return {
        success: true,
        transactionId: data.id,
        status: data.status,
        cardLastDigits: data.card?.lastDigits || '****',
        cardBrand: data.card?.brand || 'unknown',
        installments: data.installments || 1
      };

    } catch (error: any) {
      console.error('[JunglePay] Request Error:', error);
      return {
        success: false,
        error: `Erro ao conectar com JunglePay: ${error.message}`,
        code: 'API_ERROR'
      };
    }
  }
}
