import { FC, PropsWithChildren } from 'hono/jsx';

interface BadgeProps extends PropsWithChildren {
  variant?: 'live' | 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'secondary';
  className?: string;
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    live: "w-fit bg-red-600 text-[10px] font-black px-3 py-1 rounded-full border-2 border-[#050505] uppercase tracking-tighter shadow-lg animate-pulse",
    primary: "w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] shadow-[0_0_15px_rgba(255,0,0,0.4)]",
    default: "w-fit bg-white/5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
    success: "w-fit bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded text-[10px] font-bold border border-green-500/20 uppercase tracking-wider",
    warning: "w-fit bg-yellow-500/20 text-yellow-400 px-2.5 py-0.5 rounded text-[10px] font-bold border border-yellow-500/20 uppercase tracking-wider",
    danger: "w-fit bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded text-[10px] font-bold border border-red-500/20 uppercase tracking-wider",
    secondary: "w-fit bg-gray-500/20 text-gray-400 px-2.5 py-0.5 rounded text-[10px] font-bold border border-gray-500/20 uppercase tracking-wider"
  };

  return (
    <div class={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
