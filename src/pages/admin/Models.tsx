import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Pagination } from '../../components/molecules/Pagination';
import { ModelTable } from '../../components/organisms/ModelTable';
import { MockService } from '../../services/mock';

export const AdminModels: FC = () => {
  const models = MockService.getAdminModels();

  return (
    <AdminLayout title="Gestão de Modelos" activePath="/admin/models">
      <div class="flex justify-between items-center mb-6">
         <div class="flex gap-2">
             <button class="px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-white text-xs font-bold uppercase hover:bg-white/5">Todas (1,240)</button>
             <button class="px-4 py-2 bg-transparent border border-white/10 rounded text-gray-400 hover:text-white text-xs font-bold uppercase hover:bg-white/5">Pendentes (3)</button>
             <button class="px-4 py-2 bg-transparent border border-white/10 rounded text-gray-400 hover:text-white text-xs font-bold uppercase hover:bg-white/5">Banidas (12)</button>
         </div>
         <input type="text" placeholder="Buscar modelo..." class="bg-surface border border-white/10 rounded px-4 py-2 text-xs text-white w-64 focus:border-primary focus:outline-none" />
      </div>

      <ModelTable models={models} />
        
      {/* Pagination Component */}
      <Pagination 
        currentPage={1}
        totalPages={124}
        showingFrom={1}
        showingTo={10}
        totalItems={1240}
        nextUrl="/admin/models?page=2"
      />
    </AdminLayout>
  );
};
