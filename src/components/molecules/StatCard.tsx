import { FC } from 'hono/jsx';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
}

export const StatCard: FC<StatCardProps> = ({ label, value, trend, isPositive }) => (
  <div class="p-6 rounded-xl bg-[#121212] border border-white/5 hover:border-primary/30 transition-colors">
    <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
    <div class="flex items-end justify-between">
      <h3 class="text-3xl font-bold text-white font-display">{value}</h3>
      <span class={`text-xs font-bold px-2 py-1 rounded ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {trend}
      </span>
    </div>
  </div>
);
