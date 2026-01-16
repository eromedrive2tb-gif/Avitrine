import { FC } from 'hono/jsx';

interface ModelCardProps {
  name: string;
  imageUrl: string;
  videoUrl?: string; // Optional video preview
  category?: string;
  isLive?: boolean;
  views?: string;
}

export const ModelCard: FC<ModelCardProps> = ({ 
  name, 
  imageUrl, 
  category = 'Model', 
  isLive = false,
  views = '1.2k'
}) => {
  return (
    <div class="group relative w-full aspect-[2/3] rounded-lg overflow-hidden cursor-pointer bg-surface border border-white/5 hover:border-primary/50 transition-all duration-500 hover:shadow-neon-purple">
      {/* Image Layer */}
      <img 
        src={imageUrl} 
        alt={name} 
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0" 
        loading="lazy"
      />
      
      {/* Video Preview Layer (Simulated with opacity on hover) */}
      <div class="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-300"></div>

      {/* Gradient Overlay for Text Readability */}
      <div class="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent opacity-80 z-20"></div>

      {/* Live Badge */}
      {isLive && (
        <div class="absolute top-3 right-3 z-30">
          <span class="flex items-center gap-2 bg-red-600/20 backdrop-blur-md border border-red-500/50 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Ao Vivo
          </span>
        </div>
      )}

      {/* Content */}
      <div class="absolute bottom-0 left-0 w-full p-4 z-30 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div class="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 delay-75">
          <span class="text-xs font-semibold text-primary uppercase tracking-wider">{category}</span>
          <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
          <span class="text-xs text-gray-400 flex items-center gap-1">
            👁 {views}
          </span>
        </div>
        
        <h3 class="text-white text-2xl font-display uppercase leading-none mb-1 group-hover:text-primary transition-colors duration-300">{name}</h3>
        
        <div class="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500 ease-out mt-3"></div>
      </div>
    </div>
  );
};