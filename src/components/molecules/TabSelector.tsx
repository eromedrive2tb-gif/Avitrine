import { FC } from 'hono/jsx';

export const TabSelector: FC = () => {
  return (
    <div class="flex gap-8 mb-8 border-b border-white/5">
      <button class="pb-4 border-b-2 border-primary text-sm font-black tracking-widest text-primary uppercase">Publicações</button>
      <button class="pb-4 border-b-2 border-transparent text-sm font-black tracking-widest text-gray-500 hover:text-white transition-colors uppercase">Galeria</button>
    </div>
  );
};
