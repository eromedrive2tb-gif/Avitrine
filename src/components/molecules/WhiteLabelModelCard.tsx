import { FC } from 'hono/jsx';

interface WhiteLabelModelProps {
  id: number;
  name: string;
  postCount: number;
  thumbnailUrl: string | null;
}

export const WhiteLabelModelCard: FC<WhiteLabelModelProps> = ({ 
  name, 
  thumbnailUrl, 
  postCount 
}) => {
  // Fallback se não tiver imagem (embora nossa query tente garantir uma)
  const imageSrc = thumbnailUrl || '/static/img/placeholder_model.jpg'; 
  // Formata o nome para URL (slug simples)
  const slug = name.trim();

  return (
    <a href={`/models/${slug}`} class="group relative w-full aspect-[3/4] rounded-md overflow-hidden cursor-pointer block bg-gray-900 border border-white/5 hover:border-primary/50 transition-all duration-300">
      
      {/* Image Layer */}
      <img 
        src={imageSrc} 
        alt={name} 
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

      {/* Content */}
      <div class="absolute bottom-0 left-0 w-full p-3 z-20">
        <h3 class="text-white text-sm md:text-base font-bold truncate capitalize shadow-black drop-shadow-md">
          {name}
        </h3>
        
        <div class="flex items-center gap-2 mt-1">
          <span class="text-[10px] text-gray-300 flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
            📸 {postCount} Posts
          </span>
        </div>
      </div>
    </a>
  );
};