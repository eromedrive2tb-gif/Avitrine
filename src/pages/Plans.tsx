import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';

export const PlansPage: FC = () => {
  const plans = [
    {
      name: "Basic",
      price: "29,90",
      features: ["Acesso a 50 modelos", "Qualidade HD", "Suporte por Email"],
      recommended: false
    },
    {
      name: "Premium",
      price: "59,90",
      features: ["Acesso Ilimitado", "Qualidade 4K Ultra HD", "Lives Exclusivas", "Download Offline"],
      recommended: true
    },
    {
      name: "Diamond",
      price: "99,90",
      features: ["Tudo do Premium", "Chat Direto com Modelos", "Conteúdo VR", "Badge de Apoiador"],
      recommended: false
    }
  ];

  return (
    <Layout title="Planos - CreatorFlix">
      <section class="py-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A37CFF] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>

        <div class="max-w-7xl mx-auto px-6 relative z-10">
          <div class="text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">Escolha seu Plano</h1>
            <p class="text-gray-400 text-lg">Desbloqueie todo o potencial da plataforma.</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {plans.map((plan) => (
              <div class={`relative p-8 rounded-[30px] backdrop-blur-xl border transition-transform hover:scale-105 duration-300 ${
                plan.recommended 
                  ? 'bg-white/10 border-[#A37CFF] shadow-2xl shadow-purple-500/20 md:scale-110 z-10' 
                  : 'bg-[#0E1136]/60 border-white/5 hover:border-white/20'
              }`}>
                {plan.recommended && (
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF4006] to-[#A37CFF] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    MAIS POPULAR
                  </div>
                )}
                
                <h3 class="text-2xl font-bold mb-2">{plan.name}</h3>
                <div class="flex items-end gap-1 mb-8">
                  <span class="text-sm text-gray-400 mb-1">R$</span>
                  <span class="text-4xl font-bold">{plan.price}</span>
                  <span class="text-sm text-gray-400 mb-1">/mês</span>
                </div>

                <ul class="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li class="flex items-center gap-3 text-gray-300">
                      <svg class="w-5 h-5 text-[#A37CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant={plan.recommended ? 'primary' : 'outline'} className="w-full">
                  Assinar {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
