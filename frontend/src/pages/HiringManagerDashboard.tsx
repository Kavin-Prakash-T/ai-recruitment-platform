import { DashboardLayout } from '../components/DashboardLayout';

export default function HiringManagerDashboard() {
  return (
    <DashboardLayout
      title="Hiring Manager Console"
      roleDescription="Review shortlisted candidates, approve hiring decisions, and track job opening progress."
    >
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/80">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">Welcome back, Hiring Manager!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This is a placeholder for the Hiring Manager Console. Future versions will let you give thumbs up/down on interview summaries, review candidate profiles, and define department headcount requisitions.
        </p>
      </div>
    </DashboardLayout>
  );
}
