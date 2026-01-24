import { FC } from 'hono/jsx';

export const StepSuccess: FC = () => {
  return (
    <div id="step-3" class="step-content">
        <div class="glass-card p-12 text-center rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
            {/* Estado de Pagamento Pendente (visível inicialmente) */}
            <div id="payment-pending-state">
                <div class="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-8 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                </div>
                <h2 id="pending-title" class="text-4xl font-display text-white mb-2">Aguardando Pagamento</h2>
                <p id="pending-message" class="text-gray-400 mb-8 max-w-md text-lg">Seu pedido foi recebido. Assim que o pagamento for confirmado, você receberá o acesso no seu e-mail.</p>
                
                {/* Indicador de verificação */}
                <div id="checking-status" class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verificando pagamento...</span>
                </div>
            </div>
            
            {/* Estado de Pagamento Confirmado (oculto inicialmente) */}
            <div id="payment-confirmed-state" class="hidden">
                <div class="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)] animate-[pulse_1s_ease-in-out]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 class="text-4xl font-display text-white mb-2">Pagamento Confirmado!</h2>
                <p id="confirmed-message" class="text-gray-400 mb-8 max-w-md text-lg">Seu pagamento foi aprovado com sucesso! Você receberá o acesso no seu e-mail em instantes.</p>
                
                {/* Badge de confirmação */}
                <div class="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span class="text-green-400 text-sm font-medium">Transação aprovada</span>
                </div>
            </div>
                
            {/* Container do PIX */}
            <div id="pix-code-container" class="hidden w-full max-w-md mb-8 p-6 bg-[#111] rounded-xl border border-white/10">
                <p class="text-xs uppercase font-bold text-gray-500 mb-3 tracking-widest">Escaneie ou Copie o Código PIX</p>
                <div id="pix-qrcode" class="bg-white p-2 rounded w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                    {/* QR Code será inserido via JavaScript */}
                    <svg class="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <p class="text-xs text-gray-500 mb-2">Expira em: <span id="pix-expiration" class="text-white">--</span></p>
                <textarea 
                    readonly 
                    class="w-full text-xs bg-black/50 p-3 rounded border border-white/10 font-mono h-20 text-gray-300 mb-3 focus:outline-none resize-none" 
                    id="pix-copy-code"
                    placeholder="Carregando código PIX..."
                ></textarea>
                <button 
                    type="button" 
                    id="btn-copy-pix"
                    onclick="copyPixCode()"
                    class="w-full bg-white text-black py-3 rounded font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors"
                >
                    Copiar Código
                </button>
            </div>

            <a href="/" class="inline-block border border-white/20 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Voltar para Vitrine</a>
        </div>
    </div>
  );
};