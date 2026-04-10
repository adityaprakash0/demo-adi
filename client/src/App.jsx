import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminPanelPage from './pages/AdminPanelPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DonorProfilePage from './pages/DonorProfilePage.jsx';
import EmergencyRequestPage from './pages/EmergencyRequestPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="donors/:id" element={<DonorProfilePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="request" element={<EmergencyRequestPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminPanelPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
