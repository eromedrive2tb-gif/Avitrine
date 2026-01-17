document.body.addEventListener('htmx:afterOnLoad', function(evt) {
    if(evt.detail.pathInfo.requestPath === '/api/admin/whitelabel/stats') {
        const stats = JSON.parse(evt.detail.xhr.response);
        const container = evt.detail.target;
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 mb-4 text-center">
                <div>
                    <h4 class="text-3xl font-display text-white">${stats.totalModels || '0'}</h4>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest">Modelos (S3)</p>
                </div>
                <div>
                    <h4 class="text-3xl font-display text-primary">${stats.totalPosts || '0'}</h4>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest">Posts (DB)</p>
                </div>
            </div>
             <form hx-post="/api/admin/whitelabel/activate" hx-swap="afterbegin">
                <input type="hidden" name="all" value="true" />
                <button type="submit" class="w-full bg-[#8A2BE2] text-white font-bold uppercase tracking-widest text-xs py-3 rounded hover:brightness-110 transition-all shadow-neon-purple flex items-center justify-center gap-2">
                    <span>⚡</span> Sincronizar Tudo
                </button>
                <p class="text-[10px] text-gray-500 text-center mt-2">Importa novos modelos e posts do S3 para o banco.</p>
            </form>
        `;
        // Re-process HTMX for the new content
        htmx.process(container);
    }
});
