/**
 * Server-Sent Events (SSE) Manager
 * Gerencia conexões de clientes aguardando notificações de pagamento
 */

type SSEClient = {
  checkoutId: number;
  controller: ReadableStreamDefaultController<Uint8Array>;
  createdAt: Date;
};

// Map de checkoutId -> array de clients (pode haver múltiplas abas abertas)
const clients = new Map<number, SSEClient[]>();

// Encoder para converter strings em Uint8Array
const encoder = new TextEncoder();

/**
 * Registra um novo cliente SSE
 */
export function registerClient(checkoutId: number, controller: ReadableStreamDefaultController<Uint8Array>): void {
  const client: SSEClient = {
    checkoutId,
    controller,
    createdAt: new Date()
  };

  const existing = clients.get(checkoutId) || [];
  existing.push(client);
  clients.set(checkoutId, existing);

  console.log(`[SSE] Client registered for checkout ${checkoutId}. Total clients: ${getTotalClients()}`);
}

/**
 * Remove um cliente SSE
 */
export function unregisterClient(checkoutId: number, controller: ReadableStreamDefaultController<Uint8Array>): void {
  const existing = clients.get(checkoutId);
  if (!existing) return;

  const filtered = existing.filter(c => c.controller !== controller);
  
  if (filtered.length === 0) {
    clients.delete(checkoutId);
  } else {
    clients.set(checkoutId, filtered);
  }

  console.log(`[SSE] Client unregistered for checkout ${checkoutId}. Total clients: ${getTotalClients()}`);
}

/**
 * Notifica todos os clientes aguardando um checkout específico
 */
export function notifyPaymentConfirmed(checkoutId: number, data: {
  status: string;
  paymentMethod?: string;
  customerEmail?: string;
}): void {
  const checkoutClients = clients.get(checkoutId);
  
  if (!checkoutClients || checkoutClients.length === 0) {
    console.log(`[SSE] No clients waiting for checkout ${checkoutId}`);
    return;
  }

  const eventData = JSON.stringify({
    type: 'payment_confirmed',
    checkoutId,
    status: data.status,
    paymentMethod: data.paymentMethod,
    customerEmail: data.customerEmail,
    timestamp: new Date().toISOString()
  });

  const sseMessage = `event: payment_confirmed\ndata: ${eventData}\n\n`;
  const encoded = encoder.encode(sseMessage);

  console.log(`[SSE] Notifying ${checkoutClients.length} client(s) for checkout ${checkoutId}`);

  // Enviar para todos os clientes deste checkout
  for (const client of checkoutClients) {
    try {
      client.controller.enqueue(encoded);
    } catch (error) {
      console.error(`[SSE] Error sending to client:`, error);
    }
  }

  // Cleanup: remover todos os clientes deste checkout após notificação
  clients.delete(checkoutId);
  console.log(`[SSE] Clients cleared for checkout ${checkoutId}. Total clients: ${getTotalClients()}`);
}

/**
 * Envia heartbeat para manter conexão viva
 */
export function sendHeartbeat(controller: ReadableStreamDefaultController<Uint8Array>): void {
  try {
    const heartbeat = encoder.encode(`: heartbeat\n\n`);
    controller.enqueue(heartbeat);
  } catch (error) {
    // Cliente provavelmente desconectou
  }
}

/**
 * Retorna o total de clientes conectados
 */
export function getTotalClients(): number {
  let total = 0;
  for (const clientList of clients.values()) {
    total += clientList.length;
  }
  return total;
}

/**
 * Limpa conexões antigas (mais de 15 minutos)
 */
export function cleanupStaleConnections(): void {
  const now = new Date();
  const maxAge = 15 * 60 * 1000; // 15 minutos

  for (const [checkoutId, clientList] of clients.entries()) {
    const activeClients = clientList.filter(client => {
      const age = now.getTime() - client.createdAt.getTime();
      if (age > maxAge) {
        try {
          client.controller.close();
        } catch (e) {
          // Ignorar erros ao fechar
        }
        return false;
      }
      return true;
    });

    if (activeClients.length === 0) {
      clients.delete(checkoutId);
    } else {
      clients.set(checkoutId, activeClients);
    }
  }

  console.log(`[SSE] Cleanup complete. Total clients: ${getTotalClients()}`);
}

// Executar cleanup a cada 5 minutos
setInterval(cleanupStaleConnections, 5 * 60 * 1000);

export const SSEManager = {
  registerClient,
  unregisterClient,
  notifyPaymentConfirmed,
  sendHeartbeat,
  getTotalClients,
  cleanupStaleConnections
};
