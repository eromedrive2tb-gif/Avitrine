import { FC } from 'hono/jsx';
import { ProfileHeaderActions } from '../molecules/ProfileHeaderActions';

interface ProfileHeroProps {
  bannerUrl: string;
}

export const ProfileHero: FC<ProfileHeroProps> = ({ bannerUrl }) => {
  return (
    <div class="relative h-[40vh] md:h-[55vh] w-full overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src={bannerUrl} 
          alt="" 
          class="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
      </div>
      
      <ProfileHeaderActions />
    </div>
  );
};
