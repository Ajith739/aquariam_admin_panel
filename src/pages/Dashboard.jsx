import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { useShop } from '../context/ShopContext';
import { revenueData, orderStatusData, topProducts, waterTypeData, monthlyLiveShipments } from '../data/mockData';

// No GSAP at all — StrictMode double-invocation breaks opacity:0 from() animations
// and gsap counter sets textContent='0' then never recovers
export default function Dashboard() {
  const { stats, orders, products } = useShop();
  const navigate = useNavigate();

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const lowStock = products.filter(p => p.stock <= 10).sort((a, b) => a.stock - b.stock).slice(0, 6);
  const statusColor = s => ({ delivered: 'success', shipped: 'info', processing: 'warning', pending: 'purple', cancelled: 'danger' }[s] || 'default');

  const liveAnimalOrders = orders.filter(o => o.hasLiveAnimals).length;
  const pendingLive = orders.filter(o => o.hasLiveAnimals && ['pending', 'processing'].includes(o.status)).length;
  const avgOrderValue = orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0;
  const saltwater = products.filter(p => p.waterType === 'Saltwater').length;
  const freshwater = products.filter(p => p.waterType === 'Freshwater').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><span>🌊</span> Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your aquarium shop overview.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/products/add')}>➕ Add Product</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/orders')}>📦 View Orders</button>
        </div>
      </div>

      {/* Main Stat Cards — values rendered directly by React, no GSAP counter */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-info">
            <h4>Total Revenue</h4>
            <div className="stat-number">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-change up">↑ 12.5% from last month</div>
          </div>
          <div className="stat-icon">💰</div>
        </div>
        <div className="stat-card products">
          <div className="stat-info">
            <h4>Total Products</h4>
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-change up">↑ 3 new this week</div>
          </div>
          <div className="stat-icon">🐠</div>
        </div>
        <div className="stat-card orders">
          <div className="stat-info">
            <h4>Total Orders</h4>
            <div className="stat-number">{stats.totalOrders}</div>
            <div className="stat-change up">↑ 8.3% from last month</div>
          </div>
          <div className="stat-icon">📦</div>
        </div>
        <div className="stat-card customers">
          <div className="stat-info">
            <h4>Total Customers</h4>
            <div className="stat-number">{stats.totalCustomers}</div>
            <div className="stat-change up">↑ 5 new this month</div>
          </div>
          <div className="stat-icon">👥</div>
        </div>
      </div>

      {/* Aquarium KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '🐟', label: 'Live Animal Orders', value: liveAnimalOrders, color: 'var(--info)', bg: 'var(--info-bg)' },
          { icon: '⚠️', label: 'Pending Live Shipments', value: pendingLive, color: 'var(--warning)', bg: 'var(--warning-bg)' },
          { icon: '💵', label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, color: 'var(--success)', bg: 'var(--success-bg)' },
          { icon: '🌊', label: 'Saltwater Species', value: saltwater, color: '#0891b2', bg: '#ecfeff' },
          { icon: '🟦', label: 'Freshwater Species', value: freshwater, color: '#3b82f6', bg: '#dbeafe' },
          { icon: '🏷️', label: 'Categories', value: 10, color: 'var(--purple)', bg: '#ede9fe' },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.color}25`, borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.6rem' }}>{k.icon}</span>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600, lineHeight: 1.3 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Order Status */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>📈 Revenue Overview</h3>
            <span className="badge badge-success">+12.5%</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0f2fe', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>🥧 Order Status</h3></div>
          <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                  {orderStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0f2fe' }} formatter={v => [v + '%', 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', justifyContent: 'center', marginTop: 4 }}>
              {orderStatusData.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem' }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: item.fill }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live vs Dry & Water Type breakdown */}
      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3>🐟 Live vs Dry Shipments</h3>
            <span className="badge badge-info">Last 6 months</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyLiveShipments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0f2fe' }} />
                <Legend />
                <Bar dataKey="live" name="Live Animals" fill="#0891b2" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="dry" name="Dry Goods" fill="#a5f3fc" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>🌊 Inventory by Water Type</h3></div>
          <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={waterTypeData} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                  {waterTypeData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0f2fe' }} formatter={v => [v + ' products', '']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', marginTop: 8 }}>
              {[
                { label: 'Saltwater', value: `${saltwater} species`, icon: '🌊', color: '#0891b2' },
                { label: 'Freshwater', value: `${freshwater} species`, icon: '🟦', color: '#3b82f6' },
                { label: 'Live Animals', value: `${products.filter(p => p.isLiveAnimal).length} items`, icon: '🐟', color: '#10b981' },
                { label: 'Dry Goods', value: `${products.filter(p => !p.isLiveAnimal).length} items`, icon: '📦', color: '#64748b' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="dashboard-grid equal">
        <div className="card">
          <div className="card-header">
            <h3>🕐 Recent Orders</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/orders')}>View All →</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Total</th><th>Live?</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700 }}>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                    <td>{order.hasLiveAnimals ? '🐟' : <span style={{ color: 'var(--text-lighter)' }}>—</span>}</td>
                    <td><span className={`badge badge-${statusColor(order.status)}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>⚠️ Low Stock Alerts</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/products')}>View All →</button>
          </div>
          <div className="card-body">
            {lowStock.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <div className="empty-icon">✅</div>
                <h3>All Stocked Up!</h3>
                <p>No products running low.</p>
              </div>
            ) : (
              <div className="low-stock-list">
                {lowStock.map(p => (
                  <div className="low-stock-item" key={p.id} onClick={() => navigate(`/products/edit/${p.id}`)} style={{ cursor: 'pointer' }}>
                    <span className="emoji">{p.emoji}</span>
                    <div className="info">
                      <h4>{p.name}</h4>
                      <p>{p.category}{p.isLiveAnimal ? ' · 🐟 Live' : ''}</p>
                    </div>
                    <span className="stock-count">{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products & Quick Actions */}
      <div className="dashboard-grid equal" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-header"><h3>🏆 Top Selling Products</h3></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0f2fe' }} formatter={v => [v + ' sold', 'Sales']} />
                <Bar dataKey="sales" fill="#0891b2" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>⚡ Quick Actions</h3></div>
          <div className="card-body">
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => navigate('/products/add')}><span className="action-icon">➕</span>Add Product</button>
              <button className="quick-action-btn" onClick={() => navigate('/orders')}><span className="action-icon">📋</span>Orders</button>
              <button className="quick-action-btn" onClick={() => navigate('/categories')}><span className="action-icon">📁</span>Categories</button>
              <button className="quick-action-btn" onClick={() => navigate('/customers')}><span className="action-icon">👤</span>Customers</button>
              <button className="quick-action-btn" onClick={() => navigate('/products')}><span className="action-icon">⚠️</span>Low Stock</button>
              <button className="quick-action-btn" onClick={() => navigate('/settings')}><span className="action-icon">⚙️</span>Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
