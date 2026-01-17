import { FC } from 'hono/jsx';

interface Ad {
  id: number;
  name: string;
  type: string;
  placement: string;
  impressions: string;
  clicks: string;
  status: string;
}

interface AdTableProps {
  ads: Ad[];
}

export const AdTable: FC<AdTableProps> = ({ ads }) => {
  return (
    <div class="rounded-xl border border-white/5 bg-[#121212] overflow-hidden">
      <table class="w-full text-left text-sm text-gray-400">
        <thead class="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-200">
          <tr>
            <th class="px-6 py-4">Campanha</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Local</th>
            <th class="px-6 py-4">Impressões</th>
            <th class="px-6 py-4">Cliques (CTR)</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 bg-[#121212]">
          {ads.map((ad) => (
            <tr class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 font-bold text-white">{ad.name}</td>
              <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] uppercase font-mono">{ad.type}</span>
              </td>
              <td class="px-6 py-4 text-xs">{ad.placement}</td>
              <td class="px-6 py-4 font-mono text-white">{ad.impressions}</td>
              <td class="px-6 py-4 text-white font-mono">
                  {ad.clicks} <span class="text-xs text-green-500 ml-1">({((parseInt(ad.clicks.replace(/,/g,''))/parseInt(ad.impressions.replace(/,/g,'')))*100).toFixed(1)}%)</span>
              </td>
              <td class="px-6 py-4">
                <span class={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                    ad.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    ad.status === 'Paused' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                }`}>
                  {ad.status}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                  <button class="text-primary hover:text-white mr-3 text-xs uppercase font-bold">Editar</button>
                  <button class="text-red-500 hover:text-red-400 text-xs uppercase font-bold">Pausar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
