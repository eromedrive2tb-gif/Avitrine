import { FC } from 'hono/jsx';
import { AdSpotSmall } from '../molecules/AdSpotSmall';
import { AdsService } from '../../services/ads';

export const Sidebar: FC = async () => {
  // Fetch sidebar ads from database
  const sidebarAds = await AdsService.getActiveByPlacement('sidebar', 1);
  const activeSpotAd = sidebarAds.find(ad => ad.type === 'spot');

  const menuItems = [
    { 
      label: 'Home', 
      link: '/', 
      active: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    { 
      label: 'Premium', 
      link: '/plans',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12 12 2l6 10-6 10Z"/><path d="M12 22 6 12 12 2l6 10Z"/></svg>
    },
    { 
      label: 'Ao Vivo', 
      link: '/models?filter=live',
      isLive: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    },
    { 
      label: 'Em Alta', 
      link: '/models?filter=trending',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    },
    { 
      label: 'Novidades', 
      link: '/models?filter=new',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    },
  ];

  const categories = [
    'Brasileiras', 'Amadoras', 'Gamer', 'Cosplay', 'Tatuadas', 'Ebony', 'Milf'
  ];

  return (
    <>
      <div id="sidebar-overlay" class="fixed inset-0 bg-black/60 z-40 hidden md:hidden backdrop-blur-sm transition-opacity" onclick="toggleSidebar()"></div>

      <aside id="sidebar" class="fixed top-0 left-0 h-full w-64 bg-[#050505] border-r border-white/5 z-50 transform -translate-x-full md:translate-x-0 transition-all duration-300 overflow-y-auto flex flex-col custom-scrollbar">
        
        {/* Brand/Logo Area */}
        <div class="h-16 flex items-center px-6 shrink-0 border-b border-white/5 bg-black/20">
            <span class="font-display text-2xl text-white tracking-tighter">
                CREATOR<span class="text-primary shadow-neon-purple">FLIX</span>
            </span>
            <button onclick="toggleSidebar()" class="md:hidden ml-auto text-gray-500 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>

        <div class="flex-1 px-3 py-6 space-y-8">
          {/* Main Navigation */}
          <div>
            <h4 class="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Navegação</h4>
            <nav class="space-y-1">
              {menuItems.map((item) => (
                <a 
                  href={item.link} 
                  class={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative
                    ${item.active 
                      ? 'bg-primary/10 text-white border border-primary/20 shadow-[inset_0_0_20px_rgba(138,43,226,0.05)]' 
                      : 'text-gray-400 hover:bg-white/[0.03] hover:text-white border border-transparent'}
                  `}
                >
                  {item.active && (
                    <div class="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-neon-purple"></div>
                  )}
                  
                  <span class={`${item.active ? 'text-primary' : 'text-gray-500 group-hover:text-primary'} transition-colors`}>
                    {item.icon}
                  </span>
                  
                  <span class="tracking-wide">{item.label}</span>

                  {item.isLive && (
                    <span class="ml-auto flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Categories Section */}
          <div>
            <h4 class="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Categorias Populares</h4>
            <div class="flex flex-wrap gap-2 px-2">
              {categories.map((cat) => (
                <a 
                    href={`/models?cat=${cat.toLowerCase()}`} 
                    class="px-3 py-1.5 rounded-lg bg-surface/30 border border-white/5 text-[11px] text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Ad Spot Small - Real Data from DB */}
        {activeSpotAd && (
          <AdSpotSmall 
            title={activeSpotAd.title}
            buttonText={activeSpotAd.ctaText || 'SAIBA MAIS'}
            link={activeSpotAd.link}
            imageUrl={activeSpotAd.imageUrl || undefined}
          />
        )}

      </aside>

      <script dangerouslySetInnerHTML={{ __html: `
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }
      `}} />
    </>
  );
};
