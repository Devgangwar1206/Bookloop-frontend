import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Eye, 
  MessageSquare, 
  Tag, 
  CheckCircle2, 
  ArrowLeftRight, 
  PlusCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Trash2
} from 'lucide-react';
import { sellerApi } from '../services/sellerApi';
import { bookApi } from '../services/bookApi';
import { useToast } from '../context/ToastContext';

export function SellerDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [dashMetrics, myListings] = await Promise.all([
          sellerApi.getSellerMetrics(),
          sellerApi.getMyListings()
        ]);
        if (isMounted) {
          setMetrics(dashMetrics);
          setListings(Array.isArray(myListings) ? myListings.slice(0, 5) : []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load seller dashboard', err);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    await bookApi.updateListingStatus(id, nextStatus);
    setListings(listings.map(l => l.id === id ? { ...l, status: nextStatus } : l));
    addToast(`Listing status updated to ${nextStatus}`, 'info');
  };

  const handleMarkSold = async (id) => {
    await bookApi.updateListingStatus(id, 'Sold');
    setListings(listings.map(l => l.id === id ? { ...l, status: 'Sold' } : l));
    addToast('Book marked as Sold! Congratulations.', 'success');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await bookApi.deleteListing(id);
      setListings(listings.filter(l => l.id !== id));
      addToast('Listing deleted', 'info');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const metricCards = [
    { label: 'Active Listings', value: metrics?.activeListings !== undefined ? metrics.activeListings : 0, icon: BookOpen, color: 'text-blue-700 bg-blue-50' },
    { label: 'Total Views', value: metrics?.views !== undefined ? metrics.views : 0, icon: Eye, color: 'text-sky-700 bg-sky-50' },
    { label: 'New Messages', value: metrics?.messages !== undefined ? metrics.messages : 0, icon: MessageSquare, color: 'text-indigo-700 bg-indigo-50', link: '/chat' },
    { label: 'Offers Received', value: metrics?.offersReceived !== undefined ? metrics.offersReceived : 0, icon: Tag, color: 'text-amber-700 bg-amber-50', link: '/dashboard/offers' },
    { label: 'Sold Books', value: metrics?.soldBooks !== undefined ? metrics.soldBooks : 0, icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Exchange Requests', value: metrics?.exchangeRequests !== undefined ? metrics.exchangeRequests : 0, icon: ArrowLeftRight, color: 'text-teal-700 bg-teal-50', link: '/dashboard/exchanges' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Seller Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your books, customer inquiries, price offers, and exchange trades
            </p>
          </div>
          <Link
            to="/sell"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Another Book</span>
          </Link>
        </div>

        {/* 6 Metrics Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {metricCards.map((m) => {
            const Icon = m.icon;
            const content = (
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-sm transition-all text-center sm:text-left flex flex-col justify-between h-full">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-2.5 ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {m.label}
                  </div>
                </div>
              </div>
            );

            return m.link ? (
              <Link key={m.label} to={m.link}>
                {content}
              </Link>
            ) : (
              <div key={m.label}>{content}</div>
            );
          })}
        </div>

        {/* 2-Column: My Recent Listings + Recent Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Quick Overview of My Listings */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  My Active Listings
                </h2>
              </div>
              <Link
                to="/dashboard/listings"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All Listings</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {listings.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <Link to={`/books/${item.id}`} className="font-serif font-semibold text-slate-900 text-sm hover:text-blue-600 truncate block">
                        {item.title}
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Price: <strong className="text-slate-800">₹{item.price}</strong> · Views: {item.views || 45} · Likes: {item.likes || 6}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          item.status === 'Active' ? 'text-emerald-700 bg-emerald-50' : item.status === 'Paused' ? 'text-amber-700 bg-amber-50' : 'text-slate-600 bg-slate-100'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.dateListed || 'Active now'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {item.status !== 'Sold' && (
                      <button
                        type="button"
                        onClick={() => handleMarkSold(item.id)}
                        className="px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                        title="Mark as sold"
                      >
                        Mark Sold
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title={item.status === 'Active' ? 'Pause listing' : 'Resume listing'}
                    >
                      {item.status === 'Active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Recent Activity Feed */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="font-serif text-base font-bold text-slate-900">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: 'New offer received', desc: 'Rohan Sharma offered ₹280 for Atomic Habits', time: '10m ago' },
                { title: 'Exchange request', desc: 'Ananya proposed swapping Java with Spring in Action', time: '1h ago' },
                { title: 'Book marked as Sold', desc: 'Clean Code was handed over at Noida Sector 18', time: 'Yesterday' },
                { title: 'Listing updated', desc: 'Price reduced for NCERT Physics Set', time: '2 days ago' }
              ].map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-slate-900 font-semibold mb-0.5">
                    <span>{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{act.time}</span>
                  </div>
                  <div className="text-slate-600 leading-snug">{act.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/dashboard/offers"
                className="w-full py-2.5 text-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl block transition-colors"
              >
                Review All Price Offers
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SellerDashboardPage;
