import { FC, PropsWithChildren } from 'hono/jsx';
import { AdminSidebar } from '../organisms/AdminSidebar';

interface AdminLayoutProps extends PropsWithChildren {
  title?: string;
  activePath?: string;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ children, title = "Admin Panel", activePath }) => {
  return (
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      </head>
      <body class="bg-[#222222] text-white font-body min-h-screen antialiased selection:bg-primary selection:text-white">
        
        <AdminSidebar activePath={activePath} />

        {/* Content Area */}
        <main class="pl-[240px] min-h-screen flex flex-col relative">
            {/* Background Texture/Gradient for Depth */}
            <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Header - Mais elevado e com glassmorphism sutil */}
            <header class="h-16 border-b border-primary/20 flex items-center justify-between px-8 bg-[#000000] sticky top-0 z-40">
                <div class="flex items-center gap-4">
                  <div class="h-8 w-1 bg-primary rounded-full shadow-neon-purple"></div>
                  <h1 class="font-display text-2xl tracking-wide text-white">{title}</h1>
                </div>
                
                <div class="flex items-center gap-6">
                    <div class="flex flex-col items-end">
                      <div class="flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Online</span>
                      </div>
                      <span class="text-[9px] text-primary/60 font-medium">v2.4.0-stable</span>
                    </div>

                    <div class="h-8 w-px bg-primary/20"></div>

                    <button class="p-2 rounded-lg bg-surface border border-primary/20 hover:border-primary/50 transition-all group">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-primary"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    </button>
                </div>
            </header>

            {/* Main Content Container */}
            <div class="p-8 relative z-10 flex-1">
                {children}
            </div>
        </main>
      </body>
    </html>
  );
};