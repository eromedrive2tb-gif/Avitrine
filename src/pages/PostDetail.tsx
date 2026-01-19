import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { MockService } from '../services/mock';

interface PostDetailPageProps {
  id: string;
  user?: any;
}

export const PostDetailPage: FC<PostDetailPageProps> = ({ id, user }) => {
  const post = MockService.getPostById(parseInt(id));

  return (
    <Layout title={`${post.title} - ${post.modelName} | CreatorFlix`} user={user}>
      <div class="max-w-4xl mx-auto min-h-screen pb-20 p-4">
        
        {/* Navigation / Header */}
        <div class="flex items-center gap-4 mb-6">
          <button onclick="history.back()" class="p-2 text-gray-400 hover:text-white transition-colors">
            ← Voltar
          </button>
          <h1 class="text-lg font-bold truncate">Post de {post.modelName}</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content (Post) */}
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-[#111] rounded-2xl overflow-hidden border border-white/5">
              {/* Media */}
              <div class="relative w-full bg-black flex items-center justify-center min-h-[400px]">
                {post.type === 'video' ? (
                  <video src={post.mediaUrl} controls class="w-full h-full max-h-[80vh] object-contain" />
                ) : (
                  <img src={post.mediaUrl} alt={post.title} class="w-full h-full max-h-[80vh] object-contain" />
                )}
                
                {post.isLocked && (
                   <div class="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                    <div class="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 text-4xl">
                      🔒
                    </div>
                    <h2 class="text-2xl font-bold mb-3">Conteúdo Bloqueado</h2>
                    <p class="text-gray-400 mb-8 max-w-xs">Este post é exclusivo para assinantes. Faça o upgrade do seu plano para ver agora.</p>
                    <a href="/plans" class="bg-primary hover:bg-primary-hover text-white px-10 py-3 rounded-full font-bold transition-all transform hover:scale-105">
                      VER PLANOS DE ASSINATURA
                    </a>
                  </div>
                )}
              </div>

              {/* Info */}
              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h2 class="text-xl font-bold text-white mb-1">{post.title}</h2>
                    <p class="text-xs text-gray-500 uppercase font-bold tracking-widest">{post.createdAt}</p>
                  </div>
                  <div class="flex gap-4">
                    <button class="flex flex-col items-center text-gray-400 hover:text-red-500 transition-colors">
                      <span class="text-xl">❤️</span>
                      <span class="text-[10px] font-bold mt-1">{post.likes}</span>
                    </button>
                    <button class="flex flex-col items-center text-gray-400 hover:text-primary transition-colors">
                      <span class="text-xl">💬</span>
                      <span class="text-[10px] font-bold mt-1">{post.comments}</span>
                    </button>
                  </div>
                </div>
                
                <p class="text-gray-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Mock Comments Section */}
              <div class="border-t border-white/5 p-6 bg-black/20">
                <h3 class="font-bold text-sm mb-4">Comentários ({post.comments})</h3>
                <div class="space-y-4">
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">U1</div>
                    <div class="bg-white/5 rounded-2xl p-3 flex-1">
                      <p class="text-xs font-bold mb-1">user_alpha99</p>
                      <p class="text-xs text-gray-400">Maravilhosa demais! Ansioso pelo próximo set.</p>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold">U2</div>
                    <div class="bg-white/5 rounded-2xl p-3 flex-1">
                      <p class="text-xs font-bold mb-1">joao_premium</p>
                      <p class="text-xs text-gray-400">O melhor conteúdo da plataforma com certeza. 🔥🔥🔥</p>
                    </div>
                  </div>
                </div>
                
                {/* Add Comment Box */}
                <div class="mt-6 flex gap-3">
                   <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">YOU</div>
                   <div class="flex-1 relative">
                      <input type="text" placeholder="Escreva um comentário..." class="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 text-xs focus:outline-none focus:border-primary transition-colors" />
                      <button class="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-bold text-[10px] px-2">ENVIAR</button>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Model Info) */}
          <div class="space-y-6">
            <div class="bg-[#111] rounded-2xl p-6 border border-white/5 sticky top-24">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30">
                  <img src={post.modelImageUrl} alt={post.modelName} class="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="font-bold text-lg">{post.modelName} <span class="text-primary text-xs">✓</span></h3>
                  <p class="text-xs text-gray-500">@modelo_premium</p>
                </div>
              </div>
              
              <p class="text-xs text-gray-400 mb-6 line-clamp-3">
                Bem-vindo ao meu perfil! Aqui você encontra conteúdo exclusivo, bastidores e muito mais. Não esqueça de assinar para ver tudo!
              </p>

              <a href={`/models/slug-da-modelo`} class="block w-full text-center bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors mb-3">
                VER PERFIL COMPLETO
              </a>
              <button class="w-full text-center border border-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors">
                MENSAGEM DIRETA
              </button>
            </div>

            {/* Suggested Content */}
            <div class="bg-[#111] rounded-2xl p-6 border border-white/5">
               <h4 class="font-bold text-xs uppercase tracking-widest text-gray-500 mb-4">Relacionados</h4>
               <div class="space-y-4">
                  <div class="flex gap-3 group cursor-pointer">
                    <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=200&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p class="text-xs font-bold line-clamp-1 group-hover:text-primary transition-colors">Aulas de Yoga e Flexibilidade</p>
                      <p class="text-[10px] text-gray-500 mt-1">2.4k curtidas</p>
                    </div>
                  </div>
                  <div class="flex gap-3 group cursor-pointer">
                    <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1529139574466-a302d2d3f524?w=200&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p class="text-xs font-bold line-clamp-1 group-hover:text-primary transition-colors">Look do Dia: Especial Verão</p>
                      <p class="text-[10px] text-gray-500 mt-1">1.8k curtidas</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};