import { FC } from 'hono/jsx';

interface WhitelabelStatusProps {
    error?: string;
}

export const WhitelabelStatus: FC<WhitelabelStatusProps> = ({ error }) => {
    return (
        <div class="grid lg:grid-cols-2 gap-6">
            <div class="p-6 rounded-xl bg-[#121212] border border-white/5 flex flex-col justify-between shadow-lg">
                <div>
                    <h3 class="font-bold text-white text-lg flex items-center gap-2 mb-2">
                        <span class="text-2xl">☁️</span> DigitalOcean Spaces (SFO3)
                    </h3>
                    <p class="text-sm text-gray-500 font-mono">bucket: <span class="text-white">bucketcoomerst</span></p>
                    {error && <p class="text-red-500 text-xs mt-2 font-bold bg-red-500/10 p-2 rounded">Erro: {error}</p>}
                </div>
                <div class="mt-4 flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p class="text-green-500 font-bold text-sm">Conectado & Sincronizado</p>
                </div>
            </div>

            {/* Mass Activation & Global Count - Static Example */}
            <div class="p-6 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 flex flex-col justify-center">
                 <div class="grid grid-cols-3 gap-2 mb-6 text-center">
                    <div>
                        <h4 class="text-2xl font-bold text-white">128</h4>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Modelos</p>
                    </div>
                    <div>
                        <h4 class="text-2xl font-bold text-primary">12.4k</h4>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Posts</p>
                    </div>
                    <div>
                        <h4 class="text-2xl font-bold text-white">48.2k</h4>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Mídias</p>
                    </div>
                </div>

                 <form hx-post="/api/admin/whitelabel/activate" hx-swap="none">
                    <input type="hidden" name="all" value="true" />
                    <button type="submit" class="w-full bg-[#8A2BE2] text-white font-bold uppercase tracking-widest text-xs py-3 rounded hover:brightness-110 transition-all shadow-[0_0_15px_rgba(138,43,226,0.5)] flex items-center justify-center gap-2">
                        <span>⚡</span> Sincronizar com Bucket
                    </button>
                    <p class="text-[10px] text-gray-500 text-center mt-3">Atualiza base local com dados do S3</p>
                </form>
            </div>
        </div>
    );
};
