import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

const Private = ({ children }) => (localStorage.getItem('token') ? children : <Navigate to="/auth" replace />);

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Private><Layout><DashboardPage /></Layout></Private>} />
      <Route path="/products" element={<Private><Layout><ProductsPage /></Layout></Private>} />
      <Route path="/orders" element={<Private><Layout><OrdersPage /></Layout></Private>} />
      <Route path="/users" element={<Private><Layout><UsersPage /></Layout></Private>} />
      <Route path="/settings" element={<Private><Layout><SettingsPage /></Layout></Private>} />
    </Routes>
  );
}
