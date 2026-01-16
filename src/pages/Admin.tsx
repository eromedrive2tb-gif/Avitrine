import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';

const AdminSidebar = () => (
  <aside class="w-64 bg-[#0E1136] border-r border-white/5 min-h-screen p-6 hidden md:block">
    <div class="mb-10">
      <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Menu Principal</span>
    </div>
    <nav class="space-y-2">
      <a href="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#A37CFF]/10 text-[#A37CFF] font-medium">
        <span>📊</span> Dashboard
      </a>
      <a href="/admin/models" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <span>👥</span> Modelos
      </a>
      <a href="/admin/plans" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <span>💳</span> Planos
      </a>
      <a href="/admin/config" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <span>⚙️</span> Configurações
      </a>
    </nav>
  </aside>
);

export const AdminDashboard: FC = () => {
  return (
    <Layout title="Admin Dashboard" isAdmin>
      <div class="flex">
        <AdminSidebar />
        <div class="flex-1 p-8">
          <div class="mb-8 flex items-center justify-between">
            <h1 class="text-3xl font-bold">Dashboard Overview</h1>
            <div class="flex gap-2">
               <button class="px-4 py-2 bg-[#0E1136] rounded-lg border border-white/10 text-sm">Last 30 Days</button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="p-6 rounded-2xl bg-[#0E1136] border border-white/5 relative overflow-hidden">
               <div class="relative z-10">
                 <p class="text-gray-400 text-sm font-medium mb-2">Receita Total</p>
                 <h3 class="text-3xl font-bold text-white">R$ 124.500,00</h3>
                 <span class="text-green-500 text-sm flex items-center gap-1 mt-2">
                   +12.5% <span class="text-gray-500">vs last month</span>
                 </span>
               </div>
               <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-[#FF4006] rounded-full blur-[40px] opacity-20"></div>
            </div>
            
            <div class="p-6 rounded-2xl bg-[#0E1136] border border-white/5 relative overflow-hidden">
               <div class="relative z-10">
                 <p class="text-gray-400 text-sm font-medium mb-2">Usuários Ativos</p>
                 <h3 class="text-3xl font-bold text-white">45.2k</h3>
                 <span class="text-green-500 text-sm flex items-center gap-1 mt-2">
                   +5.2% <span class="text-gray-500">vs last month</span>
                 </span>
               </div>
               <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-[#A37CFF] rounded-full blur-[40px] opacity-20"></div>
            </div>

            <div class="p-6 rounded-2xl bg-[#0E1136] border border-white/5 relative overflow-hidden">
               <div class="relative z-10">
                 <p class="text-gray-400 text-sm font-medium mb-2">Modelos Cadastradas</p>
                 <h3 class="text-3xl font-bold text-white">842</h3>
                 <span class="text-gray-500 text-sm flex items-center gap-1 mt-2">
                   Total na plataforma
                 </span>
               </div>
            </div>
          </div>

          {/* Recent Activity Table (Simplified Organism) */}
          <div class="rounded-2xl bg-[#0E1136] border border-white/5 overflow-hidden">
            <div class="p-6 border-b border-white/5">
              <h3 class="font-bold text-lg">Últimas Transações</h3>
            </div>
            <div class="p-6">
              <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-white/5 text-gray-200 uppercase text-xs">
                  <tr>
                    <th class="px-4 py-3 rounded-l-lg">Usuário</th>
                    <th class="px-4 py-3">Plano</th>
                    <th class="px-4 py-3">Data</th>
                    <th class="px-4 py-3 text-right rounded-r-lg">Valor</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  {[1,2,3,4,5].map(i => (
                    <tr class="hover:bg-white/5 transition-colors">
                      <td class="px-4 py-4 font-medium text-white">user_{i}@example.com</td>
                      <td class="px-4 py-4"><span class="px-2 py-1 rounded bg-[#A37CFF]/10 text-[#A37CFF] text-xs">Premium</span></td>
                      <td class="px-4 py-4">Oct 2{i}, 2024</td>
                      <td class="px-4 py-4 text-right text-white">R$ 59,90</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
