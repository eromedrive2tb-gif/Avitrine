import { FC } from 'hono/jsx';

interface BioSectionProps {
  description: string;
}

export const BioSection: FC<BioSectionProps> = ({ description }) => {
  return (
    <div class="lg:col-span-1 space-y-6">
      <div class="p-6 rounded-2xl bg-[#121212] border border-[#222] shadow-sm hover:shadow-[0_0_15px_rgba(138,43,226,0.1)] transition-shadow duration-300">
        <h3 class="text-xs font-bold text-[#8A2BE2] uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
           <span class="w-1.5 h-1.5 rounded-full bg-[#8A2BE2]"></span>
           Sobre a Modelo
        </h3>
        <p class="text-gray-400 text-[15px] leading-loose whitespace-pre-line font-medium">
          {description}
        </p>
      </div>
    </div>
  );
};