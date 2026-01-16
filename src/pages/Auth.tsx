import { FC } from 'hono/jsx';
import { Layout } from '../components/templates/Layout';
import { Button } from '../components/atoms/Button';

interface AuthPageProps {
  type: 'login' | 'register';
}

export const AuthPage: FC<AuthPageProps> = ({ type }) => {
  const isLogin = type === 'login';
  
  return (
    <Layout title={isLogin ? "Login - CreatorFlix" : "Criar Conta - CreatorFlix"}>
      <div class="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Background Blob */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#FF4006] to-[#A37CFF] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>

        <div class="relative z-10 w-full max-w-md p-8 rounded-[30px] bg-[#0E1136]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
            <p class="text-gray-400 text-sm">
              {isLogin ? 'Acesse sua conta para continuar' : 'Comece a aproveitar conteúdos exclusivos'}
            </p>
          </div>

          <form class="space-y-6" action={isLogin ? '/api/login' : '/api/register'} method="POST">
            {!isLogin && (
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-300 ml-1">Nome Completo</label>
                <input type="text" name="name" class="w-full px-5 py-3 rounded-[14px] bg-[#0B2641] border border-white/10 text-white focus:outline-none focus:border-[#A37CFF] transition-colors" placeholder="Seu nome" />
              </div>
            )}
            
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300 ml-1">Email</label>
              <input type="email" name="email" class="w-full px-5 py-3 rounded-[14px] bg-[#0B2641] border border-white/10 text-white focus:outline-none focus:border-[#A37CFF] transition-colors" placeholder="seu@email.com" />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300 ml-1">Senha</label>
              <input type="password" name="password" class="w-full px-5 py-3 rounded-[14px] bg-[#0B2641] border border-white/10 text-white focus:outline-none focus:border-[#A37CFF] transition-colors" placeholder="••••••••" />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div class="mt-8 text-center text-sm text-gray-400">
            {isLogin ? 'Ainda não tem uma conta? ' : 'Já tem uma conta? '}
            <a href={isLogin ? '/register' : '/login'} class="text-[#A37CFF] font-semibold hover:underline">
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
