import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ProfileHero } from '../components/organisms/ProfileHero';
import { ProfileSummary } from '../components/organisms/ProfileSummary';
import { BioSection } from '../components/molecules/BioSection';
import { TabSelector } from '../components/molecules/TabSelector';
import { PostFeed } from '../components/organisms/PostFeed';
import { AdBanner } from '../components/molecules/AdBanner';
import type { Ad } from '../services/ads';

interface ModelProfilePageProps {
  model: any;
  initialPosts: any[];
  user?: any;
  ads?: {
    model_profile?: Ad[];
    model_sidebar?: Ad[];
  };
}

export const ModelProfilePage: FC<ModelProfilePageProps> = ({ model, initialPosts, user, ads = {} }) => {
  const folderName = model.folderName;
  const displayName = model.name || folderName;

  // Verificar se usuário tem assinatura ativa
  const isSubscribed = user?.subscriptionStatus === 1;

  // Banner superior estilo Netflix
  const bannerUrl = model.bannerUrl || model.thumbnailUrl || '/static/img/placeholder_model.jpg';

  // Get profile ads
  const profileAds = ads.model_profile?.filter(ad => ad.type === 'spot') || [];
  const sidebarAds = ads.model_sidebar?.filter(ad => ad.type === 'spot') || [];

  return (
    <Layout title={`${displayName} (@${folderName}) - Perfil Exclusivo`} user={user}>
      <div class="relative min-h-screen bg-[#050505] text-white font-sans pb-20">
        
        {/* Cinematic Header / Hero Section */}
        <ProfileHero bannerUrl={bannerUrl} />

        {/* Profile Content Overlap */}
        <ProfileSummary model={model} displayName={displayName} />

        {/* Bio Section & Feed */}
        <div class="px-6 mt-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div>
            <BioSection 
              description={model.description || "Bem-vindo ao meu perfil exclusivo. Assine para ter acesso a conteúdos inéditos diariamente."} 
            />
            
            {/* Sidebar Ads */}
            {sidebarAds.length > 0 && (
              <div class="mt-6 space-y-4">
                {sidebarAds.slice(0, 2).map(ad => {
                  const trackId = `ad-model-sidebar-${ad.id}-${Math.random().toString(36).substr(2, 9)}`;
                  return (
                    <div id={trackId}>
                      <a 
                        href={ad.link} 
                        class="block rounded-lg overflow-hidden border border-white/10 hover:border-primary/50 transition-colors group"
                        onclick={`fetch('/api/ads/${ad.id}/click?placement=model_sidebar', {method:'POST'})`}
                      >
                        {ad.imageUrl && (
                          <img src={ad.imageUrl} class="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                        )}
                        <div class="p-3 bg-[#1a1a1a]">
                          <span class="text-[10px] text-[#FFD700] font-bold uppercase">Patrocinado</span>
                          <h5 class="text-white font-bold text-sm mt-1">{ad.title}</h5>
                          {ad.ctaText && (
                            <span class="text-xs text-primary mt-2 inline-block">{ad.ctaText}</span>
                          )}
                        </div>
                      </a>
                      <script dangerouslySetInnerHTML={{ __html: `
                        (function() {
                          const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                              if (entry.isIntersecting) {
                                fetch('/api/ads/${ad.id}/impression?placement=model_sidebar', {method:'POST'});
                                observer.unobserve(entry.target);
                              }
                            });
                          }, { threshold: 0.1 });
                          const el = document.getElementById('${trackId}');
                          if (el) observer.observe(el);
                        })();
                      `}} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Feed Area */}
          <div class="lg:col-span-2">
            <TabSelector />
            
            {/* Profile Banner Ad */}
            {profileAds.length > 0 && (
              <div class="mb-6">
                <AdBanner 
                  title={profileAds[0].title}
                  subtitle={profileAds[0].subtitle || ''}
                  ctaText={profileAds[0].ctaText || 'Saiba Mais'}
                  link={profileAds[0].link}
                  imageUrl={profileAds[0].imageUrl}
                  adId={profileAds[0].id}
                  placement="model_profile"
                />
              </div>
            )}
            
            <PostFeed initialPosts={initialPosts} model={model} displayName={displayName} isSubscribed={isSubscribed} />
          </div>
        </div>
      </div>
      
      <script src="/static/js/post-carousel.js"></script>
    </Layout>
  );
};
