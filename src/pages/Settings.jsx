import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

function SectionCard({ icon, title, children, onSave, saveLabel = 'Save' }) {
  return (
    <div className="card settings-section" style={{ marginBottom: 24 }}>
      <div className="card-body" style={{ padding: 32 }}>
        <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 16, borderBottom: '2px solid var(--border-light)', fontSize: '1rem' }}>
          {icon} {title}
        </h3>
        {children}
        {onSave && (
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={onSave}>💾 {saveLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Settings() {
  const { showToast } = useShop();

  const [shop, setShop] = useState({
    shopName: 'AquaAdmin Pet Shop', email: 'admin@aquaadmin.com',
    phone: '(555) 000-1234', website: 'www.aquaadmin.com',
    address: '123 Ocean Boulevard, Marina Bay, FL 33139',
    currency: 'USD', taxRate: '7.5', taxIncluded: false,
    shippingFee: '9.99', freeShippingMin: '75',
    instagramHandle: '', facebookPage: '',
  });

  const [hours, setHours] = useState({
    monFri: '9:00 AM – 6:00 PM', saturday: '10:00 AM – 5:00 PM',
    sunday: 'Closed', holidays: 'Closed on public holidays',
    timezone: 'America/New_York',
  });

  const [liveAnimal, setLiveAnimal] = useState({
    offerLiveAnimalShipping: true,
    liveArrivalGuarantee: '24 hours',
    overnightOnly: true,
    doNotShipBelow: '50', doNotShipAbove: '90',
    blackoutMonths: 'Dec–Jan (extreme cold)',
    packagingNote: 'All live animals are packed with insulated foam, heat/cold packs, and oxygen-infused bags.',
    returnPolicy: 'DOA claims must be reported within 2 hours of delivery with a clear photo.',
  });

  const [waterQuality, setWaterQuality] = useState({
    lowStockThreshold: '10',
    enableLowStockAlerts: true,
    waterTestReminderDays: '7',
    enableWaterTestAlerts: false,
    preferredTestKit: 'API Master Test Kit',
    quarantinePeriodDays: '14',
    defaultAcclimationTime: '30 minutes',
  });

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Pacific Marine Imports', contact: 'sales@pacificmarine.com', phone: '(555) 100-2000', type: 'Saltwater', leadDays: 3 },
    { id: 2, name: 'Amazon Aquatics', contact: 'orders@amazonaquatics.com', phone: '(555) 200-3000', type: 'Freshwater', leadDays: 5 },
  ]);

  const [profile, setProfile] = useState({
    name: 'Admin User', email: 'admin@aquaadmin.com', role: 'Shop Manager',
  });

  const [notifications, setNotifications] = useState({
    emailOnNewOrder: true, emailOnLowStock: true,
    emailOnNewCustomer: false, smsOnNewOrder: false,
    dailySummary: true,
  });



  const save = section => showToast(`${section} settings saved! ✅`, 'success');

  const toggle = (setter, key) => setter(prev => ({ ...prev, [key]: !prev[key] }));

  const Toggle = ({ checked, onChange, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }} />
      <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </label>
  );

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div>
          <h1><span>⚙️</span> Settings</h1>
          <p className="page-subtitle">Manage your aquarium shop configuration</p>
        </div>
      </div>

      {/* Shop Info */}
      <SectionCard icon="🏪" title="Shop Information" onSave={() => save('Shop')}>
        <div className="form-grid">
          <div className="form-group">
            <label>Shop Name</label>
            <input type="text" name="shopName" value={shop.shopName} onChange={e => setShop(p => ({ ...p, shopName: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input type="email" value={shop.email} onChange={e => setShop(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={shop.phone} onChange={e => setShop(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="text" value={shop.website} onChange={e => setShop(p => ({ ...p, website: e.target.value }))} placeholder="www.yourshop.com" />
          </div>
          <div className="form-group full">
            <label>Shop Address</label>
            <input type="text" value={shop.address} onChange={e => setShop(p => ({ ...p, address: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Instagram Handle</label>
            <input type="text" value={shop.instagramHandle} onChange={e => setShop(p => ({ ...p, instagramHandle: e.target.value }))} placeholder="@aquaadmin" />
          </div>
          <div className="form-group">
            <label>Facebook Page</label>
            <input type="text" value={shop.facebookPage} onChange={e => setShop(p => ({ ...p, facebookPage: e.target.value }))} placeholder="facebook.com/aquaadmin" />
          </div>
        </div>
      </SectionCard>

      {/* Business Hours */}
      <SectionCard icon="🕐" title="Business Hours" onSave={() => save('Hours')}>
        <div className="form-grid">
          <div className="form-group">
            <label>Monday – Friday</label>
            <input type="text" value={hours.monFri} onChange={e => setHours(p => ({ ...p, monFri: e.target.value }))} placeholder="9:00 AM – 6:00 PM" />
          </div>
          <div className="form-group">
            <label>Saturday</label>
            <input type="text" value={hours.saturday} onChange={e => setHours(p => ({ ...p, saturday: e.target.value }))} placeholder="10:00 AM – 5:00 PM" />
          </div>
          <div className="form-group">
            <label>Sunday</label>
            <input type="text" value={hours.sunday} onChange={e => setHours(p => ({ ...p, sunday: e.target.value }))} placeholder="Closed" />
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <select value={hours.timezone} onChange={e => setHours(p => ({ ...p, timezone: e.target.value }))}>
              <option value="America/New_York">Eastern (ET)</option>
              <option value="America/Chicago">Central (CT)</option>
              <option value="America/Denver">Mountain (MT)</option>
              <option value="America/Los_Angeles">Pacific (PT)</option>
              <option value="Pacific/Honolulu">Hawaii (HT)</option>
            </select>
          </div>
          <div className="form-group full">
            <label>Holiday / Special Hours Note</label>
            <input type="text" value={hours.holidays} onChange={e => setHours(p => ({ ...p, holidays: e.target.value }))} placeholder="e.g. Closed on public holidays" />
          </div>
        </div>
      </SectionCard>

      {/* Pricing */}
      <SectionCard icon="💲" title="Pricing &amp; Shipping" onSave={() => save('Pricing')}>
        <div className="form-grid">
          <div className="form-group">
            <label>Currency</label>
            <select value={shop.currency} onChange={e => setShop(p => ({ ...p, currency: e.target.value }))}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tax Rate (%)</label>
            <input type="number" value={shop.taxRate} onChange={e => setShop(p => ({ ...p, taxRate: e.target.value }))} step="0.1" />
          </div>
          <div className="form-group">
            <label>Standard Shipping Fee ($)</label>
            <input type="number" value={shop.shippingFee} onChange={e => setShop(p => ({ ...p, shippingFee: e.target.value }))} step="0.01" />
          </div>
          <div className="form-group">
            <label>Free Shipping Minimum ($)</label>
            <input type="number" value={shop.freeShippingMin} onChange={e => setShop(p => ({ ...p, freeShippingMin: e.target.value }))} />
          </div>
          <div className="form-group full">
            <Toggle checked={shop.taxIncluded} onChange={() => toggle(setShop, 'taxIncluded')} label="Prices displayed include tax (tax-inclusive pricing)" />
          </div>
        </div>
      </SectionCard>

      {/* Live Animal Shipping */}
      <SectionCard icon="🐟" title="Live Animal Shipping Policy" onSave={() => save('Live Animal')}>
        <div className="form-grid">
          <div className="form-group full">
            <Toggle checked={liveAnimal.offerLiveAnimalShipping} onChange={() => toggle(setLiveAnimal, 'offerLiveAnimalShipping')} label="Offer live animal shipping" />
            <Toggle checked={liveAnimal.overnightOnly} onChange={() => toggle(setLiveAnimal, 'overnightOnly')} label="Require overnight shipping for all live animals" />
          </div>
          <div className="form-group">
            <label>Live Arrival Guarantee</label>
            <select value={liveAnimal.liveArrivalGuarantee} onChange={e => setLiveAnimal(p => ({ ...p, liveArrivalGuarantee: e.target.value }))}>
              <option value="DOA only">DOA Replacement Only</option>
              <option value="24 hours">24-Hour Live Guarantee</option>
              <option value="7 days">7-Day Live Guarantee</option>
              <option value="None">No Guarantee</option>
            </select>
          </div>
          <div className="form-group">
            <label>Blackout Months (no shipping)</label>
            <input type="text" value={liveAnimal.blackoutMonths} onChange={e => setLiveAnimal(p => ({ ...p, blackoutMonths: e.target.value }))} placeholder="e.g. Dec–Jan" />
          </div>
          <div className="form-group">
            <label>Do Not Ship Below (°F)</label>
            <input type="number" value={liveAnimal.doNotShipBelow} onChange={e => setLiveAnimal(p => ({ ...p, doNotShipBelow: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Do Not Ship Above (°F)</label>
            <input type="number" value={liveAnimal.doNotShipAbove} onChange={e => setLiveAnimal(p => ({ ...p, doNotShipAbove: e.target.value }))} />
          </div>
          <div className="form-group full">
            <label>Packaging Note (shown to customers)</label>
            <textarea value={liveAnimal.packagingNote} onChange={e => setLiveAnimal(p => ({ ...p, packagingNote: e.target.value }))} rows={2} />
          </div>
          <div className="form-group full">
            <label>DOA / Return Policy</label>
            <textarea value={liveAnimal.returnPolicy} onChange={e => setLiveAnimal(p => ({ ...p, returnPolicy: e.target.value }))} rows={2} />
          </div>
        </div>
      </SectionCard>

      {/* Water Quality & Inventory Alerts */}
      <SectionCard icon="🔬" title="Water Quality &amp; Inventory Alerts" onSave={() => save('Alerts')}>
        <div className="form-grid">
          <div className="form-group full">
            <Toggle checked={waterQuality.enableLowStockAlerts} onChange={() => toggle(setWaterQuality, 'enableLowStockAlerts')} label="Alert when product stock falls below threshold" />
            <Toggle checked={waterQuality.enableWaterTestAlerts} onChange={() => toggle(setWaterQuality, 'enableWaterTestAlerts')} label="Schedule periodic water quality test reminders" />
          </div>
          <div className="form-group">
            <label>Low Stock Alert Threshold (units)</label>
            <input type="number" min="1" value={waterQuality.lowStockThreshold} onChange={e => setWaterQuality(p => ({ ...p, lowStockThreshold: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Water Test Reminder (every N days)</label>
            <input type="number" min="1" value={waterQuality.waterTestReminderDays} onChange={e => setWaterQuality(p => ({ ...p, waterTestReminderDays: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Preferred Test Kit</label>
            <input type="text" value={waterQuality.preferredTestKit} onChange={e => setWaterQuality(p => ({ ...p, preferredTestKit: e.target.value }))} placeholder="e.g. API Master Test Kit" />
          </div>
          <div className="form-group">
            <label>Default Quarantine Period (days)</label>
            <input type="number" min="0" value={waterQuality.quarantinePeriodDays} onChange={e => setWaterQuality(p => ({ ...p, quarantinePeriodDays: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Default Acclimation Time</label>
            <input type="text" value={waterQuality.defaultAcclimationTime} onChange={e => setWaterQuality(p => ({ ...p, defaultAcclimationTime: e.target.value }))} placeholder="e.g. 30 minutes" />
          </div>
        </div>
      </SectionCard>

      {/* Suppliers */}
      <SectionCard icon="🚚" title="Supplier / Vendor Management">
        <div style={{ marginBottom: 16 }}>
          {suppliers.map((s, i) => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 10, alignItems: 'end', marginBottom: 12, padding: '14px', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>Supplier Name</label>
                <input type="text" value={s.name} onChange={e => setSuppliers(p => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>Contact Email</label>
                <input type="email" value={s.contact} onChange={e => setSuppliers(p => p.map((x, j) => j === i ? { ...x, contact: e.target.value } : x))} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>Speciality</label>
                <select value={s.type} onChange={e => setSuppliers(p => p.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}>
                  <option value="Freshwater">Freshwater</option>
                  <option value="Saltwater">Saltwater</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Food">Food</option>
                  <option value="Plants">Plants</option>
                  <option value="All">All</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>Lead Days</label>
                <input type="number" min="0" value={s.leadDays} style={{ width: 70 }} onChange={e => setSuppliers(p => p.map((x, j) => j === i ? { ...x, leadDays: parseInt(e.target.value) } : x))} />
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSuppliers(p => p.filter((_, j) => j !== i))} style={{ color: 'var(--danger)' }}>🗑️</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setSuppliers(p => [...p, { id: Date.now(), name: '', contact: '', phone: '', type: 'All', leadDays: 3 }])}>
            ➕ Add Supplier
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => save('Suppliers')}>💾 Save Suppliers</button>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon="🔔" title="Notification Preferences" onSave={() => save('Notifications')}>
        <div>
          <Toggle checked={notifications.emailOnNewOrder} onChange={() => toggle(setNotifications, 'emailOnNewOrder')} label="📧 Email me on new orders" />
          <Toggle checked={notifications.emailOnLowStock} onChange={() => toggle(setNotifications, 'emailOnLowStock')} label="📧 Email me on low stock alerts" />
          <Toggle checked={notifications.emailOnNewCustomer} onChange={() => toggle(setNotifications, 'emailOnNewCustomer')} label="📧 Email me when a new customer registers" />
          <Toggle checked={notifications.smsOnNewOrder} onChange={() => toggle(setNotifications, 'smsOnNewOrder')} label="📱 SMS me on new orders" />
          <Toggle checked={notifications.dailySummary} onChange={() => toggle(setNotifications, 'dailySummary')} label="📊 Daily summary digest email" />
        </div>
      </SectionCard>

      {/* Profile */}
      <SectionCard icon="👤" title="Profile Settings" onSave={() => save('Profile')}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: 700 }}>
            {profile.name.charAt(0)}
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" value={profile.role} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
