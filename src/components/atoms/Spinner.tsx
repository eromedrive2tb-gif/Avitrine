import { FC } from 'hono/jsx';

export const Spinner: FC = () => (
  <div class="loader" style="border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top: 3px solid #8A2BE2; width: 24px; height: 24px; animation: spin 1s linear infinite;"></div>
);