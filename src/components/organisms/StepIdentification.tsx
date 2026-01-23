import { FC } from 'hono/jsx';
import { Input } from '../atoms/Input';

interface StepIdentificationProps {
  user?: {
      name?: string;
      email?: string;
  };
}

export const StepIdentification: FC<StepIdentificationProps> = ({ user }) => {
  const isEmailReadOnly = !!user?.email;

  return (
    <div id="step-1" class="step-content active">
        <div class="glass-card p-8 rounded-2xl border border-white/10">
            <div class="mb-8 border-b border-white/5 pb-4">
                <h2 class="text-3xl font-display text-white mb-1">Quem irá assistir?</h2>
                <p class="text-gray-400 text-sm">Informe seus dados para criar seu acesso exclusivo.</p>
            </div>
            
            <div class="space-y-5">
                <Input 
                  id="email" 
                  name="email" 
                  label="E-mail de Acesso" 
                  placeholder="seu@email.com" 
                  type="email" 
                  value={user?.email} 
                  required 
                  readOnly={isEmailReadOnly}
                />
                <Input id="name" name="name" label="Nome Completo" placeholder="Nome impresso no cartão" value={user?.name} required />
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input id="cpf" name="cpf" label="CPF" placeholder="000.000.000-00" required />
                    <Input id="phone" name="phone" label="Whatsapp" placeholder="(00) 00000-0000" type="tel" required />
                </div>
            </div>

            <div class="mt-10 flex justify-end">
                <button type="button" onclick="goToStep(2)" class="group bg-primary text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 hover:shadow-neon-purple transition-all flex items-center gap-3">
                    Próximo Passo
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
            </div>
        </div>
    </div>
  );
};