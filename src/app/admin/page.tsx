import AdminDashboard from '../../screens/admin/AdminDashboard';
import { getAdminDashboardData } from '../../lib/admin';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <AdminDashboard initialData={getAdminDashboardData()} />;
}
