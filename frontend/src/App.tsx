import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import HiringManagerDashboard from './pages/HiringManagerDashboard';
import InterviewerDashboard from './pages/InterviewerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Component to handle redirection from "/" based on user role
function HomeRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'CANDIDATE':
      return <Navigate to="/dashboard/candidate" replace />;
    case 'RECRUITER':
      return <Navigate to="/dashboard/recruiter" replace />;
    case 'HIRING_MANAGER':
      return <Navigate to="/dashboard/hiring-manager" replace />;
    case 'INTERVIEWER':
      return <Navigate to="/dashboard/interviewer" replace />;
    case 'ADMIN':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

// Public routing guard that redirects logged-in users away from /login and /register
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Dashboards based on roles */}
          <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
            <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
            <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['HIRING_MANAGER']} />}>
            <Route path="/dashboard/hiring-manager" element={<HiringManagerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['INTERVIEWER']} />}>
            <Route path="/dashboard/interviewer" element={<InterviewerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

          {/* Root Redirect Route */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
