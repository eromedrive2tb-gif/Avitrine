import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';

interface AuthPageProps {
  type: 'login' | 'register';
}

export const AuthPage: FC<AuthPageProps> = ({ type }) => {
  const isLogin = type === 'login';
  
  return (
    <Layout title={isLogin ? "Login - CreatorFlix" : "Acesso VIP - CreatorFlix"}>
      <div class="min-h-screen flex">
        
        {/* Left Side: Visual/Tease (Hidden on Mobile) */}
        <div class="hidden lg:flex w-1/2 relative bg-black overflow-hidden items-center justify-center">
          <div class="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80" 
               class="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
             />
             <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          </div>
          
          <div class="relative z-10 p-12 max-w-lg">
             <span class="inline-block px-3 py-1 mb-6 border border-[#FFD700] text-[#FFD700] text-xs font-bold uppercase tracking-[0.2em] rounded">
                Acesso Premium
             </span>
             <h2 class="text-6xl font-display text-white mb-6 leading-none">
                Junte-se à <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Elite</span>
             </h2>
             <ul class="space-y-4 text-gray-300 font-light text-lg mb-12">
                <li class="flex items-center gap-3"><span class="text-primary">✓</span> 50,000+ Vídeos Exclusivos</li>
                <li class="flex items-center gap-3"><span class="text-primary">✓</span> Lives Privadas 24/7</li>
                <li class="flex items-center gap-3"><span class="text-primary">✓</span> Qualidade 4K Ultra HD</li>
             </ul>

             {/* Native Ad Block in Visual Side */}
             <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors">
                <div class="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-xl">
                   $
                </div>
                <div>
                   <h4 class="font-bold text-white text-sm">Parceiro Oficial: BetWin</h4>
                   <p class="text-xs text-gray-400">Cadastre-se hoje e ganhe 50 rodadas grátis.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form & Ads */}
        <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 bg-[#050505] relative">
          
          {/* Mobile Background (Absolute) */}
          <div class="absolute inset-0 lg:hidden z-0">
             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" class="w-full h-full object-cover opacity-20" />
             <div class="absolute inset-0 bg-[#050505]/90"></div>
          </div>

          <div class="w-full max-w-md relative z-10">
            {/* Header */}
            <div class="text-center mb-10">
              <a href="/" class="inline-block font-display text-3xl text-white mb-2">Creator<span class="text-primary">Flix</span></a>
              <h1 class="text-2xl font-bold text-white">{isLogin ? 'Bem-vindo de volta' : 'Desbloqueie seu Acesso'}</h1>
              <p class="text-gray-400 text-sm mt-2">
                {isLogin ? 'Entre para assistir suas criadoras favoritas.' : 'Crie sua conta gratuita em menos de 1 minuto.'}
              </p>
            </div>

            {/* Auth Form */}
            <form class="space-y-5" action={isLogin ? '/api/login' : '/api/register'} method="POST">
              {!isLogin && (
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome de Usuário</label>
                  <div class="relative group">
                    <input type="text" name="name" class="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all peer" placeholder="Escolha um nome único" />
                    <div class="absolute inset-0 border border-transparent peer-focus:border-primary/50 rounded pointer-events-none animate-pulse"></div>
                  </div>
                </div>
              )}
              
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <input type="email" name="email" class="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="seu@email.com" />
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Senha</label>
                  {isLogin && <a href="#" class="text-xs text-primary hover:text-white transition-colors">Esqueceu?</a>}
                </div>
                <input type="password" name="password" class="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="••••••••" />
              </div>

              {!isLogin && (
                  <div class="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded">
                      <input type="checkbox" checked class="mt-1 accent-primary" />
                      <p class="text-xs text-gray-400">
                          Eu concordo com os Termos e confirmo que tenho <span class="text-white font-bold">18 anos ou mais</span>.
                      </p>
                  </div>
              )}

              <Button type="submit" variant="primary" className="w-full !py-4 !text-base shadow-neon-purple font-display tracking-widest">
                {isLogin ? 'ENTRAR AGORA' : 'CRIAR CONTA GRÁTIS'}
              </Button>
            </form>

            {/* Bottom Links */}
            <div class="mt-8 text-center border-t border-white/5 pt-6">
              <p class="text-sm text-gray-400">
                {isLogin ? 'Novo por aqui? ' : 'Já é membro? '}
                <a href={isLogin ? '/register' : '/login'} class="text-primary font-bold hover:text-white uppercase tracking-wide ml-1">
                  {isLogin ? 'Assinar VIP' : 'Fazer Login'}
                </a>
              </p>
            </div>

            {/* AD BANNER (Bottom of Form) */}
            <div class="mt-8">
               <a href="#" class="block relative rounded-lg overflow-hidden border border-[#FFD700]/30 group">
                  <div class="bg-gradient-to-r from-[#1a1a1a] to-black p-4 flex items-center justify-between">
                     <div>
                        <span class="text-[10px] text-[#FFD700] border border-[#FFD700] px-1 font-bold uppercase">Parceiro</span>
                        <h5 class="text-white font-bold mt-1">Cassino Royalle</h5>
                        <p class="text-xs text-gray-400">Bônus de boas-vindas ativo.</p>
                     </div>
                     <span class="text-2xl">🎰</span>
                  </div>
                  <div class="h-1 w-full bg-[#FFD700]/20">
                     <div class="h-full bg-[#FFD700] w-2/3"></div>
                  </div>
               </a>
            </div>

            {/* Trust Badges */}
            <div class="mt-8 flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                <span class="text-xs text-white border border-white px-2 py-1 rounded">SSL SECURE</span>
                <span class="text-xs text-white border border-white px-2 py-1 rounded">18+ ONLY</span>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};