import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { StatCard } from '../../components/molecules/StatCard';

export const AdminDashboard: FC = () => {
  return (
    <AdminLayout title="Dashboard Overview" activePath="/admin">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Receita Mensal" value="R$ 45.200" trend="+12%" isPositive={true} />
        <StatCard label="Novos Assinantes" value="1,240" trend="+5%" isPositive={true} />
        <StatCard label="Modelos Ativas" value="342" trend="+2" isPositive={true} />
        <StatCard label="Ads CTR Médio" value="3.2%" trend="-0.4%" isPositive={false} />
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div class="lg:col-span-2 p-6 rounded-xl bg-[#121212] border border-white/5 h-[400px] flex flex-col items-center justify-center relative">
          <h4 class="absolute top-6 left-6 font-bold text-white">Fluxo de Tráfego (24h)</h4>
          <div class="w-full h-full flex items-end gap-2 px-6 pb-6 pt-16">
             {/* Fake Chart Bars */}
             {Array.from({length: 20}).map((_, i) => (
                <div style={{ height: `${Math.random() * 80 + 20}%` }} class={`flex-1 rounded-t hover:bg-primary transition-colors ${i % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}`}></div>
             ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div class="p-6 rounded-xl bg-[#121212] border border-white/5">
           <h4 class="font-bold text-white mb-6">Atividade Recente</h4>
           <ul class="space-y-4">
              {[1,2,3,4,5].map(i => (
                  <li class="flex items-center gap-3 text-sm pb-4 border-b border-white/5 last:border-0">
                      <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">👤</div>
                      <div>
                          <p class="text-gray-300"><span class="text-white font-bold">User_{i}99</span> assinou o plano Diamond.</p>
                          <p class="text-xs text-gray-500">Há {i * 5} minutos</p>
                      </div>
                  </li>
              ))}
           </ul>
        </div>
      </div>
    </AdminLayout>
  );
};
