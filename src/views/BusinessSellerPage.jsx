import React, { useState, useEffect } from 'react';
import { 
  Store, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Eye, 
  Plus, 
  Search, 
  Tag, 
  DollarSign,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Minus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { sellerApi } from '../services/sellerApi';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../data/mockData';

export function BusinessSellerPage() {
  const [stats, setStats] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: 'Engineering',
    sku: '',
    stock: 10,
    price: '',
    mrp: '',
    discount: 15,
    shipping: 'Free Express Delivery'
  });
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await sellerApi.getBusinessInventory();
      if (res && Array.isArray(res.inventory)) {
        setInventory(res.inventory);
        if (res.stats) setStats(res.stats);
      } else if (Array.isArray(res)) {
        setInventory(res);
      } else {
        setInventory([]);
      }
    } catch (err) {
      console.error('Failed to load business inventory', err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.price) {
      addToast('Please enter title and selling price', 'error');
      return;
    }
    try {
      const added = await sellerApi.addBusinessBook(newBook);
      setInventory(prev => [added, ...prev]);
      setIsAddModalOpen(false);
      setNewBook({
        title: '',
        author: '',
        category: 'Engineering',
        sku: '',
        stock: 10,
        price: '',
        mrp: '',
        discount: 15,
        shipping: 'Free Express Delivery'
      });
      addToast(`"${added.title}" added to bookstore inventory!`, 'success');
    } catch (err) {
      addToast('Failed to add book to inventory', 'error');
    }
  };

  const handleStockChange = async (id, delta) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (Number(item.stock) || 0) + delta);
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i));
    await sellerApi.updateStock(id, newStock);
  };

  const handleDeleteItem = async (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your stock?`)) {
      setInventory(prev => prev.filter(i => i.id !== id));
      await sellerApi.deleteInventoryItem(id);
      addToast(`Removed "${title}" from inventory`, 'info');
    }
  };

  const handleExportCSV = () => {
    if (!inventory || inventory.length === 0) {
      addToast('No inventory items to export', 'info');
      return;
    }
    const headers = ['SKU', 'Title', 'Author', 'Category', 'Stock', 'Price (INR)', 'Shipping'];
    const rows = inventory.map(item => [
      `"${item.sku || ''}"`,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      `"${(item.author || '').replace(/"/g, '""')}"`,
      `"${item.category || 'General'}"`,
      item.stock || 0,
      item.price || 0,
      `"${item.shipping || 'Standard'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bookloop_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Inventory CSV exported successfully!', 'success');
  };

  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const filteredInventory = safeInventory.filter(item => {
    if (!item) return false;
    const q = (search || '').toLowerCase().trim();
    const titleMatch = (item.title || '').toLowerCase().includes(q);
    const skuMatch = (item.sku || '').toLowerCase().includes(q);
    const authorMatch = (item.author || '').toLowerCase().includes(q);
    const matchesSearch = !q || titleMatch || skuMatch || authorMatch;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner with Premium Styling */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Bookstore Merchant Suite</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Professional Store & Inventory Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Manage high-volume book inventory, SKU units, courier fulfillment, price discounts, and revenue analytics.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stock Book</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Business Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Books in Stock</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans mt-2">
              {stats?.totalBooks || safeInventory.reduce((acc, b) => acc + (Number(b.stock) || 0), 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Real-time live catalog</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Sales</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans mt-2">
              {stats?.totalSales !== undefined ? stats.totalSales : '0'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Units fulfilled & delivered</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/40 shadow-xs">
            <div className="text-amber-800 text-xs font-bold uppercase tracking-wider">Net Store Revenue</div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-sans mt-2">
              {stats?.revenue || '₹0'}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Real-time earnings</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Orders</div>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 font-sans mt-2">
              {stats?.orders !== undefined ? stats.orders : '0'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Delivered or active</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Store Views</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans mt-2">
              {stats?.views !== undefined ? stats.views : '0'}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1">From search & nearby students</div>
          </div>
        </div>

        {/* Inventory Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Live Inventory Management ({filteredInventory.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage SKU units, discounts, adjust inventory levels, and dispatch options
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Category Filter */}
              <div className="relative w-full sm:w-44">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search SKU, title, author..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading merchant inventory...
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-medium text-sm">No inventory items match your search or filter.</p>
              <button
                type="button"
                onClick={() => { setSearch(''); setSelectedCategory('all'); }}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear search & filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">SKU</th>
                    <th className="px-5 py-3.5">Book Title & Author</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">In Stock</th>
                    <th className="px-5 py-3.5">Selling Price</th>
                    <th className="px-5 py-3.5">Discount</th>
                    <th className="px-5 py-3.5">Shipping Method</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredInventory.map((item) => {
                    const isLowStock = Number(item.stock) <= 3;
                    const discountDisplay = item.discount || (item.mrp && item.mrp > item.price ? `${Math.round(((item.mrp - item.price) / item.mrp) * 100)}%` : '15%');
                    
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 whitespace-nowrap">
                          {item.sku || 'SKU-GEN'}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900 max-w-xs truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{item.author}</div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                            {item.category || 'General'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStockChange(item.id, -1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer active:scale-95"
                              title="Decrease stock by 1"
                            >
                              -
                            </button>
                            <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${
                              isLowStock 
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : 'text-slate-900'
                            }`}>
                              {item.stock} {Number(item.stock) === 1 ? 'unit' : 'units'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStockChange(item.id, 1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer active:scale-95"
                              title="Increase stock by 1"
                            >
                              +
                            </button>
                          </div>
                          {isLowStock && (
                            <div className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Low Stock</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                          ₹{item.price}
                          {item.mrp && item.mrp > item.price && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">
                              ₹{item.mrp}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 text-[10px] font-bold text-amber-900 bg-amber-100/80 border border-amber-300 rounded">
                            {discountDisplay}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                          {item.shipping || 'Standard Delivery'}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Stock Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add Bulk Book Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Bookstore Inventory Item"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Book Title *
            </label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              placeholder="e.g. Higher Engineering Mathematics"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Author
              </label>
              <input
                type="text"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                placeholder="e.g. B.S. Grewal"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newBook.category}
                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                min="1"
                value={newBook.stock}
                onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                value={newBook.price}
                onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                placeholder="450"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                MRP (₹)
              </label>
              <input
                type="number"
                min="1"
                value={newBook.mrp}
                onChange={(e) => setNewBook({ ...newBook, mrp: e.target.value })}
                placeholder="699"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Custom SKU (Optional)
              </label>
              <input
                type="text"
                value={newBook.sku}
                onChange={(e) => setNewBook({ ...newBook, sku: e.target.value })}
                placeholder="e.g. ENG-BSG-44"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Shipping Method
              </label>
              <select
                value={newBook.shipping}
                onChange={(e) => setNewBook({ ...newBook, shipping: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              >
                <option value="Free Express Delivery">Free Express Delivery</option>
                <option value="Standard Courier (₹40)">Standard Courier (₹40)</option>
                <option value="Local Store Pickup">Local Store Pickup</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 active:scale-98 rounded-xl shadow-xs shadow-amber-500/20 transition-all cursor-pointer"
            >
              Add to Live Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default BusinessSellerPage;
