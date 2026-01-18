import { FC } from 'hono/jsx';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { ProfileStats } from '../molecules/ProfileStats';
import { Button } from '../atoms/Button';

interface ProfileSummaryProps {
  model: any;
  displayName: string;
}

export const ProfileSummary: FC<ProfileSummaryProps> = ({ model, displayName }) => {
  return (
    <div class="relative px-6 -mt-32 z-10 max-w-5xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end gap-6">
        {/* Avatar Profile */}
        <div class="relative shrink-0 group">
          <div class="rounded-3xl border-[6px] border-[#050505] overflow-hidden bg-gray-900 shadow-2xl transition-transform group-hover:scale-[1.02]">
            <Avatar src={model.thumbnailUrl || '/static/img/placeholder_model.jpg'} alt={displayName} size="lg" className="w-32 h-32 md:w-44 md:h-44" />
          </div>
          {model.isLive && (
             <div class="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <Badge variant="live">AO VIVO</Badge>
             </div>
          )}
        </div>

        {/* Basic Info */}
        <div class="flex-1 pb-2">
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
              {displayName}
            </h1>
            <Badge variant="primary">✓</Badge>
          </div>
          <p class="text-white/60 font-medium text-lg">@{model.folderName}</p>
          
          <ProfileStats postCount={model.postCount} likesCount={model.likesCount} />
        </div>

        {/* Main Action Call */}
        <div class="w-full md:w-auto pb-2">
            <Button variant="primary" className="w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 active:scale-95 uppercase tracking-widest">
              Assinar Acesso Total
            </Button>
        </div>
      </div>
    </div>
  );
};
