import { FC } from 'hono/jsx';

export const AdminSidebar: FC<{ activePath?: string }> = ({ activePath = '/admin' }) => {
  const menuItems = [
    { section: 'VISÃO GERAL', items: [
      { label: 'Dashboard', path: '/admin', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
      { label: 'Live Monitor', path: '/admin/live', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/><circle cx="12" cy="12" r="10"/></svg> }
    ]},
    { section: 'CONTEÚDO', items: [
      { label: 'Modelos', path: '/admin/models', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { label: 'Whitelabel (S3)', path: '/admin/whitelabel', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19.5h-10A4.5 4.5 0 0 1 3 15a4.5 4.5 0 0 1 4.5-4.5H9a5 5 0 0 1 9.5-2.5 5 5 0 0 1 4 4.5V15a4.5 4.5 0 0 1-4.5 4.5Z"/></svg> },
      { label: 'Vídeos', path: '/admin/videos', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg> },
      { label: 'Planos', path: '/admin/plans', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 12 6-9 6 9a6 6 0 1 1-12 0Z"/></svg> }
    ]},
    { section: 'MONETIZAÇÃO', items: [
      { label: 'Ads', path: '/admin/ads', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M9 10h6"/><path d="M5 14h14"/><path d="M12 2v4"/></svg> },
      { label: 'Financeiro', path: '/admin/finance', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
    ]},
    { section: 'SISTEMA', items: [
      { label: 'Configurações', path: '/admin/settings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> },
      { label: 'Logs', path: '/admin/logs', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg> }
    ]}
  ];

  return (
    <aside class="fixed top-0 left-0 h-full w-[240px] bg-void border-r border-primary/40 flex flex-col z-50 shadow-[10px_0_40px_-15px_rgba(138,43,226,0.4)]">
      
      {/* Brand - Divisória primária reforçada */}
      <div class="h-16 flex items-center px-6 bg-void border-b border-primary/30">
        <span class="font-display text-xl text-white tracking-widest uppercase">
          CREATOR<span class="text-primary ml-1.5 shadow-neon-purple">ADMIN</span>
        </span>
      </div>

      {/* Menu Navigation */}
      <nav class="flex-1 overflow-y-auto py-4 px-4 space-y-6 custom-scrollbar">
        {menuItems.map((group) => (
          <div class="space-y-2">
            <h4 class="px-3 font-display text-[10px] text-gray-500 tracking-[0.2em] uppercase opacity-70">
              {group.section}
            </h4>
            <ul class="space-y-1">
              {group.items.map((item) => {
                const isActive = activePath === item.path;
                return (
                  <li>
                    <a 
                      href={item.path} 
                      class={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-300 relative
                        ${isActive 
                          ? 'bg-primary/15 text-white shadow-neon-purple border border-primary/60' 
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent'}
                      `}
                    >
                      {isActive && <div class="absolute left-0 w-1.5 h-5 bg-primary rounded-r-full shadow-neon-purple"></div>}
                      
                      <span class={`${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary'} transition-colors duration-300`}>
                        {item.icon}
                      </span>
                      <span class={`font-body tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            {/* Divisória interna sutil entre seções */}
            <div class="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-auto mt-4"></div>
          </div>
        ))}
      </nav>

      {/* Admin User Card - Removido borda branca e ajustado contraste */}
      <div class="p-4 bg-void border-t border-primary/30">
        <div class="p-3 rounded-xl bg-surface border border-primary/20 flex items-center gap-3 hover:border-primary/50 transition-all duration-500 group shadow-lg">
          <div class="relative flex-shrink-0">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center font-display text-base text-white shadow-lg">
              AD
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-surface shadow-[0_0_8px_#22c55e]"></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <p class="font-display text-sm text-white tracking-wide truncate mb-0.5">ADMIN MASTER</p>
            <p class="font-body text-[9px] text-primary/80 uppercase font-black tracking-widest leading-none">Online</p>
          </div>

          <a href="/logout" class="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </a>
        </div>
      </div>
    </aside>
  );
};