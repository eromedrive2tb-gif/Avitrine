import { FC } from 'hono/jsx';
import { PostCard } from './PostCard';

interface PostFeedProps {
  initialPosts: any[];
  model: any;
  displayName: string;
}

export const PostFeed: FC<PostFeedProps> = ({ initialPosts, model, displayName }) => {
  return (
    <div class="lg:col-span-2">
      {/* Feed de Posts */}
      <div id="posts-feed" class="space-y-10">
        {initialPosts.map(post => (
            <PostCard post={post} model={model} displayName={displayName} />
        ))}
      </div>

      {/* Sentinel */}
      <div id="infinite-sentinel" class="py-20 flex flex-col items-center justify-center gap-4">
         <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
         <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Carregando Conteúdo</p>
      </div>

      {/* Infinite Scroll Script */}
      <script dangerouslySetInnerHTML={{ __html: `
        let page = 1;
        let loading = false;
        const modelSlug = "${model.folderName}";
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
              const response = await fetch("/api/models/" + modelSlug + "/posts?page=" + page);
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

                    // Replicating PostCard HTML structure for dynamic insertion
                    const postHtml = \`
                      <div class="group bg-[#0f0f0f] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-white/10 mt-10">
                        <div class="p-5 flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="shadow-lg border border-white/10 rounded-xl w-11 h-11 overflow-hidden">
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
                            \${mediaItems.length > 1 ? 
                              \`<button class="carousel-prev absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md z-30 cursor-pointer shadow-lg">
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

                        \${post.title ? \`<div class="px-6 pb-4"><p class="text-sm text-gray-300 leading-relaxed font-medium">\${post.title}</p></div>\` : ''}
                        
                        <div class="p-6 flex items-center justify-between border-t border-white/5">
                            <div class="flex items-center gap-8">
                                <button class="flex items-center gap-2 group/btn">
                                  <span class="text-xl group-hover/btn:scale-125 transition-transform">❤️</span>
                                  <span class="text-xs font-black text-gray-400 group-hover/btn:text-white">\${post.likes || 0}</span>
                                </button>
                                <button class="flex items-center gap-2 group/btn">
                                  <span class="text-xl group-hover/btn:scale-125 transition-transform">💬</span>
                                  <span class="text-xs font-black text-gray-400 group-hover/btn:text-white">\${post.comments || 0}</span>
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
    </div>
  );
};
