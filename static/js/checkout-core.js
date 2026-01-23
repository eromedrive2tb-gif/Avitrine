document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Máscaras
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');
    
    if (cpfInput) IMask(cpfInput, { mask: '000.000.000-00' });
    if (phoneInput) IMask(phoneInput, { mask: '(00) 00000-0000' });

    // Inicializar máscaras de cartão
    setupCardMasks();

    // Inicializar Countdown
    initCountdown();

    // Listeners
    setupStepNavigation();
    setupPaymentMethodToggle();
    setupOrderBump();
});

// --- State Management Simples ---
const state = {
    currentStep: 1,
    basePrice: 0,
    bumpPrice: 0,
    total: 0,
    junglePayPublicKey: ''
};

// Função de inicialização principal (chamada do onload)
function initCheckout(base, bump, publicKey) {
    state.basePrice = base;
    state.bumpPrice = bump;
    state.junglePayPublicKey = publicKey || '';
    updateTotal();
    
    // Configurar JunglePagamentos se disponível
    if (typeof JunglePagamentos !== 'undefined' && state.junglePayPublicKey) {
        JunglePagamentos.setPublicKey(state.junglePayPublicKey);
        // JunglePagamentos.setTestMode(true); // Descomentar para modo de teste
        console.log('[JunglePay] SDK inicializado com publicKey');
    }
}

// Ler dados iniciais do DOM (retrocompatibilidade)
function initPrices(base, bump) {
    initCheckout(base, bump, '');
}

// --- Máscaras de Cartão ---
function setupCardMasks() {
    const cardNumberInput = document.getElementById('card_number');
    const cardExpiryInput = document.getElementById('card_expiry');
    const cardCvcInput = document.getElementById('card_cvc');
    
    if (cardNumberInput) {
        IMask(cardNumberInput, { 
            mask: '0000 0000 0000 0000',
            lazy: false
        });
    }
    
    if (cardExpiryInput) {
        IMask(cardExpiryInput, { 
            mask: '00/00',
            lazy: false
        });
    }
    
    if (cardCvcInput) {
        IMask(cardCvcInput, { 
            mask: '0000',
            lazy: false
        });
    }
}

// --- Navegação ---
function goToStep(step) {
    if (state.currentStep === 1 && step === 2) {
        if (!validateStep1()) return;
    }

    document.getElementById('step-' + state.currentStep).classList.remove('active');
    
    setTimeout(() => {
        document.getElementById('step-' + step).classList.add('active');
    }, 100);

    updateIndicators(step);
    state.currentStep = step;
}

function validateStep1() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    
    if (!name || !email || !cpf) {
        const step = document.getElementById('step-1');
        step.classList.add('animate-pulse');
        setTimeout(() => step.classList.remove('animate-pulse'), 500);
        return false;
    }
    return true;
}

function updateIndicators(step) {
    for(let i=1; i<=3; i++) {
        const el = document.getElementById('ind-step-' + i);
        const circle = el.querySelector('.step-circle');
        
        if (i <= step) {
            el.classList.remove('text-gray-600');
            el.classList.add('text-white');
            circle.classList.remove('bg-surface', 'text-gray-500', 'border-white/10');
            circle.classList.add('bg-primary', 'text-white', 'shadow-neon-purple', 'border-transparent');
        } else {
            el.classList.add('text-gray-600');
            el.classList.remove('text-white');
            circle.classList.add('bg-surface', 'text-gray-500', 'border-white/10');
            circle.classList.remove('bg-primary', 'text-white', 'shadow-neon-purple', 'border-transparent');
        }
    }
}

// --- Listeners de Pagamento ---
function setupPaymentMethodToggle() {
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
}

function setupOrderBump() {
    const bumpCheck = document.getElementById('order_bump');
    if(bumpCheck) {
        bumpCheck.addEventListener('change', updateTotal);
    }
}

function updateTotal() {
    const bumpCheck = document.getElementById('order_bump');
    const bumpSummary = document.getElementById('bump-summary');
    const totalPriceEl = document.getElementById('total-price');
    
    const isBumped = bumpCheck && bumpCheck.checked;
    
    if(isBumped) {
        bumpSummary.classList.remove('hidden');
    } else {
        bumpSummary.classList.add('hidden');
    }
    
    const total = isBumped ? state.basePrice + state.bumpPrice : state.basePrice;
    
    if(totalPriceEl) {
        totalPriceEl.innerText = (total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}

// --- Utils ---
function initCountdown() {
    let timeLeft = 600; 
    const el = document.getElementById('countdown');
    if(!el) return;

    setInterval(() => {
        if(timeLeft <= 0) return;
        timeLeft--;
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        el.innerText = m + ':' + s;
    }, 1000);
}

// --- Processamento ---
async function processCheckout() {
    const btn = document.getElementById('btn-process-checkout');
    const text = document.getElementById('pay-btn-text');
    const loader = document.getElementById('pay-loader');
    
    btn.disabled = true;
    btn.classList.add('opacity-70', 'cursor-not-allowed');
    text.classList.add('hidden');
    loader.classList.remove('hidden');

    const form = document.getElementById('checkout-form');
    // Coleta manual ou FormData
    const planId = document.querySelector('input[name="planId"]').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    const orderBump = document.getElementById('order_bump').checked;
    
    const totalAmount = orderBump ? state.basePrice + state.bumpPrice : state.basePrice;

    try {
        // Se for PIX, usar o endpoint PIX da JunglePay
        if (paymentMethod === 'pix') {
            const pixResult = await processPixPayment({
                customerName: name,
                customerEmail: email,
                customerDocument: cpf,
                customerPhone: phone,
                totalAmount: totalAmount,
                planId: parseInt(planId),
                orderBump: orderBump
            });

            if (pixResult.success) {
                // Exibir QR Code e copia-e-cola do PIX
                displayPixPayment(pixResult);
                goToStep(3);
            } else {
                throw new Error(pixResult.error || 'Erro ao gerar PIX');
            }
        } else if (paymentMethod === 'credit_card') {
            // Fluxo de cartão de crédito via JunglePay
            const cardResult = await processCardPayment({
                customerName: name,
                customerEmail: email,
                customerDocument: cpf,
                customerPhone: phone,
                totalAmount: totalAmount,
                planId: parseInt(planId),
                orderBump: orderBump
            });

            if (cardResult.success) {
                displayCardSuccess(cardResult);
                goToStep(3);
            } else {
                throw new Error(cardResult.error || 'Erro ao processar cartão');
            }
        }
    } catch (e) {
        console.error(e);
        alert('Erro ao processar: ' + e.message);
        resetButton();
    }
}

function resetButton() {
    const btn = document.getElementById('btn-process-checkout');
    const text = document.getElementById('pay-btn-text');
    const loader = document.getElementById('pay-loader');
    
    btn.disabled = false;
    btn.classList.remove('opacity-70', 'cursor-not-allowed');
    text.classList.remove('hidden');
    loader.classList.add('hidden');
}

// --- PIX Payment via JunglePay ---
async function processPixPayment(data) {
    const res = await fetch('/api/checkout/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    const result = await res.json();
    return result;
}

// --- Credit Card Payment via JunglePay ---
async function processCardPayment(data) {
    // 1. Coletar dados do cartão
    const cardHolder = document.getElementById('card_holder').value;
    const cardNumber = document.getElementById('card_number').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('card_expiry').value;
    const cardCvc = document.getElementById('card_cvc').value;
    const installments = parseInt(document.getElementById('card_installments')?.value || '1');

    // 2. Validar campos do cartão
    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvc) {
        return { success: false, error: 'Preencha todos os dados do cartão' };
    }

    if (cardNumber.length < 13 || cardNumber.length > 19) {
        return { success: false, error: 'Número do cartão inválido' };
    }

    // 3. Parsear data de expiração
    const [expMonth, expYear] = cardExpiry.split('/');
    if (!expMonth || !expYear) {
        return { success: false, error: 'Data de validade inválida' };
    }

    const fullExpYear = expYear.length === 2 ? parseInt('20' + expYear) : parseInt(expYear);

    // 4. Tokenizar cartão via JunglePagamentos SDK
    if (typeof JunglePagamentos === 'undefined') {
        return { success: false, error: 'SDK de pagamento não carregado. Recarregue a página.' };
    }

    if (!state.junglePayPublicKey) {
        return { success: false, error: 'Gateway de pagamento não configurado corretamente.' };
    }

    try {
        console.log('[Card] Tokenizando cartão...');
        
        const cardHash = await JunglePagamentos.encrypt({
            number: cardNumber,
            holderName: cardHolder.toUpperCase(),
            expMonth: parseInt(expMonth),
            expYear: fullExpYear,
            cvv: cardCvc
        });

        if (!cardHash) {
            return { success: false, error: 'Erro ao tokenizar cartão. Verifique os dados.' };
        }

        console.log('[Card] Cartão tokenizado com sucesso');

        // 5. Enviar para o backend
        const res = await fetch('/api/checkout/card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                cardHash: cardHash,
                installments: installments
            })
        });

        const result = await res.json();
        return result;

    } catch (error) {
        console.error('[Card] Erro na tokenização:', error);
        return { 
            success: false, 
            error: error.message || 'Erro ao processar cartão. Verifique os dados e tente novamente.' 
        };
    }
}

// --- Exibir sucesso do cartão ---
function displayCardSuccess(cardData) {
    const pixContainer = document.getElementById('pix-code-container');
    
    // Ocultar container de PIX se visível
    if (pixContainer) {
        pixContainer.classList.add('hidden');
    }

    // Exibir mensagem de sucesso do cartão
    const successTitle = document.querySelector('#step-3 h2');
    const successMessage = document.querySelector('#step-3 p');
    
    if (successTitle) {
        successTitle.innerText = cardData.status === 'paid' ? 'Pagamento Aprovado!' : 'Processando Pagamento';
    }
    
    if (successMessage) {
        if (cardData.status === 'paid') {
            successMessage.innerHTML = `
                Seu pagamento foi aprovado!<br>
                <span class="text-sm text-gray-500">
                    Cartão •••• ${cardData.cardLastDigits} (${cardData.cardBrand})<br>
                    ${cardData.installments}x
                </span><br><br>
                Você receberá o acesso no seu e-mail em instantes.
            `;
        } else {
            successMessage.innerText = 'Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail.';
        }
    }

    console.log('[Card] Pagamento processado:', {
        transactionId: cardData.transactionId,
        status: cardData.status,
        brand: cardData.cardBrand,
        lastDigits: cardData.cardLastDigits
    });
}

function displayPixPayment(pixData) {
    const pixContainer = document.getElementById('pix-code-container');
    const pixQrCode = document.getElementById('pix-qrcode');
    const pixCopyCode = document.getElementById('pix-copy-code');
    const pixExpiration = document.getElementById('pix-expiration');
    
    if (pixContainer) {
        pixContainer.classList.remove('hidden');
    }

    // Exibir QR Code usando API externa
    if (pixQrCode && pixData.pixQrCode) {
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.pixQrCode)}`;
        pixQrCode.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code PIX" class="w-full h-full object-contain" />`;
    }

    // Código copia-e-cola
    if (pixCopyCode && pixData.pixQrCode) {
        pixCopyCode.value = pixData.pixQrCode;
        pixCopyCode.setAttribute('data-pix-code', pixData.pixQrCode);
    }

    // Data de expiração
    if (pixExpiration && pixData.expirationDate) {
        const expDate = new Date(pixData.expirationDate + 'T23:59:59');
        pixExpiration.innerText = expDate.toLocaleDateString('pt-BR');
    }

    // Armazenar transactionId para polling de status
    if (pixData.transactionId) {
        window.currentPixTransactionId = pixData.transactionId;
        startPixStatusPolling(pixData.transactionId);
    }

    console.log('[PIX] Dados exibidos:', {
        transactionId: pixData.transactionId,
        qrCodeLength: pixData.pixQrCode?.length,
        expiration: pixData.expirationDate
    });
}

// Função para copiar código PIX
function copyPixCode() {
    const pixCopyCode = document.getElementById('pix-copy-code');
    const pixCode = pixCopyCode?.getAttribute('data-pix-code') || pixCopyCode?.value;
    
    if (pixCode) {
        navigator.clipboard.writeText(pixCode).then(() => {
            const btn = document.getElementById('btn-copy-pix');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = 'Copiado!';
                btn.classList.add('bg-green-600');
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove('bg-green-600');
                }, 2000);
            }
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Erro ao copiar código PIX');
        });
    }
}

// Polling para verificar status do pagamento (opcional)
function startPixStatusPolling(transactionId) {
    // Implementar polling a cada 5 segundos para verificar se o PIX foi pago
    // Por enquanto apenas loga
    console.log('[PIX] Monitorando transação:', transactionId);
}

// Expor globalmente para o HTML chamar onclick
window.goToStep = goToStep;
window.processCheckout = processCheckout;
window.initPrices = initPrices;
window.initCheckout = initCheckout;
window.copyPixCode = copyPixCode;

// Setup step navigation helper (placeholder if needed)
function setupStepNavigation() {}