import { FC } from 'hono/jsx';

export const SupportDropdown: FC = () => {
  return (
    <div class="fixed bottom-6 right-6 z-50 group">
      {/* Dropdown Menu (Opens Upwards) */}
      <div 
        id="support-menu"
        class="hidden absolute bottom-full right-0 mb-4 w-52 bg-[#121212] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden transform transition-all duration-300 origin-bottom-right"
      >
        <div class="bg-white/5 px-4 py-3 border-b border-white/5">
            <h3 class="text-sm font-bold text-white">Precisa de Ajuda?</h3>
            <p class="text-[10px] text-gray-400">Entre em contato com o suporte</p>
        </div>
        <div class="p-2 space-y-1">
          <a 
            href="https://t.me/seulink" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group/item"
          >
            {/* Telegram Icon */}
            <span class="bg-[#229ED9]/10 p-2 rounded-full text-[#229ED9] group-hover/item:bg-[#229ED9] group-hover/item:text-white transition-all">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12.268 12.268 0 0 0-.056 0c-.367.006-.732.023-1.092.052v.004H11.944zM8.903 16.59l.526-2.529 6.22-6.058c.27-.27-.087-.417-.428-.15l-7.75 4.885-2.614-.816c-.568-.178-.58-.57.119-.844l10.218-3.94c.475-.176.89.108.736.814L14.15 15.11c-.13.626-.644.838-1.294.52l-2.953-2.04z"/></svg>
            </span>
            <div>
                <p class="text-sm font-medium text-gray-200 group-hover/item:text-white">Telegram</p>
                <p class="text-[10px] text-gray-500">Resposta rápida</p>
            </div>
          </a>

          <a 
            href="https://wa.me/seunumero" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group/item"
          >
            {/* WhatsApp Icon */}
             <span class="bg-[#25D366]/10 p-2 rounded-full text-[#25D366] group-hover/item:bg-[#25D366] group-hover/item:text-white transition-all">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
             </span>
             <div>
                <p class="text-sm font-medium text-gray-200 group-hover/item:text-white">WhatsApp</p>
                <p class="text-[10px] text-gray-500">Atendimento 24h</p>
            </div>
          </a>
        </div>
      </div>

      {/* Floating Button */}
      <button 
        id="support-btn"
        onclick="const menu = document.getElementById('support-menu'); menu.classList.toggle('hidden'); this.classList.toggle('rotate-90');"
        class="bg-gradient-to-br from-primary to-purple-700 hover:from-primary/90 hover:to-purple-600 text-white p-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-neon-purple hover:-translate-y-1 transition-all duration-300 flex items-center justify-center z-50 relative"
        aria-label="Abrir Suporte"
      >
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"/></svg>
      </button>

      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener('click', function(e) {
            const container = document.querySelector('.fixed.bottom-6.right-6');
            const menu = document.getElementById('support-menu');
            const btn = document.getElementById('support-btn');
            
            if (container && !container.contains(e.target) && menu && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
                btn.classList.remove('rotate-90');
            }
        });
      `}} />
    </div>
  );
};
