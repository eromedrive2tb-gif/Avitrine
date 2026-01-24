import { FC } from 'hono/jsx';
import { modalScripts } from '../molecules/ActionHistoryButton';

export const TransactionHistoryModal: FC = () => (
  <div id="history-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 opacity-0 pointer-events-none hidden">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onclick={modalScripts.close}></div>
    
    <div class="modal-box relative w-full max-w-lg max-h-[85vh] bg-[#121212] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden scale-95 transition-all duration-300">
      <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#050505]">
        <div class="flex items-center gap-3">
          <div class="w-1 h-6 bg-primary rounded-full shadow-neon-purple"></div>
          <div>
            <h3 class="font-display text-xl text-white tracking-wide">HISTÓRICO FINANCEIRO</h3>
            <p class="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Transações detalhadas do cliente</p>
          </div>
        </div>
        <button onclick={modalScripts.close} class="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div id="modal-history-content" class="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-[300px] bg-[#121212]">
        {/* Skeleton/HTMX content */}
      </div>

      <div class="p-4 border-t border-white/5 bg-[#050505] flex justify-end">
        <button onclick={modalScripts.close} class="px-6 py-2 text-[10px] font-bold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg uppercase tracking-widest transition-all">
          Fechar
        </button>
      </div>
    </div>
  </div>
);
