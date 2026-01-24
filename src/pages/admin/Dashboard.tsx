import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { StatCard } from '../../components/molecules/StatCard';

interface AdminDashboardProps {
  stats: {
    monthlyRevenue: string;
    revenueTrend: string;
    revenueIsPositive: boolean;
    newSubscribers: string;
    subscribersTrend: string;
    subscribersIsPositive: boolean;
    activeModels: string;
    avgAdsCtr: string;
  };
  trafficData: number[];
  recentActivity: {
    userName: string;
    planName: string;
    timeAgo: string;
  }[];
}

export const AdminDashboard: FC<AdminDashboardProps> = ({ stats, trafficData, recentActivity }) => {
  return (
    <AdminLayout title="Dashboard Overview" activePath="/admin">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Receita Mensal" 
          value={stats.monthlyRevenue} 
          trend={stats.revenueTrend} 
          isPositive={stats.revenueIsPositive} 
        />
        <StatCard 
          label="Novos Assinantes" 
          value={stats.newSubscribers} 
          trend={stats.subscribersTrend} 
          isPositive={stats.subscribersIsPositive} 
        />
        <StatCard 
          label="Modelos Ativas" 
          value={stats.activeModels} 
        />
        <StatCard 
          label="Ads CTR Médio" 
          value={stats.avgAdsCtr} 
        />
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div class="lg:col-span-2 p-6 rounded-2xl bg-surface/50 border border-primary/10 hover:border-primary/20 transition-all duration-500 h-[400px] flex flex-col relative shadow-2xl backdrop-blur-sm group">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h4 class="font-display text-lg text-white tracking-wide">Fluxo de Tráfego</h4>
              <p class="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Últimas 24 horas</p>
            </div>
            <div class="flex gap-2">
              <div class="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold">LIVE</div>
            </div>
          </div>
          
          <div class="flex-1 flex items-end gap-2 px-2 pb-2">
             {/* Real Chart Bars com gradientes e hover */}
             {trafficData.map((count, i) => {
                const max = Math.max(...trafficData, 1);
                const height = (count / max) * 80 + 5; // 5% minimum height
                return (
                  <div 
                    style={{ height: `${height}%` }} 
                    class={`flex-1 rounded-t-sm transition-all duration-500 relative group/bar ${i % 2 === 0 ? 'bg-primary/20' : 'bg-primary/10'} hover:bg-primary hover:shadow-neon-purple`}
                  >
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-primary/30 px-2 py-1 rounded text-[8px] opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {count} hits
                    </div>
                  </div>
                );
             })}
          </div>

          {/* Chart Grid Lines */}
          <div class="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-10">
            {[1,2,3,4].map(() => <div class="w-full h-px bg-primary/50"></div>)}
          </div>
        </div>

        {/* Recent Activity */}
        <div class="p-6 rounded-2xl bg-surface/50 border border-primary/10 h-full flex flex-col shadow-2xl backdrop-blur-sm">
           <div class="mb-6">
              <h4 class="font-display text-lg text-white tracking-wide">Atividade Recente</h4>
              <p class="text-[10px] text-gray-100/50 uppercase tracking-[0.2em]">Monitoramento Global</p>
           </div>
           
           <ul class="space-y-4 flex-1">
              {recentActivity.map(activity => (
                  <li class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group">
                      <div class="relative">
                        <div class="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm group-hover:border-primary/50 transition-all">
                          👤
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-black rounded-full flex items-center justify-center">
                          <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                          <p class="text-xs text-gray-300 truncate">
                            <span class="text-white font-bold">{activity.userName}</span> 
                            <span class="text-gray-500 ml-1">assinou o plano</span> 
                            <span class="text-primary font-bold ml-1">{activity.planName}</span>
                          </p>
                          <p class="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{activity.timeAgo}</p>
                      </div>
                  </li>
              ))}
           </ul>


           <button class="w-full mt-6 py-3 rounded-xl border border-primary/20 text-[11px] text-gray-400 font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-white hover:border-primary/50 transition-all duration-300">
             Ver Todos os Logs
           </button>
        </div>
      </div>
    </AdminLayout>
  );
};