import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckCircle, AlertCircle, Briefcase, Users, LayoutDashboard, Calendar, ShieldCheck } from 'lucide-react';

interface DashboardLayoutProps {
  title: string;
  roleDescription: string;
  children: React.ReactNode;
}

export const DashboardLayout = ({ title, roleDescription, children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <ShieldCheck className="h-5 w-5 text-red-500" />;
      case 'RECRUITER':
        return <Users className="h-5 w-5 text-indigo-500" />;
      case 'HIRING_MANAGER':
        return <Briefcase className="h-5 w-5 text-emerald-500" />;
      case 'INTERVIEWER':
        return <Calendar className="h-5 w-5 text-amber-500" />;
      default:
        return <LayoutDashboard className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col transition-colors duration-300">
      {/* Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-500/20">
              HF
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                HireFlow AI
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Meta */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </div>
                <img
                  src={user.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 shadow-inner"
                />
              </div>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                  alt={user?.name}
                  className="h-20 w-20 rounded-full border-2 border-indigo-500 shadow-lg bg-slate-100"
                />
                <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white">
                  ✓
                </span>
              </div>
              <h3 className="mt-4 font-bold text-lg">{user?.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-full">{user?.email}</p>

              <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                {getRoleIcon(user?.role || '')}
                {user?.role}
              </span>
            </div>

            <hr className="my-6 border-slate-200 dark:border-slate-800" />

            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-2 mb-1">
                Account Status
              </div>
              
              <div className="flex items-center justify-between p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500">Email Status</span>
                {user?.isEmailVerified ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Unverified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500">Profile Active</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  Active
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <main className="flex-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 relative overflow-hidden">
            {/* Visual background accents */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl pointer-events-none"></div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white m-0">
                {title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {roleDescription}
              </p>
            </div>

            <div className="min-h-[300px]">
              {children}
            </div>
          </div>
        </main>
      </div>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto text-center text-xs text-slate-400">
        © {new Date().getFullYear()} HireFlow AI. All rights reserved. Built with premium styling.
      </footer>
    </div>
  );
};
