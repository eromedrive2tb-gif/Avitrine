document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Máscaras
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');
    
    if (cpfInput) IMask(cpfInput, { mask: '000.000.000-00' });
    if (phoneInput) IMask(phoneInput, { mask: '(00) 00000-0000' });

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
    total: 0
};

// Ler dados iniciais do DOM
function initPrices(base, bump) {
    state.basePrice = base;
    state.bumpPrice = bump;
    updateTotal();
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
        // Se for PIX, usar o novo endpoint da JunglePay
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
        } else {
            // Fluxo antigo para cartão de crédito
            const res = await fetch('/api/checkout/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId, email, name, cpf, phone, paymentMethod, orderBump, totalAmount
                })
            });
            const data = await res.json();
            
            if(data.success) {
                goToStep(3);
            } else {
                throw new Error(data.error || 'Erro desconhecido');
            }
        }
    } catch (e) {
        console.error(e);
        alert('Erro ao processar: ' + e.message);
        btn.disabled = false;
        btn.classList.remove('opacity-70', 'cursor-not-allowed');
        text.classList.remove('hidden');
        loader.classList.add('hidden');
    }
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
window.copyPixCode = copyPixCode;

// Setup step navigation helper (placeholder if needed)
function setupStepNavigation() {}