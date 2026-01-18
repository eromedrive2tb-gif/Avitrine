// src/pages/ModelProfile.tsx
import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';

interface ModelProfilePageProps {
  model: any;
  initialPosts: any[];
}

export const ModelProfilePage: FC<ModelProfilePageProps> = ({ model, initialPosts }) => {
  // O slug no banco de dados é o folderName
  const folderName = model.folderName;
  const displayName = model.name || folderName;

  return (
    <Layout title={`${displayName} (@${folderName}) - Perfil Exclusivo`}>

      <div>
        <div>
          {/* Header Info */}
          <div class="relative flex justify-between items-end -mt-16 mb-4">
            <div class="relative">
              <div class="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#050505] overflow-hidden bg-gray-900 shadow-xl">
                <img src={model.thumbnailUrl || '/static/img/placeholder_model.jpg'} alt={displayName} class="w-full h-full object-cover" />
              </div>
              {model.isLive && (
                <div class="absolute bottom-1 right-1 bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#050505] uppercase">
                  Live
                </div>
              )}
            </div>
            <div class="flex gap-2 mb-2">
              <button class="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">📤</button>
              <button class="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">⭐</button>
            </div>
          </div>

          <div class="space-y-1">
            <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-2 capitalize">
              {displayName} <span class="text-primary text-base">✓</span>
            </h1>
            <p class="text-gray-400 text-sm font-medium">@{folderName}</p>
          </div>

          {/* Stats */}
          <div class="flex gap-8 mt-6 py-4 border-y border-white/5">
            <div>
              <span class="block text-white font-bold text-lg">{model.postCount || 0}</span>
              <span class="text-[10px] text-gray-500 uppercase tracking-widest">Publicações</span>
            </div>
            <div>
              <span class="block text-white font-bold text-lg">{model.likesCount || 0}</span>
              <span class="text-[10px] text-gray-500 uppercase tracking-widest">Curtidas</span>
            </div>
          </div>

          {/* Bio */}
          {model.description && (
            <div class="mt-4">
              <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {model.description}
              </p>
            </div>
          )}

          {/* Subscribe CTA */}
          <div class="mt-8 p-5 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/30">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p class="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Acesso Premium</p>
                <p class="text-xl font-black text-white">R$ 49,90 <span class="text-sm font-normal text-gray-400">/ mês</span></p>
              </div>
              <button class="w-full md:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold transition-transform active:scale-95">
                ASSINAR AGORA
              </button>
            </div>
          </div>

          {/* Feed Tabs */}
          <div class="flex mt-10 border-b border-white/5">
            <button class="px-8 py-4 border-b-2 border-primary text-primary font-bold text-sm">POSTS</button>
            <button class="px-8 py-4 text-gray-500 font-bold text-sm">MÍDIA</button>
          </div>

          {/* Feed de Posts com Infinite Scroll */}
          <div id="posts-feed" class="mt-6 space-y-8">
            {initialPosts.map(post => (
              <div class="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 shadow-sm">
                <div class="p-4 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <img src={model.thumbnailUrl} class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-sm font-bold capitalize">{displayName}</p>
                    <p class="text-[10px] text-gray-500 uppercase">{post.createdAt || 'Recente'}</p>
                  </div>
                </div>

                <a href={`/posts/${post.id}`} class="block relative aspect-square bg-black group">
                  <img 
                    src={post.thumbnail} 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="lazy" 
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <span class="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase">Ver completo</span>
                  </div>
                </a>
                
                <div class="p-4 flex items-center gap-6 border-t border-white/5">
                  <button class="flex items-center gap-2 text-gray-400">
                    <span>❤️</span> <span class="text-xs font-bold">{post.likes || 0}</span>
                  </button>
                  <button class="flex items-center gap-2 text-gray-400">
                    <span>💬</span> <span class="text-xs font-bold">{post.comments || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sentinel (Gatilho do Scroll) */}
          <div id="infinite-sentinel" class="h-32 flex items-center justify-center">
             <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      {/* Script do Cliente para Carregamento Infinito */}
      <script dangerouslySetInnerHTML={{ __html: `
        let page = 1;
        let loading = false;
        const modelSlug = "${folderName}";
        const modelThumb = "${model.thumbnailUrl}";
        const feed = document.getElementById('posts-feed');
        const sentinel = document.getElementById('infinite-sentinel');

        const observer = new IntersectionObserver(async (entries) => {
          if (entries[0].isIntersecting && !loading) {
            loading = true;
            page++;
            
            try {
              const response = await fetch(\`/api/models/\${modelSlug}/posts?page=\${page}\`);
              const result = await response.json();
              
              if (result.data && result.data.length > 0) {
                result.data.forEach(post => {
                  const thumb = (post.mediaCdns && post.mediaCdns.images && post.mediaCdns.images[0]) 
                                ? post.mediaCdns.images[0] 
                                : (post.thumbnail || "/static/img/placeholder.jpg");
                                
                  const postHtml = \`
                    <div class="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 shadow-sm">
                       <div class="p-4 flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                             <img src="\${modelThumb}" class="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p class="text-sm font-bold capitalize">\${modelSlug}</p>
                             <p class="text-[10px] text-gray-500 uppercase">Recente</p>
                          </div>
                       </div>
                       <a href="/posts/\${post.id}" class="block relative aspect-square bg-black group">
                          <img src="\${thumb}" class="w-full h-full object-cover" loading="lazy" />
                          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                               <span class="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase">Ver completo</span>
                          </div>
                       </a>
                    </div>
                  \`;
                  feed.insertAdjacentHTML('beforeend', postHtml);
                });
                loading = false;
              } else {
                sentinel.innerHTML = "<p class='text-gray-500 text-sm font-medium'>Fim do conteúdo.</p>";
                observer.unobserve(sentinel);
              }
            } catch (err) {
              console.error("Erro ao carregar posts:", err);
              loading = false;
            }
          }
        }, { threshold: 0.1 });

        observer.observe(sentinel);
      `}} />
    </Layout>
  );
};