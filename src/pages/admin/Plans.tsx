import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';

interface Plan {
  id: number;
  name: string;
  price: number; // in cents
  duration: number; // in days
  checkoutUrl: string | null;
  acceptsPix?: boolean | null;
  acceptsCard?: boolean | null;
}

interface OrderBump {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean | null;
  imageUrl: string | null;
  displayOrder: number | null;
  createdAt: Date | null;
}

interface AdminPlansProps {
  plans: Plan[];
  activeGateway: string; // 'Dias Marketplace' | 'JunglePay'
  orderBumps: OrderBump[];
}

export const AdminPlans: FC<AdminPlansProps> = ({ plans, activeGateway, orderBumps }) => {
  // Helper to get value safely
  const getPlan = (duration: number) => plans.find(p => p.duration === duration) || {
    id: 0, name: 'Unknown', price: 0, duration, checkoutUrl: '', acceptsPix: false, acceptsCard: false
  };

  const weekly = getPlan(7);
  const monthly = getPlan(30);
  const annual = getPlan(365);

  const renderPlanCard = (plan: any, title: string) => (
    <div class="p-6 rounded-xl bg-surface border border-white/5 relative group hover:border-primary/50 transition-colors">
      <form action="/api/admin/plans/update" method="post" class="space-y-4">
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

        {activeGateway === 'Dias Marketplace' ? (
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
        ) : (
           <div class="space-y-3 pt-2">
             <label class="block text-xs text-gray-500 uppercase font-bold tracking-wider">Métodos Aceitos (JunglePay)</label>
             
             <label class="flex items-center justify-between bg-[#1a1a1a] p-3 rounded border border-white/10 cursor-pointer hover:bg-white/5">
                <span class="text-sm text-gray-300">Aceitar PIX</span>
                <input 
                  type="checkbox" 
                  name="acceptsPix" 
                  value="true"
                  checked={!!plan.acceptsPix} 
                  class="accent-primary w-5 h-5 rounded" 
                />
             </label>

             <label class="flex items-center justify-between bg-[#1a1a1a] p-3 rounded border border-white/10 cursor-pointer hover:bg-white/5">
                <span class="text-sm text-gray-300">Aceitar Cartão</span>
                <input 
                  type="checkbox" 
                  name="acceptsCard" 
                  value="true"
                  checked={!!plan.acceptsCard} 
                  class="accent-primary w-5 h-5 rounded" 
                />
             </label>
          </div>
        )}

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
      <div class="mb-8 flex justify-between items-start">
         <div>
            <h1 class="text-3xl font-bold mb-2">Planos de Assinatura</h1>
            <p class="text-gray-400">Configure os preços e links de checkout.</p>
         </div>
         <div class="text-right">
            <span class="text-xs text-gray-500 uppercase font-bold block mb-1">Gateway Ativo</span>
            <span class="bg-surface border border-white/10 px-3 py-1 rounded text-sm text-primary font-mono">
              {activeGateway}
            </span>
         </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        {renderPlanCard(weekly, 'Semanal (Trial)')}
        {renderPlanCard(monthly, 'Mensal')}
        {renderPlanCard(annual, 'Anual')}
      </div>

      {/* Order Bumps Section */}
      <div class="mt-12 border-t border-white/10 pt-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-white">Order Bumps</h2>
            <p class="text-gray-400 text-sm">Ofertas adicionais exibidas no checkout.</p>
          </div>
          <button 
            type="button"
            onclick="openOrderBumpModal()"
            class="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Adicionar Order Bump
          </button>
        </div>

        {orderBumps.length === 0 ? (
          <div class="text-center py-12 bg-surface rounded-xl border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto opacity-30 mb-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <p class="text-gray-500">Nenhuma order bump cadastrada.</p>
            <p class="text-gray-600 text-sm mt-1">Clique em "Adicionar Order Bump" para criar uma nova.</p>
          </div>
        ) : (
          <div class="grid gap-4">
            {orderBumps.map((bump) => (
              <div class={`p-5 rounded-xl border transition-all ${bump.isActive ? 'bg-surface border-white/10 hover:border-primary/50' : 'bg-surface/50 border-white/5 opacity-60'}`}>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    {bump.imageUrl ? (
                      <img src={bump.imageUrl} alt={bump.name} class="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 20.23l7.36-6.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65"/></svg>
                      </div>
                    )}
                    <div>
                      <h3 class="font-bold text-white text-lg">{bump.name}</h3>
                      <p class="text-gray-400 text-sm">{bump.description || 'Sem descrição'}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <span class="text-primary font-bold text-xl">
                        {(bump.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <div class="flex items-center gap-2 mt-1">
                        <span class={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${bump.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                          {bump.isActive ? 'Ativa' : 'Inativa'}
                        </span>
                        {bump.displayOrder !== null && bump.displayOrder > 0 && (
                          <span class="text-[10px] text-gray-500">Ordem: {bump.displayOrder}</span>
                        )}
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button 
                        onclick={`toggleOrderBump(${bump.id})`}
                        class={`p-2 rounded-lg transition-all ${bump.isActive ? 'bg-green-500/10 hover:bg-green-500/20 text-green-500' : 'bg-gray-500/10 hover:bg-gray-500/20 text-gray-500'}`}
                        title={bump.isActive ? 'Desativar' : 'Ativar'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      </button>
                      <button 
                        onclick={`editOrderBump(${bump.id})`}
                        class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button 
                        onclick={`deleteOrderBump(${bump.id}, '${bump.name}')`}
                        class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all"
                        title="Excluir"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para criar/editar Order Bump */}
      <div id="order-bump-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden items-center justify-center">
        <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 id="modal-title" class="text-xl font-bold text-white">Nova Order Bump</h3>
            <button onclick="closeOrderBumpModal()" class="text-gray-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          
          <form id="order-bump-form" class="space-y-4">
            <input type="hidden" id="bump-id" value="" />
            
            <div>
              <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Nome *</label>
              <input 
                type="text" 
                id="bump-name"
                required
                class="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="Ex: Acesso ao Grupo VIP"
              />
            </div>
            
            <div>
              <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Descrição</label>
              <textarea 
                id="bump-description"
                rows={3}
                class="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors resize-none"
                placeholder="Descrição que aparecerá no checkout..."
              ></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Preço (R$) *</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input 
                    type="text" 
                    id="bump-price"
                    required
                    class="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 pl-10 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="19,90"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Ordem de Exibição</label>
                <input 
                  type="number" 
                  id="bump-order"
                  class="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">URL da Imagem (Opcional)</label>
              <input 
                type="url" 
                id="bump-image"
                class="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="https://..."
              />
            </div>
            
            <label class="flex items-center gap-3 cursor-pointer bg-surface p-3 rounded-lg border border-white/10">
              <input 
                type="checkbox" 
                id="bump-active"
                checked
                class="accent-primary w-5 h-5 rounded"
              />
              <span class="text-gray-300">Ativar order bump imediatamente</span>
            </label>
            
            <div class="flex gap-3 pt-4">
              <button 
                type="button" 
                onclick="closeOrderBumpModal()"
                class="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-lg font-bold text-sm transition-all"
              >
                CANCELAR
              </button>
              <button 
                type="submit"
                id="save-bump-btn"
                class="flex-1 bg-primary hover:bg-primary/80 text-white py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span id="save-btn-text">SALVAR</span>
                <div id="save-btn-loader" class="hidden">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Script para gerenciar Order Bumps */}
      <script dangerouslySetInnerHTML={{__html: `
        const orderBumpsData = ${JSON.stringify(orderBumps)};

        window.openOrderBumpModal = function() {
          const form = document.getElementById('order-bump-form');
          form.reset();
          document.getElementById('modal-title').textContent = 'Nova Order Bump';
          document.getElementById('bump-id').value = '';
          document.getElementById('bump-active').checked = true;
          
          const modal = document.getElementById('order-bump-modal');
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }

        window.closeOrderBumpModal = function() {
          const modal = document.getElementById('order-bump-modal');
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }

        window.editOrderBump = function(id) {
          const bump = orderBumpsData.find(b => b.id === id);
          if (!bump) {
            console.error('Order bump não encontrada:', id);
            return;
          }

          document.getElementById('modal-title').textContent = 'Editar Order Bump';
          document.getElementById('bump-id').value = bump.id;
          document.getElementById('bump-name').value = bump.name || '';
          document.getElementById('bump-description').value = bump.description || '';
          document.getElementById('bump-price').value = (bump.price / 100).toFixed(2).replace('.', ',');
          document.getElementById('bump-order').value = bump.displayOrder || 0;
          document.getElementById('bump-image').value = bump.imageUrl || '';
          document.getElementById('bump-active').checked = !!bump.isActive;
          
          const modal = document.getElementById('order-bump-modal');
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }

        window.toggleOrderBump = async function(id) {
          try {
            const res = await fetch('/api/admin/order-bumps/' + id + '/toggle', { method: 'PATCH' });
            const data = await res.json();
            if (data.success) {
              window.location.reload();
            } else {
              alert('Erro: ' + (data.error || 'Erro desconhecido'));
            }
          } catch (e) {
            alert('Erro ao alternar status. Verifique sua conexão.');
          }
        }

        window.deleteOrderBump = async function(id, name) {
          if (!confirm('Tem certeza que deseja excluir "' + name + '"?')) return;
          
          try {
            const res = await fetch('/api/admin/order-bumps/' + id, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
              window.location.reload();
            } else {
              alert('Erro: ' + (data.error || 'Erro desconhecido'));
            }
          } catch (e) {
            alert('Erro ao excluir. Verifique sua conexão.');
          }
        }

        document.getElementById('order-bump-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const btn = document.getElementById('save-bump-btn');
          const btnText = document.getElementById('save-btn-text');
          const btnLoader = document.getElementById('save-btn-loader');
          
          const id = document.getElementById('bump-id').value;
          const name = document.getElementById('bump-name').value;
          const description = document.getElementById('bump-description').value;
          const priceRaw = document.getElementById('bump-price').value;
          const displayOrder = document.getElementById('bump-order').value;
          const imageUrl = document.getElementById('bump-image').value;
          const isActive = document.getElementById('bump-active').checked;
          
          // Validação básica
          if (!name) {
            alert('O nome é obrigatório');
            return;
          }

          // Converter preço para centavos
          const priceClean = priceRaw.replace(',', '.');
          const price = Math.round(parseFloat(priceClean) * 100);
          
          if (isNaN(price)) {
            alert('Insira um preço válido');
            return;
          }
          
          const payload = { 
            name, 
            description: description || null, 
            price, 
            displayOrder: parseInt(displayOrder) || 0, 
            imageUrl: imageUrl || null, 
            isActive 
          };
          
          // Iniciar loading
          btn.disabled = true;
          btnText.textContent = 'SALVANDO...';
          btnLoader.classList.remove('hidden');
          
          try {
            let res;
            if (id) {
              // Usar PATCH conforme solicitado
              res = await fetch('/api/admin/order-bumps/' + id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
            } else {
              res = await fetch('/api/admin/order-bumps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
            }
            
            const data = await res.json();
            if (data.success) {
              window.location.reload();
            } else {
              alert('Erro ao salvar: ' + (data.error || 'Erro desconhecido'));
              // Reset loading
              btn.disabled = false;
              btnText.textContent = 'SALVAR';
              btnLoader.classList.add('hidden');
            }
          } catch (e) {
            alert('Erro de rede ao salvar. Tente novamente.');
            // Reset loading
            btn.disabled = false;
            btnText.textContent = 'SALVAR';
            btnLoader.classList.add('hidden');
          }
        });

        // Fechar modal ao clicar fora dele
        document.getElementById('order-bump-modal').addEventListener('click', function(e) {
          if (e.target === this) {
            window.closeOrderBumpModal();
          }
        });
      `}} />
    </AdminLayout>
  );
};