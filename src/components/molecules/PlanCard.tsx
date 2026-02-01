import { FC } from 'hono/jsx';
import { Button } from '../atoms/Button';

interface PlanFeature {
  icon?: string;
  title?: string;
  subtitle?: string;
}

interface PlanProps {
  id: string | number;
  name: string;
  price: string;
  currency: string;
  period?: string;
  features: (string | PlanFeature)[];
  highlighted: boolean;
  variant: 'primary' | 'secondary' | 'outline';
  badge?: string;
  description?: string;
  className?: string;
  checkoutUrl?: string | null;
}

export const PlanCard: FC<PlanProps> = ({
  id,
  name,
  price,
  currency,
  period,
  features,
  highlighted,
  variant,
  badge,
  description,
  className,
  checkoutUrl
}) => {
  const ButtonComponent = () => (
    <Button 
      href={`/checkout?planId=${id}`} 
      variant={highlighted ? 'primary' : variant as any} 
      className={highlighted ? "w-full !bg-gradient-to-r !from-gold !to-[#B8860B] !text-black hover:!brightness-110 !font-bold !text-lg !py-4 shadow-[0_0_20px_rgba(255,215,0,0.3)] border-none" : `w-full ${variant === 'outline' ? 'border-gray-700 text-gray-400 hover:text-white hover:border-white' : ''}`}
    >
        {highlighted ? `ASSINAR ${name}` : `Selecionar ${name}`}
    </Button>
  );

  if (highlighted) {
    return (
      <div class={`relative p-1 rounded-2xl bg-gradient-to-b from-gold via-[#B8860B] to-black shadow-neon-gold transform scale-105 z-20 ${className || ''}`}>
        {badge && (
          <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-[#B8860B] text-black font-bold uppercase tracking-widest text-xs px-6 py-2 rounded-full shadow-lg">
            {badge}
          </div>
        )}
        
        <div class="bg-[#080808] rounded-xl p-10 h-full flex flex-col justify-between">
          <div>
            <div class="text-center mb-8">
                <h3 class="text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-gold to-white mb-2">{name}</h3>
                <div class="flex items-center justify-center gap-1">
                <span class="text-lg text-gold/80">{currency}</span>
                <span class="text-6xl font-bold text-white">{price}</span>
                {period && <span class="text-gray-500 text-sm">{period}</span>}
                </div>
            </div>

            <div class="space-y-6 mb-10">
                {features.map((feature: any) => (
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">{feature.icon || '★'}</div>
                    <div>
                    <p class="font-bold text-white">{feature.title || feature}</p>
                    <p class="text-xs text-gray-400">{feature.subtitle || ''}</p>
                    </div>
                </div>
                ))}
            </div>
          </div>

          <div>
            <ButtonComponent />
            <p class="text-center text-xs text-gray-500 mt-4">Renovação automática. Cancele a qualquer momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class={`relative p-8 rounded-2xl bg-surface${variant === 'outline' ? '/50 backdrop-blur-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100' : ' border border-white/10 hover:border-primary/50'} transition-all duration-300 flex flex-col justify-between h-full ${className || ''}`}>
      <div>
        <h3 class={`text-2xl font-display ${variant === 'outline' ? 'text-gray-400' : 'text-white'} mb-2`}>{name}</h3>
        <div class="flex items-end gap-1 mb-8">
            <span class={`text-sm ${variant === 'outline' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>{currency}</span>
            <span class="text-4xl font-bold text-white">{price}</span>
        </div>
        <ul class={`space-y-4 mb-8 text-sm ${variant === 'outline' ? 'text-gray-500' : 'text-gray-300'}`}>
            {features.map((feature: any) => (
            <li class="flex items-center gap-3">
                <span class={variant === 'outline' ? 'text-gray-600' : 'text-primary'}>✓</span> {typeof feature === 'string' ? feature : (feature.title || feature)}
            </li>
            ))}
        </ul>
      </div>
      <ButtonComponent />
    </div>
  );
};