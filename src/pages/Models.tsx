import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { ModelCard } from '../components/molecules/ModelCard';

export const ModelsPage: FC = () => {
  // Mock data generator with better images
  const models = [
    { name: "Alessandra V.", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", category: "Exclusive", isLive: true, views: "12k" },
    { name: "Fernanda T.", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80", category: "Gamer", isLive: true, views: "8.5k" },
    { name: "Sarah J.", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", category: "Cosplay", isLive: true, views: "5.1k" },
    { name: "Mikaela", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", category: "Chat", isLive: true, views: "3.2k" },
    { name: "Ruby Rose", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80", category: "Alternative", isLive: true, views: "15k" },
    { name: "Julia K.", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", category: "Fashion", isLive: false, views: "1k" },
    { name: "Mariana S.", imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80", category: "Vlog", isLive: false, views: "2k" },
    { name: "Elena R.", imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&q=80", category: "Fitness", isLive: false, views: "4.5k" },
    { name: "Sophie", imageUrl: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=80", category: "Art", isLive: false, views: "900" },
    { name: "Valentina", imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", category: "Lifestyle", isLive: false, views: "3.2k" },
    { name: "Isabella", imageUrl: "https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=600&q=80", category: "Model", isLive: false, views: "5k" },
    { name: "Carla", imageUrl: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80", category: "Fitness", isLive: false, views: "2.1k" }
  ];

  const filters = [
    { icon: '🔥', label: 'Em Alta' },
    { icon: '✨', label: 'Novas' },
    { icon: '🔴', label: 'Ao Vivo' },
    { icon: '💎', label: 'VIP' },
    { icon: '🎮', label: 'Cosplay' },
    { icon: '👠', label: 'Fashion' },
    { icon: '💪', label: 'Fitness' },
  ];

  return (
    <Layout title="Explorar Modelos - CreatorFlix">
      <section class="min-h-screen py-12 bg-void">
        <div class="max-w-[1400px] mx-auto px-6">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 class="text-4xl md:text-6xl font-display mb-2 text-white">Descubra <span class="text-primary">Talentos</span></h1>
              <p class="text-gray-400 max-w-xl text-lg">
                Navegue pelo catálogo exclusivo das criadoras mais cobiçadas do momento.
              </p>
            </div>
          </div>

          {/* Filter Pills with Icons */}
          <div class="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <button class="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold uppercase tracking-wide shadow-neon-purple transition-transform hover:scale-105">
              <span>♾️</span> Todas
            </button>
            {filters.map((filter) => (
              <button class="flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer whitespace-nowrap">
                <span>{filter.icon}</span>
                <span class="font-medium tracking-wide">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {models.map((model) => (
              <ModelCard {...model} />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          <div class="mt-20 flex justify-center">
             <div 
               hx-get="/api/models?page=2" 
               hx-trigger="revealed" 
               hx-swap="afterend"
               class="text-gray-500 animate-pulse flex flex-col items-center gap-2"
             >
               <span class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
               <span class="text-xs uppercase tracking-widest">Carregando mais...</span>
             </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};