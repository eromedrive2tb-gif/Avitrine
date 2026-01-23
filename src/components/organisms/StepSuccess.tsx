import { FC } from 'hono/jsx';

export const StepSuccess: FC = () => {
  return (
    <div id="step-3" class="step-content">
        <div class="glass-card p-12 text-center rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
                <div class="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 class="text-4xl font-display text-white mb-2">Tudo Pronto!</h2>
                <p class="text-gray-400 mb-8 max-w-md text-lg">Seu pedido foi recebido. Assim que o pagamento for confirmado, você receberá o acesso no seu e-mail.</p>
                
                <div id="pix-code-container" class="hidden w-full max-w-md mb-8 p-6 bg-[#111] rounded-xl border border-white/10">
                <p class="text-xs uppercase font-bold text-gray-500 mb-3 tracking-widest">Escaneie ou Copie o Código PIX</p>
                <div class="bg-white p-2 rounded w-32 h-32 mx-auto mb-4">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example`} alt="QR Code" class="w-full h-full object-contain" />
                </div>
                <textarea readonly class="w-full text-xs bg-black/50 p-3 rounded border border-white/10 font-mono h-20 text-gray-300 mb-3 focus:outline-none" id="pix-code">00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540410.005802BR5913CreatorFlix6008Sao Paulo62070503***6304E2CA</textarea>
                <button type="button" class="w-full bg-white text-black py-3 rounded font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">Copiar Código</button>
                </div>

                <a href="/" class="inline-block border border-white/20 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Voltar para Vitrine</a>
        </div>
    </div>
  );
};