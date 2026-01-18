import { FC, PropsWithChildren } from 'hono/jsx';

interface BadgeProps extends PropsWithChildren {
  variant?: 'live' | 'primary' | 'default';
  className?: string;
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    live: "bg-red-600 text-[10px] font-black px-3 py-1 rounded-full border-2 border-[#050505] uppercase tracking-tighter shadow-lg animate-pulse",
    primary: "w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] shadow-[0_0_15px_rgba(255,0,0,0.4)]",
    default: "bg-white/5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest"
  };

  return (
    <div class={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
