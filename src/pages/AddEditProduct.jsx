import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const emojiOptions = ['🐠','🐟','🐡','🦈','🐙','🦐','🦀','🐚','🪸','🌿','🍀','⚙️','🥘','🦑','💡','💧','🏠','🏰','🌊','🌺','✨','🔴','💛','🌈','🐢','🦎','🐸','🐍','🦜','🐹','🐇','🐾'];
const colorOptions = ['#ff6b35','#3b82f6','#8b5cf6','#06b6d4','#ef4444','#f59e0b','#ec4899','#eab308','#10b981','#14b8a6','#22c55e','#16a34a','#64748b','#475569','#f97316','#d97706','#fb923c','#a78bfa','#0ea5e9','#a3e635'];

function Section({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h4 style={{
        fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.5px', color: 'var(--text-light)', marginBottom: 16,
        paddingBottom: 10, borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>{icon}</span> {title}
      </h4>
      {children}
    </div>
  );
}

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct } = useShop();
  const formRef = useRef(null);
  const isEdit = !!id;
  const existing = isEdit ? products.find(p => p.id === parseInt(id)) : null;

  const [form, setForm] = useState({
    name: '', categoryId: '', price: '', stock: '', emoji: '🐠', color: '#0891b2',
    status: 'active', sku: '', barcode: '', supplier: '',
    shortDescription: '', description: '',
    careLevel: 'Easy', waterType: 'Freshwater', tankSize: '', temperature: '',
    pH: '', salinity: '', hardness: '', lighting: 'Low',
    origin: '', maxSize: '', lifespan: '', diet: '', feedingFrequency: 'Twice daily',
    compatibility: '', temperament: 'Peaceful',
    isLiveAnimal: false, shippingRestrictions: '', minTemp: '', maxTemp: '',
    acclimationNotes: '', weight: '', dimensions: '', warrantyPeriod: '',
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || '', categoryId: existing.categoryId?.toString() || '',
        price: existing.price?.toString() || '', stock: existing.stock?.toString() || '',
        emoji: existing.emoji || '🐠', color: existing.color || '#0891b2',
        status: existing.status || 'active', sku: existing.sku || '',
        barcode: existing.barcode || '', supplier: existing.supplier || '',
        shortDescription: existing.shortDescription || '',
        description: existing.description || '',
        careLevel: existing.careLevel || 'Easy', waterType: existing.waterType || 'Freshwater',
        tankSize: existing.tankSize || '', temperature: existing.temperature || '',
        pH: existing.pH || '', salinity: existing.salinity || '',
        hardness: existing.hardness || '', lighting: existing.lighting || 'Low',
        origin: existing.origin || '', maxSize: existing.maxSize || '',
        lifespan: existing.lifespan || '', diet: existing.diet || '',
        feedingFrequency: existing.feedingFrequency || 'Twice daily',
        compatibility: existing.compatibility || '', temperament: existing.temperament || 'Peaceful',
        isLiveAnimal: existing.isLiveAnimal || false,
        shippingRestrictions: existing.shippingRestrictions || '',
        minTemp: existing.minTemp || '', maxTemp: existing.maxTemp || '',
        acclimationNotes: existing.acclimationNotes || '',
        weight: existing.weight || '', dimensions: existing.dimensions || '',
        warrantyPeriod: existing.warrantyPeriod || '',
      });
    }
  }, [existing]);



  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    set(e.target.name, val);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const cat = categories.find(c => c.id === parseInt(form.categoryId));
    const data = {
      ...form,
      categoryId: parseInt(form.categoryId),
      category: cat?.name || '',
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };
    if (isEdit) updateProduct(parseInt(id), data);
    else addProduct(data);
    navigate('/products');
  };

  return (
    <div className="form-page" ref={formRef}>
      <div className="page-header">
        <div>
          <h1><span>{isEdit ? '✏️' : '➕'}</span> {isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update product information' : 'Add a new product to your inventory'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/products')}>← Back to Products</button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>

            {/* Preview */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="form-preview" style={{ width: 120, height: 120, margin: '0 auto', background: `linear-gradient(135deg, ${form.color}20, ${form.color}40)`, fontSize: '3.5rem' }}>
                {form.emoji}
              </div>
              <h3 style={{ marginTop: 12, color: 'var(--text)' }}>{form.name || 'Product Name'}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                {form.price ? `$${parseFloat(form.price || 0).toFixed(2)}` : '$0.00'}
                {form.sku ? ` · SKU: ${form.sku}` : ''}
                {form.isLiveAnimal ? ' · 🐟 Live Animal' : ''}
              </p>
            </div>

            {/* ── Core ── */}
            <Section icon="📦" title="Core Information">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Clownfish" required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" min="0" placeholder="24.99" required />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" placeholder="50" required />
                </div>
                <div className="form-group">
                  <label>SKU / Item Code</label>
                  <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. SW-CLF-001" />
                </div>
                <div className="form-group">
                  <label>Barcode / UPC</label>
                  <input type="text" name="barcode" value={form.barcode} onChange={handleChange} placeholder="e.g. 012345678901" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="active">✅ Active</option>
                    <option value="inactive">⛔ Inactive</option>
                    <option value="draft">📝 Draft</option>
                    <option value="outofseason">🌿 Out of Season</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Supplier / Vendor</label>
                  <input type="text" name="supplier" value={form.supplier} onChange={handleChange} placeholder="e.g. Pacific Marine Imports" />
                </div>
              </div>
            </Section>

            {/* ── Visuals ── */}
            <Section icon="🎨" title="Visual Identity">
              <div className="form-grid">
                <div className="form-group">
                  <label>Emoji Icon</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {emojiOptions.map(e => (
                      <button type="button" key={e} onClick={() => set('emoji', e)} style={{ fontSize: '1.4rem', padding: '4px 8px', borderRadius: 8, border: '2px solid', borderColor: form.emoji === e ? 'var(--primary)' : 'var(--border-light)', background: form.emoji === e ? 'var(--primary-50)' : 'white', cursor: 'pointer' }}>{e}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Card Colour</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {colorOptions.map(c => (
                      <button type="button" key={c} onClick={() => set('color', c)} style={{ width: 30, height: 30, borderRadius: 8, background: c, border: '3px solid', borderColor: form.color === c ? 'var(--text)' : 'transparent', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* ── Descriptions ── */}
            <Section icon="📝" title="Descriptions">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Short Description <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>(shown on product cards &amp; search)</span></label>
                  <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="One-line summary, max 120 chars..." maxLength={120} />
                </div>
                <div className="form-group full">
                  <label>Full Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Detailed description, care notes, ideal setup..." rows={4} />
                </div>
              </div>
            </Section>

            {/* ── Aquatic Care ── */}
            <Section icon="🌊" title="Aquatic Care Parameters">
              <div className="form-grid">
                <div className="form-group">
                  <label>Water Type</label>
                  <select name="waterType" value={form.waterType} onChange={handleChange}>
                    <option value="Freshwater">🟦 Freshwater</option>
                    <option value="Saltwater">🌊 Saltwater / Marine</option>
                    <option value="Brackish">🪣 Brackish</option>
                    <option value="N/A">— Not Applicable</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Care Level</label>
                  <select name="careLevel" value={form.careLevel} onChange={handleChange}>
                    <option value="Easy">🟢 Easy</option>
                    <option value="Moderate">🟡 Moderate</option>
                    <option value="Advanced">🔴 Advanced</option>
                    <option value="N/A">— Not Applicable</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Minimum Tank Size</label>
                  <input type="text" name="tankSize" value={form.tankSize} onChange={handleChange} placeholder="e.g. 20 gallons" />
                </div>
                <div className="form-group">
                  <label>Temperature Range</label>
                  <input type="text" name="temperature" value={form.temperature} onChange={handleChange} placeholder="e.g. 75–82 °F" />
                </div>
                <div className="form-group">
                  <label>pH Range</label>
                  <input type="text" name="pH" value={form.pH} onChange={handleChange} placeholder="e.g. 8.0–8.4" />
                </div>
                <div className="form-group">
                  <label>Salinity / Specific Gravity</label>
                  <input type="text" name="salinity" value={form.salinity} onChange={handleChange} placeholder="e.g. 1.020–1.025 SG" />
                </div>
                <div className="form-group">
                  <label>Water Hardness (dGH)</label>
                  <input type="text" name="hardness" value={form.hardness} onChange={handleChange} placeholder="e.g. 8–12 dGH" />
                </div>
                <div className="form-group">
                  <label>Lighting Requirement</label>
                  <select name="lighting" value={form.lighting} onChange={handleChange}>
                    <option value="Low">🌑 Low</option>
                    <option value="Moderate">🌗 Moderate</option>
                    <option value="High">☀️ High / Intense</option>
                    <option value="N/A">— Not Applicable</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* ── Biology ── */}
            <Section icon="🐾" title="Biology &amp; Behaviour">
              <div className="form-grid">
                <div className="form-group">
                  <label>Origin / Natural Habitat</label>
                  <input type="text" name="origin" value={form.origin} onChange={handleChange} placeholder="e.g. Indo-Pacific reefs" />
                </div>
                <div className="form-group">
                  <label>Max Adult Size</label>
                  <input type="text" name="maxSize" value={form.maxSize} onChange={handleChange} placeholder="e.g. 3 in / 7 cm" />
                </div>
                <div className="form-group">
                  <label>Lifespan</label>
                  <input type="text" name="lifespan" value={form.lifespan} onChange={handleChange} placeholder="e.g. 3–5 years" />
                </div>
                <div className="form-group">
                  <label>Temperament</label>
                  <select name="temperament" value={form.temperament} onChange={handleChange}>
                    <option value="Peaceful">🕊️ Peaceful</option>
                    <option value="Semi-aggressive">⚠️ Semi-Aggressive</option>
                    <option value="Aggressive">🔴 Aggressive</option>
                    <option value="Solitary">🔵 Solitary</option>
                    <option value="N/A">— Not Applicable</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Diet / Food Type</label>
                  <input type="text" name="diet" value={form.diet} onChange={handleChange} placeholder="e.g. Omnivore — flakes, pellets, frozen mysis" />
                </div>
                <div className="form-group">
                  <label>Feeding Frequency</label>
                  <select name="feedingFrequency" value={form.feedingFrequency} onChange={handleChange}>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Every other day">Every other day</option>
                    <option value="Weekly">Weekly</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label>Tank Mate Compatibility</label>
                  <textarea name="compatibility" value={form.compatibility} onChange={handleChange} placeholder="e.g. Reef-safe. Keep with peaceful community fish. Avoid housing with aggressive tangs." rows={3} />
                </div>
              </div>
            </Section>

            {/* ── Shipping ── */}
            <Section icon="🚚" title="Shipping &amp; Live Animal Policy">
              <div className="form-grid">
                <div className="form-group full">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600 }}>
                    <input type="checkbox" name="isLiveAnimal" checked={form.isLiveAnimal} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }} />
                    🐟 This is a live animal — requires special shipping handling
                  </label>
                </div>
                {form.isLiveAnimal && (<>
                  <div className="form-group">
                    <label>Min Safe Shipping Temp</label>
                    <input type="text" name="minTemp" value={form.minTemp} onChange={handleChange} placeholder="e.g. 50 °F" />
                  </div>
                  <div className="form-group">
                    <label>Max Safe Shipping Temp</label>
                    <input type="text" name="maxTemp" value={form.maxTemp} onChange={handleChange} placeholder="e.g. 85 °F" />
                  </div>
                  <div className="form-group full">
                    <label>Shipping Restrictions</label>
                    <input type="text" name="shippingRestrictions" value={form.shippingRestrictions} onChange={handleChange} placeholder="e.g. Cannot ship to HI, AK. Overnight only." />
                  </div>
                  <div className="form-group full">
                    <label>Acclimation Instructions</label>
                    <textarea name="acclimationNotes" value={form.acclimationNotes} onChange={handleChange} placeholder="e.g. Float bag for 15 min, slowly add tank water over 30 min before release." rows={3} />
                  </div>
                </>)}
                <div className="form-group">
                  <label>Shipping Weight</label>
                  <input type="text" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 0.5 lbs" />
                </div>
                <div className="form-group">
                  <label>Package Dimensions (L×W×H)</label>
                  <input type="text" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="e.g. 6×4×4 in" />
                </div>
                <div className="form-group">
                  <label>Warranty / Live Guarantee</label>
                  <select name="warrantyPeriod" value={form.warrantyPeriod} onChange={handleChange}>
                    <option value="">No Warranty</option>
                    <option value="DOA only">DOA (Dead on Arrival) Only</option>
                    <option value="24 hours">24-Hour Live Guarantee</option>
                    <option value="7 days">7-Day Live Guarantee</option>
                    <option value="30 days">30-Day Equipment Warranty</option>
                    <option value="1 year">1-Year Warranty</option>
                  </select>
                </div>
              </div>
            </Section>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {isEdit ? '✅ Update Product' : '➕ Add Product'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
