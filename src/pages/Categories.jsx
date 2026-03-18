import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import Modal from '../components/Modal';

const defaultIcons = ['🐟','🐠','🐡','🦈','🪸','🌿','🏠','⚙️','🥘','🏰','💧','💡','🎨','🧪','🌊','🦐','🐙','🐚','🐢','🦜','🐾','🐍','🐸','🦎','🌺','🍀','🦑','🦀','🧴','🔬','💊','🌡️'];

const WATER_TYPES = ['All','Freshwater','Saltwater','Brackish','N/A'];
const SORT_OPTIONS = ['Name A–Z','Name Z–A','Most Products','Fewest Products','Recently Added'];

export default function Categories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useShop();
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterWater, setFilterWater] = useState('All');
  const [sortBy, setSortBy] = useState('Name A–Z');

  const [form, setForm] = useState({
    name: '', icon: '🐟', description: '',
    waterType: 'All', isVisible: true, sortOrder: 0, slug: '',
    metaDescription: '', featuredTag: '',
  });



  const openAdd = () => {
    setEditCat(null);
    setForm({ name: '', icon: '🐟', description: '', waterType: 'All', isVisible: true, sortOrder: categories.length, slug: '', metaDescription: '', featuredTag: '' });
    setShowForm(true);
  };

  const openEdit = cat => {
    setEditCat(cat);
    setForm({
      name: cat.name, icon: cat.icon, description: cat.description,
      waterType: cat.waterType || 'All', isVisible: cat.isVisible !== false,
      sortOrder: cat.sortOrder || 0, slug: cat.slug || '',
      metaDescription: cat.metaDescription || '', featuredTag: cat.featuredTag || '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const autoSlug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (editCat) updateCategory(editCat.id, { ...form, slug: autoSlug });
    else addCategory({ ...form, slug: autoSlug });
    setShowForm(false);
  };

  const getCatProducts = id => products.filter(p => p.categoryId === id);

  const filtered = categories
    .filter(c => filterWater === 'All' || (c.waterType || 'All') === filterWater)
    .sort((a, b) => {
      const pa = getCatProducts(a.id).length, pb = getCatProducts(b.id).length;
      if (sortBy === 'Name A–Z') return a.name.localeCompare(b.name);
      if (sortBy === 'Name Z–A') return b.name.localeCompare(a.name);
      if (sortBy === 'Most Products') return pb - pa;
      if (sortBy === 'Fewest Products') return pa - pb;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });

  const waterBadge = wt => {
    const map = { Freshwater:'#3b82f6', Saltwater:'#0891b2', Brackish:'#8b5cf6', All:'#10b981' };
    return map[wt] || '#94a3b8';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><span>🏷️</span> Categories</h1>
          <p className="page-subtitle">{filtered.length} of {categories.length} product categories</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Category</button>
      </div>

      {/* Filters */}
      <div className="product-controls" style={{ marginBottom: 24 }}>
        <div className="product-filters">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {WATER_TYPES.map(wt => (
              <button key={wt} onClick={() => setFilterWater(wt)}
                className={`btn btn-sm ${filterWater === wt ? 'btn-primary' : 'btn-secondary'}`}>
                {wt === 'Freshwater' ? '🟦' : wt === 'Saltwater' ? '🌊' : wt === 'Brackish' ? '🪣' : '🔵'} {wt}
              </button>
            ))}
          </div>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Categories', value: categories.length, icon: '🏷️', color: 'var(--primary)' },
          { label: 'Visible', value: categories.filter(c => c.isVisible !== false).length, icon: '👁️', color: 'var(--success)' },
          { label: 'Hidden', value: categories.filter(c => c.isVisible === false).length, icon: '🙈', color: 'var(--text-light)' },
          { label: 'Total Products', value: products.length, icon: '📦', color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 140px' }}>
            <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="categories-grid">
        {filtered.map(cat => {
          const catProds = getCatProducts(cat.id);
          const isHidden = cat.isVisible === false;
          return (
            <div className="category-card card" key={cat.id} style={{ opacity: isHidden ? 0.6 : 1, position: 'relative' }}>
              {isHidden && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--text-lighter)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px' }}>Hidden</div>
              )}
              {cat.featuredTag && (
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--warning)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px' }}>{cat.featuredTag}</div>
              )}
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              {cat.waterType && cat.waterType !== 'All' && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ background: `${waterBadge(cat.waterType)}20`, color: waterBadge(cat.waterType), border: `1px solid ${waterBadge(cat.waterType)}40`, padding: '2px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600 }}>
                    {cat.waterType}
                  </span>
                </div>
              )}
              <span className="category-count">{catProds.length} products</span>
              {cat.slug && <div style={{ fontSize: '0.72rem', color: 'var(--text-lighter)', marginTop: 4 }}>/{cat.slug}</div>}
              <div className="category-card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}>✏️ Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(cat)}>🗑️ Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}
        title={editCat ? `Edit — ${editCat.name}` : 'Add New Category'}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{editCat ? '✅ Update' : '➕ Add'}</button>
        </>}
      >
        {/* Name */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Category Name *</label>
          <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Tropical Fish" />
        </div>

        {/* Icon */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Icon</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {defaultIcons.map(icon => (
              <button type="button" key={icon} onClick={() => setForm(p => ({ ...p, icon }))}
                style={{ fontSize: '1.4rem', padding: '5px 8px', borderRadius: 8, border: '2px solid', cursor: 'pointer', borderColor: form.icon === icon ? 'var(--primary)' : 'var(--border-light)', background: form.icon === icon ? 'var(--primary-50)' : 'white' }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Water Type */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Water Type</label>
          <select value={form.waterType} onChange={e => setForm(p => ({ ...p, waterType: e.target.value }))}>
            {WATER_TYPES.map(wt => <option key={wt} value={wt}>{wt}</option>)}
          </select>
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." rows={2} />
        </div>

        {/* Meta Description */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>SEO / Meta Description</label>
          <input type="text" value={form.metaDescription} onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value }))} placeholder="For search engine display..." maxLength={160} />
        </div>

        {/* Slug */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label>URL Slug <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(auto-generated if blank)</span></label>
          <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') }))} placeholder="e.g. freshwater-fish" />
        </div>

        {/* Sort order + Featured tag side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div className="form-group">
            <label>Display Sort Order</label>
            <input type="number" min="0" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} placeholder="0" />
          </div>
          <div className="form-group">
            <label>Featured Tag <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(optional)</span></label>
            <input type="text" value={form.featuredTag} onChange={e => setForm(p => ({ ...p, featuredTag: e.target.value }))} placeholder="e.g. SALE, NEW, HOT" maxLength={10} />
          </div>
        </div>

        {/* Visibility toggle */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600 }}>
            <input type="checkbox" checked={form.isVisible} onChange={e => setForm(p => ({ ...p, isVisible: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
            👁️ Visible to customers on the storefront
          </label>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Category"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { deleteCategory(deleteConfirm?.id); setDeleteConfirm(null); }}>🗑️ Delete</button>
        </>}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <p style={{ marginTop: 12 }}>
            Delete category <strong>{deleteConfirm?.name}</strong>?<br />
            <span style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>Products in this category won't be deleted but will be uncategorised.</span>
          </p>
        </div>
      </Modal>
    </div>
  );
}
