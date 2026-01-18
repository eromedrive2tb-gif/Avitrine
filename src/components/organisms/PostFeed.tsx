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
      <div id="posts-feed">
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
                    
                    const isVideo = (url) => /\.(mp4|webm|ogg|mov|m4v|mkv|avi|wmv|flv)(\?|$)/i.test(url);
                    
                    let mediaItems = allUrls.map(url => ({
                        type: isVideo(url) ? 'video' : 'image',
                        url
                    }));

                    if (mediaItems.length === 0) mediaItems.push({ type: 'image', url: post.thumbnail || post.thumbnailUrl || "/static/img/placeholder.jpg" });

                    // Clean structure without 'post-card' JS logic needed anymore
                    let postHtml = '<div class="premium-stack-card group">';
                    
                    // 1. Header
                    postHtml += '<div class="stack-header">';
                    postHtml +=   '<div class="flex items-center gap-3">';
                    postHtml +=     '<div class="relative">';
                    postHtml +=       '<div class="relative w-11 h-11 rounded-full ring-2 ring-[#2a2a2a] overflow-hidden">';
                    postHtml +=         '<img src="' + modelThumb + '" class="w-full h-full object-cover" />';
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
                    postHtml += '<div class="stack-media">';
                    postHtml +=   '<div class="post-carousel relative w-full aspect-[4/5] bg-[#000] overflow-hidden group" data-post-id="' + post.id + '">';
                    
                    // Items Loop
                    postHtml += mediaItems.map((item, idx) => {
                        let itemHtml = '<div class="carousel-item absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ' + (idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none') + '">';
                        if (item.type === 'video') {
                            itemHtml += '<div class="w-full h-full relative">';
                            itemHtml +=   '<video src="' + item.url + '" class="w-full h-full object-cover" loop playsinline muted></video>';
                            itemHtml +=   '<div class="play-button absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/30 transition-colors z-20">';
                            itemHtml +=     '<div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pl-1 scale-90 group-hover:scale-100 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/30">';
                            itemHtml +=       '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
                            itemHtml +=     '</div>';
                            itemHtml +=   '</div>';
                            itemHtml += '</div>';
                        } else {
                            itemHtml += '<img src="' + item.url + '" class="w-full h-full object-cover" loading="lazy" alt="Post content" />';
                        }
                        itemHtml += '</div>';
                        return itemHtml;
                    }).join('');

                    // Controls
                    if (mediaItems.length > 1) {
                        postHtml += '<button class="carousel-prev absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">';
                        postHtml +=   '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
                        postHtml += '</button>';
                        postHtml += '<button class="carousel-next absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white/90 flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#8A2BE2] hover:scale-110">';
                        postHtml +=   '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
                        postHtml += '</button>';
                        
                        // Dots
                        postHtml += '<div class="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none">';
                        postHtml +=   mediaItems.map((_, i) => {
                             return '<div class="carousel-dot w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm ' + (i === 0 ? 'bg-[#8A2BE2] w-4' : 'bg-white/50 hover:bg-white') + '"></div>';
                        }).join('');
                        postHtml += '</div>';
                        
                        // Badge
                        postHtml += '<div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 z-30">';
                        postHtml +=   '1/' + mediaItems.length;
                        postHtml += '</div>';
                    }
                    
                    postHtml += '</div></div>'; // Close Media Block

                    // 3. Footer
                    postHtml += '<div class="stack-footer">';
                    postHtml +=   '<div class="flex items-center justify-between mb-4">';
                    postHtml +=     '<div class="flex gap-4">';
                    postHtml +=       '<button class="action-btn group/like" aria-label="Like">';
                    postHtml +=         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="group-active/like:scale-75 transition-transform"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
                    postHtml +=       '</button>';
                    postHtml +=       '<button class="action-btn" aria-label="Comment">';
                    postHtml +=         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
                    postHtml +=       '</button>';
                    postHtml +=       '<button class="action-btn" aria-label="Share">';
                    postHtml +=         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
                    postHtml +=       '</button>';
                    postHtml +=     '</div>';
                    postHtml +=     '<button class="action-btn">';
                    postHtml +=        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
                    postHtml +=     '</button>';
                    postHtml +=   '</div>';
                    
                    postHtml +=   '<div class="mb-2">';
                    postHtml +=     '<p class="text-sm font-bold text-white">' + (post.likes || 0) + ' curtidas</p>';
                    postHtml +=   '</div>';

                    if (post.title) {
                        postHtml += '<div class="mb-2"><p class="text-sm text-gray-300 leading-relaxed"><span class="font-bold text-white mr-2">' + displayName + '</span>' + post.title + '</p></div>';
                    }
                    
                    if (post.comments > 0) {
                        postHtml += '<button class="text-gray-500 text-xs hover:text-gray-300 transition-colors mt-1 font-medium">Ver todos os ' + post.comments + ' comentários</button>';
                    }

                    postHtml += '</div>'; // Close Footer
                    postHtml += '</div>'; // Close Main Card

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