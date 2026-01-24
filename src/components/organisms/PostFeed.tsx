import { FC } from 'hono/jsx';
import { PostCard } from './PostCard';

interface PostFeedProps {
  initialPosts: any[];
  model: any;
  displayName: string;
  isSubscribed?: boolean;
}

export const PostFeed: FC<PostFeedProps> = ({ initialPosts, model, displayName, isSubscribed = false }) => {
  return (
    <div class="lg:col-span-2">
      {/* Feed de Posts */}
      <div id="posts-feed">
        {initialPosts.map(post => (
            <PostCard post={post} model={model} displayName={displayName} isSubscribed={isSubscribed} />
        ))}
      </div>

      {/* Sentinel */}
      <div id="infinite-sentinel" class="py-20 flex flex-col items-center justify-center gap-4">
         <div class="w-10 h-10 border-4 border-[#8A2BE2] border-t-transparent rounded-full animate-spin"></div>
         <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Carregando Conteúdo</p>
      </div>

      {/* Infinite Scroll Script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
            let page = 1;
            let loading = false;
            const modelSlug = "${model.folderName}";
            const modelIcon = "${model.iconUrl || model.thumbnailUrl}";
            const displayName = "${displayName}";
            const isSubscribed = ${isSubscribed ? 'true' : 'false'};
            const feed = document.getElementById('posts-feed');
            const sentinel = document.getElementById('infinite-sentinel');

            if (!feed || !sentinel) {
                console.error("PostFeed: Feed or Sentinel element not found.");
                return;
            }

            function reinitCarousels() {
               if (window.initPostCarousels) {
                 window.initPostCarousels();
               }
            }
            
            // Função para gerar o overlay premium
            function getPremiumOverlayHtml() {
                if (isSubscribed) return '';
                return '<div class="premium-overlay absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50">' +
                    '<div class="relative z-10 flex flex-col items-center text-center px-6">' +
                        '<div class="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20 shadow-lg">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-white">' +
                                '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>' +
                                '<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>' +
                            '</svg>' +
                        '</div>' +
                        '<h3 class="text-lg font-bold text-white mb-2">Conteúdo Exclusivo</h3>' +
                        '<p class="text-sm text-gray-300 mb-5 max-w-[200px]">Assine para desbloquear este e outros conteúdos premium</p>' +
                        '<a href="/plans" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8A2BE2] to-[#9D4EDD] text-white text-sm font-bold rounded-full hover:from-[#7B27CC] hover:to-[#8E3FCC] transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>' +
                            'Assinar Agora' +
                        '</a>' +
                    '</div>' +
                '</div>';
            }

            const observer = new IntersectionObserver(async (entries) => {
              if (entries[0].isIntersecting && !loading) {
                loading = true;
                page++;
                console.log("Loading page " + page);
                
                try {
                  const response = await fetch("/api/models/" + modelSlug + "/posts?page=" + page);
                  if (!response.ok) throw new Error("API responded with " + response.status);
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

                        let postHtml = '<div class="premium-stack-card group">';
                        
                        // 1. Header (Updated to match Avatar.tsx size="sm" structure)
                        postHtml += '<div class="stack-header">';
                        postHtml +=   '<div class="flex items-center gap-3">';
                        postHtml +=     '<div class="relative">';
                        postHtml +=       '<div class="relative group w-11 h-11 !rounded-full ring-2 ring-[#2a2a2a]">';
                        postHtml +=         '<div class="absolute -inset-0.5 bg-gradient-to-tr from-[#8A2BE2] to-[#00F0FF] rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300"></div>';
                        postHtml +=         '<div class="relative overflow-hidden object-cover w-full h-full rounded-full ring-2 ring-[#121212] !rounded-full ring-2 ring-[#2a2a2a]">';
                        postHtml +=             '<img src="' + modelIcon + '" class="w-full h-full object-cover rounded-full" />';
                        postHtml +=         '</div>';
                        postHtml +=       '</div>';
                        postHtml +=     '</div>';
                        postHtml +=     '<div class="flex flex-col">';
                        postHtml +=       '<p class="text-sm font-bold text-gray-100 hover:text-[#8A2BE2] transition-colors cursor-pointer">' + displayName + '</p>';
                        postHtml +=       '<p class="text-[11px] text-gray-500 font-medium uppercase tracking-wider">' + (post.createdAt || 'Publicado Agora') + '</p>';
                        postHtml +=     '</div>';
                        postHtml +=   '</div>';
                        postHtml +=   '<button class="action-btn !p-2 text-gray-500 hover:text-white">';
                        postHtml +=     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>';
                        postHtml +=   '</button>';
                        postHtml += '</div>';

                        // 2. Media
                        postHtml += '<div class="stack-media relative overflow-hidden">';
                        postHtml +=   '<div class="post-carousel relative w-full aspect-[4/5] bg-[#000] overflow-hidden group" data-post-id="' + post.id + '">';
                        
                        postHtml += mediaItems.map((item, idx) => {
                            let itemHtml = '<div class="carousel-item absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ' + (idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none') + '">';
                            
                            if (item.type === 'video') {
                                itemHtml += '<div class="custom-video-wrapper w-full h-full relative group/video no-context-menu" oncontextmenu="return false;">';
                                itemHtml +=   '<video src="' + item.url + '" class="w-full h-full object-cover" loop playsinline muted oncontextmenu="return false;"></video>';
                                itemHtml +=   '<div class="video-overlay absolute inset-0 cursor-pointer z-10"></div>';
                                itemHtml +=   '<div class="play-state-icon absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-200">';
                                itemHtml +=     '<div class="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center pl-1 border border-white/10 shadow-lg">';
                                itemHtml +=       '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" class="opacity-90"><path d="M8 5v14l11-7z"/></svg>';
                                itemHtml +=     '</div>';
                                itemHtml +=   '</div>';
                                itemHtml +=   '<div class="video-controls absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 z-30 flex items-center gap-3">';
                                itemHtml +=      '<button class="control-play-btn text-white hover:text-primary transition-colors">';
                                itemHtml +=        '<svg class="icon-play w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
                                itemHtml +=        '<svg class="icon-pause w-5 h-5 hidden" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
                                itemHtml +=      '</button>';
                                itemHtml +=      '<input type="range" min="0" max="100" value="0" step="0.1" class="video-scrubber flex-1 h-1 bg-white/30 rounded-full appearance-none outline-none" />';
                                itemHtml +=      '<button class="control-mute-btn text-white hover:text-primary transition-colors">';
                                itemHtml +=         '<svg class="icon-muted w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" x2="1" y1="9" y2="9" transform="rotate(45 12 12)"/></svg>';
                                itemHtml +=         '<svg class="icon-unmuted w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
                                itemHtml +=      '</button>';
                                itemHtml +=   '</div>';
                                itemHtml += '</div>';
                            } else {
                                itemHtml += '<img src="' + item.url + '" class="w-full h-full object-cover" loading="lazy" alt="Post content" />';
                            }
                            itemHtml += '</div>';
                            return itemHtml;
                        }).join('');
                        
                        // Adicionar blur overlay se não for assinante - otimizado para performance
                        if (!isSubscribed && mediaItems.length > 0) {
                            postHtml += '<div class="premium-blur-overlay" style="background-image: url(\'' + mediaItems[0].url + '\');" aria-hidden="true"></div>';
                        }

                        if (mediaItems.length > 1) {
                            postHtml += '<button class="carousel-prev absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">';
                            postHtml +=   '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
                            postHtml += '</button>';
                            postHtml += '<button class="carousel-next absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">';
                            postHtml +=   '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
                            postHtml += '</button>';
                            
                            postHtml += '<div class="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none">';
                            postHtml +=   mediaItems.map((_, i) => {
                                 return '<div class="carousel-dot w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm ' + (i === 0 ? 'bg-[#8A2BE2] w-4' : 'bg-white/50 hover:bg-white') + '"></div>';
                            }).join('');
                            postHtml += '</div>';
                            
                            postHtml += '<div class="carousel-counter absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 z-30">';
                            postHtml +=   '1/' + mediaItems.length;
                            postHtml += '</div>';
                        }
                        
                        postHtml += '</div>'; // Close carousel
                        postHtml += getPremiumOverlayHtml(); // Add premium overlay
                        postHtml += '</div>'; // Close stack-media 

                        // 3. Footer (Updated to match PostCard.tsx exact structure)
                        postHtml += '<div class="stack-footer">';
                        
                        // Interaction Row
                        postHtml += '<div class="flex items-center justify-between mb-4">';
                        postHtml +=   '<div class="flex gap-6">';
                        
                        // Likes
                        postHtml +=     '<div class="flex items-center gap-1.5 group/item">';
                        postHtml +=       '<button class="action-btn group/like" aria-label="Like">';
                        postHtml +=         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6 group-active/like:scale-75 transition-transform"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
                        postHtml +=       '</button>';
                        postHtml +=       '<span class="text-sm font-semibold text-gray-400 group-hover/item:text-gray-200 transition-colors">' + (post.likes || 0) + '</span>';
                        postHtml +=     '</div>';

                        // Tips (Donate)
                        postHtml +=     '<div class="flex items-center gap-1.5 group/item">';
                        postHtml +=       '<button class="action-btn" aria-label="Send Money">';
                        postHtml +=         '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" style="width: 24px; height: 24px; color: inherit; opacity: 0.9;">';
                        postHtml +=           '<g id="SVGRepo_iconCarrier"><g data-name="11. Phone" id="_11._Phone">';
                        postHtml +=             '<path d="M14,6a1,1,0,0,0,0-2H8A1,1,0,0,0,8,6Z"></path>';
                        postHtml +=             '<path d="M21,8.84v-4A4.8,4.8,0,0,0,16.21,0H5.79A4.8,4.8,0,0,0,1,4.79V27.21A4.8,4.8,0,0,0,5.79,32H16.21A4.8,4.8,0,0,0,21,27.21v-.05A10,10,0,0,0,21,8.84ZM16.21,30H5.79A2.79,2.79,0,0,1,3,27.21V4.79A2.79,2.79,0,0,1,5.79,2H16.21A2.79,2.79,0,0,1,19,4.79V8.2A10.2,10.2,0,0,0,17,8a9.92,9.92,0,0,0-7,2.89V10a1,1,0,0,0-2,0V26a1,1,0,0,0,2,0v-.89A9.92,9.92,0,0,0,17,28a10.19,10.19,0,0,0,1.93-.19A2.79,2.79,0,0,1,16.21,30ZM17,26a8,8,0,0,1-7-4.14V14.14A8,8,0,1,1,17,26Z"></path>';
                        postHtml +=             '<path d="M17,15h2a1,1,0,0,0,0-2H18a1,1,0,0,0-2,0v.18A3,3,0,0,0,17,19a1,1,0,0,1,0,2H15a1,1,0,0,0,0,2h1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,17,17a1,1,0,0,1,0-2Z"></path>';
                        postHtml +=             '<path d="M30,5H27.41l.3-.29a1,1,0,1,0-1.42-1.42l-2,2a1,1,0,0,0,0,1.42l2,2a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L27.41,7H30a1,1,0,0,0,0-2Z"></path>';
                        postHtml +=           '</g></g>';
                        postHtml +=         '</svg>';
                        postHtml +=       '</button>';
                        postHtml +=       '<span class="text-sm font-semibold text-gray-400 group-hover/item:text-gray-200 transition-colors">$' + (post.tipsTotal || 0) + '</span>';
                        postHtml +=     '</div>';

                        postHtml +=   '</div>'; // Close gap-6 flex
                        postHtml += '</div>'; // Close interaction row flex

                        if (post.title) {
                            postHtml += '<div class="mb-2"><p class="text-sm text-gray-300 leading-relaxed"><span class="font-bold text-white mr-2">' + displayName + '</span>' + post.title + '</p></div>';
                        }
                        
                        if (post.comments > 0) {
                            postHtml += '<button class="text-gray-500 text-xs hover:text-gray-300 transition-colors mt-1 font-medium">Ver todos os ' + post.comments + ' comentários</button>';
                        }

                        postHtml += '</div>'; 
                        postHtml += '</div>'; 

                        feed.insertAdjacentHTML('beforeend', postHtml);
                    });
                    reinitCarousels();
                    loading = false;
                  } else {
                    sentinel.innerHTML = "<p class='text-gray-600 text-xs font-black uppercase tracking-widest'>Fim do catálogo</p>";
                    observer.unobserve(sentinel);
                  }
                } catch (err) {
                  console.error("Infinite scroll error:", err);
                  loading = false;
                  sentinel.innerHTML = "<div class='text-red-500 text-xs font-bold text-center'>Erro ao carregar.<br>Verifique sua conexão.</div>";
                }
              }
            }, { threshold: 0.1 });
            observer.observe(sentinel);
        })();
      `}} />
    </div>
  );
};