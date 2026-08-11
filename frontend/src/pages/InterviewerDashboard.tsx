import { DashboardLayout } from '../components/DashboardLayout';

export default function InterviewerDashboard() {
  return (
    <DashboardLayout
      title="Interviewer Desk"
      roleDescription="Access your schedule, view candidate scorecards, and submit interview feedback."
    >
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-6 border border-slate-200/60 dark:border-slate-800/80">
        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-2">Welcome back, Interviewer!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This is a placeholder for the Interviewer Desk. In future releases, you will see your calendar invitations, candidate profiles, standard assessment rubrics, and feedback submission forms.
        </p>
      </div>
    </DashboardLayout>
  );
}
