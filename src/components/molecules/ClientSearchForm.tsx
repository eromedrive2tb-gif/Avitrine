import { FC } from 'hono/jsx';
import { SearchIcon } from '../atoms/SearchIcon';

interface ClientSearchFormProps {
  value: string;
}

export const ClientSearchForm: FC<ClientSearchFormProps> = ({ value }) => (
  <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <form method="get" action="/admin/clients" class="relative flex-1 max-w-md">
      <input 
        type="text" 
        name="search"
        placeholder="Buscar por nome ou email..." 
        value={value}
        class="w-full bg-surface border border-white/10 rounded px-4 py-2 text-xs text-white focus:border-primary focus:outline-none transition-all"
      />
      <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
        <SearchIcon />
      </div>
    </form>
  </div>
);
