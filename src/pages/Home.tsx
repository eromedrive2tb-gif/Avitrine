import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ModelCard } from '../components/molecules/ModelCard';
import { WhiteLabelModelCard } from '../components/molecules/WhiteLabelModelCard'; // Importe o novo card
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';
import { HeroCarousel } from '../components/organisms/HeroCarousel';
import { MockService } from '../services/mock';
import { TrendingSideColumn } from '../components/molecules/TrendingSideColumn';

// Definindo a interface das props
interface HomePageProps {
  models: {
    id: number;
    name: string;
    postCount: number;
    thumbnailUrl: string | null;
  }[];
}

export const HomePage: FC<HomePageProps> = ({ models }) => {
  const trendingModels = MockService.getTrendingModels();
  // const feedModels = MockService.getFeedModels(); // REMOVIDO: Agora usamos props.models
  const sponsoredModels = MockService.getSponsoredModels();
  const tags = MockService.getTags();

  return (
    <Layout>
      <div class="max-w-[1600px] mx-auto pb-20 p-4 md:p-6">
        
        {/* TOP SECTION: Carousel + Side Ads/Trending */}
        <section class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div class="lg:col-span-3">
             <HeroCarousel />
          </div>
          <TrendingSideColumn model={trendingModels[0]} />
        </section>

        <AdBanner 
            title="Aposte na BetWinner" 
            subtitle="Bônus de 100% no primeiro depósito." 
            ctaText="Pegar Bônus" 
            link="#"
            imageUrl="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80"
        />

        {/* Filters */}
        <div class="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {tags.map((tag, i) => (
                <button class={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#333] hover:text-white'}`}>
                    {tag}
                </button>
            ))}
        </div>

        {/* --- MAIN FEED (REAL DATA) --- */}
        <section>
            <h3 class="font-display text-xl text-white mb-4 flex items-center gap-2">
              🔥 Modelos em Destaque
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {/* Usando os dados reais passados via Props */}
                {models.map(m => (
                  <WhiteLabelModelCard 
                    id={m.id}
                    name={m.name}
                    postCount={m.postCount}
                    thumbnailUrl={m.thumbnailUrl}
                  />
                ))}
            </div>
        </section>

        <NativeAdBlock title="Diamond Selection" models={sponsoredModels} />

        {/* Secondary Feed (Pode usar os mesmos dados ou uma nova lógica futura) */}
        <section class="mt-8">
            <h3 class="font-display text-2xl text-white mb-4">Novas Revelações</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                 {/* Por enquanto, invertendo a lista real para variar */}
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

      </div>
    </Layout>
  );
};