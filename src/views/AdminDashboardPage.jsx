import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Users, 
  BookOpen, 
  ArrowLeftRight, 
  DollarSign, 
  Check, 
  Trash2, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Shield,
  UserX,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('reports');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdminOverview();
      if (res) {
        setMetrics(res.metrics || null);
        setReports(Array.isArray(res.reports) ? res.reports : []);
        setUsers(Array.isArray(res.users) ? res.users : []);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, [loadData]);

  const handleDismiss = async (id) => {
    try {
      await adminApi.resolveReport(id, 'dismiss');
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Dismissed' } : r));
      addToast('Report dismissed as clean listing', 'info');
    } catch (err) {
      addToast('Failed to dismiss report', 'error');
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      await adminApi.resolveReport(id, 'delete_listing');
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
      addToast('Reported listing removed from marketplace', 'success');
    } catch (err) {
      addToast('Failed to delete listing', 'error');
    }
  };

  const handleWarnSeller = async (id) => {
    try {
      await adminApi.resolveReport(id, 'warn_seller');
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
      addToast('Official warning issued to seller', 'info');
    } catch (err) {
      addToast('Failed to issue warning', 'error');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    await adminApi.updateUserStatus(userId, nextStatus);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    addToast(`User status set to ${nextStatus}`, 'info');
  };

  const handleToggleVerification = async (userId) => {
    try {
      const updated = await adminApi.toggleUserVerification(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: updated?.verified ?? !u.verified } : u));
      addToast(`User verification ${updated?.verified ? 'granted' : 'revoked'} successfully`, 'success');
    } catch (err) {
      addToast(err?.message || 'Failed to update verification status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Platform Governance & Moderation</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              BookLoop Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review community flagged books, audit seller accounts, and monitor ecosystem health
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="self-start sm:self-center px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Console'}</span>
          </button>
        </div>

        {/* 4 Overview Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Readers</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans mt-2">
              {metrics?.totalUsers !== undefined ? Number(metrics.totalUsers).toLocaleString() : '0'}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Platform community members</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Books Listed</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans mt-2">
              {metrics?.totalBooks !== undefined ? Number(metrics.totalBooks).toLocaleString() : '0'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Live in marketplace</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Swaps Completed</span>
              <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans mt-2">
              {metrics?.totalExchanges !== undefined ? Number(metrics.totalExchanges).toLocaleString() : '0'}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Direct book trades</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 font-sans mt-2">
              {metrics?.totalSalesValue || '₹0'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Total order volume</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'reports'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Flagged Listings ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            User Management ({users.length})
          </button>
        </div>

        {/* Tab 1: Moderation Queue */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  Flagged & Reported Books ({reports.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  User complaints regarding condition mismatch, suspicious pricing, or policy violations
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 rounded-lg">
                Action Required
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-semibold text-slate-800 text-sm">Moderation queue is clean</div>
                <p>No community reports are awaiting inspection.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <div key={r.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/60 rounded">
                          {r.reason}
                        </span>
                        <span className="text-xs text-slate-400">Reported {r.date}</span>
                        {r.status && r.status !== 'Pending' && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            r.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {r.status}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-slate-900 text-base">
                        {r.bookTitle}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Seller: <strong className="text-slate-800">{r.sellerName}</strong> · Note: "{r.details || 'No additional note'}"
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {(!r.status || r.status === 'Pending') ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDismiss(r.id)}
                            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>

                          <button
                            type="button"
                            onClick={() => handleWarnSeller(r.id)}
                            className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors cursor-pointer"
                          >
                            Warn Seller
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteListing(r.id)}
                            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Listing</span>
                          </button>
                        </>
                      ) : (
                        <span className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl border border-slate-200">
                          {r.status === 'Resolved' ? 'Resolved / Removed' : 'Dismissed'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-serif text-lg font-bold text-slate-900">
                Registered Community Members
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit reader accounts, ratings, listings, and manage suspension status
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Account Type</th>
                    <th className="px-5 py-3">Listings</th>
                    <th className="px-5 py-3">Rating</th>
                    <th className="px-5 py-3 text-center">Verification</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{u.location || u.city || 'India'}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded capitalize">
                          {u.role || 'Reader'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold">{u.listingsCount !== undefined ? u.listingsCount : 0} books</td>
                      <td className="px-5 py-3.5 text-amber-600 font-semibold">{(Number(u.rating) || 4.8).toFixed(1)} ★</td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleVerification(u.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            u.verified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                          title={u.verified ? 'Click to revoke verified badge' : 'Click to grant verified badge'}
                        >
                          {u.verified ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <Shield className="w-3.5 h-3.5 text-slate-400" />
                              <span>Verify</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.status === 'Suspended'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {u.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboardPage;
