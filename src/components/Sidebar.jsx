import { NavLink, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import authService from '../services/authService';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/products',  label: 'Products',  icon: '🐠' },
  { path: '/orders',    label: 'Orders',    icon: '📦' },
  { path: '/customers', label: 'Customers', icon: '👥' },
  { path: '/categories',label: 'Categories',icon: '🏷️' },
  { path: '/settings',  label: 'Settings',  icon: '⚙️' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useShop();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen && setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={closeMobile} />
      )}

      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Desktop collapse toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* Mobile close button */}
        <button className="sidebar-mobile-close" onClick={closeMobile} aria-label="Close menu">✕</button>

        <div className="sidebar-logo">
          <span className="logo-icon">🐠</span>
          <div className="logo-text">
            <h1>AquaAdmin</h1>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>

        <div className="sidebar-wave">
          <svg viewBox="0 0 260 60" preserveAspectRatio="none">
            <path d="M0,30 C40,50 80,10 130,30 C180,50 220,10 260,30 L260,60 L0,60 Z" fill="rgba(255,255,255,0.05)" />
          </svg>
        </div>
      </aside>
    </>
  );
}
