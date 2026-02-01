import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { PlanCard } from '../components/molecules/PlanCard';

interface PlansPageProps {
  plans: any[];
  user?: any;
}

export const PlansPage: FC<PlansPageProps> = ({ plans, user }) => {
  if (user && user.subscriptionStatus === 1 && user.subscription) {
    const sub = user.subscription;
    const startDate = sub.startDate ? new Date(sub.startDate).toLocaleDateString('pt-BR') : 'N/A';
    const endDate = sub.endDate ? new Date(sub.endDate).toLocaleDateString('pt-BR') : 'N/A';
    const planName = sub.plan?.name || 'Plano VIP';
    const planPrice = sub.plan?.price ? (sub.plan.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A';

    return (
      <Layout title="Minha Assinatura - CreatorFlix" user={user}>
        <section class="min-h-screen py-20 relative overflow-hidden flex items-center justify-center bg-[#050505]">
           <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

           <div class="max-w-2xl mx-auto px-6 relative z-10 w-full">
             <div class="bg-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                <div class="text-center mb-10">
                  <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary text-4xl mb-6">💎</div>
                  <h1 class="text-3xl md:text-4xl font-display mb-2">Sua Assinatura VIP</h1>
                  <p class="text-gray-400">Você tem acesso ilimitado a todo o conteúdo.</p>
                </div>

                <div class="space-y-6">
                  <div class="flex justify-between items-center py-4 border-b border-white/5">
                    <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Plano Contratado</span>
                    <span class="text-white font-bold">{planName}</span>
                  </div>
                  <div class="flex justify-between items-center py-4 border-b border-white/5">
                    <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Valor</span>
                    <span class="text-primary font-bold">{planPrice}</span>
                  </div>
                  <div class="flex justify-between items-center py-4 border-b border-white/5">
                    <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Data de Início</span>
                    <span class="text-white">{startDate}</span>
                  </div>
                  <div class="flex justify-between items-center py-4 border-b border-white/5">
                    <span class="text-gray-500 uppercase text-xs font-bold tracking-widest">Próxima Cobrança</span>
                    <span class="text-white">{endDate}</span>
                  </div>
                </div>

                <div class="mt-12 flex flex-col gap-4">
                  <a href="/" class="w-full text-center bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all">
                    IR PARA O CATÁLOGO
                  </a>
                  <p class="text-center text-xs text-gray-600">Para gerenciar sua assinatura ou cancelar, entre em contato com o suporte.</p>
                </div>
             </div>
           </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout title="Planos VIP - CreatorFlix" user={user}>
      <section class="min-h-screen py-20 relative overflow-hidden flex items-center justify-center bg-[#050505]">
        {/* Ambient Light */}
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div class="text-center mb-20">
            <h1 class="text-5xl md:text-7xl font-display mb-4">DESTRAVE O ACESSO<span class="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#FFFDD0]"> VIP</span></h1>
            <p class="text-gray-400 text-xl font-light tracking-wide">Acesso imediato. Cancele quando quiser.</p>
          </div>

          <div class="grid lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {plans.map((plan: any) => (
              <PlanCard {...plan} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};