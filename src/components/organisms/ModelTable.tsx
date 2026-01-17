import { FC } from 'hono/jsx';

interface Model {
  id: number;
  name: string;
  email: string;
  joined: string;
  status: string;
  earnings: string;
  posts: number;
}

interface ModelTableProps {
  models: Model[];
}

export const ModelTable: FC<ModelTableProps> = ({ models }) => {
  return (
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
    </div>
  );
};
