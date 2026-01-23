import { FC } from 'hono/jsx';

export const CheckoutHeader: FC = () => {
  const steps = [
      { id: 1, label: 'Identificação' },
      { id: 2, label: 'Pagamento' },
      { id: 3, label: 'Acesso' }
  ];

  return (
    <header class="relative z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0">
      <div class="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <div class="w-8 h-8 rounded bg-gradient-to-br from-primary to-black flex items-center justify-center font-bold text-white shadow-neon-purple">V</div>
           <span class="font-display text-xl tracking-widest text-white">CHECKOUT <span class="text-primary">VIP</span></span>
        </div>
        
        <div class="hidden md:flex items-center gap-6">
           {steps.map((step, index) => (
               <div id={`ind-step-${step.id}`} class={`flex items-center gap-2 transition-colors ${step.id === 1 ? 'text-white' : 'text-gray-600'}`}>
                  <div class={`step-circle w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all ${step.id === 1 ? 'bg-primary text-white border-transparent shadow-neon-purple' : 'bg-surface text-gray-500 border-white/10'}`}>
                      {step.id}
                  </div>
                  <span class="text-sm font-medium tracking-wide uppercase">{step.label}</span>
                  {index < steps.length - 1 && <div class="w-12 h-[1px] bg-white/10"></div>}
               </div>
           ))}
        </div>
      </div>
    </header>
  );
};