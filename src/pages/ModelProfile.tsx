import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ProfileHero } from '../components/organisms/ProfileHero';
import { ProfileSummary } from '../components/organisms/ProfileSummary';
import { BioSection } from '../components/molecules/BioSection';
import { TabSelector } from '../components/molecules/TabSelector';
import { PostFeed } from '../components/organisms/PostFeed';

interface ModelProfilePageProps {
  model: any;
  initialPosts: any[];
}

export const ModelProfilePage: FC<ModelProfilePageProps> = ({ model, initialPosts }) => {
  const folderName = model.folderName;
  const displayName = model.name || folderName;

  // Banner superior estilo Netflix
  const bannerUrl = model.coverUrl || model.thumbnailUrl || '/static/img/placeholder_model.jpg';

  return (
    <Layout title={`${displayName} (@${folderName}) - Perfil Exclusivo`}>
      <div class="relative min-h-screen bg-[#050505] text-white font-sans pb-20">
        
        {/* Cinematic Header / Hero Section */}
        <ProfileHero bannerUrl={bannerUrl} />

        {/* Profile Content Overlap */}
        <ProfileSummary model={model} displayName={displayName} />

        {/* Bio Section & Feed */}
        <div class="px-6 mt-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <BioSection 
            description={model.description || "Bem-vindo ao meu perfil exclusivo. Assine para ter acesso a conteúdos inéditos diariamente."} 
          />

          {/* Feed Area */}
          <div class="lg:col-span-2">
            <TabSelector />
            <PostFeed initialPosts={initialPosts} model={model} displayName={displayName} />
          </div>
        </div>
      </div>
      
      <script src="/static/js/post-carousel.js"></script>
    </Layout>
  );
};

