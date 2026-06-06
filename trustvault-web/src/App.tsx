import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { SmoothScrollProvider } from './components/ui/SmoothScroll';
import { useAuthStore } from './stores/authStore';
import { Loader2 } from 'lucide-react';

import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Enterprise from './pages/Enterprise';
import Company from './pages/Company';
import SecurityArchitecture from './pages/SecurityArchitecture';
import Network from './pages/Network';
import UseCases from './pages/UseCases';
import Compliance from './pages/Compliance';
import DashboardHome from './pages/Dashboard';
import Triage from './pages/Triage';
import Security from './pages/Security';
import Community from './pages/Community';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import UserSecurity from './pages/UserSecurity';
import Ekyc from './pages/Ekyc';
import Labels from './pages/Labels';
import Bugs from './pages/Bugs';
import NotFound from './pages/NotFound';
import GeoLocal from './pages/dashboard/GeoLocal';
import ThreatMap from './pages/dashboard/ThreatMap';
import WalletPage from './pages/Wallet';
import TransactionsPage from './pages/Transactions';
import SendMoneyPage from './pages/SendMoney';
import AnalyticsPage from './pages/Analytics';
import CardsPage from './pages/Cards';
import DeviceTrust from './pages/DeviceTrust';
import PredictiveAI from './pages/PredictiveAI';
import DocumentVault from './pages/DocumentVault';
import SOCDashboard from './pages/dashboard/SOCDashboard';
import BudgetPage from './pages/Budget';

// ── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-[var(--brand-primary)]" size={36} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ── App ──────────────────────────────────────────────────────────────────────
function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/company" element={<Company />} />
            <Route path="/security-architecture" element={<SecurityArchitecture />} />
            <Route path="/network" element={<Network />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/compliance" element={<Compliance />} />

            {/* Protected /app/* routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="soc" element={<SOCDashboard />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="send" element={<SendMoneyPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="cards" element={<CardsPage />} />
              <Route path="device-trust" element={<DeviceTrust />} />
              <Route path="ai-insights" element={<PredictiveAI />} />
              <Route path="vault" element={<DocumentVault />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="incidents" element={<Triage />} />
              <Route path="security" element={<Security />} />
              <Route path="ekyc" element={<Ekyc />} />
              <Route path="geo" element={<GeoLocal />} />
              <Route path="bugs" element={<Bugs />} />
              <Route path="tags" element={<Labels />} />
              <Route path="community" element={<Community />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="user-security" element={<UserSecurity />} />
              <Route path="map" element={<ThreatMap />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Legacy redirect */}
            <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}

export default App;
