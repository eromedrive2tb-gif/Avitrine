import { FC } from 'hono/jsx';

interface OrderBumpItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean | null;
  imageUrl: string | null;
  displayOrder: number | null;
}

interface OrderSummaryProps {
  planName: string;
  planDuration: number;
  priceFormatted: string;
  orderBumps?: OrderBumpItem[];
}

export const OrderSummary: FC<OrderSummaryProps> = ({ planName, planDuration, priceFormatted, orderBumps = [] }) => {
  const activeBumps = orderBumps.filter(b => b.isActive);
  
  return (
    <div class="lg:col-span-4">
        <div class="glass-card p-6 rounded-2xl border border-white/10 sticky top-28">
        <h3 class="font-display text-xl text-white mb-6 tracking-wide border-b border-white/5 pb-4">Resumo do Pedido</h3>
        
        <div class="flex items-start gap-4 pb-6 border-b border-white/5">
            <div class="w-20 h-24 bg-gray-800 rounded-lg overflow-hidden relative group">
                <div class="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity" style="background-image: url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
            <div>
                <p class="font-bold text-lg text-white leading-tight">{planName}</p>
                <p class="text-sm text-gray-500 mt-1">{planDuration} dias de acesso VIP</p>
                <div class="mt-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded inline-block uppercase font-bold tracking-wider">Qualidade 4K</div>
            </div>
        </div>

        <div class="py-6 space-y-3 text-sm">
            <div class="flex justify-between text-gray-400">
                <span>Plano Selecionado</span>
                <span class="text-white">{priceFormatted}</span>
            </div>
            
            {/* Container para order bumps selecionadas - será atualizado via JS */}
            <div id="selected-bumps-container">
              {activeBumps.map((bump) => (
                <div 
                  id={`bump-summary-${bump.id}`} 
                  class="bump-summary-item flex justify-between text-gold hidden animate-[fadeIn_0.3s_ease]"
                  data-bump-id={bump.id}
                  data-bump-price={bump.price}
                >
                  <span class="truncate max-w-[150px]">{bump.name}</span>
                  <span class="font-bold">
                    {(bump.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ))}
            </div>
            
            <div class="flex justify-between text-green-400 font-medium">
                <span>Desconto Aplicado</span>
                <span>R$ 0,00</span>
            </div>
        </div>

        <div class="pt-6 border-t border-white/10 flex justify-between items-center mb-6">
            <span class="font-display text-xl text-white tracking-wide">Total</span>
            <span class="font-display text-3xl text-primary" id="total-price">{priceFormatted}</span>
        </div>
        
        <div class="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Pagamento 100% Seguro e Discreto
        </div>
        </div>
        
        {/* Countdown */}
        <div class="mt-6 border border-red-500/20 bg-red-500/5 p-4 rounded-xl text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse"></div>
        <p class="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-1 relative z-10">Oferta expira em</p>
        <p class="text-2xl font-mono font-bold text-red-500 relative z-10" id="countdown">10:00</p>
        </div>
    </div>
  );
};