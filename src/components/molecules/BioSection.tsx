import { FC } from 'hono/jsx';

interface BioSectionProps {
  description: string;
}

export const BioSection: FC<BioSectionProps> = ({ description }) => {
  return (
    <div class="lg:col-span-1 space-y-6">
      <div class="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
        <h3 class="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Sobre a Modelo</h3>
        <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
};
