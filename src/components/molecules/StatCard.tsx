import { FC } from 'hono/jsx';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
}

export const StatCard: FC<StatCardProps> = ({ label, value, trend, isPositive }) => (
  <div class="p-6 rounded-2xl bg-surface/40 border border-primary/10 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_rgba(138,43,226,0.3)] transition-all duration-500 group relative overflow-hidden backdrop-blur-sm">
    {/* Subtle Glow Effect on Hover */}
    <div class="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
    
    <p class="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4 font-bold opacity-80">{label}</p>
    
    <div class="flex items-end justify-between relative z-10">
      <div>
        <h3 class="text-3xl font-display text-white tracking-wide group-hover:text-primary transition-colors duration-500">{value}</h3>
      </div>
      
      <div class={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
        isPositive 
          ? 'bg-green-500/5 border-green-500/20 text-green-500' 
          : 'bg-red-500/5 border-red-500/20 text-red-500'
      }`}>
        <span class="text-[10px] font-black tracking-tighter uppercase">{trend}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class={isPositive ? '' : 'rotate-180'}>
          <path d="m19 12-7-7-7 7"/><path d="M12 19V5"/>
        </svg>
      </div>
    </div>

    {/* Bottom Accent Line */}
    <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-full transition-all duration-700"></div>
  </div>
);