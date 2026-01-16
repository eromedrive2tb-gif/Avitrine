import { FC } from 'hono/jsx';
import { Button } from '../atoms/Button';

interface NavbarProps {
  isAdmin?: boolean;
}

export const Navbar: FC<NavbarProps> = ({ isAdmin = false }) => {
  return (
    <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-xl bg-void/70 border-b border-white/5">
      <div class="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" class="flex items-center gap-3 group">
          <div class="relative w-10 h-10 flex items-center justify-center">
             <div class="absolute inset-0 bg-primary rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
             <div class="relative w-full h-full bg-gradient-to-br from-primary to-purple-900 rounded-lg flex items-center justify-center border border-white/10">
               <span class="font-display text-2xl text-white pt-1">C</span>
             </div>
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-display text-white tracking-wide leading-none">
              Creator<span class="text-primary">Flix</span>
            </span>
            <span class="text-[10px] uppercase tracking-[0.2em] text-gray-400 hidden sm:block">Premium Content</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div class="hidden md:flex items-center gap-10">
          <a href="/" class="text-sm font-medium uppercase tracking-widest text-white border-b-2 border-primary pb-1">Home</a>
          <a href="/models" class="text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Modelos</a>
          <a href="/plans" class="text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Planos</a>
        </div>

        {/* Actions */}
        <div class="flex items-center gap-6">
          <a href="/login" class="text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors hidden md:block">Login</a>
          <Button href="/register" variant="primary" className="!py-2 !px-6 text-xs shadow-neon-purple">
            Assinar VIP
          </Button>
        </div>
      </div>
    </nav>
  );
};