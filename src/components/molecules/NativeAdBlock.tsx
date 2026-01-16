import { FC } from 'hono/jsx';
import { ModelCard } from './ModelCard';

interface NativeAdBlockProps {
  title: string;
  models: any[]; // List of models to show in this block
}

// Type C: Native Ad (Bloco Editorial Patrocinado)
export const NativeAdBlock: FC<NativeAdBlockProps> = ({ title, models }) => {
  return (
    <div class="my-8 p-4 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-y border-[#FFD700]/30 relative overflow-hidden">
        {/* Label Native */}
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-white font-display text-xl flex items-center gap-2">
                <span class="text-[#FFD700]">★</span> {title}
            </h3>
            <span class="text-[10px] text-gray-500 uppercase">Patrocinado</span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            {models.map(model => (
                <ModelCard {...model} isPromoted={true} />
            ))}
        </div>
    </div>
  );
};
