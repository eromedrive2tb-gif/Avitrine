import { FC, PropsWithChildren } from 'hono/jsx';
import { cx } from 'hono/jsx/dom/css';

interface ButtonProps extends PropsWithChildren {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: string; // HTMX support or inline JS
}

export const Button: FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  href, 
  className = '', 
  type = 'button',
  onClick
}) => {
  const baseStyles = "inline-flex items-center justify-center font-display uppercase tracking-widest transition-all duration-300 rounded-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 hover:shadow-neon-purple hover:-translate-y-0.5 border border-transparent",
    secondary: "bg-surface border border-white/10 text-white hover:border-primary/50 hover:text-primary hover:shadow-neon-purple hover:-translate-y-0.5",
    outline: "bg-transparent border border-white/30 text-white hover:border-white hover:bg-white/5",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  const sizes = "text-sm px-6 py-3";

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes} ${className}`;

  if (href) {
    return <a href={href} class={combinedClasses}>{children}</a>;
  }

  return (
    <button type={type} class={combinedClasses} onclick={onClick}>
      {children}
    </button>
  );
};