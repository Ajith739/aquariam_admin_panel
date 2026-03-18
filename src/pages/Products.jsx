import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Modal from '../components/Modal';

const WATER_FILTERS = ['All', 'Freshwater', 'Saltwater', 'Brackish'];
const CARE_FILTERS = ['All', 'Easy', 'Moderate', 'Advanced'];
const STATUS_FILTERS = ['All', 'active', 'inactive', 'draft', 'outofseason'];

export default function Products() {
  const { products, categories, deleteProduct } = useShop();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [waterFilter, setWaterFilter] = useState('All');
  const [careFilter, setCareFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [liveOnly, setLiveOnly] = useState(false);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const gridRef = useRef(null);

  const filtered = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.supplier || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => categoryFilter === 'all' || p.categoryId === parseInt(categoryFilter))
    .filter(p => waterFilter === 'All' || (p.waterType || '') === waterFilter)
    .filter(p => careFilter === 'All' || p.careLevel === careFilter)
    .filter(p => statusFilter === 'All' || p.status === statusFilter)
    .filter(p => !liveOnly || p.isLiveAnimal)
    .filter(p => !lowStockOnly || p.stock <= 10)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      return 0;
    });



  const handleDelete = id => { deleteProduct(id); setDeleteConfirm(null); };

  const careLevelColor = l => ({ Easy: 'success', Moderate: 'warning', Advanced: 'danger' }[l] || 'default');
  const waterIcon = w => ({ Freshwater: '🟦', Saltwater: '🌊', Brackish: '🪣' }[w] || '💧');
  const statusBadge = s => ({ active: 'success', inactive: 'default', draft: 'warning', outofseason: 'purple' }[s] || 'default');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><span>🐠</span> Products</h1>
          <p className="page-subtitle">{filtered.length} of {products.length} products shown</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/products/add')}>➕ Add Product</button>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <div className="filter-search" style={{ flex: '1 1 240px' }}>
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search name, SKU, supplier..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
          </div>
          <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Sort: Name A–Z</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="stock-asc">Stock ↑</option>
            <option value="stock-desc">Stock ↓</option>
          </select>
          <div className="view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>☰</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {/* Water type pills */}
          {WATER_FILTERS.map(wt => (
            <button key={wt} onClick={() => setWaterFilter(wt)} className={`btn btn-sm ${waterFilter === wt ? 'btn-primary' : 'btn-secondary'}`}>
              {waterIcon(wt)} {wt}
            </button>
          ))}
          <span style={{ color: 'var(--border)', margin: '0 4px' }}>|</span>
          {/* Care level pills */}
          {CARE_FILTERS.map(c => (
            <button key={c} onClick={() => setCareFilter(c)} className={`btn btn-sm ${careFilter === c ? 'btn-primary' : 'btn-secondary'}`}>{c}</button>
          ))}
          <span style={{ color: 'var(--border)', margin: '0 4px' }}>|</span>
          <button onClick={() => setLiveOnly(v => !v)} className={`btn btn-sm ${liveOnly ? 'btn-primary' : 'btn-secondary'}`}>🐟 Live Only</button>
          <button onClick={() => setLowStockOnly(v => !v)} className={`btn btn-sm ${lowStockOnly ? 'btn-danger' : 'btn-secondary'}`}>⚠️ Low Stock</button>
        </div>
      </div>

      {/* Count bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Showing', value: filtered.length, color: 'var(--primary)' },
          { label: 'Live Animals', value: products.filter(p => p.isLiveAnimal).length, color: 'var(--info)' },
          { label: 'Low Stock', value: products.filter(p => p.stock <= 10).length, color: 'var(--danger)' },
          { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, color: 'var(--text-lighter)' },
        ].map(s => (
          <div key={s.label} style={{ fontSize: '0.82rem', color: s.color, fontWeight: 700, background: `${s.color}12`, border: `1px solid ${s.color}25`, padding: '4px 14px', borderRadius: 99 }}>
            {s.value} {s.label}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters.</p>
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => { setSearch(''); setCategoryFilter('all'); setWaterFilter('All'); setCareFilter('All'); setLiveOnly(false); setLowStockOnly(false); }}>Clear All Filters</button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="products-grid" ref={gridRef}>
          {filtered.map(product => (
            <div className="product-card" key={product.id}>
              <div className="product-card-image" style={{ background: `linear-gradient(135deg, ${product.color}15, ${product.color}30)` }} onClick={() => setSelectedProduct(product)}>
                <span>{product.emoji}</span>
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {product.isLiveAnimal && <span style={{ background: 'var(--info)', color: 'white', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px' }}>🐟 LIVE</span>}
                  {product.stock <= 5 && <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>LOW</span>}
                  {product.stock === 0 && <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>OUT</span>}
                </div>
                {product.waterType && product.waterType !== 'N/A' && product.waterType !== 'All' && (
                  <span style={{ position: 'absolute', top: 8, right: 8, fontSize: '1rem' }}>{waterIcon(product.waterType)}</span>
                )}
              </div>
              <div className="product-card-body" onClick={() => setSelectedProduct(product)}>
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                  {product.careLevel && product.careLevel !== 'N/A' && (
                    <span className={`badge badge-${careLevelColor(product.careLevel)}`} style={{ fontSize: '0.7rem' }}>{product.careLevel}</span>
                  )}
                  <span className={`badge badge-${statusBadge(product.status)}`} style={{ fontSize: '0.7rem' }}>{product.status}</span>
                </div>
                <div className="product-card-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <span className={`product-stock ${product.stock <= 10 ? 'low' : ''}`}>{product.stock} in stock</span>
                </div>
                {product.sku && <div style={{ fontSize: '0.7rem', color: 'var(--text-lighter)', marginTop: 4 }}>SKU: {product.sku}</div>}
              </div>
              <div className="product-card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/products/edit/${product.id}`)}>✏️ Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(product)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Water</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Care</th>
                  <th>Live?</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          {p.shortDescription && <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{p.shortDescription.slice(0, 45)}{p.shortDescription.length > 45 ? '…' : ''}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>{p.sku || '—'}</td>
                    <td>{p.category}</td>
                    <td>{p.waterType && p.waterType !== 'N/A' ? <span>{waterIcon(p.waterType)} {p.waterType}</span> : '—'}</td>
                    <td style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                    <td>
                      <span className={p.stock === 0 ? 'badge badge-danger' : p.stock <= 10 ? 'badge badge-warning' : 'badge badge-success'}>{p.stock}</span>
                    </td>
                    <td>{p.careLevel && p.careLevel !== 'N/A' ? <span className={`badge badge-${careLevelColor(p.careLevel)}`}>{p.careLevel}</span> : '—'}</td>
                    <td>{p.isLiveAnimal ? '🐟' : '—'}</td>
                    <td><span className={`badge badge-${statusBadge(p.status)}`}>{p.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProduct(p)}>👁️</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/products/edit/${p.id}`)}>✏️</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(p)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct?.name || ''}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Close</button>
          <button className="btn btn-primary" onClick={() => { setSelectedProduct(null); navigate(`/products/edit/${selectedProduct?.id}`); }}>✏️ Edit</button>
        </>}
      >
        {selectedProduct && (
          <div>
            <div style={{ textAlign: 'center', padding: 24, borderRadius: 12, marginBottom: 20, background: `linear-gradient(135deg, ${selectedProduct.color}15, ${selectedProduct.color}30)` }}>
              <span style={{ fontSize: '4rem' }}>{selectedProduct.emoji}</span>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                {selectedProduct.isLiveAnimal && <span className="badge badge-info">🐟 Live Animal</span>}
                {selectedProduct.careLevel && selectedProduct.careLevel !== 'N/A' && <span className={`badge badge-${({ Easy:'success',Moderate:'warning',Advanced:'danger' }[selectedProduct.careLevel]||'default')}`}>{selectedProduct.careLevel}</span>}
                {selectedProduct.waterType && selectedProduct.waterType !== 'N/A' && <span className="badge badge-default">{waterIcon(selectedProduct.waterType)} {selectedProduct.waterType}</span>}
              </div>
            </div>

            {selectedProduct.shortDescription && <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginBottom: 14, fontStyle: 'italic' }}>{selectedProduct.shortDescription}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {[
                ['💰 Price', `$${selectedProduct.price.toFixed(2)}`],
                ['📦 Stock', `${selectedProduct.stock} units`],
                ['🏷️ SKU', selectedProduct.sku || '—'],
                ['🚚 Supplier', selectedProduct.supplier || '—'],
                ['🏠 Tank Size', selectedProduct.tankSize || '—'],
                ['🌡️ Temperature', selectedProduct.temperature || '—'],
                ['🧪 pH Range', selectedProduct.pH || '—'],
                ['🌊 Salinity', selectedProduct.salinity || '—'],
                ['💧 Hardness', selectedProduct.hardness || '—'],
                ['💡 Lighting', selectedProduct.lighting || '—'],
                ['🌍 Origin', selectedProduct.origin || '—'],
                ['📏 Max Size', selectedProduct.maxSize || '—'],
                ['⏳ Lifespan', selectedProduct.lifespan || '—'],
                ['😤 Temperament', selectedProduct.temperament || '—'],
                ['🥣 Diet', selectedProduct.diet || '—'],
                ['⏰ Feeding', selectedProduct.feedingFrequency || '—'],
              ].map(([label, val]) => (
                <div className="detail-row" key={label} style={{ padding: '5px 0' }}>
                  <span className="label" style={{ fontSize: '0.78rem' }}>{label}</span>
                  <span className="value" style={{ fontSize: '0.82rem' }}>{val}</span>
                </div>
              ))}
            </div>

            {selectedProduct.compatibility && (
              <div style={{ marginTop: 12, padding: 12, background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text)' }}>
                <strong>🤝 Compatibility:</strong> {selectedProduct.compatibility}
              </div>
            )}

            {selectedProduct.isLiveAnimal && selectedProduct.shippingRestrictions && (
              <div style={{ marginTop: 8, padding: 12, background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#92400e' }}>
                <strong>🚚 Shipping:</strong> {selectedProduct.shippingRestrictions}
              </div>
            )}

            {selectedProduct.description && (
              <p style={{ marginTop: 14, fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.65 }}>{selectedProduct.description}</p>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Product"
        footer={<><button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button><button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm?.id)}>🗑️ Delete</button></>}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <p style={{ marginTop: 12 }}>Delete <strong>{deleteConfirm?.name}</strong>? This cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
