import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';

export const AdminAds: FC = () => {
  const ads = [
    { id: 1, name: "BetWinner Banner", type: "Banner (Type B)", placement: "Home Top", impressions: "125k", clicks: "4.2k", status: "Active" },
    { id: 2, name: "Cassino Native", type: "Native Block (Type C)", placement: "Models Grid", impressions: "80k", clicks: "1.2k", status: "Active" },
    { id: 3, name: "Diamond Push", type: "Post Injection (Type A)", placement: "Feed Mix", impressions: "200k", clicks: "8.5k", status: "Paused" },
  ];

  return (
    <AdminLayout title="Gestão de Publicidade (Ads)" activePath="/admin/ads">
      <div class="flex justify-between items-center mb-8">
         <p class="text-gray-400">Gerencie campanhas, banners e injeções de conteúdo patrocinado.</p>
         <button class="bg-primary text-white px-4 py-2 rounded text-sm font-bold shadow-neon-purple hover:brightness-110">
            + Nova Campanha
         </button>
      </div>

      <div class="overflow-hidden rounded-xl border border-white/5">
        <table class="w-full text-left text-sm text-gray-400">
          <thead class="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-200">
            <tr>
              <th class="px-6 py-4">Nome da Campanha</th>
              <th class="px-6 py-4">Tipo</th>
              <th class="px-6 py-4">Localização</th>
              <th class="px-6 py-4">Impressões</th>
              <th class="px-6 py-4">Cliques (CTR)</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 bg-[#121212]">
            {ads.map((ad) => (
              <tr class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 font-medium text-white">{ad.name}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded border border-white/10 bg-white/5 text-xs">{ad.type}</span>
                </td>
                <td class="px-6 py-4">{ad.placement}</td>
                <td class="px-6 py-4">{ad.impressions}</td>
                <td class="px-6 py-4 text-white">
                    {ad.clicks} <span class="text-xs text-gray-500">({((parseInt(ad.clicks)/parseInt(ad.impressions))*100).toFixed(1)}%)</span>
                </td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded text-xs font-bold ${ad.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {ad.status}
                  </span>
                </td>
                <td class="px-6 py-4 flex gap-2">
                    <button class="text-gray-400 hover:text-white">✏️</button>
                    <button class="text-gray-400 hover:text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
