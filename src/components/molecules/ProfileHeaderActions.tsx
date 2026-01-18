import { FC } from 'hono/jsx';
import { IconButton } from '../atoms/IconButton';

export const ProfileHeaderActions: FC = () => {
  return (
    <div class="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
      <IconButton onClick="history.back()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </IconButton>
      <div class="flex gap-3">
        <IconButton>📤</IconButton>
        <IconButton className="text-primary">★</IconButton>
      </div>
    </div>
  );
};
