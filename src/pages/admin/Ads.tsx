import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { Pagination } from '../../components/molecules/Pagination';
import { AdTable } from '../../components/organisms/AdTable';
import { MockService } from '../../services/mock';

export const AdminAds: FC = () => {
  const ads = MockService.getAdminAds();

  return (
    <AdminLayout title="Gestão de Publicidade (Ads)" activePath="/admin/ads">
      <div class="flex justify-between items-center mb-8">
         <p class="text-gray-400 text-sm">Gerencie campanhas e acompanhe o CTR em tempo real.</p>
         <button class="bg-primary text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest shadow-neon-purple hover:brightness-110">
            + Nova Campanha
         </button>
      </div>

      <AdTable ads={ads} />

      {/* Pagination Component */}
      <Pagination 
        currentPage={1}
        totalPages={3}
        showingFrom={1}
        showingTo={5}
        totalItems={15}
        nextUrl="/admin/ads?page=2"
      />
    </AdminLayout>
  );
};
