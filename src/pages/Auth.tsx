import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';
import { AuthHero } from '../components/organisms/AuthHero';
import type { Ad } from '../services/ads';

interface AuthPageProps {
  type: 'login' | 'register';
  ads?: Ad[];
}

export const AuthPage: FC<AuthPageProps> = ({ type, ads = [] }) => {
  const isLogin = type === 'login';
  
  // Get first ad
  const adData = ads[0];
  
  return (
    <Layout title={isLogin ? "Login - CreatorFlix" : "Acesso VIP - CreatorFlix"}>
      <div class="min-h-screen flex">
        
        <AuthHero />

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
            <form class="space-y-5" action={isLogin ? '/api/login' : '/api/register'} method="post">
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

            {/* AD BANNER (Bottom of Form) - Dynamic */}
            {adData && (
              <div class="mt-8">
                 <a 
                   href={adData.link} 
                   class="block relative rounded-lg overflow-hidden border border-[#FFD700]/30 group"
                   onclick={`fetch('/api/ads/${adData.id}/click', {method:'post'})`}
                 >
                    <div class="bg-gradient-to-r from-[#1a1a1a] to-black p-4 flex items-center justify-between">
                       <div>
                          <span class="text-[10px] text-[#FFD700] border border-[#FFD700] px-1 font-bold uppercase">Parceiro</span>
                          <h5 class="text-white font-bold mt-1">{adData.title}</h5>
                          <p class="text-xs text-gray-400">{adData.subtitle || adData.ctaText}</p>
                       </div>
                       {adData.imageUrl ? (
                         <img src={adData.imageUrl} class="w-12 h-12 rounded object-cover" />
                       ) : (
                         <span class="text-2xl">🎰</span>
                       )}
                    </div>
                    <div class="h-1 w-full bg-[#FFD700]/20">
                       <div class="h-full bg-[#FFD700] w-2/3"></div>
                    </div>
                 </a>
              </div>
            )}

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
