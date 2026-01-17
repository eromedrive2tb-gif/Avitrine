import { FC } from 'hono/jsx';
import { WhitelabelModel } from '../../services/s3';

interface WhitelabelTableProps {
    models: WhitelabelModel[];
    currentPage?: number;
    totalPages?: number;
    error?: string;
}

export const WhitelabelTable: FC<WhitelabelTableProps> = ({ models, currentPage = 1, totalPages = 1, error }) => {
    return (
        <div class="rounded-xl border border-white/5 bg-surface overflow-hidden">
            <div class="p-4 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
                <h3 class="font-bold text-white text-sm">Explorador de Arquivos S3 (Cached)</h3>
                <div class="flex gap-2 items-center">
                    <span class="text-xs text-gray-500 flex items-center gap-1 mr-4">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span> DB Synced
                    </span>
                </div>
            </div>

            <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-[#050505] text-xs uppercase font-bold text-gray-500">
                    <tr>
                        <th class="px-6 py-3 w-10"><input type="checkbox" class="accent-primary" /></th>
                        <th class="px-6 py-3">Capa</th>
                        <th class="px-6 py-3">ID da Pasta (Model)</th>
                        <th class="px-6 py-3">Posts</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Ação</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    {models.length === 0 ? (
                        <tr>
                            <td colspan={6} class="text-center py-12 text-gray-500">
                                {error ? 'Erro ao carregar dados.' : 'Nenhum modelo encontrado. Clique em Sync.'}
                            </td>
                        </tr>
                    ) : (
                        models.map((item) => (
                            <tr class="hover:bg-white/5 transition-colors group">
                                <td class="px-6 py-4"><input type="checkbox" class="accent-primary" /></td>
                                <td class="px-6 py-4">
                                    <div class="w-12 h-12 rounded bg-[#050505] overflow-hidden border border-white/10 group-hover:border-primary transition-colors">
                                        {item.thumbnailUrl ? (
                                            <img src={item.thumbnailUrl} class="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <div class="w-full h-full flex items-center justify-center text-[10px] text-gray-600">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="font-mono text-white text-xs block mb-1">{item.folderName}</span>
                                    <span class="text-[10px] text-gray-600">Última sync: Hoje</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="bg-white/5 border border-white/5 px-2 py-1 rounded text-xs text-white font-mono">{item.postCount || 0}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border bg-green-500/10 text-green-500 border-green-500/20">
                                        {item.status || 'Active'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                     <form hx-post="/api/admin/whitelabel/activate" hx-swap="none">
                                        <input type="hidden" name="model" value={item.folderName} />
                                        <button type="submit" class="text-[10px] font-bold text-white bg-primary hover:bg-primary/80 px-3 py-1.5 rounded transition-colors uppercase tracking-widest">
                                            Importar
                                        </button>
                                     </form>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div class="px-6 py-4 border-t border-white/5 bg-[#1a1a1a] flex items-center justify-between">
                <div class="text-xs text-gray-500">
                    Página <span class="font-bold text-white">{currentPage}</span> de <span class="font-bold text-white">{totalPages}</span>
                </div>

                <div class="flex items-center gap-2">
                    {currentPage > 1 ? (
                         <a href={`/admin/whitelabel?page=${currentPage - 1}`} class="px-3 py-1.5 rounded bg-[#050505] border border-white/10 text-xs text-white hover:border-primary transition-colors">
                            ⟵ Anterior
                        </a>
                    ) : (
                        <button disabled class="px-3 py-1.5 rounded bg-[#050505] border border-white/5 text-xs text-gray-600 cursor-not-allowed">
                            ⟵ Anterior
                        </button>
                    )}
                    
                    {currentPage < totalPages ? (
                         <a href={`/admin/whitelabel?page=${currentPage + 1}`} class="px-4 py-1.5 rounded bg-primary text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-colors">
                            Próximo ⟶
                        </a>
                    ) : (
                        <button disabled class="px-4 py-1.5 rounded bg-[#050505] border border-white/5 text-xs text-gray-600 cursor-not-allowed uppercase tracking-widest">
                            Fim
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};