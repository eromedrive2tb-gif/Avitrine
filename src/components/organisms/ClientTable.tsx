import { FC } from 'hono/jsx';
import { ActionHistoryButton } from '../molecules/ActionHistoryButton';
import { AddPlanButton } from '../molecules/AddPlanButton';
import { Pagination } from '../molecules/Pagination';
import { Badge } from '../atoms/Badge';

export interface UserData {
  id: number;
  name: string | null;
  email: string;
  subscriptionStatus: number | null;
  lastSubscriptionEndDate: Date | null;
}

interface ClientTableProps {
  users: UserData[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

const ClientTableRow: FC<{ user: UserData }> = ({ user }) => (
  <tr class="hover:bg-white/5 transition-colors group">
    <td class="px-6 py-4 text-[11px] font-mono text-gray-600">#{user.id}</td>
    <td class="px-6 py-4">
      <div class="font-bold text-white group-hover:text-primary transition-colors text-sm">
        {user.name || 'Sem nome'}
      </div>
    </td>
    <td class="px-6 py-4 text-xs text-gray-500">{user.email}</td>
    <td class="px-6 py-4 text-xs text-gray-400 font-mono">
      {user.lastSubscriptionEndDate 
        ? new Date(user.lastSubscriptionEndDate).toLocaleDateString('pt-BR') 
        : <span class="text-gray-700">Nenhuma</span>}
    </td>
    <td class="px-6 py-4">
      <Badge variant={user.subscriptionStatus === 1 ? 'success' : 'danger'}>
        {user.subscriptionStatus === 1 ? 'Ativa' : 'Inativa'}
      </Badge>
    </td>
    <td class="px-6 py-4 text-right flex items-center justify-end gap-2">
      <AddPlanButton userId={user.id} />
      <ActionHistoryButton userId={user.id} />
    </td>
  </tr>
);

export const ClientTable: FC<ClientTableProps> = ({ users, pagination }) => (
  <div class="rounded-xl border border-white/5 bg-surface overflow-hidden shadow-2xl">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#1a1a1a] border-b border-white/5">
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">ID</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Usuário</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Email</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Último Término</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-200 uppercase tracking-[0.2em]">Status Assinatura</th>
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
