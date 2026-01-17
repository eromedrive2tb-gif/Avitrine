import { FC } from 'hono/jsx';

export const AuthHero: FC = () => {
  return (
    <div class="hidden lg:flex w-1/2 relative bg-black overflow-hidden items-center justify-center">
      <div class="absolute inset-0 z-0">
         <img 
           src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80" 
           class="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
         />
         <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
      </div>
      
      <div class="relative z-10 p-12 max-w-lg">
         <span class="inline-block px-3 py-1 mb-6 border border-[#FFD700] text-[#FFD700] text-xs font-bold uppercase tracking-[0.2em] rounded">
            Acesso Premium
         </span>
         <h2 class="text-6xl font-display text-white mb-6 leading-none">
            Junte-se à <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Elite</span>
         </h2>
         <ul class="space-y-4 text-gray-300 font-light text-lg mb-12">
            <li class="flex items-center gap-3"><span class="text-primary">✓</span> 50,000+ Vídeos Exclusivos</li>
            <li class="flex items-center gap-3"><span class="text-primary">✓</span> Lives Privadas 24/7</li>
            <li class="flex items-center gap-3"><span class="text-primary">✓</span> Qualidade 4K Ultra HD</li>
         </ul>

         {/* Native Ad Block in Visual Side */}
         <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors">
            <div class="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-xl">
               $
            </div>
            <div>
               <h4 class="font-bold text-white text-sm">Parceiro Oficial: BetWin</h4>
               <p class="text-xs text-gray-400">Cadastre-se hoje e ganhe 50 rodadas grátis.</p>
            </div>
         </div>
      </div>
    </div>
  );
};
