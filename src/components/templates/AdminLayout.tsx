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
      <body class="bg-[#050505] text-white font-sans min-h-screen antialiased selection:bg-primary selection:text-white">
        
        <AdminSidebar activePath={activePath} />

        {/* Content Area */}
        <main class="pl-64 min-h-screen">
            {/* Header */}
            <header class="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/95 backdrop-blur sticky top-0 z-40">
                <h1 class="font-bold text-gray-200">{title}</h1>
                <div class="flex items-center gap-4">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span class="text-xs text-gray-500 uppercase">System Stable</span>
                </div>
            </header>

            <div class="p-8">
                {children}
            </div>
        </main>
      </body>
    </html>
  );
};
