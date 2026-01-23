import { FC } from 'hono/jsx';

interface InputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
}

export const Input: FC<InputProps> = ({ id, name, label, placeholder, type = "text", value, required, readOnly, className = "" }) => {
  return (
    <div class={className}>
      <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" for={id}>
        {label}
      </label>
      <input 
        type={type} 
        id={id} 
        name={name} 
        value={value || ''} 
        class={`input-dark w-full px-5 py-4 rounded-xl text-base bg-[#111] border border-white/10 text-white focus:border-primary focus:shadow-neon-purple transition-all outline-none ${readOnly ? 'opacity-60 cursor-not-allowed border-dashed' : ''}`} 
        placeholder={placeholder} 
        required={required} 
        readonly={readOnly}
      />
    </div>
  );
};