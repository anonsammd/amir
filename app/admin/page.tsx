import { verifyAdminSession } from '@/lib/auth';
import { getProjects, getDesignProjects, getAccounts } from '@/lib/github-store';
import { LoginForm } from './login-form';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const metadata = {
  title: 'Admin Dashboard | DopexCreation Studio',
  description: 'Manage showreel videos, design showcases, and social channel settings for DopexCreation.',
};

export default async function AdminPage() {
  const session = await verifyAdminSession();

  if (!session) {
    return <LoginForm />;
  }

  const [projects, designProjects, accounts] = await Promise.all([
    getProjects(true), // Include hidden projects for admin view
    getDesignProjects(true), // Include hidden design projects
    getAccounts(true), // Include hidden accounts for admin view
  ]);

  return (
    <AdminDashboard
      initialProjects={projects}
      initialDesignProjects={designProjects}
      initialAccounts={accounts}
    />
  );
}
