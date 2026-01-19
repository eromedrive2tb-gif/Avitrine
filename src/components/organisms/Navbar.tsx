import { FC } from 'hono/jsx';
import { Button } from '../atoms/Button';

interface NavbarProps {
  isAdmin?: boolean;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export const Navbar: FC<NavbarProps> = ({ isAdmin = false, user }) => {
  return (
    <nav class="fixed top-0 left-0 w-full z-[60] transition-all duration-300 bg-[#050505] border-b border-white/5 h-16">
      <div class="w-full px-4 md:px-6 h-full flex items-center justify-between">
        
        {/* Left: Hamburger & Logo */}
        <div class="flex items-center gap-4">
          {/* Hamburger (Mobile Only) */}
          <button onclick="toggleSidebar()" class="md:hidden text-white p-1">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

          <a href="/" class="flex items-center gap-2 group">
             <div class="w-8 h-8 bg-gradient-to-br from-primary to-purple-900 rounded flex items-center justify-center font-display text-white">C</div>
             <span class="text-xl font-display text-white tracking-wide hidden sm:block">
              Creator<span class="text-primary">Flix</span>
            </span>
          </a>
        </div>

        {/* Center: Search Bar (Tube Style) */}
        <div class="hidden md:flex flex-1 max-w-xl mx-8">
            <div class="relative w-full group">
                <input 
                    type="text" 
                    placeholder="Pesquisar modelos, vídeos, categorias..." 
                    class="w-full bg-[#121212] border border-white/10 text-gray-300 text-sm rounded-full py-2 px-5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary">
                    🔍
                </button>
            </div>
        </div>

        {/* Right: Actions */}
        <div class="flex items-center gap-3">
          <a href="/plans" class="hidden md:flex items-center gap-1 text-[#FFD700] text-xs font-bold border border-[#FFD700]/30 px-3 py-1.5 rounded-full hover:bg-[#FFD700]/10 transition-colors">
            <span>💎</span> SEJA VIP
          </a>
          
          <div class="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
          
          {user ? (
            <div class="relative group" x-data="{ open: false }">
                <button 
                  onclick="const menu = document.getElementById('user-menu'); menu.classList.toggle('hidden');"
                  class="flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors focus:outline-none"
                >
                  <span>{user.name || user.email.split('@')[0] || 'Minha Conta'}</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {/* Dropdown Menu */}
                <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-[#121212] border border-white/10 rounded-lg shadow-xl py-2 z-50">
                    <div class="px-4 py-2 border-b border-white/5 mb-2">
                        <p class="text-xs text-gray-400">Logado como</p>
                        <p class="text-sm text-white truncate">{user.email}</p>
                    </div>
                    
                    <a href="/plans" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                       💳 Ver Plano
                    </a>
                    
                    {user.role === 'admin' && (
                        <a href="/admin" class="block px-4 py-2 text-sm text-primary hover:bg-white/5 transition-colors">
                           ⚡ Admin Panel
                        </a>
                    )}

                    <div class="border-t border-white/5 mt-2 pt-2">
                         <form action="/api/logout" method="POST">
                            <button type="submit" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors">
                                🚪 Deslogar
                            </button>
                         </form>
                    </div>
                </div>
            </div>
          ) : (
            <>
              <a href="/login" class="text-sm font-medium text-gray-400 hover:text-white">Entrar</a>
              <Button href="/register" variant="primary" className="!py-1.5 !px-4 !text-xs !rounded-full">
                Criar Conta
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Click outside to close helper (simple script) */}
      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener('click', function(event) {
            const menu = document.getElementById('user-menu');
            const button = event.target.closest('button');
            if (!menu.classList.contains('hidden') && !menu.contains(event.target) && (!button || !button.onclick)) {
                menu.classList.add('hidden');
            }
        });
      `}} />
    </nav>
  );
};