import { FC, PropsWithChildren } from 'hono/jsx';

interface ButtonProps extends PropsWithChildren {
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
  onClick?: string; // For client-side interactions if needed, though mostly server-rendered/link
  href?: string;
}

export const Button: FC<ButtonProps> = ({ children, variant = 'primary', className = '', type = 'button', href, onClick }) => {
  const baseStyles = "px-6 py-3 rounded-[20px] font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#FF4006] to-[#A37CFF] text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border-none",
    outline: "bg-transparent border-2 border-[#A37CFF] text-white hover:bg-[#A37CFF]/10",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} class={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} class={combinedClassName} onclick={onClick}>
      {children}
    </button>
  );
};
