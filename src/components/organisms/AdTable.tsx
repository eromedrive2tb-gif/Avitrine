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
    <div class="rounded-xl border border-white/5 bg-surface overflow-hidden">
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
        <tbody class="divide-y divide-white/5 bg-surface">
          {ads.map((ad) => {
            // Calculate CTR
            const impressions = parseInt(ad.impressions.replace(/\./g, '').replace(/,/g, '')) || 0;
            const clicks = parseInt(ad.clicks.replace(/\./g, '').replace(/,/g, '')) || 0;
            const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';

            return (
              <tr class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-white">{ad.name}</span>
                    <span class="text-[10px] text-gray-500">ID: {ad.id}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] uppercase font-mono">{ad.type}</span>
                </td>
                <td class="px-6 py-4 text-xs">{ad.placement}</td>
                <td class="px-6 py-4 font-mono text-white">{ad.impressions}</td>
                <td class="px-6 py-4 text-white font-mono">
                    {ad.clicks} <span class={`text-xs ml-1 ${parseFloat(ctr) > 2 ? 'text-green-500' : parseFloat(ctr) > 1 ? 'text-yellow-500' : 'text-gray-500'}`}>({ctr}%)</span>
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
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    {/* Edit Button */}
                    <a 
                      href={`/admin/ads/${ad.id}/edit`} 
                      class="text-primary hover:text-white text-xs uppercase font-bold inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      Editar
                    </a>
                    
                    {/* Toggle Status Form */}
                    <form action={`/admin/ads/${ad.id}/toggle`} method="post" class="inline">
                      <button 
                        type="submit" 
                        class={`text-xs uppercase font-bold inline-flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                          ad.status === 'Active' 
                            ? 'text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10' 
                            : 'text-green-500 hover:text-green-400 hover:bg-green-500/10'
                        }`}
                      >
                        {ad.status === 'Active' ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
                            Pausar
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                            Ativar
                          </>
                        )}
                      </button>
                    </form>
                    
                    {/* Delete Button */}
                    <form action={`/admin/ads/${ad.id}/delete`} method="post" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir este anúncio?')">
                      <button 
                        type="submit" 
                        class="text-red-500 hover:text-red-400 text-xs uppercase font-bold inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
