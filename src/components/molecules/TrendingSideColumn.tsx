import { FC } from 'hono/jsx';
import { AdBanner } from './AdBanner';
import type { Ad } from '../../services/ads';

interface TrendingModel {
    name: string;
    imageUrl: string;
}

interface TrendingSideColumnProps {
    model: TrendingModel;
    sidebarAds?: Ad[];
}

export const TrendingSideColumn: FC<TrendingSideColumnProps> = ({ model, sidebarAds = [] }) => {
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

            {/* Small Square Ad - Real Data */}
            {sidebarAds.length > 0 ? (
                <div class="h-1/3 overflow-hidden rounded-lg">
                    <a 
                        href={sidebarAds[0].link} 
                        class="block h-full w-full relative group"
                        onclick={`fetch('/api/ads/${sidebarAds[0].id}/click', {method:'post'})`}
                    >
                        {sidebarAds[0].imageUrl && (
                            <img src={sidebarAds[0].imageUrl} class="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        )}
                        <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <div class="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                            <p class="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest mb-1">Patrocinado</p>
                            <p class="text-white font-display text-lg leading-tight">{sidebarAds[0].title}</p>
                            {sidebarAds[0].ctaText && (
                                <span class="mt-2 bg-primary text-white text-[9px] px-2 py-1 rounded font-bold uppercase">{sidebarAds[0].ctaText}</span>
                            )}
                        </div>
                    </a>
                </div>
            ) : (
                <div class="h-1/3 bg-[#111] rounded-lg border border-[#FFD700]/30 flex items-center justify-center relative overflow-hidden group">
                    <div class="text-center z-10">
                        <p class="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-1">Promoção</p>
                        <p class="text-white font-display text-xl">50% OFF</p>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-black/50 group-hover:opacity-0 transition-opacity"></div>
                </div>
            )}
        </div>
    );
};
