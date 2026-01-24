import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { StatCard } from '../../components/molecules/StatCard';
import { Pagination } from '../../components/molecules/Pagination';

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

export const AdminClients: FC<AdminClientsProps> = ({ 
  users = [], 
  stats, 
  pagination, 
  filters 
}) => {
  return (
    <AdminLayout title="Gerenciamento de Clientes" activePath="/admin/clients">
      {/* Stats Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="Total de Usuários" 
          value={stats.totalUsers.toLocaleString('pt-BR')} 
        />
        <StatCard 
          label="Usuários Assinantes" 
          value={stats.activeSubscribers.toLocaleString('pt-BR')} 
          isPositive={true}
        />
        <StatCard 
          label="Usuários Não Assinantes" 
          value={stats.inactiveSubscribers.toLocaleString('pt-BR')} 
          isPositive={false}
        />
      </div>

      {/* Filters & Actions */}
      <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form method="get" action="/admin/clients" class="relative flex-1 max-w-md">
          <input 
            type="text" 
            name="search"
            placeholder="Buscar por nome ou email..." 
            value={filters.search}
            class="w-full bg-surface border border-white/10 rounded px-4 py-2 text-xs text-white focus:border-primary focus:outline-none transition-all"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </form>
      </div>

      {/* Users Table */}
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
              {users.map((user) => (
                <tr key={user.id} class="hover:bg-white/5 transition-colors group">
                  <td class="px-6 py-4 text-[11px] font-mono text-gray-600">#{user.id}</td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-white group-hover:text-primary transition-colors text-sm">
                      {user.name || 'Sem nome'}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-xs text-gray-500">{user.email}</td>
                  <td class="px-6 py-4">
                    {user.subscriptionStatus === 1 ? (
                      <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-green-500/10 text-green-500 border border-green-500/20">
                        Ativa
                      </span>
                    ) : (
                      <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-red-500/10 text-red-500 border border-red-500/20">
                        Inativa
                      </span>
                    )}
                  </td>
                  <td class="px-6 py-4 text-xs text-gray-400 font-mono">
                    {user.lastSubscriptionEndDate 
                      ? new Date(user.lastSubscriptionEndDate).toLocaleDateString('pt-BR') 
                      : <span class="text-gray-700">Nenhuma</span>}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      hx-get={`/admin/clients/${user.id}/history`}
                      hx-target="#modal-history-content"
                      hx-indicator="#modal-loader"
                      onclick="document.getElementById('history-modal').classList.remove('hidden'); document.body.style.overflow = 'hidden';"
                      class="text-[10px] font-bold text-primary hover:text-white border border-primary/30 hover:bg-primary px-3 py-1.5 rounded transition-all uppercase tracking-widest"
                    >
                      Histórico
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} class="px-6 py-12 text-center text-gray-500 text-sm">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            baseUrl="/admin/clients"
          />
        )}
      </div>

      {/* Modal Histórico */}
      <div id="history-modal" class="fixed inset-0 z-[100] hidden">
        {/* Backdrop */}
        <div 
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onclick="document.getElementById('history-modal').classList.add('hidden'); document.body.style.overflow = '';"
        ></div>
        
        {/* Modal Content */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] bg-surface border border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#050505]">
            <div>
              <h3 class="font-display text-xl text-white tracking-wide">Histórico de Transações</h3>
              <p class="text-[10px] text-gray-500 uppercase tracking-widest">Listagem completa do usuário</p>
            </div>
            <button 
              onclick="document.getElementById('history-modal').classList.add('hidden'); document.body.style.overflow = '';"
              class="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Body */}
          <div id="modal-history-content" class="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-[200px]">
            {/* Loader placeholder */}
            <div id="modal-loader" class="htmx-indicator flex flex-col items-center justify-center gap-4 py-12">
               <div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
               <p class="text-xs text-gray-500 uppercase tracking-widest animate-pulse">Carregando...</p>
            </div>
          </div>

          {/* Footer */}
          <div class="p-4 border-t border-white/5 bg-[#050505] flex justify-end">
            <button 
              onclick="document.getElementById('history-modal').classList.add('hidden'); document.body.style.overflow = '';"
              class="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
