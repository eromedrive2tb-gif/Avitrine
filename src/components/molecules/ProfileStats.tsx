import { FC } from 'hono/jsx';

interface ProfileStatsProps {
  postCount: number;
  likesCount: number;
}

export const ProfileStats: FC<ProfileStatsProps> = ({ postCount, likesCount }) => {
  return (
    <div class="flex gap-6 mt-4">
      <div class="flex flex-col">
        <span class="text-xl font-black">{postCount || 0}</span>
        <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Posts</span>
      </div>
      <div class="flex flex-col">
        <span class="text-xl font-black">{likesCount || 0}</span>
        <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Fãs</span>
      </div>
    </div>
  );
};
