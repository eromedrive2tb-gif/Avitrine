import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';
import { ModelCard } from '../components/molecules/ModelCard';

export const HomePage: FC = () => {
  const featuredModels = [
    { name: "Alessandra V.", imageUrl: "https://placehold.co/400x600/222/fff?text=Alessandra", category: "Influencer", isLive: true },
    { name: "Julia K.", imageUrl: "https://placehold.co/400x600/333/fff?text=Julia", category: "Fitness", isLive: false },
    { name: "Mariana S.", imageUrl: "https://placehold.co/400x600/444/fff?text=Mariana", category: "Cosplay", isLive: false },
    { name: "Fernanda T.", imageUrl: "https://placehold.co/400x600/555/fff?text=Fernanda", category: "Gamer", isLive: true },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF4006] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
        <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#A37CFF] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style="animation-delay: 2s"></div>

        <div class="relative z-10 text-center max-w-4xl px-6">
          <span class="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[#A37CFF] text-sm font-semibold mb-6 backdrop-blur-sm">
            🚀 A plataforma #1 de conteúdo exclusivo
          </span>
          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Conecte-se com seus <br/>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4006] to-[#A37CFF]">
              Criadores Favoritos
            </span>
          </h1>
          <p class="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Acesso ilimitado a conteúdos exclusivos, lives privadas e interação direta. 
            Junte-se a comunidade que mais cresce no mundo.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/plans" variant="primary" className="!text-lg !px-10">
              Assinar Agora
            </Button>
            <Button href="/models" variant="outline" className="!text-lg !px-10">
              Explorar Modelos
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Models Section */}
      <section class="py-20 bg-[#0E1136]/50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex items-end justify-between mb-12">
            <div>
              <h2 class="text-3xl font-bold mb-2">Modelos em Destaque 🔥</h2>
              <p class="text-gray-400">As criadoras mais populares da semana</p>
            </div>
            <a href="/models" class="text-[#A37CFF] font-semibold hover:text-white transition-colors">Ver todas -></a>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredModels.map((model) => (
              <ModelCard {...model} />
            ))}
          </div>
        </div>
      </section>

      {/* Advertiser Section (Diferenciada) */}
      <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B2641] to-[#0E1136]"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold mb-6">Torne-se um Criador</h2>
            <p class="text-gray-300 text-lg mb-8">
              Monetize sua audiência com as melhores taxas do mercado. 
              Pagamentos semanais, suporte 24/7 e liberdade total de conteúdo.
            </p>
            <Button href="/register?type=creator" variant="primary">
              Começar a Faturar
            </Button>
          </div>
          <div class="relative">
             <div class="aspect-video rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 flex items-center justify-center">
                <span class="text-gray-500 font-mono">Dashboard Preview Graphic</span>
             </div>
             {/* Decorative Elements */}
             <div class="absolute -top-10 -right-10 w-32 h-32 bg-[#FF4006] rounded-full blur-[60px] opacity-30"></div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
