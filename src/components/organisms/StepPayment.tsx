import { FC } from 'hono/jsx';
import { RadioCard } from '../molecules/RadioCard';
import { OrderBump } from '../molecules/OrderBump';
import { Input } from '../atoms/Input';
import { Spinner } from '../atoms/Spinner';

interface OrderBumpItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean | null;
  imageUrl: string | null;
  displayOrder: number | null;
}

interface StepPaymentProps {
  orderBumps?: OrderBumpItem[];
  planPrice?: number; // Preço em centavos para calcular parcelas
}

export const StepPayment: FC<StepPaymentProps> = ({ orderBumps = [], planPrice = 0 }) => {
  // Gera opções de parcelas (1x a 12x)
  const installmentOptions = Array.from({ length: 12 }, (_, i) => {
    const installment = i + 1;
    const value = planPrice / 100 / installment;
    return { value: installment, label: `${installment}x de R$ ${value.toFixed(2).replace('.', ',')}` };
  });

  return (
    <div id="step-2" class="step-content">
        <div class="glass-card p-8 rounded-2xl border border-white/10">
            <div class="mb-8 border-b border-white/5 pb-4">
                <h2 class="text-3xl font-display text-white mb-1">Pagamento Seguro</h2>
                <p class="text-gray-400 text-sm">Seus dados são criptografados e processados com segurança.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <RadioCard 
                    name="payment_method" 
                    value="pix" 
                    label="PIX (Instantâneo)" 
                    description="Liberação imediata do conteúdo." 
                    checked={true}
                    badge="Recomendado"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>}
                />

                <RadioCard 
                    name="payment_method" 
                    value="credit_card" 
                    label="Cartão de Crédito" 
                    description="Até 12x no cartão. Discreto na fatura." 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                />
            </div>

            {/* Credit Card Fields */}
            <div id="card-fields" class="hidden space-y-5 mb-8 pt-6 border-t border-white/10 animate-[fadeIn_0.3s_ease]">
                <Input id="card_holder" name="card_holder" label="Nome no Cartão" placeholder="Como está impresso no cartão" />
                <Input id="card_number" name="card_number" label="Número do Cartão" placeholder="0000 0000 0000 0000" />
                <div class="grid grid-cols-2 gap-5">
                    <Input id="card_expiry" name="card_expiry" label="Validade" placeholder="MM/AA" />
                    <Input id="card_cvc" name="card_cvc" label="CVC" placeholder="123" maxLength={4} />
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-300">Parcelas</label>
                    <select 
                        id="card_installments" 
                        name="card_installments"
                        class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                        {installmentOptions.map(opt => (
                            <option value={opt.value} selected={opt.value === 1}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <OrderBump orderBumps={orderBumps} />

            <div class="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                <button type="button" onclick="goToStep(1)" class="text-gray-400 hover:text-white font-medium text-sm transition-colors uppercase tracking-wide">Voltar</button>
                <button type="button" id="btn-process-checkout" onclick="processCheckout()" class="bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 shadow-neon-purple transition-all flex items-center gap-3">
                    <span id="pay-btn-text">Finalizar e Acessar</span>
                    <div id="pay-loader" class="hidden"><Spinner /></div>
                </button>
            </div>
        </div>
    </div>
  );
};