import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';

interface AdminSupportProps {
  contacts: {
    id: number;
    platform: string;
    url: string;
    isActive: boolean | null;
  }[];
  message?: string;
  error?: string;
}

export const AdminSupport: FC<AdminSupportProps> = ({ contacts, message, error }) => {
  return (
    <AdminLayout title="Suporte">
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-white">Configuração de Suporte</h1>
        </div>

        {message && (
          <div class="bg-green-500/20 text-green-400 p-4 rounded-lg border border-green-500/30">
            {message}
          </div>
        )}

        {error && (
          <div class="bg-red-500/20 text-red-400 p-4 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}

        <div class="bg-[#121212] border border-white/5 rounded-xl p-6">
            <h2 class="text-xl font-bold text-white mb-4">Canais de Atendimento</h2>
            <p class="text-gray-400 mb-6 text-sm">Defina os links para WhatsApp e Telegram. Deixe em branco para desativar.</p>

            <form action="/admin/support/update" method="post" class="space-y-6">
                {contacts.map((contact) => (
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-300 capitalize">
                            {contact.platform}
                        </label>
                        <div class="flex gap-4">
                            <input 
                                type="hidden" 
                                name={`contacts[${contact.id}][id]`} 
                                value={contact.id} 
                            />
                            <div class="flex-1 relative">
                                <span class="absolute left-3 top-3 text-gray-500">
                                    {contact.platform === 'whatsapp' ? 'wa.me/' : 't.me/'}
                                </span>
                                <input 
                                    type="text" 
                                    name={`contacts[${contact.id}][url]`} 
                                    value={contact.url.replace('https://wa.me/', '').replace('https://t.me/', '')}
                                    class="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-16 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder={contact.platform === 'whatsapp' ? '5511999999999' : 'username'}
                                />
                            </div>
                            <div class="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    name={`contacts[${contact.id}][isActive]`} 
                                    checked={contact.isActive || false}
                                    value="true"
                                    class="w-5 h-5 rounded bg-black/50 border-white/10 text-primary focus:ring-primary"
                                />
                                <span class="text-sm text-gray-400">Ativo</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                <div class="pt-4 border-t border-white/5 flex justify-end">
                    <button type="submit" class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
      </div>
    </AdminLayout>
  );
};
