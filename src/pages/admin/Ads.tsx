import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Pagination } from '../../components/molecules/Pagination';
import { AdTable } from '../../components/organisms/AdTable';

interface Ad {
  id: number;
  name: string;
  type: string;
  placement: string;
  impressions: string;
  clicks: string;
  status: string;
}

interface AdminAdsProps {
  ads: Ad[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  filters?: {
    status?: string;
    placement?: string;
  };
}

export const AdminAds: FC<AdminAdsProps> = ({ ads, pagination, filters }) => {
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || ads.length;

  return (
    <AdminLayout title="Gestão de Publicidade (Ads)" activePath="/admin/ads">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <p class="text-gray-400 text-sm">Gerencie campanhas e acompanhe o CTR em tempo real.</p>
          <p class="text-gray-500 text-xs mt-1">{total} anúncio(s) encontrado(s)</p>
        </div>
        <a 
          href="/admin/ads/new" 
          class="bg-primary text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest shadow-neon-purple hover:brightness-110 inline-flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nova Campanha
        </a>
      </div>

      {/* Filters */}
      <div class="bg-surface border border-white/5 rounded-xl p-4 mb-6">
        <form method="get" action="/admin/ads" class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[150px]">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <select 
              name="status" 
              class="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded text-white text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="active" selected={filters?.status === 'active'}>Ativos</option>
              <option value="paused" selected={filters?.status === 'paused'}>Pausados</option>
              <option value="draft" selected={filters?.status === 'draft'}>Rascunhos</option>
            </select>
          </div>
          <div class="flex-1 min-w-[150px]">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Placement</label>
            <select 
              name="placement" 
              class="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded text-white text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="home_top" selected={filters?.placement === 'home_top'}>Home (Topo)</option>
              <option value="home_middle" selected={filters?.placement === 'home_middle'}>Home (Meio)</option>
              <option value="home_bottom" selected={filters?.placement === 'home_bottom'}>Home (Rodapé)</option>
              <option value="sidebar" selected={filters?.placement === 'sidebar'}>Sidebar (Geral)</option>
              <option value="feed_mix" selected={filters?.placement === 'feed_mix'}>Feed Mix</option>
              <option value="models_grid" selected={filters?.placement === 'models_grid'}>Grid de Modelos</option>
              <option value="model_profile" selected={filters?.placement === 'model_profile'}>Perfil de Modelo (Topo)</option>
              <option value="login" selected={filters?.placement === 'login'}>Página de Login</option>
              <option value="register" selected={filters?.placement === 'register'}>Página de Registro</option>
              <option value="feed_model" selected={filters?.placement === 'feed_model'}>Feed de Modelo</option>
              <option value="model_sidebar" selected={filters?.placement === 'model_sidebar'}>Sidebar de Modelo</option>
            </select>
          </div>
          <button type="submit" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold uppercase transition-colors">
            Filtrar
          </button>
          {(filters?.status || filters?.placement) && (
            <a href="/admin/ads" class="px-4 py-2 text-gray-400 hover:text-white text-xs uppercase transition-colors">
              Limpar
            </a>
          )}
        </form>
      </div>

      {/* Table */}
      {ads.length > 0 ? (
        <AdTable ads={ads} />
      ) : (
        <div class="bg-surface border border-white/5 rounded-xl p-12 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <h3 class="text-white font-bold text-lg mb-2">Nenhum anúncio encontrado</h3>
          <p class="text-gray-400 text-sm mb-6">Comece criando sua primeira campanha publicitária.</p>
          <a 
            href="/admin/ads/new" 
            class="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded text-sm font-bold uppercase tracking-widest hover:brightness-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Criar Primeira Campanha
          </a>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          showingFrom={(currentPage - 1) * 20 + 1}
          showingTo={Math.min(currentPage * 20, total)}
          totalItems={total}
          nextUrl={currentPage < totalPages ? `/admin/ads?page=${currentPage + 1}${filters?.status ? `&status=${filters.status}` : ''}${filters?.placement ? `&placement=${filters.placement}` : ''}` : undefined}
          prevUrl={currentPage > 1 ? `/admin/ads?page=${currentPage - 1}${filters?.status ? `&status=${filters.status}` : ''}${filters?.placement ? `&placement=${filters.placement}` : ''}` : undefined}
        />
      )}
    </AdminLayout>
  );
};
