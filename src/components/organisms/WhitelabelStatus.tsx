import { FC } from 'hono/jsx';

interface WhitelabelStatusProps {
    error?: string;
    stats?: { models: number; posts: number; media: number };
}

export const WhitelabelStatus: FC<WhitelabelStatusProps> = ({ error, stats = { models: 0, posts: 0, media: 0 } }) => {
    
    const formatNumber = (num: number) => num.toLocaleString('pt-BR');

    // Classes repetitivas para garantir consistência total
    const outerCardClass = "group relative bg-surface border border-white/5 rounded-xl p-1 hover:border-primary/50 transition-all duration-300 hover:shadow-neon-purple";
    const innerCardClass = "flex h-full bg-surface rounded-lg p-4 items-center justify-between";

    return (
        <div class="w-full mb-8">
            <div class="flex items-center gap-2 mb-4 px-1">
                <div class="h-6 w-1 bg-primary rounded-full shadow-neon-purple"></div>
                <h3 class="font-display text-xl text-gray-400 tracking-wide">SYSTEM HEALTH</h3>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                
                {/* --- CARD 1: STORAGE STATUS (Corrigido para seguir o padrão dos outros) --- */}
                <div class={outerCardClass}>
                    <div class="flex flex-col h-full bg-surface rounded-lg p-4">
                        {/* Topo: Info + Botão Sync */}
                        <div class="flex justify-between items-start w-full mb-4">
                            <div class="flex items-center gap-3">
                                <div class="p-2 rounded bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19.5h-10A4.5 4.5 0 0 1 3 15a4.5 4.5 0 0 1 4.5-4.5H9a5 5 0 0 1 9.5-2.5 5 5 0 0 1 4 4.5V15a4.5 4.5 0 0 1-4.5 4.5Z"/></svg>
                                </div>
                                <div>
                                    <h4 class="font-display text-xl text-primary tracking-wide leading-none group-hover:text-white transition-colors">STORAGE</h4>
                                    <p class="font-body text-[10px] text-gray-600 uppercase tracking-tighter">S3 BUCKET</p>
                                </div>
                            </div>
                            
                            <form hx-post="/admin/whitelabel/sync" hx-swap="none" hx-on="htmx:afterOnLoad: window.location.reload()">
                                <button type="submit" class="p-1.5 text-gray-600 hover:text-primary transition-colors bg-white/5 rounded-md border border-white/5 hover:border-primary/30" title="Sync Now">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                                </button>
                            </form>
                        </div>

                        {/* Base: Status Online */}
                        <div class="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                            <div class="flex items-center gap-2">
                                <div class="h-2 w-2 rounded-full bg-green-500 animate-glow-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                <span class="font-display text-xl text-white tracking-wide">ONLINE</span>
                            </div>
                            <span class="font-display text-xs text-gray-600 tracking-wider">whitelabel-only</span>
                        </div>
                    </div>
                </div>

                {/* --- METRIC CARDS (Loop Otimizado) --- */}
                {[
                    { 
                        label: 'MODELS', 
                        sub: 'TOTAL ACTIVE',
                        value: stats.models, 
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    },
                    { 
                        label: 'POSTS', 
                        sub: 'TOTAL ACTIVE',
                        value: stats.posts, 
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    },
                    { 
                        label: 'MEDIA ITEMS', 
                        sub: 'TOTAL ACTIVE',
                        value: stats.media, 
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    }
                ].map((stat) => (
                    <div class={outerCardClass}>
                        <div class={innerCardClass}>
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-primary group-hover:text-white transition-colors duration-300">
                                        {stat.icon}
                                    </span>
                                    <h4 class="font-display text-xl text-primary tracking-wide leading-none group-hover:text-white transition-colors duration-300">
                                        {stat.label}
                                    </h4>
                                </div>
                                <span class="font-body text-[10px] text-gray-600 uppercase tracking-tighter">
                                    {stat.sub}
                                </span>
                            </div>

                            <span class="font-display text-4xl text-white tracking-wide leading-none">
                                {formatNumber(stat.value)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};