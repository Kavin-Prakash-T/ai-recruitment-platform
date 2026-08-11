import { DashboardLayout } from '../components/DashboardLayout';

export default function CandidateDashboard() {
  return (
    <DashboardLayout
      title="Candidate Portal"
      roleDescription="Manage your job applications, view recruitment status, and prepare for interviews."
    >
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/80">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">Welcome back, Candidate!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This is a placeholder for your application dashboard. In the future, you will be able to search for matching job roles, upload your resume, and track your recruitment stages.
        </p>
      </div>
    </DashboardLayout>
  );
}
