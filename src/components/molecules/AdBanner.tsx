import { FC } from 'hono/jsx';

interface AdBannerProps {
  imageUrl?: string; // Optional custom image
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
}

// Type B: Banner Ad (Faixa Horizontal)
export const AdBanner: FC<AdBannerProps> = ({ title, subtitle, ctaText, link, imageUrl }) => {
  return (
    <a href={link} class="block my-6 group">
      <div class="relative w-full h-24 md:h-32 rounded-lg overflow-hidden bg-gradient-to-r from-[#1a1a1a] to-[#050505] border border-white/10 hover:border-primary/50 transition-all">
        {imageUrl && (
            <img src={imageUrl} class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity" />
        )}
        <div class="absolute inset-0 flex items-center justify-between px-4 md:px-10 z-10">
            <div class="flex flex-col justify-center">
                <span class="text-[10px] text-[#FFD700] uppercase font-bold tracking-widest border border-[#FFD700] px-1 w-fit mb-1">Publicidade</span>
                <h4 class="text-white font-display text-xl md:text-3xl uppercase leading-none">{title}</h4>
                <p class="text-gray-400 text-xs md:text-sm hidden sm:block">{subtitle}</p>
            </div>
            <span class="bg-primary text-white text-xs md:text-sm font-bold px-4 py-2 rounded-sm uppercase group-hover:bg-primary/80 transition-colors">
                {ctaText}
            </span>
        </div>
      </div>
    </a>
  );
};
