import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { MockService } from '../services/mock';

interface ModelProfilePageProps {
  slug: string;
}

export const ModelProfilePage: FC<ModelProfilePageProps> = ({ slug }) => {
  const model = MockService.getModelBySlug(slug);
  const posts = MockService.getPostsByModel(model.id);

  return (
    <Layout title={`${model.name} (@${model.slug}) - CreatorFlix`}>
      <div class="max-w-4xl mx-auto min-h-screen pb-20">
        

        {/* Profile Info */}
        <div class="px-4">
          <div class="relative flex justify-between items-end -mt-12 mb-4">
            {/* Avatar */}
            <div class="relative">
              <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#050505] overflow-hidden bg-gray-800">
                <img src={model.imageUrl} alt={model.name} class="w-full h-full object-cover" />
              </div>
              {model.isLive && (
                <div class="absolute bottom-1 right-1 bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#050505] uppercase">
                  Live
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div class="flex gap-2 mb-2">
              <button class="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                 📤
              </button>
              <button class="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                 ⭐
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <h1 class="text-xl md:text-2xl font-bold flex items-center gap-1">
              {model.name}
              <span class="text-primary text-sm">✓</span>
            </h1>
            <p class="text-gray-400 text-sm">@{model.slug}</p>
          </div>

          {/* Stats */}
          <div class="flex gap-6 mt-4 py-4 border-y border-white/5">
            <div class="text-center">
              <span class="block text-white font-bold">{model.postsCount}</span>
              <span class="text-xs text-gray-500 uppercase">Posts</span>
            </div>
            <div class="text-center">
              <span class="block text-white font-bold">{model.likesCount}</span>
              <span class="text-xs text-gray-500 uppercase">Curtidas</span>
            </div>
          </div>

          {/* About */}
          <div class="mt-4">
            <p class="text-gray-300 text-sm whitespace-pre-line">
              {model.description}
            </p>
          </div>

          {/* Subscribe CTA */}
          <div class="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-purple-600/20 border border-primary/30">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Assinatura Mensal</p>
                <p class="text-lg font-bold text-white">R$ 49,90 /mês</p>
              </div>
              <button class="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-bold transition-transform active:scale-95">
                ASSINAR AGORA
              </button>
            </div>
          </div>

          {/* Feed Tabs */}
          <div class="flex mt-8 border-b border-white/5">
            <button class="px-6 py-3 border-b-2 border-primary text-primary font-bold text-sm">POSTS</button>
            <button class="px-6 py-3 text-gray-500 font-bold text-sm hover:text-gray-300 transition-colors">MÍDIA</button>
          </div>

          {/* Posts Feed */}
          <div class="mt-4 space-y-6">
            {posts.map(post => (
              <div class="bg-[#111] rounded-xl overflow-hidden border border-white/5">
                {/* Post Header */}
                <div class="p-4 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                    <img src={model.imageUrl} alt={model.name} class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-sm font-bold flex items-center gap-1">
                      {model.name} <span class="text-primary text-[10px]">✓</span>
                    </p>
                    <p class="text-[10px] text-gray-500">{post.createdAt}</p>
                  </div>
                </div>

                {/* Post Content */}
                <div class="px-4 pb-3">
                  <p class="text-sm text-gray-300">{post.content}</p>
                </div>

                {/* Post Media */}
                <a href={`/posts/${post.id}`} class="block relative aspect-square md:aspect-video bg-gray-900 group">
                  <img src={post.mediaUrl} alt={post.title} class="w-full h-full object-cover" />
                  {post.isLocked && (
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                      <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-2xl">
                        🔒
                      </div>
                      <p class="text-white font-bold mb-2">Conteúdo Exclusivo</p>
                      <p class="text-gray-400 text-xs mb-4">Assine para desbloquear este e outros posts.</p>
                      <button class="bg-primary text-white text-xs px-4 py-2 rounded-full font-bold">ASSINAR</button>
                    </div>
                  )}
                  {!post.isLocked && (
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span class="bg-black/60 px-4 py-2 rounded-full text-xs font-bold">VER POST COMPLETO</span>
                    </div>
                  )}
                </a>

                {/* Post Footer */}
                <div class="p-4 flex items-center gap-6">
                  <button class="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                    <span>❤️</span> <span class="text-xs font-bold">{post.likes}</span>
                  </button>
                  <button class="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                    <span>💬</span> <span class="text-xs font-bold">{post.comments}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};