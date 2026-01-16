import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';

export const PlansPage: FC = () => {
  return (
    <Layout title="Planos VIP - CreatorFlix">
      <section class="min-h-screen py-20 relative overflow-hidden flex items-center justify-center bg-[#050505]">
        {/* Ambient Light */}
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div class="text-center mb-20">
            <h1 class="text-5xl md:text-7xl font-display mb-4">Escolha sua <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#FFFDD0]">Jornada</span></h1>
            <p class="text-gray-400 text-xl font-light tracking-wide">Acesso imediato. Cancele quando quiser.</p>
          </div>

          <div class="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Basic Plan (Recuado, Insuficiente) */}
            <div class="order-2 lg:order-1 relative p-8 rounded-2xl bg-surface/50 border border-white/5 backdrop-blur-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:-translate-y-2">
              <h3 class="text-2xl font-display text-gray-400 mb-2">Basic</h3>
              <div class="flex items-end gap-1 mb-8">
                <span class="text-sm text-gray-500 mb-1">R$</span>
                <span class="text-4xl font-bold text-white">29,90</span>
              </div>
              <ul class="space-y-4 mb-8 text-sm text-gray-500">
                <li class="flex items-center gap-3"><span class="text-gray-600">✓</span> Acesso limitado</li>
                <li class="flex items-center gap-3"><span class="text-gray-600">✓</span> Qualidade SD (720p)</li>
                <li class="flex items-center gap-3"><span class="text-gray-600">✓</span> Com anúncios</li>
              </ul>
              <Button variant="outline" className="w-full border-gray-700 text-gray-400 hover:text-white hover:border-white">
                Selecionar Basic
              </Button>
            </div>

            {/* Diamond Plan (Hero, Luxo, Gold) */}
            <div class="order-1 lg:order-2 relative p-1 rounded-2xl bg-gradient-to-b from-gold via-[#B8860B] to-black shadow-neon-gold transform scale-105 z-20">
              <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-[#B8860B] text-black font-bold uppercase tracking-widest text-xs px-6 py-2 rounded-full shadow-lg">
                Experiência Definitiva
              </div>
              
              <div class="bg-[#080808] rounded-xl p-10 h-full">
                <div class="text-center mb-8">
                  <h3 class="text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold to-white mb-2">DIAMOND</h3>
                  <div class="flex items-center justify-center gap-1">
                    <span class="text-lg text-gold/80">R$</span>
                    <span class="text-6xl font-bold text-white">99,90</span>
                    <span class="text-gray-500 text-sm">/mês</span>
                  </div>
                </div>

                <div class="space-y-6 mb-10">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">👑</div>
                    <div>
                      <p class="font-bold text-white">Acesso Total VIP</p>
                      <p class="text-xs text-gray-400">Todos os vídeos, fotos e sets exclusivos.</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">🎥</div>
                    <div>
                      <p class="font-bold text-white">4K Ultra HD + VR</p>
                      <p class="text-xs text-gray-400">A melhor qualidade possível.</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">💬</div>
                    <div>
                      <p class="font-bold text-white">Direct Message</p>
                      <p class="text-xs text-gray-400">Fale diretamente com as modelos.</p>
                    </div>
                  </div>
                </div>

                <Button variant="primary" className="w-full !bg-gradient-to-r !from-gold !to-[#B8860B] !text-black hover:!brightness-110 !font-bold !text-lg !py-4 shadow-[0_0_20px_rgba(255,215,0,0.3)] border-none">
                  ASSINAR DIAMOND
                </Button>
                <p class="text-center text-xs text-gray-500 mt-4">Renovação automática. Cancele a qualquer momento.</p>
              </div>
            </div>

            {/* Gold/Pro Plan (Intermediário) */}
            <div class="order-3 lg:order-3 relative p-8 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-all duration-300">
              <h3 class="text-2xl font-display text-white mb-2">Gold</h3>
              <div class="flex items-end gap-1 mb-8">
                <span class="text-sm text-gray-400 mb-1">R$</span>
                <span class="text-4xl font-bold text-white">59,90</span>
              </div>
              <ul class="space-y-4 mb-8 text-sm text-gray-300">
                <li class="flex items-center gap-3"><span class="text-primary">✓</span> Acesso ilimitado</li>
                <li class="flex items-center gap-3"><span class="text-primary">✓</span> Full HD (1080p)</li>
                <li class="flex items-center gap-3"><span class="text-primary">✓</span> Sem anúncios</li>
                <li class="flex items-center gap-3"><span class="text-primary">✓</span> Acesso a Lives</li>
              </ul>
              <Button variant="secondary" className="w-full">
                Selecionar Gold
              </Button>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};