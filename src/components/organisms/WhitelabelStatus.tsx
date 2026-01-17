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

            {/* Mass Activation & Global Count */}
            <div class="p-6 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 flex flex-col justify-center" hx-get="/api/admin/whitelabel/stats" hx-trigger="load" hx-swap="innerHTML">
                 {/* Skeleton Loader */}
                 <div class="animate-pulse space-y-4">
                     <div class="h-8 bg-white/10 rounded w-1/3 mx-auto"></div>
                     <div class="h-4 bg-white/5 rounded w-1/2 mx-auto"></div>
                     <div class="h-10 bg-white/5 rounded w-full"></div>
                 </div>
            </div>
        </div>
    );
};
