import { FC } from 'hono/jsx';
import { CheckoutHeader } from '../components/organisms/CheckoutHeader';
import { StepIdentification } from '../components/organisms/StepIdentification';
import { StepPayment } from '../components/organisms/StepPayment';
import { StepSuccess } from '../components/organisms/StepSuccess';
import { OrderSummary } from '../components/organisms/OrderSummary';

interface CheckoutPageProps {
  plan: {
    id: number;
    name: string;
    price: number;
    duration: number;
  };
  user?: any;
  gateway?: {
    publicKey?: string | null;
  };
}

export const CheckoutPage: FC<CheckoutPageProps> = ({ plan, user, gateway }) => {
  const formattedPrice = (plan.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const orderBumpPrice = 1990;
  const orderBumpFormatted = (orderBumpPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const junglePayPublicKey = gateway?.publicKey || '';

  return (
    <html lang="pt-BR" class="dark">
      <head>
        <title>Finalizar Assinatura | A Vitrine VIP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050505" />
        
        {/* CSS */}
        <link rel="stylesheet" href="/static/styles.css" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Scripts de Terceiros */}
        <script src="https://unpkg.com/imask"></script>
        
        {/* JunglePay SDK para tokenização de cartão */}
        <script src="https://api.junglepagamentos.com/v1/js"></script>
        
        {/* Core Logic do Checkout (Modularizado) */}
        <script src="/static/js/checkout-core.js" defer></script>
      </head>
      <body 
        class="min-h-screen bg-[#050505] selection:bg-primary selection:text-white overflow-x-hidden" 
        onload={`initCheckout(${plan.price}, ${orderBumpPrice}, '${junglePayPublicKey}')`}
        data-plan-price={plan.price}
        data-bump-price={orderBumpPrice}
        data-junglepay-pk={junglePayPublicKey}
      >
        
        {/* Ambient Glow */}
        <div class="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none z-0"></div>

        <CheckoutHeader />

        <main class="relative z-10 max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div class="lg:col-span-8">
            <form id="checkout-form" onsubmit="return false;">
              <input type="hidden" name="planId" value={plan.id} />
              
              <StepIdentification user={user} />
              
              <StepPayment orderBumpFormatted={orderBumpFormatted} planPrice={plan.price} />
              
              <StepSuccess />

            </form>
          </div>

          <OrderSummary 
            planName={plan.name} 
            planDuration={plan.duration} 
            priceFormatted={formattedPrice} 
            orderBumpFormatted={orderBumpFormatted} 
          />

        </main>
      </body>
    </html>
  );
};