import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';

interface ModelProfilePageProps {
  model: any;
  initialPosts: any[];
}

export const ModelProfilePage: FC<ModelProfilePageProps> = ({ model, initialPosts }) => {
  const folderName = model.folderName;
  const displayName = model.name || folderName;

  // Banner superior estilo Netflix
  const bannerUrl = model.coverUrl || model.thumbnailUrl || '/static/img/placeholder_model.jpg';

  return (
    <Layout title={`${displayName} (@${folderName}) - Perfil Exclusivo`}>
      <div class="relative min-h-screen bg-[#050505] text-white font-sans pb-20">
        
        {/* Cinematic Header / Hero Section */}
        <div class="relative h-[40vh] md:h-[55vh] w-full overflow-hidden">
          <div class="absolute inset-0">
            <img 
              src={bannerUrl} 
              alt="" 
              class="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
          </div>
          
          {/* Top Actions */}
          <div class="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
             <button onclick="history.back()" class="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             <div class="flex gap-3">
                <button class="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">📤</button>
                <button class="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-primary">★</button>
             </div>
          </div>
        </div>

        {/* Profile Content Overlap */}
        <div class="relative px-6 -mt-32 z-10 max-w-5xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar Profile */}
            <div class="relative shrink-0 group">
              <div class="w-32 h-32 md:w-44 md:h-44 rounded-3xl border-[6px] border-[#050505] overflow-hidden bg-gray-900 shadow-2xl transition-transform group-hover:scale-[1.02]">
                <img src={model.thumbnailUrl || '/static/img/placeholder_model.jpg'} alt={displayName} class="w-full h-full object-cover" />
              </div>
              {model.isLive && (
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] font-black px-3 py-1 rounded-full border-2 border-[#050505] uppercase tracking-tighter shadow-lg animate-pulse">
                  AO VIVO
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div class="flex-1 pb-2">
              <div class="flex items-center gap-2 mb-1">
                <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
                  {displayName}
                </h1>
                <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] shadow-[0_0_15px_rgba(255,0,0,0.4)]">✓</div>
              </div>
              <p class="text-white/60 font-medium text-lg">@{folderName}</p>
              
              <div class="flex gap-6 mt-4">
                <div class="flex flex-col">
                  <span class="text-xl font-black">{model.postCount || 0}</span>
                  <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Posts</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xl font-black">{model.likesCount || 0}</span>
                  <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Fãs</span>
                </div>
              </div>
            </div>

            {/* Main Action Call */}
            <div class="w-full md:w-auto pb-2">
                <button class="w-full md:w-auto px-10 py-4 bg-primary hover:bg-red-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary/20 active:scale-95 uppercase tracking-widest">
                  Assinar Acesso Total
                </button>
            </div>
          </div>

          {/* Bio Section */}
          <div class="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div class="lg:col-span-1 space-y-6">
               <div class="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                  <h3 class="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Sobre a Modelo</h3>
                  <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {model.description || "Bem-vindo ao meu perfil exclusivo. Assine para ter acesso a conteúdos inéditos diariamente."}
                  </p>
               </div>
            </div>

            {/* Feed Area */}
            <div class="lg:col-span-2">
              {/* Tabs */}
              <div class="flex gap-8 mb-8 border-b border-white/5">
                <button class="pb-4 border-b-2 border-primary text-sm font-black tracking-widest text-primary uppercase">Publicações</button>
                <button class="pb-4 border-b-2 border-transparent text-sm font-black tracking-widest text-gray-500 hover:text-white transition-colors uppercase">Galeria</button>
              </div>

              {/* Feed de Posts */}
              <div id="posts-feed" class="space-y-10">
                {initialPosts.map(post => {
                  // Robust media type detection fallback
                  const rawImages = (post.mediaCdns?.images || post.images || []);
                  const rawVideos = (post.mediaCdns?.videos || post.videos || []);
                  const allUrls = [...rawImages, ...rawVideos];
                  
                  // Regex updated to handle query parameters (presigned URLs) and more formats
                  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|m4v|mkv|avi|wmv|flv)(\?|$)/i.test(url);
                  
                  let mediaItems = allUrls.map(url => ({
                    type: isVideo(url) ? 'video' : 'image',
                    url
                  }));
                  
                  if (mediaItems.length === 0) {
                    mediaItems.push({ type: 'image', url: post.thumbnail || post.thumbnailUrl || '/static/img/placeholder.jpg' });
                  }

                  return (
                    <div class="group bg-[#0f0f0f] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-white/10">
                      {/* Post Header */}
                      <div class="p-5 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div class="w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-white/10">
                            <img src={model.thumbnailUrl} class="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p class="text-sm font-black tracking-tight">{displayName}</p>
                            <div class="flex items-center gap-2">
                               <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                               <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{post.createdAt || 'Publicado Agora'}</p>
                            </div>
                          </div>
                        </div>
                        <a href={`/posts/${post.id}`} class="text-[10px] font-black bg-white/5 px-4 py-2 rounded-lg hover:bg-primary transition-all uppercase tracking-widest">Detalhes</a>
                      </div>

                      {/* Post Media Container */}
                      <div class="post-carousel relative aspect-[4/5] md:aspect-video bg-black/60 overflow-hidden min-h-[300px] group" data-post-id={post.id} style={{ aspectRatio: '0.8' }}>
                        {mediaItems.map((item: any, idx: number) => (
                            <div class={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-300 ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                                {item.type === 'video' ? (
                                    <div class="w-full h-full relative">
                                        <video src={item.url} class="w-full h-full object-cover" loop playsInline></video>
                                        <div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors z-20">
                                            <div class="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center pl-1 scale-90 group-hover:scale-100 transition-transform shadow-2xl">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
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
                                <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md z-30 cursor-pointer shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                </button>
                                <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md z-30 cursor-pointer shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </button>
                                
                                <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-none">
                                    {mediaItems.map((_: any, i: number) => (
                                        <div class={`carousel-dot w-2 h-2 rounded-full transition-all cursor-pointer pointer-events-auto ${i === 0 ? 'bg-primary scale-125' : 'bg-white/40 hover:bg-white'}`}></div>
                                    ))}
                                </div>
                            </>
                        )}
                      </div>

                                            {/* Post Text */}
                                            {post.title && (
                        <div class="px-6 pb-4">
                          <p class="text-sm text-gray-300 leading-relaxed font-medium">{post.title}</p>
                        </div>
                      )}

                      {/* Interaction Footer */}
                      <div class="p-6 flex items-center justify-between border-t border-white/5">
                        <div class="flex items-center gap-8">
                            <button class="flex items-center gap-2 group/btn">
                              <span class="text-xl group-hover/btn:scale-125 transition-transform">❤️</span>
                              <span class="text-xs font-black text-gray-400 group-hover/btn:text-white">{post.likes || 0}</span>
                            </button>
                            <button class="flex items-center gap-2 group/btn">
                              <span class="text-xl group-hover/btn:scale-125 transition-transform">💬</span>
                              <span class="text-xs font-black text-gray-400 group-hover/btn:text-white">{post.comments || 0}</span>
                            </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sentinel */}
              <div id="infinite-sentinel" class="py-20 flex flex-col items-center justify-center gap-4">
                 <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                 <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Carregando Conteúdo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="/static/js/post-carousel.js"></script>

      <script dangerouslySetInnerHTML={{ __html: `
        let page = 1;
        let loading = false;
        const modelSlug = "${folderName}";
        const modelThumb = "${model.thumbnailUrl}";
        const displayName = "${displayName}";
        const feed = document.getElementById('posts-feed');
        const sentinel = document.getElementById('infinite-sentinel');

        // Função para re-inicializar carrosséis via post-carousel.js ou fallback
        function reinitCarousels() {
           if (window.initPostCarousels) {
             window.initPostCarousels();
           }
        }

        const observer = new IntersectionObserver(async (entries) => {
          if (entries[0].isIntersecting && !loading) {
            loading = true;
            page++;
            
            try {
              const response = await fetch("/api/models/\${modelSlug}/posts?page=\${page}");
              const result = await response.json();
              
              if (result.data && result.data.length > 0) {
                result.data.forEach(post => {
                    const rawImages = (post.mediaCdns?.images || post.images || []);
                    const rawVideos = (post.mediaCdns?.videos || post.videos || []);
                    const allUrls = [...rawImages, ...rawVideos];
                    
                    // Regex handles query params (presigned URLs) and more formats
                    const isVideo = (url) => /\\.(mp4|webm|ogg|mov|m4v|mkv|avi|wmv|flv)(\\?|$)/i.test(url);
                    
                    let mediaItems = allUrls.map(url => ({
                        type: isVideo(url) ? 'video' : 'image',
                        url
                    }));

                    if (mediaItems.length === 0) mediaItems.push({ type: 'image', url: post.thumbnail || post.thumbnailUrl || "/static/img/placeholder.jpg" });

                    const postHtml = \`
                      <div class="group bg-[#0f0f0f] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-white/10 mt-10">
                        <div class="p-5 flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-white/10">
                              <img src="\${modelThumb}" class="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p class="text-sm font-black tracking-tight">\${displayName}</p>
                              <div class="flex items-center gap-2">
                                 <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                 <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Recém postado</p>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <a href="/posts/\${post.id}" class="text-[10px] font-black bg-white/5 px-4 py-2 rounded-lg hover:bg-primary transition-all uppercase tracking-widest">Detalhes</a>
                                                      </div>
                                                      \${post.title ? \`<div class="px-6 pb-4"><p class="text-sm text-gray-300 leading-relaxed font-medium">\${post.title}</p></div>\` : ''}
                                                      <div class="post-carousel relative aspect-[4/5] md:aspect-video bg-black/60 overflow-hidden min-h-[300px] group" data-post-id="\${post.id}" style="aspect-ratio: 0.8;">
                                                          \${mediaItems.map((item, idx) => \`
                                                              <div class="carousel-item absolute inset-0 w-full h-full transition-opacity duration-300 \${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}">
                                                                  \${item.type === 'video' ? 
                                                                      \`<div class="w-full h-full relative">
                                                                          <video src="\${item.url}" class="w-full h-full object-cover" loop playsinline></video>
                                                                          <div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors z-20">
                                                                              <div class="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center pl-1 scale-90 group-hover:scale-100 transition-transform shadow-2xl">
                                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                                                                              </div>
                                                                          </div>
                                                                      </div>\` : 
                                                                      \`<img src="\${item.url}" class="w-full h-full object-cover" loading="lazy" />\`
                                                                  }
                                                              </div>
                                                          \`).join('')}
                                                          \${mediaItems.length > 1 ? \`
                                                            <button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md z-30 cursor-pointer shadow-lg">
                                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                                            </button>
                                                            <button class="carousel-next absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md z-30 cursor-pointer shadow-lg">
                                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                                            </button>
                                                            <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-none">
                                                                \${mediaItems.map((_, i) => \`<div class="carousel-dot w-2 h-2 rounded-full transition-all cursor-pointer pointer-events-auto \${i === 0 ? 'bg-primary scale-125' : 'bg-white/40 hover:bg-white'}"></div>\`).join('')}
                                                            </div>
                                                          \` : ''}
                                                      </div>
                                                      <div class="p-6 flex items-center justify-between border-t border-white/5">
                                                          <div class="flex items-center gap-8">
                                                              <button class="flex items-center gap-2">
                                                                <span>❤️</span> 
                                                                <span class="text-xs font-black text-gray-400">\${post.likes || 0}</span>
                                                              </button>
                                                              <button class="flex items-center gap-2">
                                                                <span>💬</span> 
                                                                <span class="text-xs font-black text-gray-400">\${post.comments || 0}</span>
                                                              </button>
                                                          </div>
                                                      </div>
                                                    </div>
                                                  \`;
                    feed.insertAdjacentHTML('beforeend', postHtml);
                });
                reinitCarousels();
                loading = false;
              } else {
                sentinel.innerHTML = "<p class='text-gray-600 text-xs font-black uppercase tracking-widest'>Fim do catálogo</p>";
                observer.unobserve(sentinel);
              }
            } catch (err) {
              loading = false;
            }
          }
        }, { threshold: 0.1 });
        observer.observe(sentinel);
      `}} />
    </Layout>
  );
};
