import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';

interface CheckoutPageProps {
  plan: {
    id: number;
    name: string;
    price: number;
    duration: number;
  };
  user?: any;
  gateway?: any;
}

export const CheckoutPage: FC<CheckoutPageProps> = ({ plan, user, gateway }) => {
  const formattedPrice = (plan.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const orderBumpPrice = 1990; // R$ 19,90 example
  const orderBumpFormatted = (orderBumpPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <html>
      <head>
        <title>Checkout Seguro | A Vitrine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Simple masks library */}
        <script src="https://unpkg.com/imask"></script>
        <style dangerouslySetInnerHTML={{ __html: `
          body { font-family: 'Inter', sans-serif; background-color: #f9fafb; }
          .step-content { transition: all 0.4s ease-in-out; opacity: 0; transform: translateX(20px); display: none; }
          .step-content.active { opacity: 1; transform: translateX(0); display: block; }
          .slide-out { opacity: 0; transform: translateX(-20px); }
          
          /* Custom Radio */
          .radio-card:checked + div { border-color: #000; background-color: #f8f9fa; }
          .radio-card:checked + div .check-icon { display: block; }
          
          .loader {
            border: 3px solid #f3f3f3;
            border-radius: 50%;
            border-top: 3px solid #000;
            width: 24px;
            height: 24px;
            -webkit-animation: spin 1s linear infinite; /* Safari */
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        ` }} />
      </head>
      <body class="bg-gray-50 text-gray-900 antialiased">
        
        {/* Navbar Simplified */}
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
               <span class="font-semibold text-sm tracking-tight text-gray-600 uppercase">Checkout Seguro</span>
            </div>
            {/* Steps Indicator */}
            <div class="hidden md:flex items-center gap-4 text-sm font-medium">
               <div id="ind-step-1" class="flex items-center gap-2 text-black transition-colors">
                  <span class="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">1</span>
                  Identificação
               </div>
               <div class="w-8 h-[1px] bg-gray-300"></div>
               <div id="ind-step-2" class="flex items-center gap-2 text-gray-400 transition-colors">
                  <span class="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">2</span>
                  Pagamento
               </div>
               <div class="w-8 h-[1px] bg-gray-300"></div>
               <div id="ind-step-3" class="flex items-center gap-2 text-gray-400 transition-colors">
                  <span class="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">3</span>
                  Conclusão
               </div>
            </div>
          </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Steps */}
          <div class="lg:col-span-8">
            
            <form id="checkout-form" onsubmit="return false;">
              <input type="hidden" name="planId" value={plan.id} />
              
              {/* STEP 1: IDENTIFICATION */}
              <div id="step-1" class="step-content active bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200/60">
                <h2 class="text-xl font-semibold mb-1">Seus Dados</h2>
                <p class="text-sm text-gray-500 mb-6">Preencha para receber o acesso.</p>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input type="email" id="email" name="email" value={user?.email || ''} class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="seu@email.com" required />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input type="text" id="name" name="name" value={user?.name || ''} class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="Como no cartão" required />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                      <input type="text" id="cpf" name="cpf" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="000.000.000-00" required />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                      <input type="tel" id="phone" name="phone" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="(11) 99999-9999" required />
                    </div>
                  </div>
                </div>

                <div class="mt-8 flex justify-end">
                  <button type="button" onclick="goToStep(2)" class="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center gap-2">
                    Continuar
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

              {/* STEP 2: PAYMENT */}
              <div id="step-2" class="step-content bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200/60">
                <h2 class="text-xl font-semibold mb-1">Pagamento</h2>
                <p class="text-sm text-gray-500 mb-6">Escolha como deseja pagar.</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Pix Option */}
                    <label class="cursor-pointer relative">
                        <input type="radio" name="payment_method" value="pix" class="peer sr-only" checked />
                        <div class="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-black peer-checked:bg-gray-50 transition-all hover:bg-gray-50 h-full">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                  PIX
                                </span>
                                <div class="w-4 h-4 rounded-full border border-gray-300 peer-checked:bg-black peer-checked:border-black"></div>
                            </div>
                            <p class="text-xs text-gray-500">Aprovação imediata. QR Code gerado na próxima tela.</p>
                             <span class="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Recomendado</span>
                        </div>
                    </label>

                    {/* Credit Card Option */}
                    <label class="cursor-pointer relative">
                        <input type="radio" name="payment_method" value="credit_card" class="peer sr-only" />
                        <div class="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-black peer-checked:bg-gray-50 transition-all hover:bg-gray-50 h-full">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium flex items-center gap-2">
                                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                   Cartão
                                </span>
                                <div class="w-4 h-4 rounded-full border border-gray-300 peer-checked:bg-black peer-checked:border-black"></div>
                            </div>
                            <p class="text-xs text-gray-500">Até 12x no cartão de crédito.</p>
                        </div>
                    </label>
                </div>

                {/* Credit Card Fields (Hidden by default, shown via JS) */}
                <div id="card-fields" class="hidden space-y-4 mb-6 pt-4 border-t border-gray-100">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                        <input type="text" id="card_number" class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 outline-none" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                         <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                            <input type="text" id="card_expiry" class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 outline-none" placeholder="MM/AA" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input type="text" id="card_cvc" class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 outline-none" placeholder="123" />
                        </div>
                    </div>
                </div>

                {/* ORDER BUMP */}
                <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 mb-6">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="order_bump" id="order_bump" class="mt-1 w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                        <div>
                            <p class="font-bold text-sm text-gray-900">Acesso VIP + Grupo Exclusivo</p>
                            <p class="text-xs text-gray-600 mt-1">Adicione acesso ao nosso grupo privado no Telegram e veja conteúdos antes de todo mundo por apenas <span class="font-bold text-black">{orderBumpFormatted}</span>.</p>
                        </div>
                    </label>
                </div>

                <div class="flex justify-between items-center mt-8">
                  <button type="button" onclick="goToStep(1)" class="text-gray-500 hover:text-black font-medium text-sm transition-colors">Voltar</button>
                  <button type="button" onclick="processCheckout()" class="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
                    <span id="pay-btn-text">Finalizar Pagamento</span>
                    <div id="pay-loader" class="loader hidden"></div>
                  </button>
                </div>
              </div>

              {/* STEP 3: SUCCESS */}
              <div id="step-3" class="step-content bg-white p-10 text-center rounded-2xl shadow-sm border border-gray-200/60">
                 <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                 </div>
                 <h2 class="text-2xl font-bold mb-2">Pedido Recebido!</h2>
                 <p class="text-gray-500 mb-8 max-w-sm mx-auto">Sua assinatura está sendo processada. Você receberá um e-mail com os dados de acesso em instantes.</p>
                 
                 <div id="pix-code-container" class="hidden mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="text-xs uppercase font-bold text-gray-500 mb-2">Copie o código PIX</p>
                    <textarea readonly class="w-full text-xs bg-white p-2 rounded border border-gray-200 font-mono h-24" id="pix-code">00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540410.005802BR5913Dias Market6008Sao Paulo62070503***6304E2CA</textarea>
                    <button type="button" class="mt-2 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50">Copiar Código</button>
                 </div>

                 <a href="/" class="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800">Voltar para Home</a>
              </div>

            </form>
          </div>

          {/* Right Column: Summary (Sticky) */}
          <div class="lg:col-span-4">
             <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 sticky top-24">
                <h3 class="font-semibold text-lg mb-4">Resumo do Pedido</h3>
                
                <div class="flex items-start gap-4 pb-4 border-b border-gray-100">
                   <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {/* Placeholder Image */}
                      <svg class="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24"><rect width="24" height="24" /></svg>
                   </div>
                   <div>
                      <p class="font-medium text-gray-900">{plan.name}</p>
                      <p class="text-sm text-gray-500">{plan.duration} dias de acesso</p>
                   </div>
                </div>

                <div class="py-4 space-y-2 text-sm">
                   <div class="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formattedPrice}</span>
                   </div>
                   <div id="bump-summary" class="flex justify-between text-gray-600 hidden">
                      <span>Acesso VIP (BUMP)</span>
                      <span>{orderBumpFormatted}</span>
                   </div>
                   <div class="flex justify-between text-green-600 font-medium">
                      <span>Desconto</span>
                      <span>R$ 0,00</span>
                   </div>
                </div>

                <div class="pt-4 border-t border-gray-100 flex justify-between items-center">
                   <span class="font-bold text-gray-900">Total</span>
                   <span class="font-bold text-xl text-black" id="total-price">{formattedPrice}</span>
                </div>
                
                <div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   Ambiente 100% Seguro
                </div>
             </div>
             
             {/* Countdown */}
             <div class="mt-4 bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                <p class="text-xs font-bold text-red-600 uppercase mb-1">Oferta por tempo limitado</p>
                <p class="text-2xl font-mono font-bold text-red-700" id="countdown">10:00</p>
             </div>
          </div>
        </main>

        <script dangerouslySetInnerHTML={{ __html: `
          // Masks
          IMask(document.getElementById('cpf'), { mask: '000.000.000-00' });
          IMask(document.getElementById('phone'), { mask: '(00) 00000-0000' });
          
          let currentStep = 1;
          const totalSteps = 3;
          
          function goToStep(step) {
            // Validate Step 1
            if (currentStep === 1 && step === 2) {
               const name = document.getElementById('name').value;
               const email = document.getElementById('email').value;
               const cpf = document.getElementById('cpf').value;
               if (!name || !email || !cpf) {
                  alert('Por favor, preencha todos os campos.');
                  return;
               }
            }

            document.getElementById('step-' + currentStep).classList.remove('active');
            
            // Wait for transition
            setTimeout(() => {
                document.getElementById('step-' + step).classList.add('active');
            }, 100);

            // Update Header Indicators
            updateIndicators(step);
            
            currentStep = step;
          }
          
          function updateIndicators(step) {
             for(let i=1; i<=3; i++) {
                 const el = document.getElementById('ind-step-' + i);
                 const circle = el.querySelector('span');
                 if(i <= step) {
                     el.classList.remove('text-gray-400');
                     el.classList.add('text-black');
                     circle.classList.remove('bg-gray-200', 'text-gray-500');
                     circle.classList.add('bg-black', 'text-white');
                 } else {
                     el.classList.add('text-gray-400');
                     el.classList.remove('text-black');
                     circle.classList.add('bg-gray-200', 'text-gray-500');
                     circle.classList.remove('bg-black', 'text-white');
                 }
             }
          }

          // Payment Method Toggle
          const radioInputs = document.querySelectorAll('input[name="payment_method"]');
          const cardFields = document.getElementById('card-fields');
          radioInputs.forEach(input => {
             input.addEventListener('change', (e) => {
                 if(e.target.value === 'credit_card') {
                     cardFields.classList.remove('hidden');
                 } else {
                     cardFields.classList.add('hidden');
                 }
             });
          });

          // Order Bump Logic
          const bumpCheck = document.getElementById('order_bump');
          const bumpSummary = document.getElementById('bump-summary');
          const totalPriceEl = document.getElementById('total-price');
          const basePrice = ${plan.price};
          const bumpPrice = ${orderBumpPrice};

          bumpCheck.addEventListener('change', (e) => {
              if(e.target.checked) {
                  bumpSummary.classList.remove('hidden');
                  const total = basePrice + bumpPrice;
                  totalPriceEl.innerText = (total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              } else {
                  bumpSummary.classList.add('hidden');
                  totalPriceEl.innerText = (basePrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              }
          });

          // Countdown
          let timeLeft = 600; // 10 minutes
          setInterval(() => {
             if(timeLeft <= 0) return;
             timeLeft--;
             const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
             const s = (timeLeft % 60).toString().padStart(2, '0');
             document.getElementById('countdown').innerText = m + ':' + s;
          }, 1000);

          // Submit
          async function processCheckout() {
              const btn = document.querySelector('button[onclick="processCheckout()"]');
              const text = document.getElementById('pay-btn-text');
              const loader = document.getElementById('pay-loader');
              
              btn.disabled = true;
              text.classList.add('hidden');
              loader.classList.remove('hidden');

              // Gather Data
              const planId = document.querySelector('input[name="planId"]').value;
              const email = document.getElementById('email').value;
              const name = document.getElementById('name').value;
              const cpf = document.getElementById('cpf').value;
              const phone = document.getElementById('phone').value;
              const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
              const orderBump = document.getElementById('order_bump').checked;
              
              // Calculate Total
              const basePrice = ${plan.price};
              const bumpPrice = ${orderBumpPrice};
              const totalAmount = orderBump ? basePrice + bumpPrice : basePrice;

              try {
                  const res = await fetch('/api/checkout/process', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          planId, email, name, cpf, phone, paymentMethod, orderBump, totalAmount
                      })
                  });
                  const data = await res.json();
                  
                  if(data.success) {
                      // Success
                      goToStep(3);
                      if(paymentMethod === 'pix') {
                          document.getElementById('pix-code-container').classList.remove('hidden');
                      }
                  } else {
                      alert('Erro ao processar: ' + (data.error || 'Tente novamente.'));
                      btn.disabled = false;
                      text.classList.remove('hidden');
                      loader.classList.add('hidden');
                  }
              } catch (e) {
                  console.error(e);
                  alert('Erro de conexão. Tente novamente.');
                  btn.disabled = false;
                  text.classList.remove('hidden');
                  loader.classList.add('hidden');
              }
          }

        ` }} />
      </body>
    </html>
  );
};
