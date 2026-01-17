import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Pagination } from '../../components/molecules/Pagination';

export const AdminModels: FC = () => {
  const models = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    name: `Model_${i + 1}`,
    email: `model${i + 1}@example.com`,
    joined: "2 days ago",
    status: i % 3 === 0 ? "Pending" : "Verified",
    earnings: `R$ ${Math.floor(Math.random() * 5000)}`,
    posts: Math.floor(Math.random() * 500)
  }));

  return (
    <AdminLayout title="Gestão de Modelos" activePath="/admin/models">
      <div class="flex justify-between items-center mb-6">
         <div class="flex gap-2">
             <button class="px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-white text-xs font-bold uppercase hover:bg-white/5">Todas (1,240)</button>
             <button class="px-4 py-2 bg-transparent border border-white/10 rounded text-gray-400 hover:text-white text-xs font-bold uppercase hover:bg-white/5">Pendentes (3)</button>
             <button class="px-4 py-2 bg-transparent border border-white/10 rounded text-gray-400 hover:text-white text-xs font-bold uppercase hover:bg-white/5">Banidas (12)</button>
         </div>
         <input type="text" placeholder="Buscar modelo..." class="bg-[#121212] border border-white/10 rounded px-4 py-2 text-xs text-white w-64 focus:border-primary focus:outline-none" />
      </div>

      <div class="rounded-xl border border-white/5 bg-[#121212] overflow-hidden">
        <table class="w-full text-left text-sm text-gray-400">
          <thead class="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-200">
            <tr>
              <th class="px-6 py-4">Modelo</th>
              <th class="px-6 py-4">Posts</th>
              <th class="px-6 py-4">Faturamento</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Verificação</th>
              <th class="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 bg-[#121212]">
            {models.map((m) => (
              <tr class="hover:bg-white/5 transition-colors group">
                <td class="px-6 py-4 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10"></div>
                    <div>
                        <p class="font-bold text-white group-hover:text-primary transition-colors">{m.name}</p>
                        <p class="text-xs text-gray-500">{m.email}</p>
                    </div>
                </td>
                <td class="px-6 py-4 text-white font-mono">{m.posts}</td>
                <td class="px-6 py-4 text-white font-mono">{m.earnings}</td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${m.status === 'Verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                    {m.status}
                  </span>
                </td>
                <td class="px-6 py-4">
                    {m.status === 'Pending' ? (
                        <button class="text-[10px] font-bold bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-500 uppercase tracking-wide">Aprovar Doc</button>
                    ) : (
                        <span class="text-green-500 text-xs flex items-center gap-1">✓ <span class="text-[10px] opacity-70">VERIFICADO</span></span>
                    )}
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="text-gray-400 hover:text-white mr-3 text-xs uppercase font-bold">Editar</button>
                    <button class="text-red-500 hover:text-red-400 text-xs uppercase font-bold">Banir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Component */}
        <Pagination 
            currentPage={1}
            totalPages={124}
            showingFrom={1}
            showingTo={10}
            totalItems={1240}
            nextUrl="/admin/models?page=2"
        />
      </div>
    </AdminLayout>
  );
};