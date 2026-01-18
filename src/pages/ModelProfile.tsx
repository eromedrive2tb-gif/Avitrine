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
            {initialPosts.map(post => {
              const images = (post.mediaCdns?.images || []).map((url: string) => ({ type: 'image', url }));
              const videos = (post.mediaCdns?.videos || []).map((url: string) => ({ type: 'video', url }));
              // Combine images and videos. You might want to sort them if needed.
              const mediaItems = [...images, ...videos];
              
              // Fallback if empty
              if (mediaItems.length === 0) {
                 mediaItems.push({ type: 'image', url: post.thumbnail || '/static/img/placeholder.jpg' });
              }

              return (
                <div class="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 shadow-sm">
                  <div class="p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                        <img src={model.thumbnailUrl} class="w-full h-full object-cover" />
                        </div>
                        <div>
                        <p class="text-sm font-bold capitalize">{displayName}</p>
                        <p class="text-[10px] text-gray-500 uppercase">{post.createdAt || 'Recente'}</p>
                        </div>
                    </div>
                    <a href={`/posts/${post.id}`} class="text-xs font-bold text-primary hover:text-white transition-colors">Ver Post ➜</a>
                  </div>

                  <div class="post-carousel relative aspect-square bg-black group" data-post-id={post.id}>
                    {/* Slides */}
                    {mediaItems.map((item: any, idx: number) => (
                        <div class={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-300 ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                            {item.type === 'video' ? (
                                <div class="w-full h-full relative">
                                    <video src={item.url} class="w-full h-full object-cover" loop playsInline></video>
                                    <div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors z-20">
                                        <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <img src={item.url} class="w-full h-full object-cover" loading="lazy" />
                            )}
                        </div>
                    ))}

                    {/* Controls */}
                    {mediaItems.length > 1 && (
                        <>
                            <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                            
                            <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-none">
                                {mediaItems.map((_: any, i: number) => (
                                    <button class={`carousel-dot w-1.5 h-1.5 rounded-full transition-all pointer-events-auto cursor-pointer ${i === 0 ? 'bg-white w-4' : 'bg-white/50 hover:bg-white'}`}></button>
                                ))}
                            </div>
                        </>
                    )}
                  </div>

                  {post.title && (
                    <div class="px-4 pb-3">
                      <p class="text-sm text-gray-200 leading-relaxed">{post.title}</p>
                    </div>
                  )}

                  
                  <div class="p-4 flex items-center gap-6 border-t border-white/5">
                    <button class="flex items-center gap-2 text-gray-400">
                      <span>❤️</span> <span class="text-xs font-bold">{post.likes || 0}</span>
                    </button>
                    <button class="flex items-center gap-2 text-gray-400">
                      <span>💬</span> <span class="text-xs font-bold">{post.comments || 0}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sentinel (Gatilho do Scroll) */}
          <div id="infinite-sentinel" class="h-32 flex items-center justify-center">
             <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      <script src="/static/js/post-carousel.js"></script>

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
                    const images = (post.mediaCdns && post.mediaCdns.images || []).map(url => ({ type: 'image', url }));
                    const videos = (post.mediaCdns && post.mediaCdns.videos || []).map(url => ({ type: 'video', url }));
                    let mediaItems = [...images, ...videos];
                    
                    if (mediaItems.length === 0) {
                        mediaItems.push({ type: 'image', url: post.thumbnail || "/static/img/placeholder.jpg" });
                    }

                    // Generate Slides HTML
                    const slidesHtml = mediaItems.map((item, idx) => {
                        const opacityClass = idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none';
                        const content = item.type === 'video' 
                            ? \`<div class="w-full h-full relative">
                                  <video src="\${item.url}" class="w-full h-full object-cover" loop playsinline></video>
                                  <div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors z-20">
                                      <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                  </div>
                               </div>\`
                            : \`<img src="\${item.url}" class="w-full h-full object-cover" loading="lazy" />\`;
                            
                        return \`<div class="carousel-item absolute inset-0 w-full h-full transition-opacity duration-300 \${opacityClass}">\${content}</div>\`;
                    }).join('');

                    // Generate Controls HTML
                    let controlsHtml = '';
                    if (mediaItems.length > 1) {
                        const dotsHtml = mediaItems.map((_, i) => 
                            \`<button class="carousel-dot w-1.5 h-1.5 rounded-full transition-all pointer-events-auto cursor-pointer \${i === 0 ? 'bg-white w-4' : 'bg-white/50 hover:bg-white'}"></button>\`
                        ).join('');

                        controlsHtml = \`
                            <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                            <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-none">
                                \${dotsHtml}
                            </div>
                        \`;
                    }

                    const postHtml = \`
                        <div class="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 shadow-sm">
                        <div class="p-4 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
                                    <img src="\${modelThumb}" class="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p class="text-sm font-bold capitalize">\${modelSlug}</p>
                                    <p class="text-[10px] text-gray-500 uppercase">Recente</p>
                                </div>
                            </div>
                            <a href="/posts/\${post.id}" class="text-xs font-bold text-primary hover:text-white transition-colors">Ver Post ➜</a>
                        </div>

                        \${post.title ? \`<div class="px-4 pb-3"><p class="text-sm text-gray-200 leading-relaxed">\${post.title}</p></div>\` : ''}

                        <div class="post-carousel relative aspect-square bg-black group" data-post-id="\${post.id}">
                            \${slidesHtml}
                            \${controlsHtml}
                        </div>
                        
                        <div class="p-4 flex items-center gap-6 border-t border-white/5">
                            <button class="flex items-center gap-2 text-gray-400">
                            <span>❤️</span> <span class="text-xs font-bold">\${post.likes || 0}</span>
                            </button>
                            <button class="flex items-center gap-2 text-gray-400">
                            <span>💬</span> <span class="text-xs font-bold">\${post.comments || 0}</span>
                            </button>
                        </div>
                        </div>
                    \`;
                    feed.insertAdjacentHTML('beforeend', postHtml);
                });
                
                // Initialize new carousels
                if (window.initPostCarousels) window.initPostCarousels();
                
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