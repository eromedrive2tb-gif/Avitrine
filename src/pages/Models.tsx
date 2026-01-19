import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { WhiteLabelModelCard } from '../components/molecules/WhiteLabelModelCard';
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';
import { FilterBar } from '../components/molecules/FilterBar';
import { Pagination } from '../components/molecules/Pagination';
import { MockService } from '../services/mock';

interface ModelsPageProps {
  models: any[];
  pagination: any;
}

export const ModelsPage: FC<ModelsPageProps> = ({ models, pagination }) => {
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

          {/* Grid Section */}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
             {models.map(m => (
                 <WhiteLabelModelCard 
                    id={m.id}
                    name={m.folderName || m.name}
                    postCount={m.postCount || 0}
                    thumbnailUrl={m.thumbnailUrl}
                 />
             ))}
          </div>

          {/* Native Ad Block Separator */}
          <div class="py-6">
             <NativeAdBlock title="Recomendado para Você" models={sponsoredModels} />
          </div>

          <Pagination {...pagination} />

      </div>
    </Layout>
  );
};