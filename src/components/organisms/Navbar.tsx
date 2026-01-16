import { FC } from 'hono/jsx';
import { Button } from '../atoms/Button';

interface NavbarProps {
  isAdmin?: boolean;
}

export const Navbar: FC<NavbarProps> = ({ isAdmin = false }) => {
  return (
    <nav class="fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-[#0B2641]/70 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4006] to-[#A37CFF] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform">
            C
          </div>
          <span class="text-2xl font-bold text-white tracking-tight">
            Creator<span class="text-[#A37CFF]">Flix</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div class="hidden md:flex items-center gap-8">
          <a href="/" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</a>
          <a href="/models" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Modelos</a>
          <a href="/plans" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Planos</a>
        </div>

        {/* Actions */}
        <div class="flex items-center gap-4">
          <a href="/login" class="text-sm font-medium text-gray-300 hover:text-white hidden md:block">Login</a>
          <Button href="/register" variant="primary" className="!py-2 !px-5 text-sm">
            Começar Agora
          </Button>
        </div>
      </div>
    </nav>
  );
};
