import { FC } from 'hono/jsx';
import { Badge } from '../atoms/Badge';

// --- Types ---

export interface CheckoutTransaction {
  id: number;
  customerName: string | null;
  customerEmail: string | null;
  customerDocument: string | null;
  customerPhone: string | null;
  totalAmount: number;
  paymentMethod: 'pix' | 'credit_card' | null;
  status: 'pending' | 'paid' | 'failed' | 'abandoned' | null;
  orderBump: boolean | null;
  planName?: string;
  createdAt: Date | null;
}

export interface SubscriptionTransaction {
  id: number;
  userName: string | null;
  userEmail: string;
  planName: string | null;
  planPrice: number | null;
  startDate: Date | null;
  endDate: Date | null;
  status: 'active' | 'expired' | 'pending' | null;
  externalId: string | null;
  createdAt: Date | null;
}

interface TransactionsTableProps {
  gatewayType: 'JunglePay' | 'Dias Marketplace';
  checkouts?: CheckoutTransaction[];
  subscriptions?: SubscriptionTransaction[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  filters?: {
    status?: string;
    search?: string;
  };
}

// --- Helper Functions ---

function formatCurrency(cents: number | null): string {
  if (cents === null) return 'R$ 0,00';
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(date: Date | string | null): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDocument(doc: string | null): string {
  if (!doc) return '-';
  // Já formatado ou formata CPF
  if (doc.includes('.')) return doc;
  if (doc.length === 11) {
    return `${doc.slice(0,3)}.${doc.slice(3,6)}.${doc.slice(6,9)}-${doc.slice(9)}`;
  }
  return doc;
}

function getStatusBadge(status: string | null, type: 'checkout' | 'subscription') {
  if (!status) return <Badge variant="secondary">-</Badge>;
  
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'secondary' | 'primary'> = {
    paid: 'success',
    active: 'success',
    pending: 'warning',
    failed: 'danger',
    expired: 'danger',
    abandoned: 'secondary'
  };

  const labels: Record<string, string> = {
    paid: 'Pago',
    active: 'Ativo',
    pending: 'Pendente',
    failed: 'Falhou',
    expired: 'Expirado',
    abandoned: 'Abandonado'
  };

  return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
}

function getPaymentMethodBadge(method: string | null) {
  if (!method) return <span class="text-gray-500">-</span>;
  
  if (method === 'pix') {
    return (
      <span class="inline-flex items-center gap-1 text-green-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        PIX
      </span>
    );
  }
  
  return (
    <span class="inline-flex items-center gap-1 text-purple-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect width="20" height="14" x="2" y="5" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
      Cartão
    </span>
  );
}

// --- Component ---

export const TransactionsTable: FC<TransactionsTableProps> = ({ 
  gatewayType, 
  checkouts = [], 
  subscriptions = [], 
  pagination,
  filters 
}) => {
  const isJunglePay = gatewayType === 'JunglePay';
  const hasData = isJunglePay ? checkouts.length > 0 : subscriptions.length > 0;
  
  const statusOptions = isJunglePay 
    ? ['pending', 'paid', 'failed', 'abandoned']
    : ['active', 'pending', 'expired'];

  return (
    <div class="mt-8">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white">
            {isJunglePay ? 'Transações (JunglePay)' : 'Assinaturas (Dias Marketplace)'}
          </h2>
          <p class="text-gray-400 text-sm">
            {pagination.total} {isJunglePay ? 'transações' : 'assinaturas'} encontradas
          </p>
        </div>

        {/* Filters */}
        <form method="get" action="/admin/finance" class="flex flex-wrap gap-3">
          <input 
            type="text" 
            name="search" 
            placeholder="Buscar cliente..."
            value={filters?.search || ''}
            class="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none w-48"
          />
          <select 
            name="status"
            class="bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
          >
            <option value="">Todos os status</option>
            {statusOptions.map(s => (
              <option value={s} selected={filters?.status === s}>
                {s === 'pending' ? 'Pendente' : 
                 s === 'paid' ? 'Pago' : 
                 s === 'active' ? 'Ativo' : 
                 s === 'expired' ? 'Expirado' : 
                 s === 'failed' ? 'Falhou' : 
                 s === 'abandoned' ? 'Abandonado' : s}
              </option>
            ))}
          </select>
          <button 
            type="submit"
            class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Filtrar
          </button>
          {(filters?.search || filters?.status) && (
            <a 
              href="/admin/finance"
              class="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Limpar
            </a>
          )}
        </form>
      </div>

      {/* Table */}
      <div class="bg-surface rounded-xl border border-white/5 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/5 bg-white/[0.02]">
                {isJunglePay ? (
                  <>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Contato</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plano</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Método</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                  </>
                ) : (
                  <>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plano</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Início</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Término</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Externo</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {!hasData ? (
                <tr>
                  <td colspan={8} class="px-4 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Nenhuma {isJunglePay ? 'transação' : 'assinatura'} encontrada</span>
                    </div>
                  </td>
                </tr>
              ) : isJunglePay ? (
                checkouts.map(tx => (
                  <tr key={tx.id} class="hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3 text-sm font-mono text-gray-400">#{tx.id}</td>
                    <td class="px-4 py-3">
                      <div class="flex flex-col">
                        <span class="text-sm text-white font-medium">{tx.customerName || '-'}</span>
                        <span class="text-xs text-gray-500">{formatDocument(tx.customerDocument)}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-400">{tx.customerEmail || '-'}</span>
                        <span class="text-xs text-gray-500">{tx.customerPhone || '-'}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-sm text-white">{tx.planName || '-'}</span>
                      {tx.orderBump && (
                        <span class="ml-1 text-[10px] bg-yellow-500/20 text-yellow-400 px-1 py-0.5 rounded">+BUMP</span>
                      )}
                    </td>
                    <td class="px-4 py-3 text-sm font-medium text-white">{formatCurrency(tx.totalAmount)}</td>
                    <td class="px-4 py-3 text-sm">{getPaymentMethodBadge(tx.paymentMethod)}</td>
                    <td class="px-4 py-3">{getStatusBadge(tx.status, 'checkout')}</td>
                    <td class="px-4 py-3 text-xs text-gray-400">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))
              ) : (
                subscriptions.map(sub => (
                  <tr key={sub.id} class="hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3 text-sm font-mono text-gray-400">#{sub.id}</td>
                    <td class="px-4 py-3">
                      <div class="flex flex-col">
                        <span class="text-sm text-white font-medium">{sub.userName || '-'}</span>
                        <span class="text-xs text-gray-500">{sub.userEmail}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-white">{sub.planName || '-'}</td>
                    <td class="px-4 py-3 text-sm font-medium text-white">{formatCurrency(sub.planPrice)}</td>
                    <td class="px-4 py-3 text-xs text-gray-400">{formatDate(sub.startDate)}</td>
                    <td class="px-4 py-3 text-xs text-gray-400">{formatDate(sub.endDate)}</td>
                    <td class="px-4 py-3">{getStatusBadge(sub.status, 'subscription')}</td>
                    <td class="px-4 py-3 text-xs font-mono text-gray-500 truncate max-w-[100px]" title={sub.externalId || ''}>
                      {sub.externalId ? sub.externalId.slice(0, 12) + '...' : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div class="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <span class="text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <div class="flex gap-2">
              {pagination.page > 1 && (
                <a 
                  href={`/admin/finance?page=${pagination.page - 1}${filters?.status ? `&status=${filters.status}` : ''}${filters?.search ? `&search=${filters.search}` : ''}`}
                  class="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors"
                >
                  Anterior
                </a>
              )}
              {pagination.page < pagination.totalPages && (
                <a 
                  href={`/admin/finance?page=${pagination.page + 1}${filters?.status ? `&status=${filters.status}` : ''}${filters?.search ? `&search=${filters.search}` : ''}`}
                  class="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors"
                >
                  Próxima
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
