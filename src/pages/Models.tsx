import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ModelCard } from '../components/molecules/ModelCard';
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';
import { FilterBar } from '../components/molecules/FilterBar';
import { Pagination } from '../components/molecules/Pagination';
import { MockService } from '../services/mock';

export const ModelsPage: FC = () => {
  const { section1, section2 } = MockService.getAllModels();
  const sponsoredModels = MockService.getVipModels();

  return (
    <Layout title="Explorar Modelos - CreatorFlix">
      <FilterBar />

      <div class="max-w-[1600px] mx-auto px-4 md:px-6 py-6 min-h-screen">
          
          {/* Top Banner Ad */}
          <AdBanner 
                title="Acesso VIP Limitado" 
                subtitle="Desbloqueie todas as modelos por apenas R$ 1,99 no primeiro mês." 
                ctaText="Aproveitar" 
                link="/plans"
                imageUrl="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1200&q=80"
          />

          {/* Grid Section 1 */}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
             {section1.map(m => <ModelCard {...m} />)}
          </div>

          {/* Native Ad Block Separator */}
          <div class="py-2">
             <NativeAdBlock title="Recomendado para Você" models={sponsoredModels} />
          </div>

          {/* Grid Section 2 (With Injected Post Ad) */}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
             {section2.map(m => <ModelCard {...m} />)}
          </div>

          <Pagination />

      </div>
    </Layout>
  );
};