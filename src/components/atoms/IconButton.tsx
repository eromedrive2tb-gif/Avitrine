import { FC, PropsWithChildren } from 'hono/jsx';

interface IconButtonProps extends PropsWithChildren {
  onClick?: string; // Inline JS handler
  className?: string;
}

export const IconButton: FC<IconButtonProps> = ({ children, onClick, className = '' }) => {
  return (
    <button 
      onclick={onClick} 
      class={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all ${className}`}
    >
      {children}
    </button>
  );
};
