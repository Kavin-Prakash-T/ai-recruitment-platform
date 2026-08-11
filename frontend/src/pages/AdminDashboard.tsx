import { DashboardLayout } from '../components/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout
      title="Admin Dashboard"
      roleDescription="Configure system global settings, manage user accounts, and view platform metrics."
    >
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/80">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">Welcome back, Administrator!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This is a placeholder for the Admin Dashboard. Future releases will contain configurations for email templates, user access controls (RBAC override), and system audit logs.
        </p>
      </div>
    </DashboardLayout>
  );
}
