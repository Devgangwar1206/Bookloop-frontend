import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  Navigation,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { orderApi } from '../services/orderApi';
import { OrderCard } from '../components/cards/OrderCard';
import { OrderTrackingModal } from '../components/orders/OrderTrackingModal';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState('buying'); // buying | selling
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | out_for_delivery | completed | cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { orderId: paramOrderId } = useParams();
  const { addToast } = useToast();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrders(activeTab);
      setOrders(data);

      // Check if URL specifies an order ID to open in modal
      const targetId = paramOrderId || searchParams.get('id') || searchParams.get('track');
      if (targetId) {
        const found = data.find(o => o.id === targetId || o.trackingNumber === targetId);
        if (found) {
          setSelectedOrder(found);
          setIsModalOpen(true);
        }
      }
    } catch (err) {
      console.error('Failed to load orders', err);
      addToast('Failed to load orders list', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, paramOrderId, searchParams, addToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Handle selecting an order to open the tracker modal
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setSearchParams({ track: order.id });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setSearchParams({});
  };

  // Status updates
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      addToast(`Order ${orderId} status updated to ${newStatus}`, 'info');
    } catch (e) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleAdvanceStatus = async (orderId) => {
    try {
      const updated = await orderApi.advanceOrderStatus(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (e) {
      addToast('Failed to advance tracking', 'error');
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const updated = await orderApi.cancelOrder(orderId, reason);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (e) {
      addToast('Failed to cancel order', 'error');
    }
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = orders.length;
    const active = orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped' || o.status === 'Pending').length;
    const outForDelivery = orders.filter(o => o.status === 'Out for Delivery').length;
    const completed = orders.filter(o => o.status === 'Completed').length;
    const totalSavings = orders.reduce((sum, o) => {
      const orig = Number(o.originalPrice) || 0;
      const price = Number(o.price) || 0;
      return sum + Math.max(0, orig - price);
    }, 0);

    return { total, active, outForDelivery, completed, totalSavings };
  }, [orders]);

  // Filtering
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Shipped');
    } else if (statusFilter === 'out_for_delivery') {
      result = result.filter(o => o.status === 'Out for Delivery');
    } else if (statusFilter === 'completed') {
      result = result.filter(o => o.status === 'Completed');
    } else if (statusFilter === 'cancelled') {
      result = result.filter(o => o.status === 'Cancelled');
    }

    // Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o => 
        o.id?.toLowerCase().includes(q) ||
        o.bookTitle?.toLowerCase().includes(q) ||
        o.bookAuthor?.toLowerCase().includes(q) ||
        o.partyName?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Marketplace Fulfillment & Escrow</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Orders & Purchases
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Track live delivery progress, check security OTPs, inspect book handovers, and manage fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              to="/books"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Explore Books</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Metric Counter Cards (with Gold and Red accents) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Active Orders */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">In Transit</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {metrics.active}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Live tracking active</span>
            </div>
          </div>

          {/* Out for Delivery (Crimson / Red Accent) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Arriving Today</span>
              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-red-600 mt-2">
              {metrics.outForDelivery}
            </div>
            <div className="text-[11px] text-red-600 font-semibold mt-0.5">
              {metrics.outForDelivery > 0 ? 'Ready for OTP handover' : 'None scheduled'}
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Delivered</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {metrics.completed}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Escrow released
            </div>
          </div>

          {/* Total Savings on Books (Gold / Yellow Accent) */}
          <div className="bg-gradient-to-br from-amber-50/70 to-yellow-50/40 rounded-2xl p-4 border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Total Savings</span>
              <div className="w-7 h-7 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-xs">
                ₹
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-950 mt-2">
              ₹{metrics.totalSavings.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-0.5">
              Saved vs bookstore MRP
            </div>
          </div>
        </div>

        {/* Tab Switcher & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Primary Buying vs Selling Segmented Control */}
            <div className="bg-slate-100 p-1 rounded-xl inline-flex shadow-2xs self-start">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('buying');
                  setStatusFilter('all');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'buying'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Purchases ({orders.filter(o => o.type === 'buying').length || 0})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('selling');
                  setStatusFilter('all');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'selling'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sold Orders ({orders.filter(o => o.type === 'selling').length || 0})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, ID (ORD-...), or seller..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Quick Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Status:</span>
            </span>
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'active', label: 'In Transit / Confirmed' },
              { id: 'out_for_delivery', label: '🚨 Arriving Today' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            type="orders"
            title={
              searchQuery
                ? `No orders matching "${searchQuery}"`
                : activeTab === 'buying'
                ? 'No purchases in this status'
                : 'No sales in this status'
            }
            description={
              searchQuery
                ? 'Try checking for typos or searching by the 5-digit Order ID.'
                : activeTab === 'buying'
                ? 'Browse the marketplace to find books and track your deliveries here.'
                : 'List your books to receive orders from buyers.'
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelectOrder={handleSelectOrder}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}

        {/* Tracking & Details Modal Drawer */}
        <OrderTrackingModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
          onAdvanceStatus={handleAdvanceStatus}
          onCancelOrder={handleCancelOrder}
        />

      </div>
    </div>
  );
}

export default OrdersPage;
