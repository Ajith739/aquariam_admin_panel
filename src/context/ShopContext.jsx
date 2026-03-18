import { createContext, useContext, useState, useCallback } from 'react';
import {
  initialProducts,
  initialOrders,
  initialCustomers,
  initialCategories,
} from '../data/mockData';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [customers] = useState(initialCustomers);
  const [categories, setCategories] = useState(initialCategories);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addProduct = useCallback((product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [newProduct, ...prev]);
    showToast('Product added successfully! 🐠');
    return newProduct;
  }, [showToast]);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Product updated successfully! ✅');
  }, [showToast]);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted!', 'info');
  }, [showToast]);

  const updateOrderStatus = useCallback((id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Order ${id} status updated to ${status}`);
  }, [showToast]);

  const deleteOrder = useCallback((id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast('Order deleted!', 'info');
  }, [showToast]);

  const addCategory = useCallback((category) => {
    const newCat = { ...category, id: Date.now(), productCount: 0 };
    setCategories(prev => [...prev, newCat]);
    showToast('Category added! 📁');
  }, [showToast]);

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Category updated! ✅');
  }, [showToast]);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted!', 'info');
  }, [showToast]);

  const stats = {
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    lowStockProducts: products.filter(p => p.stock <= 5),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
  };

  return (
    <ShopContext.Provider value={{
      products, orders, customers, categories, stats,
      addProduct, updateProduct, deleteProduct,
      updateOrderStatus, deleteOrder,
      addCategory, updateCategory, deleteCategory,
      toasts, showToast, removeToast,
      sidebarOpen, setSidebarOpen,
      mobileMenuOpen, setMobileMenuOpen,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
};
