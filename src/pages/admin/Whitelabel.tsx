import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Button } from '../../components/atoms/Button';
import { WhitelabelModel } from '../../services/s3';
import { Pagination } from '../../components/molecules/Pagination';

interface AdminWhitelabelProps {
  models: WhitelabelModel[];
  nextToken?: string;
  error?: string;
}

export const AdminWhitelabel: FC<AdminWhitelabelProps> = ({ models, nextToken, error }) => {
  
  return (
    <AdminLayout title="Integração Whitelabel (S3/DigitalOcean)" activePath="/admin/whitelabel">
      
      <div class="space-y-8 pb-20">
        
        {/* Status Connection & Activation Card */}
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

        {/* Script for Stats & Activation Feedback */}
        <script dangerouslySetInnerHTML={{ __html: `
            document.body.addEventListener('htmx:afterOnLoad', function(evt) {
                if(evt.detail.pathInfo.requestPath === '/api/admin/whitelabel/stats') {
                    const stats = JSON.parse(evt.detail.xhr.response);
                    const container = evt.detail.target;
                    container.innerHTML = \`
                        <div class="grid grid-cols-2 gap-4 mb-4 text-center">
                            <div>
                                <h4 class="text-3xl font-display text-white">\${stats.totalModels || '0'}</h4>
                                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Modelos (S3)</p>
                            </div>
                            <div>
                                <h4 class="text-3xl font-display text-primary">\${stats.totalPosts || '0'}</h4>
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
                    \`
                }
            });
        `}} />

        {/* Explorer Table */}
        <div class="rounded-xl border border-white/5 bg-[#121212] overflow-hidden">
            <div class="p-4 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
                <h3 class="font-bold text-white text-sm">Explorador de Arquivos S3</h3>
                <div class="flex gap-2">
                    <span class="text-xs text-gray-500 flex items-center gap-1">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span> Live Data
                    </span>
                </div>
            </div>

            <table class="w-full text-left text-sm text-gray-400">
                <thead class="bg-[#050505] text-xs uppercase font-bold text-gray-500">
                    <tr>
                        <th class="px-6 py-3 w-10"><input type="checkbox" class="accent-primary" /></th>
                        <th class="px-6 py-3">Capa</th>
                        <th class="px-6 py-3">ID da Pasta (Bucket Key)</th>
                        <th class="px-6 py-3">Posts (Subpastas)</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Ação</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    {models.length === 0 ? (
                        <tr>
                            <td colspan={6} class="text-center py-12 text-gray-500">
                                {error ? 'Erro de Conexão.' : 'Carregando dados do bucket...'}
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
                                </td>
                                <td class="px-6 py-4">
                                    <span class="bg-white/5 border border-white/5 px-2 py-1 rounded text-xs text-white font-mono">{item.postCount}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border bg-blue-500/10 text-blue-500 border-blue-500/20">
                                        Novo
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
            
            {/* Pagination Controls (Adapted for S3 Token) */}
            <div class="px-6 py-4 border-t border-white/5 bg-[#1a1a1a] flex items-center justify-between">
                <div class="text-xs text-gray-500">
                    Visualizando <span class="font-bold text-white">{models.length}</span> itens desta página
                </div>

                <div class="flex items-center gap-2">
                    <a href="/admin/whitelabel" class="px-3 py-1.5 rounded bg-[#050505] border border-white/10 text-xs text-white hover:border-primary transition-colors">
                        ⟵ Início
                    </a>
                    
                    {nextToken ? (
                         <a href={`/admin/whitelabel?token=${nextToken}`} class="px-4 py-1.5 rounded bg-primary text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-colors">
                            Carregar Mais ⟶
                        </a>
                    ) : (
                        <button disabled class="px-4 py-1.5 rounded bg-[#050505] border border-white/5 text-xs text-gray-600 cursor-not-allowed uppercase tracking-widest">
                            Fim da Lista
                        </button>
                    )}
                </div>
            </div>

        </div>

      </div>
    </AdminLayout>
  );
};