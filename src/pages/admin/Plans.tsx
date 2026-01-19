import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';

interface Plan {
  id: number;
  name: string;
  price: number; // in cents
  duration: number; // in days
  checkoutUrl: string | null;
}

interface AdminPlansProps {
  plans: Plan[];
}

export const AdminPlans: FC<AdminPlansProps> = ({ plans }) => {
  // Helper to get value safely
  const getPlan = (duration: number) => plans.find(p => p.duration === duration) || {
    id: 0, name: 'Unknown', price: 0, duration, checkoutUrl: ''
  };

  const weekly = getPlan(7);
  const monthly = getPlan(30);
  const annual = getPlan(365);

  const renderPlanCard = (plan: any, title: string) => (
    <div class="p-6 rounded-xl bg-surface border border-white/5 relative group hover:border-primary/50 transition-colors">
      <form action="/api/admin/plans/update" method="POST" class="space-y-4">
        <input type="hidden" name="id" value={plan.id} />
        
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-xl text-white">{title}</h3>
          <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase">
             {plan.duration === 7 ? '7 Dias' : plan.duration === 30 ? '30 Dias' : '365 Dias'}
          </span>
        </div>

        <div>
          <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Preço de Exibição (R$)</label>
          <div class="relative">
             <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
             <input 
                type="text" 
                name="price" 
                value={(plan.price / 100).toFixed(2)} 
                class="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 pl-10 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="0.00"
             />
          </div>
        </div>

        <div>
          <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Link de Checkout</label>
          <input 
            type="text" 
            name="checkoutUrl" 
            value={plan.checkoutUrl || ''} 
            class="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
            placeholder="https://..."
          />
        </div>

        <div class="pt-4 border-t border-white/5">
             <button type="submit" class="w-full bg-white/5 hover:bg-primary hover:text-white text-gray-300 py-2 rounded-lg font-bold text-sm transition-all">
                SALVAR ALTERAÇÕES
             </button>
        </div>
      </form>
    </div>
  );

  return (
    <AdminLayout title="Gerenciar Planos" activePath="/admin/plans">
      <div class="mb-8">
         <h1 class="text-3xl font-bold mb-2">Planos de Assinatura</h1>
         <p class="text-gray-400">Configure os preços e links de checkout para os planos do sistema.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        {renderPlanCard(weekly, 'Semanal (Trial)')}
        {renderPlanCard(monthly, 'Mensal')}
        {renderPlanCard(annual, 'Anual')}
      </div>
    </AdminLayout>
  );
};