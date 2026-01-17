import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ModelCard } from '../components/molecules/ModelCard';
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';
import { HeroCarousel } from '../components/organisms/HeroCarousel';
import { MockService } from '../services/mock';
import { TrendingSideColumn } from '../components/molecules/TrendingSideColumn';

export const HomePage: FC = () => {
  const trendingModels = MockService.getTrendingModels();
  const feedModels = MockService.getFeedModels();
  const sponsoredModels = MockService.getSponsoredModels();
  const tags = MockService.getTags();

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
          <TrendingSideColumn model={trendingModels[0]} />
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
            {tags.map((tag, i) => (
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