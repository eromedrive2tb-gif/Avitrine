import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ModelCard } from '../components/molecules/ModelCard';
import { WhiteLabelModelCard } from '../components/molecules/WhiteLabelModelCard';
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';
import { HeroCarousel } from '../components/organisms/HeroCarousel';
import { MockService } from '../services/mock';
import { TrendingSideColumn } from '../components/molecules/TrendingSideColumn';
import type { Ad } from '../services/ads';

// Interface das props
interface HomePageProps {
  models: {
    id: number;
    name: string;
    postCount: number;
    thumbnailUrl: string | null;
  }[];
  user?: any;
  ads?: {
    home_top?: Ad[];
    home_middle?: Ad[];
    home_bottom?: Ad[];
    sidebar?: Ad[];
    feed_mix?: Ad[];
  };
}

export const HomePage: FC<HomePageProps> = ({ models, user, ads = {} }) => {
  const trendingModels = MockService.getTrendingModels();
  const tags = MockService.getTags();

  // Get ads from database
  const heroAds = ads.home_top?.filter(ad => ad.type === 'hero') || [];
  const topBannerAds = ads.home_top?.filter(ad => ad.type === 'banner') || [];
  const diamondBlockAds = ads.home_top?.filter(ad => ad.type === 'diamond_block') || [];
  const middleAds = ads.home_middle?.filter(ad => ad.type === 'diamond_block') || [];
  const bottomBannerAds = ads.home_bottom?.filter(ad => ad.type === 'banner') || [];

  // Split models for layout
  const recommendedModels = models.slice(0, 5);
  const featuredModels = models.slice(5);

  // Log para debugging
  console.log('[Home] Ads data:', { 
    home_top_count: ads.home_top?.length, 
    home_middle_count: ads.home_middle?.length,
    home_bottom_count: ads.home_bottom?.length,
    top_banners: topBannerAds.length,
    bottom_banners: bottomBannerAds.length
  });

  return (
    <Layout user={user}>
      <div class="max-w-[1600px] mx-auto pb-20 p-4 md:p-6">
        
        {/* TOP SECTION: Carousel + Side Ads/Trending */}
        <section class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div class="lg:col-span-3">
             <HeroCarousel 
                slides={heroAds.map(ad => ({
                  image: ad.imageUrl,
                  title: ad.title,
                  category: ad.category || 'DESTAQUE',
                  isLive: false,
                  link: ad.link,
                  // Tentar extrair slug se for um link interno de modelo
                  modelSlug: ad.link.includes('/models/') ? ad.link.split('/models/')[1] : undefined
                }))} 
             />
             
             {/* TOP BANNER AD - Logo após o Hero Carousel */}
             {topBannerAds.length > 0 && (
               <div class="mt-4">
                 <AdBanner 
                   title={topBannerAds[0].title}
                   subtitle={topBannerAds[0].subtitle || ''}
                   ctaText={topBannerAds[0].ctaText || 'Saiba Mais'}
                   link={topBannerAds[0].link}
                   imageUrl={topBannerAds[0].imageUrl}
                   adId={topBannerAds[0].id}
                 />
               </div>
             )}
          </div>
          <TrendingSideColumn model={trendingModels[0]} sidebarAds={ads.sidebar} />
        </section>

        {/* Filters */}
        <div class="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {tags.map((tag, i) => (
                <button class={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#333] hover:text-white'}`}>
                    {tag}
                </button>
            ))}
        </div>

        {/* Diamond Selection (Native Block) - home_top */}
        {diamondBlockAds.length > 0 && (
          <div class="mb-10">
            <NativeAdBlock 
              title={diamondBlockAds[0].title || "Diamond Selection"} 
              models={diamondBlockAds.slice(0, 4).map(ad => ({
                name: ad.title,
                imageUrl: ad.imageUrl || '',
                category: ad.category || 'Destaque',
                link: ad.link
              }))}
            />
          </div>
        )}

        {/* --- MAIN FEED (REAL DATA) --- */}
        
        {/* Recomendados Section */}
        <section class="mb-8">
            <h3 class="font-display text-xl text-white mb-4 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-primary rounded-full"></span>
              Recomendados
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {recommendedModels.map(m => (
                  <WhiteLabelModelCard 
                    id={m.id}
                    name={m.name}
                    postCount={m.postCount}
                    thumbnailUrl={m.thumbnailUrl}
                  />
                ))}
            </div>
        </section>

        {/* Modelos em Destaque Section */}
        <section>
            <h3 class="font-display text-xl text-white mb-4 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-primary rounded-full"></span>
              Modelos em Destaque
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {featuredModels.map(m => (
                  <WhiteLabelModelCard 
                    id={m.id}
                    name={m.name}
                    postCount={m.postCount}
                    thumbnailUrl={m.thumbnailUrl}
                  />
                ))}
            </div>
        </section>

        {/* MIDDLE AD - Diamond Selection Block */}
        {middleAds.length > 0 && (
          <div class="my-10">
            <NativeAdBlock 
              title={middleAds[0].title || "Diamond Selection"} 
              models={middleAds.slice(0, 4).map(ad => ({
                name: ad.title,
                imageUrl: ad.imageUrl || '',
                category: ad.category || 'Destaque',
                link: ad.link
              }))}
            />
          </div>
        )}

        {/* Secondary Feed */}
        <section class="mt-8">
            <h3 class="font-display text-2xl text-white mb-4">Novas Revelações</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                 {models.slice().reverse().map(m => (
                    <WhiteLabelModelCard 
                      id={m.id}
                      name={m.name}
                      postCount={m.postCount}
                      thumbnailUrl={m.thumbnailUrl}
                    />
                 ))}
            </div>
        </section>

        {/* BOTTOM BANNER ADS */}
        {bottomBannerAds.map(ad => (
          <AdBanner 
            title={ad.title}
            subtitle={ad.subtitle || ''}
            ctaText={ad.ctaText || 'Saiba Mais'}
            link={ad.link}
            imageUrl={ad.imageUrl}
            adId={ad.id}
          />
        ))}

      </div>
    </Layout>
  );
};
