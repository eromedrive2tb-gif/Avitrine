import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { ClientStatsSection } from '../../components/organisms/ClientStatsSection';
import { ClientSearchForm } from '../../components/molecules/ClientSearchForm';
import { ClientTable, type UserData } from '../../components/organisms/ClientTable';
import { TransactionHistoryModal } from '../../components/organisms/TransactionHistoryModal';

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
      <ClientStatsSection {...stats} />
      <ClientSearchForm value={filters.search} />
      <ClientTable users={users} pagination={pagination} />
      <TransactionHistoryModal />
    </AdminLayout>
  );
};
