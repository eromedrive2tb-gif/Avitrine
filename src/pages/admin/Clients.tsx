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
          value={stats.totalUsers.toString()} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard 
          label="Usuários Assinantes" 
          value={stats.activeSubscribers.toString()} 
          isPositive={true}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
        />
        <StatCard 
          label="Usuários Não Assinantes" 
          value={stats.inactiveSubscribers.toString()} 
          isPositive={false}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>}
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
            class="w-full bg-surface border border-primary/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-primary/50 focus:outline-none transition-all"
          />
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div class="bg-surface/50 border border-primary/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-primary/10 bg-white/[0.02]">
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">ID</th>
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Usuário</th>
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Email</th>
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status Assinatura</th>
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Último Término</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary/5">
              {users.map((user) => (
                <tr key={user.id} class="hover:bg-white/[0.02] transition-colors group">
                  <td class="px-6 py-4 text-sm text-gray-400">#{user.id}</td>
                  <td class="px-6 py-4">
                    <div class="font-display text-sm text-white group-hover:text-primary transition-colors">
                      {user.name || 'Sem nome'}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                  <td class="px-6 py-4">
                    {user.subscriptionStatus === 1 ? (
                      <span class="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                        Ativa
                      </span>
                    ) : (
                      <span class="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                        Inativa
                      </span>
                    )}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-400">
                    {user.lastSubscriptionEndDate 
                      ? new Date(user.lastSubscriptionEndDate).toLocaleDateString('pt-BR') 
                      : 'Nenhuma'}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} class="px-6 py-12 text-center text-gray-500 italic">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div class="p-6 border-t border-primary/10 flex justify-center">
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.totalPages} 
              baseUrl="/admin/clients"
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
