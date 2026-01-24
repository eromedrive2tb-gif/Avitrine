import { FC } from 'hono/jsx';
import { StatCard } from '../molecules/StatCard';

interface ClientStatsSectionProps {
  totalUsers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
}

export const ClientStatsSection: FC<ClientStatsSectionProps> = ({ 
  totalUsers, 
  activeSubscribers, 
  inactiveSubscribers 
}) => (
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <StatCard label="Total de Usuários" value={totalUsers.toLocaleString('pt-BR')} />
    <StatCard label="Usuários Assinantes" value={activeSubscribers.toLocaleString('pt-BR')} isPositive={true} />
    <StatCard label="Usuários Não Assinantes" value={inactiveSubscribers.toLocaleString('pt-BR')} isPositive={false} />
  </div>
);
