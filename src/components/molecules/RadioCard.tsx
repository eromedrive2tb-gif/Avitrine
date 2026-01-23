import { FC, PropsWithChildren } from 'hono/jsx';

interface RadioCardProps extends PropsWithChildren {
  name: string;
  value: string;
  label: string;
  description: string;
  checked?: boolean;
  icon?: any; // SVG Element
  badge?: string;
}

export const RadioCard: FC<RadioCardProps> = ({ name, value, label, description, checked, icon, badge, children }) => {
  return (
    <label class="cursor-pointer relative block radio-card-label h-full">
        <input type="radio" name={name} value={value} class="radio-card-input sr-only" checked={checked} />
        <div class="radio-card-content p-5 rounded-xl border border-white/10 bg-[#151515] transition-all h-full flex flex-col justify-between hover:border-white/30">
            <div class="flex items-center justify-between mb-3">
                <span class="font-bold text-white flex items-center gap-2">
                {icon}
                {label}
                </span>
            </div>
            <p class="text-xs text-gray-500 mb-2">{description}</p>
            {badge && (
                <span class="self-start px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded uppercase border border-green-500/30">
                    {badge}
                </span>
            )}
            {children}
        </div>
    </label>
  );
};