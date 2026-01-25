import { FC } from 'hono/jsx';

interface Post {
  id: number;
  title: string | null;
  contentUrl: string;
  type: string;
  createdAt: Date | null;
}

interface PostTableProps {
  posts: Post[];
  modelName: string;
  modelId: number;
}

export const PostTable: FC<PostTableProps> = ({ posts, modelName, modelId }) => {
  return (
    <div class="rounded-xl border border-white/5 bg-surface overflow-hidden">
      <div class="px-6 py-4 border-b border-white/5 bg-[#1a1a1a]">
        <h3 class="text-white font-bold text-lg">
          Posts de {modelName}
        </h3>
        <p class="text-gray-400 text-sm mt-1">
          Gerencie os posts da modelo "{modelName}"
        </p>
      </div>
      
      <table class="w-full text-left text-sm text-gray-400">
        <thead class="bg-[#1a1a1a] text-xs uppercase font-bold text-gray-200">
          <tr>
            <th class="px-6 py-4">Preview</th>
            <th class="px-6 py-4">Título</th>
            <th class="px-6 py-4">Tipo</th>
            <th class="px-6 py-4">Criado em</th>
            <th class="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 bg-surface">
          {posts.length === 0 ? (
            <tr>
              <td colspan={5} class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="opacity-20">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  <p>Nenhum post encontrado para esta modelo.</p>
                  <a 
                    href={`/admin/models/${modelId}/posts/new`} 
                    class="text-primary hover:underline text-sm"
                  >
                    Criar primeiro post
                  </a>
                </div>
              </td>
            </tr>
          ) : posts.map((p) => (
            <tr class="hover:bg-white/5 transition-colors group" key={p.id}>
              <td class="px-6 py-4">
                <div class="w-16 h-16 rounded overflow-hidden bg-gray-800 border border-white/10">
                  {p.type === 'image' ? (
                    <img 
                      src={p.contentUrl} 
                      alt={p.title || 'Post'} 
                      class="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                              <circle cx="9" cy="9" r="2"/>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div class="w-full h-full flex items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                      </svg>
                    </div>
                  )}
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-white group-hover:text-primary transition-colors">
                  {p.title || `Post #${p.id}`}
                </p>
              </td>
              <td class="px-6 py-4">
                <span class={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                  p.type === 'image' 
                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                    : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                }`}>
                  {p.type === 'image' ? '📷 Imagem' : '🎬 Vídeo'}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs text-gray-500">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : '-'}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <a 
                    href={p.contentUrl}
                    target="_blank"
                    class="text-gray-400 hover:text-white text-xs uppercase font-bold px-2 py-1 rounded hover:bg-white/5 transition-colors"
                    title="Visualizar"
                  >
                    👁
                  </a>
                  <a 
                    href={`/admin/models/${modelId}/posts/${p.id}/edit`}
                    class="text-gray-400 hover:text-white text-xs uppercase font-bold px-2 py-1 rounded hover:bg-white/5 transition-colors"
                  >
                    Editar
                  </a>
                  <form 
                    action={`/admin/models/${modelId}/posts/${p.id}/delete`} 
                    method="post" 
                    class="inline"
                    onsubmit="return confirm('Tem certeza que deseja excluir este post?')"
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
  );
};