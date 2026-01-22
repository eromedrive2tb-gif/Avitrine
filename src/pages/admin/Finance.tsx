import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';

interface PaymentGateway {
  id: number;
  name: string;
  publicKey: string | null;
  secretKey: string | null;
  isActive: boolean;
}

interface AdminFinanceProps {
  gateways: PaymentGateway[];
  activeGatewayName: string;
  success?: boolean;
}

export const AdminFinance: FC<AdminFinanceProps> = ({ gateways, activeGatewayName, success }) => {
  const diasGateway = gateways.find(g => g.name === 'Dias Marketplace');
  const jungleGateway = gateways.find(g => g.name === 'JunglePay');

  return (
    <AdminLayout title="Financeiro" activePath="/admin/finance">
      <div class="mb-8">
         <h1 class="text-3xl font-bold mb-2">Configuração de Pagamentos</h1>
         <p class="text-gray-400">Gerencie os gateways de pagamento e chaves de API.</p>
      </div>

      {success && (
        <div class="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
          Configurações salvas com sucesso!
        </div>
      )}

      <div class="grid md:grid-cols-2 gap-6">
        {/* Gateway Selection Card */}
        <div class="p-6 rounded-xl bg-surface border border-white/5 h-fit">
          <h3 class="font-bold text-xl text-white mb-4">Gateway Ativo</h3>
          <form action="/api/admin/finance/gateway" method="POST">
            <div class="mb-4">
              <label class="block text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
                Selecione o Provedor
              </label>
              <select 
                name="gatewayName" 
                class="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-white focus:border-primary focus:outline-none transition-colors appearance-none"
              >
                <option value="Dias Marketplace" selected={activeGatewayName === 'Dias Marketplace'}>
                  Dias Marketplace (Externo)
                </option>
                <option value="JunglePay" selected={activeGatewayName === 'JunglePay'}>
                  JunglePay (Checkout Interno)
                </option>
              </select>
            </div>
            <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-bold text-sm transition-all">
              SALVAR PREFERÊNCIA
            </button>
          </form>
        </div>

        {/* JunglePay Configuration Card - Only show inputs if we want to edit them, regardless of active state usually, but let's show them always or conditional? 
            Requirement says: "Se JunglePay for selecionada, exibir campos". 
            Let's show the config card always but maybe highlight if active.
        */}
        <div class={`p-6 rounded-xl bg-surface border ${activeGatewayName === 'JunglePay' ? 'border-primary/50' : 'border-white/5'} relative transition-colors`}>
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-xl text-white">Configuração JunglePay</h3>
            {activeGatewayName === 'JunglePay' && (
              <span class="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                ATIVO
              </span>
            )}
          </div>
          
          <form action="/api/admin/finance/junglepay" method="POST" class="space-y-4">
            <input type="hidden" name="id" value={jungleGateway?.id || ''} />
            
            <div>
              <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Public Key (PK)</label>
              <input 
                type="text" 
                name="publicKey" 
                value={jungleGateway?.publicKey || ''} 
                class="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:border-primary focus:outline-none transition-colors"
                placeholder="pk_live_..."
              />
            </div>

            <div>
              <label class="block text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Secret Key (SK)</label>
              <input 
                type="password" 
                name="secretKey" 
                value={jungleGateway?.secretKey || ''} 
                class="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-white font-mono text-sm focus:border-primary focus:outline-none transition-colors"
                placeholder="sk_live_..."
              />
            </div>

            <div class="pt-4 border-t border-white/5">
               <button type="submit" class="w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-2 rounded-lg font-bold text-sm transition-all">
                  ATUALIZAR CHAVES
               </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
