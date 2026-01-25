import { FC } from 'hono/jsx';

interface AdSpotSmallProps {
  imageUrl?: string;
  title: string;
  buttonText: string;
  link: string;
  adId?: number;
}

export const AdSpotSmall: FC<AdSpotSmallProps> = ({ 
  imageUrl = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80", 
  title, 
  buttonText, 
  link,
  adId
}) => {
  const handleClick = adId ? `fetch('/api/ads/${adId}/click', {method:'POST'})` : '';

  return (
    <div class="p-4 mt-auto border-t border-white/5 bg-[#0a0a0a]">
        <span class="text-[10px] text-gray-600 uppercase mb-1 block">Publicidade</span>
        <a href={link} class="block w-full aspect-square rounded-lg bg-white overflow-hidden relative group border border-white/10" onclick={handleClick}>
        <img src={imageUrl} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        <div class="absolute bottom-3 left-3 right-3 text-center">
            <p class="text-white font-bold text-lg leading-none mb-1">{title}</p>
            <button class="bg-[#FFD700] text-black text-[10px] font-bold w-full py-1 rounded hover:bg-white transition-colors">
                {buttonText}
            </button>
        </div>
        </a>
    </div>
  );
};
