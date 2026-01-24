import { FC } from 'hono/jsx';

export const modalScripts = {
  open: (userId: number) => `
    const modal = document.getElementById('history-modal');
    const content = document.getElementById('modal-history-content');
    
    content.innerHTML = \`
      <div class="space-y-4 animate-pulse">
        \${Array(3).fill(0).map(() => \`
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="flex justify-between items-start mb-4">
              <div class="space-y-2">
                <div class="h-2 w-16 bg-white/10 rounded"></div>
                <div class="h-3 w-32 bg-white/10 rounded"></div>
              </div>
              <div class="h-5 w-14 bg-white/10 rounded"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="h-2 w-10 bg-white/10 rounded"></div>
                <div class="h-3 w-20 bg-white/10 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="h-2 w-10 bg-white/10 rounded"></div>
                <div class="h-3 w-24 bg-white/10 rounded"></div>
              </div>
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
    const modal = document.getElementById('history-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-box').classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  `
};

export const ActionHistoryButton: FC<{ userId: number }> = ({ userId }) => (
  <button 
    hx-get={`/admin/clients/${userId}/history`}
    hx-target="#modal-history-content"
    onclick={modalScripts.open(userId)}
    class="text-[10px] font-bold text-primary hover:text-white border border-primary/30 hover:bg-primary px-3 py-1.5 rounded transition-all uppercase tracking-widest"
  >
    Histórico
  </button>
);
