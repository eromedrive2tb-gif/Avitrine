import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ModelCard } from '../components/molecules/ModelCard';
import { AdBanner } from '../components/molecules/AdBanner';
import { NativeAdBlock } from '../components/molecules/NativeAdBlock';

export const ModelsPage: FC = () => {
  // Mock Data Generators
  const generateModel = (i: number) => ({
    name: `Model ${i}`,
    imageUrl: `https://images.unsplash.com/photo-${[
        '1534528741775-53994a69daeb', '1524504388940-b1c1722653e1', '1529626455594-4ff0802cfb7e', '1494790108377-be9c29b29330', '1517841905240-472988babdf9'
    ][i % 5]}?w=600&q=80`,
    category: ['Brasileira', 'Gamer', 'Cosplay', 'Amadora'][i % 4],
    isLive: i % 7 === 0,
    views: `${(Math.random() * 10).toFixed(1)}k`,
    isPromoted: false
  });

  const modelsSection1 = Array.from({ length: 10 }).map((_, i) => generateModel(i));
  const modelsSection2 = Array.from({ length: 8 }).map((_, i) => generateModel(i + 10));
  
  // Inject Ad into Section 2
  modelsSection2.splice(2, 0, {
     name: "JOGUE AGORA",
     imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&q=80",
     category: "CASSINO",
     isLive: false,
     views: "AD",
     isPromoted: true
  });

  const sponsoredModels = [
    { name: "Elite One", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
    { name: "Elite Two", imageUrl: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
    { name: "Elite Three", imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
    { name: "Elite Four", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", category: "VIP", isLive: false, views: "PRO" },
  ];

  return (
    <Layout title="Explorar Modelos - CreatorFlix">
      {/* Sticky Header Filter Bar */}
      <div class="sticky top-16 z-40 bg-[#050505]/95 backdrop-blur border-b border-white/5 py-3 px-4 md:px-6 shadow-lg">
        <div class="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Title & Count */}
            <div class="flex items-center gap-3 w-full md:w-auto">
                <h1 class="font-display text-2xl text-white">Modelos</h1>
                <span class="text-xs font-bold text-gray-500 bg-white/10 px-2 py-0.5 rounded">12,450+</span>
            </div>

            {/* Quick Filters */}
            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
                <select class="bg-[#121212] border border-white/10 text-white text-xs font-bold uppercase py-2 px-4 rounded-full focus:outline-none focus:border-primary">
                    <option>Recomendados</option>
                    <option>Mais Populares</option>
                    <option>Novas</option>
                </select>
                
                <div class="h-6 w-px bg-white/10 mx-2 flex-shrink-0"></div>

                {['Brasileiras', 'Live Now', '4K', 'VR'].map(tag => (
                    <button class="px-4 py-2 rounded-full bg-[#121212] border border-white/5 text-xs font-medium text-gray-400 hover:text-white hover:border-white/20 whitespace-nowrap transition-colors">
                        {tag}
                    </button>
                ))}
            </div>
        </div>
      </div>

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
             {modelsSection1.map(m => <ModelCard {...m} />)}
          </div>

          {/* Native Ad Block Separator */}
          <div class="py-2">
             <NativeAdBlock title="Recomendado para Você" models={sponsoredModels} />
          </div>

          {/* Grid Section 2 (With Injected Post Ad) */}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
             {modelsSection2.map(m => <ModelCard {...m} />)}
          </div>

          {/* Pagination / Infinite Scroll Trigger */}
          <div class="mt-12 mb-20 flex flex-col items-center">
             <p class="text-gray-500 text-xs mb-4 uppercase tracking-widest">Mostrando 20 de 12,000</p>
             <button class="bg-[#1a1a1a] border border-white/10 text-white font-bold uppercase tracking-widest py-3 px-10 rounded hover:bg-primary hover:border-transparent transition-all shadow-neon-purple">
                 Carregar Mais Modelos
             </button>
          </div>

      </div>
    </Layout>
  );
};
