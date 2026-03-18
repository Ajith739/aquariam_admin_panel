import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import Modal from '../components/Modal';

const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];
const statusColor = s => ({ delivered:'success', shipped:'info', processing:'warning', pending:'purple', cancelled:'danger' }[s] || 'default');
const statusIcon = s => ({ delivered:'✅', shipped:'🚚', processing:'⚙️', pending:'⏳', cancelled:'❌' }[s] || '📦');

export default function Orders() {
  const { orders, updateOrderStatus, deleteOrder, showToast } = useShop();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [liveFilter, setLiveFilter] = useState('all'); // 'all' | 'live' | 'dry'
  const [shippingFilter, setShippingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [trackingEdit, setTrackingEdit] = useState({}); // { orderId: value }

  const filtered = orders
    .filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o => liveFilter === 'all' || (liveFilter === 'live' ? o.hasLiveAnimals : !o.hasLiveAnimals))
    .filter(o => shippingFilter === 'all' || (o.shippingMethod || '').toLowerCase() === shippingFilter)
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'total-desc') return b.total - a.total;
      if (sortBy === 'total-asc') return a.total - b.total;
      return 0;
    });



  const handleDeleteOrder = id => { deleteOrder(id); setDeleteConfirm(null); };

  const saveTracking = (orderId, val) => {
    // In a real app this would persist — here we just toast
    showToast(`Tracking saved for ${orderId}`, 'success');
    setTrackingEdit(p => { const n = { ...p }; delete n[orderId]; return n; });
  };

  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0);
  const liveCount = filtered.filter(o => o.hasLiveAnimals).length;
  const pendingCount = filtered.filter(o => o.status === 'pending').length;
  const processingCount = filtered.filter(o => o.status === 'processing').length;
  const shippedCount = filtered.filter(o => o.status === 'shipped').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><span>📦</span> Orders</h1>
          <p className="page-subtitle">{filtered.length} of {orders.length} orders shown</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge badge-purple">{pendingCount} Pending</span>
          <span className="badge badge-warning">{processingCount} Processing</span>
          <span className="badge badge-info">{shippedCount} Shipped</span>
          <span className="badge badge-info" style={{ background: '#e0f2fe', color: '#0891b2' }}>🐟 {liveCount} Live</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 10 }}>
          <div className="filter-search" style={{ flex: '1 1 200px' }}>
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search order ID, customer, tracking..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusIcon(s)} {s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="total-desc">Highest Value</option>
            <option value="total-asc">Lowest Value</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all','live','dry'].map(f => (
            <button key={f} onClick={() => setLiveFilter(f)} className={`btn btn-sm ${liveFilter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f === 'live' ? '🐟 Live Animal' : f === 'dry' ? '📦 Dry Goods' : '🔵 All Types'}
            </button>
          ))}
          <span style={{ color: 'var(--border)', margin: '0 4px' }}>|</span>
          {['all','overnight','ground'].map(f => (
            <button key={f} onClick={() => setShippingFilter(f)} className={`btn btn-sm ${shippingFilter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f === 'overnight' ? '✈️ Overnight' : f === 'ground' ? '🚛 Ground' : '🔵 All Shipping'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Showing', value: filtered.length, color: 'var(--primary)' },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'var(--success)' },
          { label: 'Live Animal Orders', value: liveCount, color: 'var(--info)' },
          { label: 'Need Action', value: pendingCount + processingCount, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} style={{ fontSize: '0.82rem', color: s.color, fontWeight: 700, background: `${s.color}12`, border: `1px solid ${s.color}25`, padding: '4px 14px', borderRadius: 99 }}>
            {s.value} {s.label}
          </div>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><h3>No orders found</h3><p>No orders match your current filters.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Shipping</th>
                  <th>Tracking</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.id}</div>
                      {order.hasLiveAnimals && <span style={{ fontSize: '0.68rem', background: 'var(--info-bg)', color: 'var(--info)', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>🐟 LIVE</span>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{order.customerEmail}</div>
                    </td>
                    <td>{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <span style={{ fontSize: '0.78rem', background: order.shippingMethod === 'Overnight' ? '#fef3c7' : 'var(--bg)', color: order.shippingMethod === 'Overnight' ? '#92400e' : 'var(--text-light)', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                        {order.shippingMethod === 'Overnight' ? '✈️' : '🚛'} {order.shippingMethod || 'Ground'}
                      </span>
                    </td>
                    <td>
                      {trackingEdit[order.id] !== undefined ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input value={trackingEdit[order.id]} onChange={e => setTrackingEdit(p => ({ ...p, [order.id]: e.target.value }))} style={{ width: 110, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '0.78rem' }} />
                          <button className="btn btn-primary btn-sm" onClick={() => saveTracking(order.id, trackingEdit[order.id])}>✓</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-light)' }}>{order.trackingNumber || '—'}</span>
                          <button onClick={() => setTrackingEdit(p => ({ ...p, [order.id]: order.trackingNumber || '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--primary)' }}>✏️</button>
                        </div>
                      )}
                    </td>
                    <td>
                      <select className="status-select" value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)} style={{ color: `var(--${statusColor(order.status) === 'purple' ? 'purple' : statusColor(order.status)})` }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusIcon(s)} {s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrder(order)}>👁️ View</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(order)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.id}`}
        footer={<button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>}
      >
        {selectedOrder && (
          <div>
            {selectedOrder.hasLiveAnimals && (
              <div style={{ background: 'var(--info-bg)', border: '1px solid var(--info)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem', color: '#1e40af', display: 'flex', gap: 8, alignItems: 'center' }}>
                🐟 <strong>Live Animal Order</strong> — Handle with care. Priority shipping required.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 16 }}>
              {[
                ['👤 Customer', selectedOrder.customerName],
                ['📧 Email', selectedOrder.customerEmail],
                ['📅 Date', new Date(selectedOrder.date).toLocaleDateString()],
                ['🚚 Method', selectedOrder.shippingMethod || 'Ground'],
                ['📍 Address', selectedOrder.address],
                ['🔢 Tracking', selectedOrder.trackingNumber || 'Not yet assigned'],
              ].map(([l, v]) => (
                <div className="detail-row" key={l}>
                  <span className="label" style={{ fontSize: '0.78rem' }}>{l}</span>
                  <span className="value" style={{ fontSize: '0.82rem' }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="detail-row">
              <span className="label">Status</span>
              <span className={`badge badge-${statusColor(selectedOrder.status)}`}>{statusIcon(selectedOrder.status)} {selectedOrder.status}</span>
            </div>

            {selectedOrder.notes && (
              <div style={{ background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', marginTop: 10, fontSize: '0.82rem' }}>
                📝 <strong>Notes:</strong> {selectedOrder.notes}
              </div>
            )}

            <h4 style={{ marginTop: 18, marginBottom: 10, fontWeight: 700 }}>Order Items</h4>
            <div className="order-detail-items">
              {selectedOrder.items.map((item, i) => (
                <div className="order-detail-item" key={i}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div style={{ marginTop: 12, padding: '12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
              {[
                ['Subtotal', `$${selectedOrder.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}`],
                ['Shipping', selectedOrder.shippingMethod === 'Overnight' ? '$29.99' : '$9.99'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '3px 0', color: 'var(--text-light)' }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <div className="order-detail-total" style={{ marginTop: 8 }}>
                <span>Total</span><span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Order"
        footer={<><button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button><button className="btn btn-danger" onClick={() => handleDeleteOrder(deleteConfirm?.id)}>🗑️ Delete</button></>}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <p style={{ marginTop: 12 }}>Delete order <strong>{deleteConfirm?.id}</strong>? Cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
