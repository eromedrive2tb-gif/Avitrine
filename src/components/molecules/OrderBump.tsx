import { FC } from 'hono/jsx';

interface OrderBumpItem {
  id: number;
  name: string;
  description: string | null;
  price: number; // Em centavos
  isActive: boolean | null;
  imageUrl: string | null;
  displayOrder: number | null;
}

interface OrderBumpProps {
  orderBumps: OrderBumpItem[];
}

// Componente para uma única order bump
const OrderBumpCard: FC<{ bump: OrderBumpItem; index: number }> = ({ bump, index }) => {
  const priceFormatted = (bump.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  return (
    <div class="relative mb-4">
      <label class="cursor-pointer block">
        <input 
          type="checkbox" 
          name={`order_bump_${bump.id}`} 
          id={`order_bump_${bump.id}`} 
          value={bump.id}
          data-bump-id={bump.id}
          data-bump-price={bump.price}
          class="bump-checkbox peer sr-only" 
        />
        <div class="border border-white/20 bg-gradient-to-r from-[#1a1a1a] to-black p-5 rounded-xl transition-all peer-checked:border-gold peer-checked:bg-gradient-to-r peer-checked:from-[#1a1a1a] peer-checked:to-[#2a2200] hover:border-white/30">
          <div class="flex items-start gap-4">
            {/* Checkbox visual */}
            <div class="flex-shrink-0 w-6 h-6 rounded border border-gray-500 peer-checked:bg-gold peer-checked:border-gold flex items-center justify-center mt-1 transition-colors bump-checkbox-visual">
              <svg class="w-4 h-4 text-black opacity-0 bump-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            {/* Imagem opcional */}
            {bump.imageUrl && (
              <img 
                src={bump.imageUrl} 
                alt={bump.name} 
                class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            
            {/* Conteúdo */}
            <div class="flex-1">
              <h4 class="font-display text-lg text-white peer-checked:text-gold flex items-center gap-2 flex-wrap">
                {bump.name}
                {index === 0 && (
                  <span class="text-[10px] bg-red-600 text-white px-2 rounded-full py-0.5">OFERTA ÚNICA</span>
                )}
              </h4>
              {bump.description && (
                <p class="text-gray-400 text-sm mt-1 leading-relaxed">
                  {bump.description}
                  {' '}
                  <span class="text-white font-bold">{priceFormatted}</span>
                </p>
              )}
              {!bump.description && (
                <p class="text-gray-400 text-sm mt-1">
                  Por apenas <span class="text-white font-bold">{priceFormatted}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

// Componente principal que renderiza múltiplas order bumps
export const OrderBump: FC<OrderBumpProps> = ({ orderBumps }) => {
  // Filtrar apenas as ativas
  const activeBumps = orderBumps.filter(b => b.isActive);
  
  if (activeBumps.length === 0) {
    return null;
  }

  return (
    <div class="mb-8" id="order-bumps-container">
      {activeBumps.map((bump, index) => (
        <OrderBumpCard key={bump.id} bump={bump} index={index} />
      ))}
      
      {/* Input hidden para enviar IDs selecionados */}
      <input type="hidden" name="orderBumpIds" id="orderBumpIds" value="" />
      
      {/* Script para gerenciar seleção de order bumps */}
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          function updateOrderBumpSelection() {
            const checkboxes = document.querySelectorAll('.bump-checkbox');
            const selectedIds = [];
            let totalBumpPrice = 0;
            
            checkboxes.forEach(function(cb) {
              const label = cb.closest('label');
              const visual = label.querySelector('.bump-checkbox-visual');
              const icon = label.querySelector('.bump-check-icon');
              const container = label.querySelector('.border');
              
              if (cb.checked) {
                selectedIds.push(cb.dataset.bumpId);
                totalBumpPrice += parseInt(cb.dataset.bumpPrice) || 0;
                
                // Atualizar visual
                if (visual) {
                  visual.classList.add('bg-[#FFD700]', 'border-[#FFD700]');
                  visual.classList.remove('border-gray-500');
                }
                if (icon) icon.classList.remove('opacity-0');
                if (container) {
                  container.classList.add('border-[#FFD700]');
                  container.classList.remove('border-white/20');
                }
              } else {
                // Reset visual
                if (visual) {
                  visual.classList.remove('bg-[#FFD700]', 'border-[#FFD700]');
                  visual.classList.add('border-gray-500');
                }
                if (icon) icon.classList.add('opacity-0');
                if (container) {
                  container.classList.remove('border-[#FFD700]');
                  container.classList.add('border-white/20');
                }
              }
            });
            
            // Atualizar input hidden com IDs selecionados
            document.getElementById('orderBumpIds').value = selectedIds.join(',');
            
            // Disparar evento customizado para atualizar total
            window.dispatchEvent(new CustomEvent('orderBumpsChanged', { 
              detail: { selectedIds, totalBumpPrice } 
            }));
          }
          
          // Adicionar listeners aos checkboxes
          document.querySelectorAll('.bump-checkbox').forEach(function(cb) {
            cb.addEventListener('change', updateOrderBumpSelection);
          });
          
          // Inicializar estado
          updateOrderBumpSelection();
        })();
      `}} />
    </div>
  );
};

// Componente legado para retrocompatibilidade (single order bump)
interface LegacyOrderBumpProps {
  priceFormatted: string;
}

export const OrderBumpLegacy: FC<LegacyOrderBumpProps> = ({ priceFormatted }) => {
  return (
    <div class="relative mb-8">
        <label class="cursor-pointer block">
        <input type="checkbox" name="order_bump" id="order_bump" class="bump-box peer sr-only" />
        <div class="border border-white/20 bg-gradient-to-r from-[#1a1a1a] to-black p-5 rounded-xl transition-all peer-checked:border-gold peer-checked:bg-gradient-to-r peer-checked:from-[#1a1a1a] peer-checked:to-[#2a2200] hover:border-white/30">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded border border-gray-500 peer-checked:bg-gold peer-checked:border-gold flex items-center justify-center mt-1 transition-colors">
                    <svg class="w-4 h-4 text-black opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                    <h4 class="font-display text-lg text-white peer-checked:text-gold flex items-center gap-2">
                        QUERO ACESSO AO GRUPO VIP (Telegram)
                        <span class="text-[10px] bg-red-600 text-white px-2 rounded-full py-0.5">OFERTA ÚNICA</span>
                    </h4>
                    <p class="text-gray-400 text-sm mt-1 leading-relaxed">
                        Tenha acesso antecipado a conteúdos, pedidos exclusivos e chat direto com as modelos. De <span class="line-through">R$ 49,90</span> por apenas <span class="text-white font-bold">{priceFormatted}</span>.
                    </p>
                </div>
            </div>
        </div>
        </label>
    </div>
  );
};
