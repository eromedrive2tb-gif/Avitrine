import { FC } from 'hono/jsx';

interface TrendingModel {
    name: string;
    imageUrl: string;
}

export const TrendingSideColumn: FC<{ model: TrendingModel }> = ({ model }) => {
    return (
        <div class="hidden lg:flex flex-col gap-4 h-[380px]">
            {/* Trending Mini Cards */}
            <div class="flex-1 relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                <img src={model.imageUrl} class="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div class="absolute top-2 left-2 bg-red-600 text-[10px] font-bold px-2 rounded text-white animate-pulse">LIVE</div>
                <div class="absolute bottom-2 left-2 font-bold text-white leading-tight">
                    {model.name}<br />
                    <span class="text-[10px] text-gray-300">Gamer Girl Room</span>
                </div>
            </div>

            {/* Small Square Ad */}
            <div class="h-1/3 bg-[#111] rounded-lg border border-[#FFD700]/30 flex items-center justify-center relative overflow-hidden group">
                <div class="text-center z-10">
                    <p class="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-1">Promoção</p>
                    <p class="text-white font-display text-xl">50% OFF</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-black/50 group-hover:opacity-0 transition-opacity"></div>
            </div>
        </div>
    );
};
