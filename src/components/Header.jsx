import { useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import authService from '../services/authService';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/products/add': 'Add Product',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/categories': 'Categories',
  '/settings': 'Settings',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { stats, sidebarOpen, setSidebarOpen, setMobileMenuOpen } = useShop();

  const user = authService.getStoredUser();
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  const userName = user?.name || 'Admin User';

  let title = pageTitles[location.pathname] || 'AquaAdmin';
  if (location.pathname.startsWith('/products/edit')) title = 'Edit Product';

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(prev => !prev)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Desktop collapse */}
        <button
          className="desktop-collapse-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <h2>{title}</h2>
      </div>

      <div className="header-right">
        <div className="header-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search anything..." />
        </div>

        <button className="header-notif">
          🔔
          {stats.pendingOrders > 0 && (
            <span className="notif-badge">{stats.pendingOrders}</span>
          )}
        </button>

        <div className="header-user" onClick={handleLogout} title="Click to logout">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Shop Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
