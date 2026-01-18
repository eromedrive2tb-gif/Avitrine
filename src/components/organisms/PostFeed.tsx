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
      <div id="posts-feed" class="space-y-8">
        {initialPosts.map(post => (
            <PostCard post={post} model={model} displayName={displayName} />
        ))}
      </div>

      {/* Sentinel */}
      <div id="infinite-sentinel" class="py-20 flex flex-col items-center justify-center gap-4">
         <div class="w-10 h-10 border-4 border-[#8A2BE2] border-t-transparent rounded-full animate-spin"></div>
         <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Carregando Conteúdo</p>
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
                    
                    const isVideo = (url) => /\\.(mp4|webm|ogg|mov|m4v|mkv|avi|wmv|flv)(\\?|$)/i.test(url);
                    
                    let mediaItems = allUrls.map(url => ({
                        type: isVideo(url) ? 'video' : 'image',
                        url
                    }));

                    if (mediaItems.length === 0) mediaItems.push({ type: 'image', url: post.thumbnail || post.thumbnailUrl || "/static/img/placeholder.jpg" });

                    // Replicating New PostCard Structure
                    const postHtml = `
                      <div class="group relative bg-[#121212] rounded-[16px] overflow-hidden border border-[#222] transition-all duration-300 hover:scale-[1.005] hover:border-[#8A2BE2]/50 hover:shadow-[0_0_20px_rgba(138,43,226,0.15)]">
                        
                        <!-- Header -->
                        <div class="p-4 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                          <div class="flex items-center gap-3">
                            <div class="relative">
                              <div class="absolute -inset-0.5 bg-gradient-to-tr from-[#8A2BE2] to-[#222] rounded-full opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity"></div>
                              <div class="relative rounded-full bg-[#121212] p-[2px]">
                                 <div class="relative group w-11 h-11">
                                    <div class="relative overflow-hidden object-cover w-full h-full rounded-full ring-2 ring-[#121212]">
                                        <img src="${modelThumb}" class="w-full h-full object-cover rounded-full" />
                                    </div>
                                 </div>
                              </div>
                            </div>
                            <div class="flex flex-col">
                              <p class="text-sm font-bold text-white tracking-wide group-hover:text-[#8A2BE2] transition-colors">
${displayName}</p>
                              <p class="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
${post.createdAt || 'Publicado Agora'}</p>
                            </div>
                          </div>
                          <button class="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                          </button>
                        </div>

                        <!-- Media -->
                        <div class="w-full bg-black">
                            <div class="post-carousel relative w-full aspect-[4/5] bg-[#1a1a1a] overflow-hidden group" data-post-id="${post.id}">
                                
                                    ${mediaItems.map((item, idx) => `
                                    <div class="carousel-item absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}">
                                        
                                            ${item.type === 'video' ? 
                                                `<div class="w-full h-full relative">
                                                <video src="${item.url}" class="w-full h-full object-cover" loop playsinline muted></video>
                                                <div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/30 transition-colors z-20">
                                                    <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 scale-90 group-hover:scale-100 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/30">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                                                    </div>
                                                </div>
                                            </div>` : 
                                                `<img src="${item.url}" class="w-full h-full object-cover" loading="lazy" alt="Post content" />`
                                            }
                                    </div>
                                `).join('')}
                                
                                
                                    ${mediaItems.length > 1 ? 
                                  `<button class="carousel-prev absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                  </button>
                                  <button class="carousel-next absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                  </button>
                                  <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none">
                                      
                                          ${mediaItems.map((_, i) => `<div class="carousel-dot w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm ${i === 0 ? 'bg-[#8A2BE2] w-4' : 'bg-white/50 hover:bg-white'}"></div>`).join('')}
                                  </div>
                                  <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 z-30">
                                    1/${mediaItems.length}
                                  </div>
                                `} 
                            </div>
                        </div>

                        <!-- Interaction -->
                        <div class="px-4 pt-3 pb-2 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <button class="flex items-center gap-2 group/like focus:outline-none">
                                  <span class="text-2xl transition-transform group-active/like:scale-75 group-hover/like:text-[#8A2BE2] text-white">♡</span>
                                </button>
                                <button class="flex items-center gap-2 group/comment focus:outline-none">
                                  <span class="text-2xl transition-transform group-hover/comment:-translate-y-0.5 text-white">💬</span>
                                </button>
                                <button class="flex items-center gap-2 group/share focus:outline-none">
                                  <span class="text-2xl transition-transform group-hover/share:rotate-12 text-white">✈️</span>
                                </button>
                            </div>
                            <button class="text-white hover:text-[#8A2BE2] transition-colors">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                            </button>
                        </div>
                        
                        <div class="px-4 pb-1">
                            <p class="text-sm font-bold text-white">${post.likes || 0} curtidas</p>
                        </div>

                        ${post.title ? `<div class="px-4 pb-4 pt-1"><p class="text-sm text-gray-300 leading-relaxed"><span class="font-bold text-white mr-2">
${displayName}</span>${post.title}</p></div>` : ''}
                        
                        ${post.comments > 0 ? `<div class="px-4 pb-4"><button class="text-gray-500 text-xs hover:text-gray-300 transition-colors">Ver todos os ${post.comments} comentários</button></div>` : ''}

                      </div>
                    `;
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