import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { StatCard } from '../../components/molecules/StatCard';
import { Pagination } from '../../components/molecules/Pagination';

// --- TYPES ---

interface UserData {
  id: number;
  name: string | null;
  email: string;
  subscriptionStatus: number | null;
  lastSubscriptionEndDate: Date | null;
}

interface AdminClientsProps {
  users: UserData[];
  stats: {
    totalUsers: number;
    activeSubscribers: number;
    inactiveSubscribers: number;
  };
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  filters: {
    search: string;
  };
}

// --- UTILS & CONSTANTS ---

const formatters = {
  date: (date: Date | null) => date ? new Date(date).toLocaleDateString('pt-BR') : 'Nenhuma',
  number: (num: number) => num.toLocaleString('pt-BR'),
};

const modalScripts = {
  open: (userId: number) => `
    const modal = document.getElementById('history-modal');
    const content = document.getElementById('modal-history-content');
    
    content.innerHTML = \`
      <div class="space-y-4 animate-pulse">
        \${Array(3).fill(0).map(() => \`
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="flex justify-between items-start mb-4">
              <div class="space-y-2">
                <div class="h-2 w-16 bg-white/10 rounded"></div>
                <div class="h-3 w-32 bg-white/10 rounded"></div>
              </div>
              <div class="h-5 w-14 bg-white/10 rounded"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="h-2 w-10 bg-white/10 rounded"></div>
                <div class="h-3 w-20 bg-white/10 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="h-2 w-10 bg-white/10 rounded"></div>
                <div class="h-3 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        \`).join('')}
      </div>
    \`;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.querySelector('.modal-box').classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
  `,
  close: `
    const modal = document.getElementById('history-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-box').classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  `
};

// --- ATOMS ---

const SearchIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// --- MOLECULES ---

const ClientStatusBadge: FC<{ status: number | null }> = ({ status }) => {
  const isActive = status === 1;
  const config = isActive 
    ? { text: 'Ativa', colors: 'bg-green-500/10 text-green-500 border-green-500/20' }
    : { text: 'Inativa', colors: 'bg-red-500/10 text-red-500 border-red-500/20' };

  return (
    <span class={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${config.colors}`}>
      {config.text}
    </span>
  );
};

const ActionHistoryButton: FC<{ userId: number }> = ({ userId }) => (
  <button 
    hx-get={`/admin/clients/${userId}/history`}
    hx-target="#modal-history-content"
    onclick={modalScripts.open(userId)}
    class="text-[10px] font-bold text-primary hover:text-white border border-primary/30 hover:bg-primary px-3 py-1.5 rounded transition-all uppercase tracking-widest"
  >
    Histórico
  </button>
);

const ClientSearchForm: FC<{ value: string }> = ({ value }) => (
  <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <form method="get" action="/admin/clients" class="relative flex-1 max-w-md">
      <input 
        type="text" 
        name="search"
        placeholder="Buscar por nome ou email..." 
        value={value}
        class="w-full bg-surface border border-white/10 rounded px-4 py-2 text-xs text-white focus:border-primary focus:outline-none transition-all"
      />
      <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
        <SearchIcon />
      </div>
    </form>
  </div>
);

// --- ORGANISMS ---

const ClientStatsSection: FC<AdminClientsProps['stats']> = ({ totalUsers, activeSubscribers, inactiveSubscribers }) => (
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <StatCard label="Total de Usuários" value={formatters.number(totalUsers)} />
    <StatCard label="Usuários Assinantes" value={formatters.number(activeSubscribers)} isPositive={true} />
    <StatCard label="Usuários Não Assinantes" value={formatters.number(inactiveSubscribers)} isPositive={false} />
  </div>
);

const TransactionHistoryModal: FC = () => (
  <div id="history-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 opacity-0 pointer-events-none hidden">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onclick={modalScripts.close}></div>
    
    <div class="modal-box relative w-full max-w-lg max-h-[85vh] bg-[#121212] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden scale-95 transition-all duration-300">
      <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#050505]">
        <div class="flex items-center gap-3">
          <div class="w-1 h-6 bg-primary rounded-full shadow-neon-purple"></div>
          <div>
            <h3 class="font-display text-xl text-white tracking-wide">HISTÓRICO FINANCEIRO</h3>
            <p class="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Transações detalhadas do cliente</p>
          </div>
        </div>
        <button onclick={modalScripts.close} class="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div id="modal-history-content" class="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-[300px] bg-[#121212]">
        {/* Skeleton/HTMX content */}
      </div>

      <div class="p-4 border-t border-white/5 bg-[#050505] flex justify-end">
        <button onclick={modalScripts.close} class="px-6 py-2 text-[10px] font-bold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg uppercase tracking-widest transition-all">
          Fechar
        </button>
      </div>
    </div>
  </div>
);

const ClientTableRow: FC<{ user: UserData }> = ({ user }) => (
  <tr class="hover:bg-white/5 transition-colors group">
    <td class="px-6 py-4 text-[11px] font-mono text-gray-600">#{user.id}</td>
    <td class="px-6 py-4">
      <div class="font-bold text-white group-hover:text-primary transition-colors text-sm">
        {user.name || 'Sem nome'}
      </div>
    </td>
    <td class="px-6 py-4 text-xs text-gray-500">{user.email}</td>
    <td class="px-6 py-4">
      <ClientStatusBadge status={user.subscriptionStatus} />
    </td>
    <td class="px-6 py-4 text-xs text-gray-400 font-mono">
      {user.lastSubscriptionEndDate 
        ? formatters.date(user.lastSubscriptionEndDate) 
        : <span class="text-gray-700">Nenhuma</span>}
    </td>
    <td class="px-6 py-4 text-right">
      <ActionHistoryButton userId={user.id} />
    </td>
  </tr>
);

const ClientTable: FC<{ users: UserData[]; pagination: AdminClientsProps['pagination'] }> = ({ users, pagination }) => (
  <div class="rounded-xl border border-white/5 bg-surface overflow-hidden shadow-2xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#1a1a1a] border-b border-white/5">
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">ID</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Usuário</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Email</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Status Assinatura</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Último Término</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em] text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {users.map((user) => <ClientTableRow key={user.id} user={user} />)}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} class="px-6 py-12 text-center text-gray-500 text-sm">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {pagination.totalPages > 1 && (
      <Pagination 
        currentPage={pagination.page} 
        totalPages={pagination.totalPages} 
        baseUrl="/admin/clients"
      />
    )}
  </div>
);

// --- PAGE ---

export const AdminClients: FC<AdminClientsProps> = ({ 
  users = [], 
  stats, 
  pagination, 
  filters 
}) => {
  return (
    <AdminLayout title="Gerenciamento de Clientes" activePath="/admin/clients">
      <ClientStatsSection {...stats} />
      <ClientSearchForm value={filters.search} />
      <ClientTable users={users} pagination={pagination} />
      <TransactionHistoryModal />
    </AdminLayout>
  );
};
