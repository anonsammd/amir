import { verifyAdminSession } from '@/lib/auth';
import { getProjects, getAccounts } from '@/lib/github-store';
import { LoginForm } from './login-form';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const metadata = {
  title: 'Admin Dashboard | DopexCreation Studio',
  description: 'Manage showreel videos and social channel settings for DopexCreation.',
};

export default async function AdminPage() {
  const session = await verifyAdminSession();

  if (!session) {
    return <LoginForm />;
  }

  const [projects, accounts] = await Promise.all([
    getProjects(true), // Include hidden projects for admin view
    getAccounts(true), // Include hidden accounts for admin view
  ]);

  return <AdminDashboard initialProjects={projects} initialAccounts={accounts} />;
}
