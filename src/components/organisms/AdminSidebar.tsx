import { FC } from 'hono/jsx';

export const AdminSidebar: FC<{ activePath?: string }> = ({ activePath = '/admin' }) => {
  const menuItems = [
    { section: 'Visão Geral', items: [
      { label: 'Dashboard', icon: '📊', path: '/admin' },
      { label: 'Live Monitor', icon: '🔴', path: '/admin/live' }
    ]},
    { section: 'Conteúdo', items: [
      { label: 'Modelos', icon: '👥', path: '/admin/models' },
      { label: 'Vídeos', icon: '🎬', path: '/admin/videos' },
      { label: 'Planos', icon: '💎', path: '/admin/plans' }
    ]},
    { section: 'Monetização', items: [
      { label: 'Gestão de Ads', icon: '📢', path: '/admin/ads' },
      { label: 'Financeiro', icon: '💰', path: '/admin/finance' }
    ]},
    { section: 'Sistema', items: [
      { label: 'Configurações', icon: '⚙️', path: '/admin/settings' },
      { label: 'Logs', icon: '📜', path: '/admin/logs' }
    ]}
  ];

  return (
    <aside class="fixed top-0 left-0 h-full w-64 bg-[#080808] border-r border-white/5 flex flex-col z-50">
      {/* Brand */}
      <div class="h-16 flex items-center px-6 border-b border-white/5">
        <span class="font-display text-xl text-white">Creator<span class="text-primary">Admin</span></span>
      </div>

      {/* Menu */}
      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
        {menuItems.map((group) => (
          <div>
            <h4 class="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{group.section}</h4>
            <ul class="space-y-1">
              {group.items.map((item) => {
                const isActive = activePath === item.path;
                return (
                  <li>
                    <a href={item.path} class={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      <span>{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Admin User */}
      <div class="p-4 border-t border-white/5 bg-[#0a0a0a]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-800 flex items-center justify-center font-bold text-white text-xs">AD</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate">Admin Master</p>
            <p class="text-xs text-green-500">● Online</p>
          </div>
          <a href="/logout" class="text-gray-500 hover:text-white">✕</a>
        </div>
      </div>
    </aside>
  );
};
