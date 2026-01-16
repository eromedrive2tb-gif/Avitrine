import { FC } from 'hono/jsx';

export const Sidebar: FC = () => {
  const menuItems = [
    { icon: '🏠', label: 'Home', link: '/', active: true },
    { icon: '💎', label: 'Premium', link: '/plans' },
    { icon: '🔴', label: 'Ao Vivo', link: '/models?filter=live' },
    { icon: '🔥', label: 'Em Alta', link: '/models?filter=trending' },
    { icon: '✨', label: 'Novidades', link: '/models?filter=new' },
  ];

  const categories = [
    'Brasileiras', 'Amadoras', 'Gamer', 'Cosplay', 'Tatuadas', 'Ebony', 'Milf', 'VR Experience'
  ];

  return (
    <>
      {/* Mobile Overlay (Hidden by default, toggled via JS) */}
      <div id="sidebar-overlay" class="fixed inset-0 bg-black/80 z-40 hidden md:hidden glass backdrop-blur-sm transition-opacity" onclick="toggleSidebar()"></div>

      {/* Sidebar Container */}
      <aside id="sidebar" class="fixed top-0 left-0 h-full w-64 bg-[#050505] border-r border-white/5 z-50 transform -translate-x-full md:translate-x-0 transition-transform duration-300 overflow-y-auto custom-scrollbar">
        
        {/* Mobile Header (Logo) */}
        <div class="flex items-center justify-between p-6 md:hidden">
            <span class="font-display text-2xl text-white">Creator<span class="text-primary">Flix</span></span>
            <button onclick="toggleSidebar()" class="text-white">✕</button>
        </div>

        {/* Logo Desktop Area (Spacer since Navbar covers top) */}
        <div class="hidden md:block h-20"></div> 

        <div class="px-4 py-6">
          {/* Main Menu */}
          <div class="mb-8">
            <h3 class="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Menu</h3>
            <nav class="space-y-1">
              {menuItems.map((item) => (
                <a href={item.link} class={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div class="mb-8">
            <h3 class="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categorias</h3>
            <nav class="space-y-1">
              {categories.map((cat) => (
                <a href={`/models?cat=${cat.toLowerCase()}`} class="flex items-center justify-between px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white group">
                  <span>{cat}</span>
                  <span class="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-600 group-hover:bg-primary group-hover:text-white transition-colors">240+</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Ad Spot Small */}
          <div class="px-4 mt-auto">
             <div class="w-full aspect-square rounded-lg bg-gradient-to-br from-purple-900 to-black border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                <div class="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors"></div>
                <div class="relative z-10 text-center">
                    <p class="text-xs font-bold text-white mb-2">SEJA CRIADOR</p>
                    <button class="text-[10px] bg-primary text-white px-3 py-1 rounded uppercase font-bold">Cadastrar</button>
                </div>
             </div>
          </div>

        </div>
      </aside>

      {/* Script for toggle logic */}
      <script dangerouslySetInnerHTML={{ __html: `
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            
            // Check if we are on mobile (using the transform class as state check or window width)
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }
      `}} />
    </>
  );
};
