import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';
import { ModelCard } from '../components/molecules/ModelCard';
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';
import { HeroCarousel } from '../components/organisms/HeroCarousel';

export const HomePage: FC = () => {
  // Mock Data
  const trendingModels = [
    { name: "Fernanda T.", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80", category: "Gamer", isLive: true, views: "8.5k" },
    { name: "Sarah J.", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", category: "Cosplay", isLive: true, views: "5.1k" },
  ];

  const feedModels = [
    { name: "Julia K.", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", category: "Fashion", isLive: false, views: "2k" },
    { name: "Mariana S.", imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80", category: "Vlog", isLive: false, views: "4k" },
    { name: "Elena R.", imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&q=80", category: "Fitness", isLive: false, views: "12k" },
    { name: "HOT_GIRL_99", imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", category: "PATROCINADO", isLive: false, views: "AD", isPromoted: true },
    { name: "Sophie", imageUrl: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=80", category: "Art", isLive: false, views: "900" },
    { name: "Valentina", imageUrl: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=600&q=80", category: "Lifestyle", isLive: false, views: "3.2k" },
    { name: "Isabella", imageUrl: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=600&q=80", category: "Model", isLive: false, views: "5k" },
    { name: "Carla", imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80", category: "Fitness", isLive: false, views: "2.1k" }
  ];

  const sponsoredModels = [
    { name: "Vitoria Secret", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", category: "Premium", isLive: false, views: "PRO" },
    { name: "Bella Doll", imageUrl: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=600&q=80", category: "New", isLive: false, views: "PRO" },
  ];

  return (
    <Layout>
      <div class="max-w-[1600px] mx-auto pb-20 p-4 md:p-6">
        
        {/* TOP SECTION: Carousel + Side Ads/Trending */}
        <section class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Main Carousel (Takes 3 columns on large screens) */}
          <div class="lg:col-span-3">
             <HeroCarousel />
          </div>

          {/* Side Column (Desktop Only - Trending/Ads) */}
          <div class="hidden lg:flex flex-col gap-4 h-[380px]">
             {/* Trending Mini Cards */}
             <div class="flex-1 relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer">
                <img src={trendingModels[0].imageUrl} class="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div class="absolute top-2 left-2 bg-red-600 text-[10px] font-bold px-2 rounded text-white animate-pulse">LIVE</div>
                <div class="absolute bottom-2 left-2 font-bold text-white leading-tight">
                    {trendingModels[0].name}<br/>
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
        </section>

        {/* Type B: Banner Ad */}
        <AdBanner 
            title="Aposte na BetWinner" 
            subtitle="Bônus de 100% no primeiro depósito." 
            ctaText="Pegar Bônus" 
            link="#"
            imageUrl="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80"
        />

        {/* Filters / Tags Scroll */}
        <div class="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {['Recomendados', 'Brasileiras', 'VR', 'Live', 'Novinhas', 'Milf', 'Gamer'].map((tag, i) => (
                <button class={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#333] hover:text-white'}`}>
                    {tag}
                </button>
            ))}
        </div>

        {/* Main Feed: High Density */}
        <section>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {/* Mobile: Show trending items here since side col is hidden */}
                <div class="lg:hidden block"><ModelCard {...trendingModels[0]} /></div>
                
                {feedModels.map(m => <ModelCard {...m} />)}
            </div>
        </section>

        {/* Native Ad Block */}
        <NativeAdBlock title="Diamond Selection" models={sponsoredModels} />

        {/* Secondary Feed */}
        <section class="mt-8">
            <h3 class="font-display text-2xl text-white mb-4">Novas Revelações</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                 {feedModels.slice().reverse().map(m => <ModelCard {...m} />)}
            </div>
        </section>

      </div>
    </Layout>
  );
};