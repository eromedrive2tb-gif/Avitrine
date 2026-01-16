import { FC } from 'hono/jsx';

interface ModelCardProps {
  name: string;
  imageUrl: string;
  category?: string;
  isLive?: boolean;
}

export const ModelCard: FC<ModelCardProps> = ({ name, imageUrl, category = 'Model', isLive = false }) => {
  return (
    <div class="group relative w-full aspect-[3/4] rounded-[20px] overflow-hidden cursor-pointer shadow-xl bg-[#0E1136]">
      {/* Image */}
      <img 
        src={imageUrl} 
        alt={name} 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" 
        loading="lazy"
      />
      
      {/* Overlay Gradient */}
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>

      {/* Content */}
      <div class="absolute bottom-0 left-0 w-full p-5 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[#A37CFF] text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md backdrop-blur-md">
            {category}
          </span>
          {isLive && (
             <span class="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-md">
               <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               LIVE
             </span>
          )}
        </div>
        <h3 class="text-white text-xl font-bold truncate">{name}</h3>
      </div>
      
      {/* Glass Effect Border on Hover */}
      <div class="absolute inset-0 rounded-[20px] border-2 border-white/0 transition-colors duration-300 group-hover:border-white/20 pointer-events-none"></div>
    </div>
  );
};
