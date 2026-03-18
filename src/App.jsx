import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Bubbles from './components/Bubbles';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddEditProduct from './pages/AddEditProduct';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Registerform from './components/registration';
import authService from './services/authService';

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminLayout({ children }) {
  return (
    <ShopProvider>
      <div className="app">
        <Sidebar />
        <div className="main-area" id="main-area">
          <Header />
          <Bubbles />
          <div className="page-content">
            {children}
          </div>
        </div>
        <Toast />
      </div>
    </ShopProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registerform />} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><AdminLayout><Products /></AdminLayout></ProtectedRoute>} />
        <Route path="/products/add" element={<ProtectedRoute><AdminLayout><AddEditProduct /></AdminLayout></ProtectedRoute>} />
        <Route path="/products/edit/:id" element={<ProtectedRoute><AdminLayout><AddEditProduct /></AdminLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><AdminLayout><Orders /></AdminLayout></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><AdminLayout><Customers /></AdminLayout></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><AdminLayout><Categories /></AdminLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
