import { FC, PropsWithChildren } from 'hono/jsx';
import { Navbar } from '../organisms/Navbar';

interface LayoutProps extends PropsWithChildren {
  title?: string;
  isAdmin?: boolean;
}

export const Layout: FC<LayoutProps> = ({ children, title = "CreatorFlix - Premium Content", isAdmin = false }) => {
  return (
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      </head>
      <body class="bg-[#0B2641] text-white font-sans min-h-screen flex flex-col antialiased selection:bg-[#A37CFF] selection:text-white">
        <Navbar isAdmin={isAdmin} />
        
        <main class="flex-grow pt-20">
          {children}
        </main>

        <footer class="bg-[#0E1136] border-t border-white/5 py-12 mt-20">
          <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 class="text-xl font-bold text-white mb-4">Creator<span class="text-[#A37CFF]">Flix</span></h4>
              <p class="text-gray-400 text-sm">
                A plataforma premium para criadores de conteúdo e fãs exclusivos.
              </p>
            </div>
            <div>
              <h5 class="font-semibold mb-4 text-white">Plataforma</h5>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><a href="/models" class="hover:text-[#A37CFF]">Modelos</a></li>
                <li><a href="/plans" class="hover:text-[#A37CFF]">Planos</a></li>
                <li><a href="/login" class="hover:text-[#A37CFF]">Login</a></li>
              </ul>
            </div>
            <div>
              <h5 class="font-semibold mb-4 text-white">Legal</h5>
              <ul class="space-y-2 text-sm text-gray-400">
                <li><a href="#" class="hover:text-[#A37CFF]">Termos de Uso</a></li>
                <li><a href="#" class="hover:text-[#A37CFF]">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div class="text-center mt-12 pt-8 border-t border-white/5 text-xs text-gray-500">
            © 2024 CreatorFlix. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
};
