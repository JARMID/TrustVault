import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import DashboardHome from './pages/Dashboard';
import Triage from './pages/Triage';
import Security from './pages/Security';
import Community from './pages/Community';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import Ekyc from './pages/Ekyc';
import Labels from './pages/Labels';
import Bugs from './pages/Bugs';
import NotFound from './pages/NotFound';
import GeoLocal from './pages/dashboard/GeoLocal';
import ThreatMap from './pages/dashboard/ThreatMap';
import WalletPage from './pages/Wallet';
import TransactionsPage from './pages/Transactions';
import SendMoneyPage from './pages/SendMoney';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          
          {/* Dashboard layout wraps all /app/* routes */}
          <Route path="/app" element={<Layout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="send" element={<SendMoneyPage />} />
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
            <Route path="map" element={<ThreatMap />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* Legacy /dashboard redirect */}
          <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
