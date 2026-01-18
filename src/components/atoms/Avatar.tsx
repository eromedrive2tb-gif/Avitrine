import { FC } from 'hono/jsx';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: "w-11 h-11",
    md: "w-20 h-20",
    lg: "w-32 h-32 md:w-44 md:h-44", 
    xl: "w-full h-full"
  };

  return (
    <div class={`relative group ${sizes[size]} ${className}`}>
      {/* Glow effect */}
      <div class="absolute -inset-0.5 bg-gradient-to-tr from-[#8A2BE2] to-[#00F0FF] rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300"></div>
      
      <div class={`relative overflow-hidden object-cover w-full h-full rounded-full ring-2 ring-[#121212] ${className}`}>
        <img src={src} alt={alt} class="w-full h-full object-cover rounded-full" />
      </div>
    </div>
  );
};