import { FC } from 'hono/jsx';
import { AdminLayout } from '../../components/templates/AdminLayout';
import { WhitelabelModel } from '../../services/s3';
import { WhitelabelStatus } from '../../components/organisms/WhitelabelStatus';
import { WhitelabelTable } from '../../components/organisms/WhitelabelTable';

interface AdminWhitelabelProps {
  models: WhitelabelModel[];
  nextToken?: string;
  error?: string;
}

export const AdminWhitelabel: FC<AdminWhitelabelProps> = ({ models, nextToken, error }) => {
  
  return (
    <AdminLayout title="Integração Whitelabel (S3/DigitalOcean)" activePath="/admin/whitelabel">
      
      <div class="space-y-8 pb-20">
        
        <WhitelabelStatus error={error} />

        <WhitelabelTable models={models} nextToken={nextToken} error={error} />
        
        <script src="/static/js/admin.js" defer></script>
      </div>
    </AdminLayout>
  );
};