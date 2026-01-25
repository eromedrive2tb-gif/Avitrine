import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { PostTable } from '../../components/organisms/PostTable';
import { Alert } from '../../components/atoms/Alert';

interface Post {
  id: number;
  title: string | null;
  contentUrl: string;
  type: string;
  createdAt: Date | null;
}

interface Model {
  id: number;
  name: string;
  slug: string | null;
  postCount: number | null;
}

interface PostsPageProps {
  model: Model;
  posts: Post[];
  page: number;
  totalPages: number;
  searchQuery?: string;
  typeFilter?: string;
  error?: string;
  success?: string;
}

export const AdminModelPosts: FC<PostsPageProps> = ({ 
  model, 
  posts, 
  page, 
  totalPages,
  searchQuery,
  typeFilter,
  error,
  success 
}) => {
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const buildUrl = (newPage: number, search?: string, type?: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    const queryString = params.toString();
    return `/admin/models/${model.id}/posts${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <AdminLayout title={`Posts de ${model.name}`} breadcrumbs={[
      { label: 'Início', href: '/admin' },
      { label: 'Modelos', href: '/admin/models' },
      { label: model.name, href: `/admin/models/${model.id}` },
      { label: 'Posts', href: '#' }
    ]}>
      <div class="space-y-6">
        {/* Header */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-white mb-2">
              Posts de {model.name}
            </h1>
            <p class="text-gray-400">
              Gerencie os posts da modelo "{model.name}" ({model.postCount || 0} posts)
            </p>
          </div>
          <div class="flex gap-3">
            <a 
              href={`/admin/models/${model.id}`}
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              ← Voltar para Modelo
            </a>
            <a 
              href={`/admin/models/${model.id}/posts/new`}
              class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Novo Post
            </a>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} />
        )}
        {success && (
          <Alert type="success" message={success} />
        )}

        {/* Filters */}
        <div class="bg-surface rounded-xl border border-white/5 p-6">
          <form method="GET" class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Buscar por título..."
                value={searchQuery || ''}
                class="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <select
                name="type"
                class="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={typeFilter || ''}
              >
                <option value="">Todos os tipos</option>
                <option value="image">Imagens</option>
                <option value="video">Vídeos</option>
              </select>
            </div>
            <button
              type="submit"
              class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              Filtrar
            </button>
          </form>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-surface rounded-xl border border-white/5 p-6">
            <div class="flex items-center">
              <div class="p-3 bg-blue-500/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-2xl font-bold text-white">{model.postCount || 0}</p>
                <p class="text-gray-400 text-sm">Total de Posts</p>
              </div>
            </div>
          </div>
          
          <div class="bg-surface rounded-xl border border-white/5 p-6">
            <div class="flex items-center">
              <div class="p-3 bg-green-500/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-2xl font-bold text-white">
                  {posts.filter(p => p.type === 'image').length}
                </p>
                <p class="text-gray-400 text-sm">Imagens</p>
              </div>
            </div>
          </div>
          
          <div class="bg-surface rounded-xl border border-white/5 p-6">
            <div class="flex items-center">
              <div class="p-3 bg-purple-500/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-2xl font-bold text-white">
                  {posts.filter(p => p.type === 'video').length}
                </p>
                <p class="text-gray-400 text-sm">Vídeos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <PostTable posts={posts} modelName={model.name} modelId={model.id} />

        {/* Pagination */}
        {(hasNextPage || hasPrevPage) && (
          <div class="flex justify-between items-center">
            <div>
              {hasPrevPage ? (
                <a 
                  href={buildUrl(page - 1, searchQuery, typeFilter)}
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  ← Anterior
                </a>
              ) : (
                <span class="px-4 py-2 bg-gray-800 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">
                  ← Anterior
                </span>
              )}
            </div>
            
            <div class="text-gray-400 text-sm">
              Página {page} de {totalPages}
            </div>
            
            <div>
              {hasNextPage ? (
                <a 
                  href={buildUrl(page + 1, searchQuery, typeFilter)}
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Próxima →
                </a>
              ) : (
                <span class="px-4 py-2 bg-gray-800 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">
                  Próxima →
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};