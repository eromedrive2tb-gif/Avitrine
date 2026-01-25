import { FC, PropsWithChildren } from 'hono/jsx';

interface AlertProps extends PropsWithChildren {
  variant?: 'success' | 'error' | 'info';
  title?: string;
  className?: string;
  id?: string;
}

export const Alert: FC<AlertProps> = ({ children, variant = 'info', title, className = '', id }) => {
  const configs = {
    success: {
      container: "bg-green-500/10 border-green-500/20 text-green-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      )
    },
    error: {
      container: "bg-red-500/10 border-red-500/20 text-red-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      )
    },
    info: {
      container: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      )
    }
  };

  const config = configs[variant];

  return (
    <div id={id} class={`flex gap-3 p-4 rounded-xl border ${config.container} ${className} animate-[fadeIn_0.3s]`}>
      <div class="mt-0.5">
        {config.icon}
      </div>
      <div class="flex-1">
        {title && <h4 class="text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>}
        <div class="text-[11px] font-medium leading-relaxed opacity-90">
          {children}
        </div>
      </div>
    </div>
  );
};
