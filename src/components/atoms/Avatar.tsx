import { FC } from 'hono/jsx';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: "w-11 h-11 rounded-xl",
    md: "w-20 h-20 rounded-2xl",
    lg: "w-32 h-32 md:w-44 md:h-44 rounded-3xl", 
    xl: "w-full h-full"
  };

  return (
    <div class={`overflow-hidden object-cover ${sizes[size]} ${className}`}>
      <img src={src} alt={alt} class="w-full h-full object-cover" />
    </div>
  );
};
