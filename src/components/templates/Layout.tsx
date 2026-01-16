import { FC, PropsWithChildren } from 'hono/jsx';
import { Navbar } from '../organisms/Navbar';
import { Sidebar } from '../organisms/Sidebar';

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
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <style dangerouslySetInnerHTML={{ __html: `
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8A2BE2; }
        `}} />
      </head>
      <body class="bg-[#050505] text-white font-sans min-h-screen antialiased selection:bg-primary selection:text-white overflow-x-hidden">
        
        <Navbar isAdmin={isAdmin} />
        
        <Sidebar />

        {/* Main Content Area - Pushed by Sidebar on Desktop */}
        <main class="pt-16 md:pl-64 min-h-screen transition-all duration-300">
          {children}
          
          <footer class="border-t border-white/5 py-8 mt-12 px-6 text-center text-gray-600 text-xs">
             <p>&copy; 2024 CreatorFlix Inc. All rights reserved. 18+ Only.</p>
          </footer>
        </main>

      </body>
    </html>
  );
};