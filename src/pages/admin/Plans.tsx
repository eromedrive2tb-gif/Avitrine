import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';
import { MockService } from '../../services/mock';

export const AdminPlans: FC = () => {
  const plans = MockService.getPlans(); // Reusing the plans from mock service for initial display

  return (
    <AdminLayout title="Planos e Preços" activePath="/admin/plans">
      <div class="grid md:grid-cols-3 gap-6">
          {/* Plan Card Editor */}
          {plans.map(plan => (
              <div class="p-6 rounded-xl bg-surface border border-white/5">
                  <div class="flex justify-between items-center mb-4">
                      <h3 class="font-bold text-xl text-white">{plan.name}</h3>
                      <span class="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Ativo</span>
                  </div>
                  
                  <div class="space-y-4 mb-6">
                      <div>
                          <label class="block text-xs text-gray-500 mb-1">Preço (R$)</label>
                          <input type="text" value={plan.price} class="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-white" />
                      </div>
                      <div>
                          <label class="block text-xs text-gray-500 mb-1">Comissão Plataforma (%)</label>
                          <input type="text" value="20%" class="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-white" />
                      </div>
                  </div>

                  <div class="space-y-2">
                      <p class="text-xs text-gray-500">Features Ativas:</p>
                      <div class="flex flex-wrap gap-2">
                          <span class="text-xs bg-white/5 px-2 py-1 rounded border border-white/5">4K Video</span>
                          <span class="text-xs bg-white/5 px-2 py-1 rounded border border-white/5">Download</span>
                      </div>
                  </div>

                  <div class="mt-6 flex gap-2">
                      <Button variant="secondary" className="!w-full !text-xs !py-2">Editar</Button>
                      {plan.id === 'diamond' && <Button variant="primary" className="!w-full !text-xs !py-2">Promover</Button>}
                  </div>
              </div>
          ))}
      </div>
    </AdminLayout>
  );
};
