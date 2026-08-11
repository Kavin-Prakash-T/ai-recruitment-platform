import { DashboardLayout } from '../components/DashboardLayout';

export default function RecruiterDashboard() {
  return (
    <DashboardLayout
      title="Recruiter Workspace"
      roleDescription="Publish job openings, review candidate resumes, and manage interview schedules."
    >
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/80">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">Welcome back, Recruiter!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This is a placeholder for the Recruiter Workspace. Future modules will let you manage pipeline candidates, trigger AI screening tools, and collaborate with hiring managers.
        </p>
      </div>
    </DashboardLayout>
  );
}
