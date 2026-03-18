import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import Modal from '../components/Modal';

const TIER_THRESHOLDS = { bronze: 0, silver: 250, gold: 750, platinum: 2000 };

function getTier(spent) {
  if (spent >= TIER_THRESHOLDS.platinum) return { label: 'Platinum', color: '#8b5cf6', icon: '💜', bg: '#ede9fe' };
  if (spent >= TIER_THRESHOLDS.gold) return { label: 'Gold', color: '#d97706', icon: '🥇', bg: '#fef3c7' };
  if (spent >= TIER_THRESHOLDS.silver) return { label: 'Silver', color: '#64748b', icon: '🥈', bg: '#f1f5f9' };
  return { label: 'Bronze', color: '#b45309', icon: '🥉', bg: '#fef9f0' };
}

function expIcon(level) {
  return { Beginner: '🌱', Intermediate: '🐟', Advanced: '🌊', Expert: '🏆' }[level] || '🐟';
}

export default function Customers() {
  const { customers, orders } = useShop();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('spent');
  const [tierFilter, setTierFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [tankFilter, setTankFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const TIERS = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];
  const EXP_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const TANK_TYPES = ['All', 'Saltwater', 'Freshwater', 'Planted', 'Nano', 'FOWLR'];

  const filtered = customers
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').includes(search)
    )
    .filter(c => tierFilter === 'All' || getTier(c.totalSpent).label === tierFilter)
    .filter(c => expFilter === 'All' || (c.experienceLevel || '') === expFilter)
    .filter(c => tankFilter === 'All' || (c.tankType || '').includes(tankFilter))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      if (sortBy === 'recent') return new Date(b.joinDate) - new Date(a.joinDate);
      return 0;
    });



  const getCustomerOrders = id => orders.filter(o => o.customerId === id);
  const totalRevenue = filtered.reduce((s, c) => s + c.totalSpent, 0);
  const avgSpend = filtered.length ? totalRevenue / filtered.length : 0;
  const liveAnimalCustomers = customers.filter(c => {
    const cos = orders.filter(o => o.customerId === c.id);
    return cos.some(o => o.hasLiveAnimals);
  }).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><span>👥</span> Customers</h1>
          <p className="page-subtitle">{filtered.length} of {customers.length} customers shown</p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '👥', label: 'Total Customers', value: customers.length, color: 'var(--primary)', bg: 'var(--primary-50)' },
          { icon: '💵', label: 'Total Revenue', value: `$${customers.reduce((s,c)=>s+c.totalSpent,0).toFixed(2)}`, color: 'var(--success)', bg: 'var(--success-bg)' },
          { icon: '📊', label: 'Avg Spend', value: `$${avgSpend.toFixed(2)}`, color: 'var(--warning)', bg: 'var(--warning-bg)' },
          { icon: '🐟', label: 'Live Animal Buyers', value: liveAnimalCustomers, color: 'var(--info)', bg: 'var(--info-bg)' },
          { icon: '💜', label: 'Platinum Tier', value: customers.filter(c=>c.totalSpent>=2000).length, color: '#8b5cf6', bg: '#ede9fe' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}25`, borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div className="filter-search" style={{ flex: '1 1 200px' }}>
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
          </div>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="spent">Top Spenders</option>
            <option value="orders">Most Orders</option>
            <option value="name">Name A–Z</option>
            <option value="recent">Recently Joined</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', alignSelf: 'center' }}>Tier:</span>
          {TIERS.map(t => (
            <button key={t} onClick={() => setTierFilter(t)} className={`btn btn-sm ${tierFilter === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
          <span style={{ color: 'var(--border)', margin: '0 4px' }}>|</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', alignSelf: 'center' }}>Experience:</span>
          {EXP_LEVELS.map(e => (
            <button key={e} onClick={() => setExpFilter(e)} className={`btn btn-sm ${expFilter === e ? 'btn-primary' : 'btn-secondary'}`}>
              {e !== 'All' ? expIcon(e) : ''} {e}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-light)', alignSelf: 'center' }}>Tank:</span>
          {TANK_TYPES.map(t => (
            <button key={t} onClick={() => setTankFilter(t)} className={`btn btn-sm ${tankFilter === t ? 'btn-primary' : 'btn-secondary'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Tank</th>
                <th>Experience</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Tier</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const tier = getTier(c.totalSpent);
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${tier.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{c.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>{c.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{c.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <div style={{ fontWeight: 500 }}>{c.tankType || '—'}</div>
                      {c.tankSize && <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{c.tankSize}</div>}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem' }}>{expIcon(c.experienceLevel)} {c.experienceLevel || '—'}</span>
                    </td>
                    <td><span className="badge badge-info">{c.totalOrders}</span></td>
                    <td style={{ fontWeight: 700 }}>${c.totalSpent.toFixed(2)}</td>
                    <td>
                      <span style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.color}30`, padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700 }}>
                        {tier.icon} {tier.label}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(c.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCustomer(c)}>👁️ View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="Customer Profile"
        footer={<button className="btn btn-secondary" onClick={() => setSelectedCustomer(null)}>Close</button>}
      >
        {selectedCustomer && (() => {
          const tier = getTier(selectedCustomer.totalSpent);
          const custOrders = getCustomerOrders(selectedCustomer.id);
          const liveOrders = custOrders.filter(o => o.hasLiveAnimals).length;
          return (
            <div>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto', background: `${tier.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: `2px solid ${tier.color}40` }}>
                  {selectedCustomer.avatar}
                </div>
                <h3 style={{ marginTop: 10, marginBottom: 4 }}>{selectedCustomer.name}</h3>
                <span style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.color}30`, padding: '4px 14px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700 }}>
                  {tier.icon} {tier.label} Member
                </span>
              </div>

              {/* Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 14 }}>
                {[
                  ['📧 Email', selectedCustomer.email],
                  ['📱 Phone', selectedCustomer.phone],
                  ['📅 Joined', new Date(selectedCustomer.joinDate).toLocaleDateString()],
                  ['🏆 Experience', `${expIcon(selectedCustomer.experienceLevel)} ${selectedCustomer.experienceLevel || '—'}`],
                  ['🏠 Tank', selectedCustomer.tankType || '—'],
                  ['📏 Tank Size', selectedCustomer.tankSize || '—'],
                  ['🏷️ Preferred Brands', selectedCustomer.preferredBrands || '—'],
                ].map(([l, v]) => (
                  <div className="detail-row" key={l} style={{ padding: '4px 0' }}>
                    <span className="label" style={{ fontSize: '0.76rem' }}>{l}</span>
                    <span className="value" style={{ fontSize: '0.8rem' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                {[
                  { icon: '📦', label: 'Orders', value: selectedCustomer.totalOrders, color: 'var(--info)' },
                  { icon: '💵', label: 'Total Spent', value: `$${selectedCustomer.totalSpent.toFixed(2)}`, color: 'var(--success)' },
                  { icon: '🐟', label: 'Live Orders', value: liveOrders, color: '#0891b2' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
                    <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {selectedCustomer.notes && (
                <div style={{ background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 14, fontSize: '0.82rem' }}>
                  📝 <strong>Notes:</strong> {selectedCustomer.notes}
                </div>
              )}

              {/* Progress to next tier */}
              {selectedCustomer.totalSpent < TIER_THRESHOLDS.platinum && (() => {
                const tiers = [{ label: 'Silver', threshold: TIER_THRESHOLDS.silver }, { label: 'Gold', threshold: TIER_THRESHOLDS.gold }, { label: 'Platinum', threshold: TIER_THRESHOLDS.platinum }];
                const nextTier = tiers.find(t => selectedCustomer.totalSpent < t.threshold);
                if (!nextTier) return null;
                const prevThreshold = tiers[tiers.indexOf(nextTier) - 1]?.threshold || 0;
                const progress = Math.min(100, ((selectedCustomer.totalSpent - prevThreshold) / (nextTier.threshold - prevThreshold)) * 100);
                return (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 5, fontWeight: 600 }}>
                      <span>Progress to {nextTier.label}</span>
                      <span>${(nextTier.threshold - selectedCustomer.totalSpent).toFixed(2)} to go</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: tier.color, borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })()}

              {/* Order History */}
              <h4 style={{ fontWeight: 700, marginBottom: 10 }}>Order History</h4>
              <div className="order-detail-items">
                {custOrders.length === 0 ? (
                  <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 16 }}>No orders yet</p>
                ) : custOrders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => (
                  <div className="order-detail-item" key={order.id}>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {order.id}
                        {order.hasLiveAnimals && <span style={{ fontSize: '0.65rem', background: 'var(--info-bg)', color: '#1e40af', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>🐟 LIVE</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        {new Date(order.date).toLocaleDateString()} · {order.items.length} items
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</div>
                      <span className={`badge badge-${{ delivered:'success', shipped:'info', processing:'warning', pending:'purple', cancelled:'danger' }[order.status]}`} style={{ fontSize: '0.68rem' }}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
