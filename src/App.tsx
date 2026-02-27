import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { KioskView } from './components/KioskView';
import { PunchModal } from './components/PunchModal';
import { SuccessScreen } from './components/SuccessScreen';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const view = useStore((state) => state.view);
  const isAdminAuthenticated = useStore((state) => state.isAdminAuthenticated);
  const setView = useStore((state) => state.setView);

  // Protect admin dashboard route
  useEffect(() => {
    if (view === 'admin_dashboard' && !isAdminAuthenticated) {
      setView('admin_login');
    }
  }, [view, isAdminAuthenticated, setView]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
      <AnimatePresence mode="wait">
        {(view === 'kiosk' || view === 'punch_modal') && <KioskView key="kiosk" />}
        {view === 'success' && <SuccessScreen key="success" />}
        {view === 'admin_login' && <AdminLogin key="admin_login" />}
        {view === 'admin_dashboard' && <AdminDashboard key="admin_dashboard" />}
      </AnimatePresence>
      <AnimatePresence>
        {view === 'punch_modal' && <PunchModal key="punch_modal" />}
      </AnimatePresence>
    </div>
  );
}
