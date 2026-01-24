import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { WhiteLabelModelCard } from '../components/molecules/WhiteLabelModelCard';
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';
import { FilterBar } from '../components/molecules/FilterBar';
import { Pagination } from '../components/molecules/Pagination';
import { MockService } from '../services/mock';
import type { Ad } from '../services/ads';

interface ModelsPageProps {
  models: any[];
  pagination: any;
  user?: any;
  ads?: {
    models_grid?: Ad[];
    sidebar?: Ad[];
  };
}

export const ModelsPage: FC<ModelsPageProps> = ({ models, pagination, user, ads = {} }) => {
  // Get grid ads - exclusively diamond_block for this placement
  const gridAds = (ads.models_grid || []).filter(ad => ad.type === 'diamond_block');

  return (
    <Layout title="Explorar Modelos - CreatorFlix" user={user}>
      <FilterBar />

      <div class="max-w-[1600px] mx-auto px-4 md:px-6 py-6 min-h-screen">
          
          {/* Top Featured Ads - Native Block */}
          {gridAds.length > 0 && (
            <div class="mb-8">
              <NativeAdBlock 
                title={gridAds[0].title || "Diamond Selection"} 
                models={gridAds.slice(0, 4).map(ad => ({
                  name: ad.title,
                  imageUrl: ad.imageUrl || '',
                  isPromoted: true,
                  category: ad.category || 'VIP',
                  link: ad.link
                }))}
              />
            </div>
          )}

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

          <Pagination {...pagination} />

      </div>
    </Layout>
  );
};
