import { FC } from 'hono/jsx';

export const addPlanModalScripts = {
  open: (userId: number) => `
    const modal = document.getElementById('add-plan-modal');
    const content = document.getElementById('modal-add-plan-content');
    const alertContainer = document.getElementById('add-plan-alert-container');
        
    if (alertContainer) {
      alertContainer.classList.add('hidden');
      alertContainer.innerHTML = '';
    }
        
    content.innerHTML = \`
      <div class="space-y-4 animate-pulse">
        \${Array(3).fill(0).map(() => \`
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="flex justify-between items-center">
              <div class="space-y-2">
                <div class="h-4 w-32 bg-white/10 rounded"></div>
                <div class="h-3 w-20 bg-white/10 rounded"></div>
              </div>
              <div class="h-8 w-24 bg-white/10 rounded"></div>
            </div>
          </div>
        \`).join('')}
      </div>
    \`;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.querySelector('.modal-box').classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
  `,
  close: `
    const modal = document.getElementById('add-plan-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-box').classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  `
};

export const AddPlanButton: FC<{ userId: number }> = ({ userId }) => (
  <button 
    hx-get={`/admin/clients/${userId}/add-plan`}
    hx-target="#modal-add-plan-content"
    onclick={addPlanModalScripts.open(userId)}
    class="text-[10px] font-bold text-green-500 hover:text-white border border-green-500/30 hover:bg-green-600 px-3 py-1.5 rounded transition-all uppercase tracking-widest ml-2"
  >
    Adicionar Plano
  </button>
);
