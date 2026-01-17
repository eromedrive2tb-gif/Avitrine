import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { PlanCard } from '../components/molecules/PlanCard';
import { MockService } from '../services/mock';

export const PlansPage: FC = () => {
  const plans = MockService.getPlans();

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
            {plans.map((plan: any) => (
              <PlanCard {...plan} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
