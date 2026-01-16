import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';

export const AdminModels: FC = () => {
  const models = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: `Model_${i}`,
    email: `model${i}@example.com`,
    joined: "2 days ago",
    status: i % 3 === 0 ? "Pending" : "Verified",
    earnings: `R$ ${Math.floor(Math.random() * 5000)}`
  }));

  return (
    <AdminLayout title="Gestão de Modelos" activePath="/admin/models">
      <div class="flex justify-between items-center mb-8">
         <div class="flex gap-2">
             <button class="px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-white text-xs font-bold uppercase">Todas</button>
             <button class="px-4 py-2 bg-transparent border border-white/10 rounded text-gray-400 hover:text-white text-xs font-bold uppercase">Pendentes (3)</button>
             <button class="px-4 py-2 bg-transparent border border-white/10 rounded text-gray-400 hover:text-white text-xs font-bold uppercase">Banidas</button>
         </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-white/5">
        <table class="w-full text-left text-sm text-gray-400">
          <thead class="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-200">
            <tr>
              <th class="px-6 py-4">Modelo</th>
              <th class="px-6 py-4">Data Registro</th>
              <th class="px-6 py-4">Faturamento</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Verificação</th>
              <th class="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 bg-[#121212]">
            {models.map((m) => (
              <tr class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-white/10"></div>
                    <div>
                        <p class="font-bold text-white">{m.name}</p>
                        <p class="text-xs text-gray-500">{m.email}</p>
                    </div>
                </td>
                <td class="px-6 py-4">{m.joined}</td>
                <td class="px-6 py-4 text-white font-mono">{m.earnings}</td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded text-xs font-bold ${m.status === 'Verified' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {m.status}
                  </span>
                </td>
                <td class="px-6 py-4">
                    {m.status === 'Pending' ? (
                        <button class="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500">Aprovar Doc</button>
                    ) : (
                        <span class="text-green-500 text-xs">✓ Docs OK</span>
                    )}
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="text-gray-400 hover:text-white mr-3">Ver Perfil</button>
                    <button class="text-red-500 hover:text-red-400">Banir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
