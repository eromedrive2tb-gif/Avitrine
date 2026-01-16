import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';
import { ModelCard } from '../components/molecules/ModelCard';

export const HomePage: FC = () => {
  // Mock Data
  const liveModels = [
    { name: "Alessandra V.", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", category: "Exclusive", isLive: true, views: "12k" },
    { name: "Fernanda T.", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80", category: "Gamer", isLive: true, views: "8.5k" },
    { name: "Sarah J.", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", category: "Cosplay", isLive: true, views: "5.1k" },
    { name: "Mikaela", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", category: "Chat", isLive: true, views: "3.2k" },
    { name: "Ruby Rose", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80", category: "Alternative", isLive: true, views: "15k" },
  ];

  const trendingModels = [
    { name: "Julia K.", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", category: "Fashion", isLive: false },
    { name: "Mariana S.", imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80", category: "Vlog", isLive: false },
    { name: "Elena R.", imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&q=80", category: "Fitness", isLive: false },
    { name: "Sophie", imageUrl: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=80", category: "Art", isLive: false },
  ];

  return (
    <Layout>
      {/* Cinematic Hero Section */}
      <section class="relative h-[85vh] flex items-center overflow-hidden">
        {/* Video Background Placeholder */}
        <div class="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop" 
            class="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
            alt="Hero Background"
          />
          {/* Vignette & Gradient */}
          <div class="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-void via-transparent to-void/20"></div>
        </div>

        <div class="relative z-10 max-w-[1400px] mx-auto px-6 w-full pt-20">
          <div class="max-w-3xl">
            <div class="flex items-center gap-3 mb-6 animate-[fadeIn_1s_ease-out]">
              <span class="px-3 py-1 border border-primary/50 bg-primary/10 backdrop-blur-md rounded text-xs font-bold uppercase tracking-widest text-primary shadow-neon-purple">
                Novo Lançamento
              </span>
              <span class="text-gray-400 text-sm font-semibold tracking-wide">
                 ★ 4.98 (2k+ Reviews)
              </span>
            </div>
            
            <h1 class="text-7xl md:text-9xl font-display leading-[0.9] mb-8 text-white drop-shadow-2xl">
              ALESSANDRA <br/> 
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">VILLENEUVE</span>
            </h1>
            
            <p class="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-xl leading-relaxed">
              Explore o conteúdo exclusivo da modelo #1 do Brasil. 
              Bastidores, ensaios em 4K e interação em tempo real.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-6">
              <Button href="/plans" variant="primary" className="!text-lg !px-12 !py-4 shadow-neon-purple">
                Assinar Agora
              </Button>
              <Button href="/models" variant="secondary" className="!text-lg !px-10 !py-4">
                Ver Trailer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Swimlane: Live Now */}
      <section class="py-12 border-b border-white/5 bg-gradient-to-b from-void to-surface">
        <div class="max-w-[1400px] mx-auto px-6 mb-8 flex items-end justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
              <h2 class="text-red-500 text-sm font-bold uppercase tracking-[0.2em]">Acontecendo Agora</h2>
            </div>
            <h3 class="text-4xl md:text-5xl">Live Streaming</h3>
          </div>
          <a href="/models?filter=live" class="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
            Ver Todas <span class="text-primary">→</span>
          </a>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div class="flex overflow-x-auto pb-12 pt-4 px-6 gap-6 snap-x scrollbar-hide max-w-[1400px] mx-auto">
          {liveModels.map((model) => (
            <div class="min-w-[280px] md:min-w-[320px] snap-center">
              <ModelCard {...model} />
            </div>
          ))}
        </div>
      </section>

      {/* Swimlane: Trending */}
      <section class="py-20 bg-void">
        <div class="max-w-[1400px] mx-auto px-6 mb-10">
          <h2 class="text-4xl md:text-5xl mb-2">Em Alta na Semana</h2>
          <p class="text-gray-400 font-light">As criadoras que estão quebrando a internet.</p>
        </div>
        
        <div class="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trendingModels.map((model) => (
            <ModelCard {...model} />
          ))}
        </div>
      </section>

      {/* Premium CTA */}
      <section class="py-32 relative overflow-hidden">
        <div class="absolute inset-0 bg-gold/5"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void"></div>
        
        <div class="relative z-10 max-w-4xl mx-auto text-center px-6">
          <span class="inline-block mb-6 px-4 py-1 border border-gold/40 text-gold text-sm font-bold uppercase tracking-[0.3em] rounded-full">
            Experiência VIP
          </span>
          <h2 class="text-5xl md:text-7xl mb-8 text-white">
            Desbloqueie o <span class="text-gold italic font-serif">Impossível</span>
          </h2>
          <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Tenha acesso a conteúdos 8K, VR Experience e chat direto com suas criadoras favoritas no plano Diamond.
          </p>
          <Button href="/plans" variant="primary" className="!bg-gold !text-black hover:!bg-white shadow-neon-gold border-none">
            Ver Planos VIP
          </Button>
        </div>
      </section>
    </Layout>
  );
};