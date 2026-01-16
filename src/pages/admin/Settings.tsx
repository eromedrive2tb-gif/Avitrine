import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';

export const AdminPlans: FC = () => {
  return (
    <AdminLayout title="Planos e Preços" activePath="/admin/plans">
      <div class="grid md:grid-cols-3 gap-6">
          {/* Plan Card Editor */}
          {['Basic', 'Gold', 'Diamond'].map(plan => (
              <div class="p-6 rounded-xl bg-[#121212] border border-white/5">
                  <div class="flex justify-between items-center mb-4">
                      <h3 class="font-bold text-xl text-white">{plan}</h3>
                      <span class="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Ativo</span>
                  </div>
                  
                  <div class="space-y-4 mb-6">
                      <div>
                          <label class="block text-xs text-gray-500 mb-1">Preço (R$)</label>
                          <input type="text" value={plan === 'Basic' ? '29.90' : plan === 'Gold' ? '59.90' : '99.90'} class="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white" />
                      </div>
                      <div>
                          <label class="block text-xs text-gray-500 mb-1">Comissão Plataforma (%)</label>
                          <input type="text" value="20%" class="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white" />
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
                      {plan === 'Diamond' && <Button variant="primary" className="!w-full !text-xs !py-2">Promover</Button>}
                  </div>
              </div>
          ))}
      </div>
    </AdminLayout>
  );
};

export const AdminSettings: FC = () => {
    return (
        <AdminLayout title="Configurações do Sistema" activePath="/admin/settings">
            <div class="max-w-2xl space-y-8">
                
                {/* General */}
                <div class="p-6 rounded-xl bg-[#121212] border border-white/5">
                    <h3 class="font-bold text-white mb-4 border-b border-white/5 pb-2">Geral</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs text-gray-500">Nome do Site</label>
                            <input type="text" value="CreatorFlix" class="w-full bg-[#050505] border border-white/10 rounded p-2 text-white mt-1" />
                        </div>
                        <div>
                            <label class="text-xs text-gray-500">Email de Suporte</label>
                            <input type="text" value="help@creatorflix.com" class="w-full bg-[#050505] border border-white/10 rounded p-2 text-white mt-1" />
                        </div>
                    </div>
                </div>

                {/* Payment Gateways */}
                <div class="p-6 rounded-xl bg-[#121212] border border-white/5">
                    <h3 class="font-bold text-white mb-4 border-b border-white/5 pb-2">Pagamentos (Gateway)</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                            <span class="font-bold text-white">Stripe</span>
                            <div class="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                            <span class="font-bold text-white">Pix (Banco Central)</span>
                            <div class="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                            <span class="font-bold text-gray-400">Crypto (USDT)</span>
                            <div class="w-10 h-5 bg-gray-600 rounded-full relative cursor-pointer"><div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end">
                    <Button variant="primary">Salvar Alterações</Button>
                </div>

            </div>
        </AdminLayout>
    )
}
