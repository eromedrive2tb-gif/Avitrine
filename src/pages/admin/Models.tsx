import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Pagination } from '../../components/molecules/Pagination';
import { StatCard } from '../../components/molecules/StatCard';

interface Model {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  externalUrl: string | null;
  postCount: number | null;
  status: string | null;
  isFeatured: boolean | null;
  isAdvertiser: boolean | null;
  createdAt: Date | null;
}

interface Stats {
  total: number;
  active: number;
  hidden: number;
  featured: number;
  advertisers: number;
}

interface AdminModelsProps {
  models: Model[];
  stats: Stats;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  filters?: {
    search?: string;
    status?: string;
  };
}

export const AdminModels: FC<AdminModelsProps> = ({ models, stats, pagination, filters }) => {
  const currentSearch = filters?.search || '';
  const currentStatus = filters?.status || '';

  return (
    <AdminLayout title="Gestão de Modelos" activePath="/admin/models">
      
      {/* Stats Cards */}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard 
          label="Total de Modelos"
          value={stats.total.toString()}
          icon="👤"
        />
        <StatCard 
          label="Ativos"
          value={stats.active.toString()}
          icon="✅"
        />
        <StatCard 
          label="Ocultos"
          value={stats.hidden.toString()}
          icon="👁‍🗨"
        />
        <StatCard 
          label="Destaques"
          value={stats.featured.toString()}
          icon="⭐"
        />
        <StatCard 
          label="Publicitários"
          value={stats.advertisers.toString()}
          icon="💰"
        />
      </div>

      {/* Actions Bar */}
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div class="flex gap-2 flex-wrap">
          <a 
            href="/admin/models" 
            class={`px-4 py-2 border border-white/10 rounded text-xs font-bold uppercase transition-colors ${
              !currentStatus ? 'bg-[#1a1a1a] text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Todos ({stats.total})
          </a>
          <a 
            href="/admin/models?status=active" 
            class={`px-4 py-2 border border-white/10 rounded text-xs font-bold uppercase transition-colors ${
              currentStatus === 'active' ? 'bg-[#1a1a1a] text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Ativos ({stats.active})
          </a>
          <a 
            href="/admin/models?status=hidden" 
            class={`px-4 py-2 border border-white/10 rounded text-xs font-bold uppercase transition-colors ${
              currentStatus === 'hidden' ? 'bg-[#1a1a1a] text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Ocultos ({stats.hidden})
          </a>
        </div>
        
        <div class="flex gap-3 w-full md:w-auto">
          <form method="get" action="/admin/models" class="flex-1 md:flex-none">
            <input 
              type="text" 
              name="search"
              value={currentSearch}
              placeholder="Buscar modelo..." 
              class="bg-surface border border-white/10 rounded px-4 py-2 text-xs text-white w-full md:w-64 focus:border-primary focus:outline-none" 
            />
          </form>
          <a 
            href="/admin/models/new" 
            class="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Novo Modelo
          </a>
        </div>
      </div>

      {/* Models Table */}
      <div class="rounded-xl border border-white/5 bg-surface overflow-hidden">
        <table class="w-full text-left text-sm text-gray-400">
          <thead class="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-200">
            <tr>
              <th class="px-6 py-4">Modelo</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Posts</th>
              <th class="px-6 py-4">Flags</th>
              <th class="px-6 py-4">Criado em</th>
              <th class="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 bg-surface">
            {models.length === 0 ? (
              <tr>
                <td colspan={6} class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="opacity-20"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p>Nenhum modelo encontrado.</p>
                    <a href="/admin/models/new" class="text-primary hover:underline text-sm">Criar primeiro modelo</a>
                  </div>
                </td>
              </tr>
            ) : models.map((m) => (
              <tr class="hover:bg-white/5 transition-colors group" key={m.id}>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-16 rounded overflow-hidden bg-gray-800 border border-white/10">
                      {m.thumbnailUrl ? (
                        <img src={m.thumbnailUrl} alt={m.name} class="w-full h-full object-cover" />
                      ) : (
                        <div class="w-full h-full flex items-center justify-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p class="font-bold text-white group-hover:text-primary transition-colors">{m.name}</p>
                      <p class="text-xs text-gray-500">/{m.slug || 'sem-slug'}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                    m.status === 'active' 
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                      : m.status === 'hidden'
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                  }`}>
                    {m.status === 'active' ? 'Ativo' : m.status === 'hidden' ? 'Oculto' : 'Rascunho'}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <a 
                    href={`/admin/models/${m.id}/posts`}
                    class="text-primary hover:text-primary-light text-sm font-bold flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    {m.postCount || 0}
                  </a>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-1">
                    {m.isFeatured && (
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" title="Destaque">
                        ⭐
                      </span>
                    )}
                    {m.isAdvertiser && (
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20" title="Publicitário">
                        ADS
                      </span>
                    )}
                    {m.externalUrl && (
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20" title="Link Externo">
                        🔗
                      </span>
                    )}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs text-gray-500">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <a 
                      href={`/models/${m.slug || m.id}`}
                      target="_blank"
                      class="text-gray-400 hover:text-white text-xs uppercase font-bold px-2 py-1 rounded hover:bg-white/5 transition-colors"
                      title="Visualizar"
                    >
                      👁
                    </a>
                    <a 
                      href={`/admin/models/${m.id}/edit`}
                      class="text-gray-400 hover:text-white text-xs uppercase font-bold px-2 py-1 rounded hover:bg-white/5 transition-colors"
                    >
                      Editar
                    </a>
                    <form 
                      action={`/admin/models/${m.id}/toggle`} 
                      method="post" 
                      class="inline"
                    >
                      <button 
                        type="submit" 
                        class={`text-xs uppercase font-bold px-2 py-1 rounded transition-colors ${
                          m.status === 'active' 
                            ? 'text-orange-500 hover:text-orange-400 hover:bg-orange-500/10' 
                            : 'text-green-500 hover:text-green-400 hover:bg-green-500/10'
                        }`}
                      >
                        {m.status === 'active' ? 'Ocultar' : 'Ativar'}
                      </button>
                    </form>
                    <form 
                      action={`/admin/models/${m.id}/delete`} 
                      method="post" 
                      class="inline"
                      onsubmit="return confirm('Tem certeza que deseja excluir este modelo?')"
                    >
                      <button 
                        type="submit" 
                        class="text-red-500 hover:text-red-400 text-xs uppercase font-bold px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
      {/* Pagination Component */}
      {pagination.totalPages > 1 && (
        <Pagination 
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          showingFrom={(pagination.page - 1) * 20 + 1}
          showingTo={Math.min(pagination.page * 20, pagination.total)}
          totalItems={pagination.total}
          nextUrl={pagination.page < pagination.totalPages ? `/admin/models?page=${pagination.page + 1}${currentStatus ? `&status=${currentStatus}` : ''}${currentSearch ? `&search=${currentSearch}` : ''}` : undefined}
          prevUrl={pagination.page > 1 ? `/admin/models?page=${pagination.page - 1}${currentStatus ? `&status=${currentStatus}` : ''}${currentSearch ? `&search=${currentSearch}` : ''}` : undefined}
        />
      )}
    </AdminLayout>
  );
};
