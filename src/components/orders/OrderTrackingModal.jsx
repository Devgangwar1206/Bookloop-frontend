import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  Receipt, 
  ChevronRight, 
  X, 
  ArrowRight, 
  RotateCcw, 
  Star, 
  Navigation, 
  User, 
  Info,
  Calendar,
  CreditCard,
  Printer
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function OrderTrackingModal({ order, isOpen, onClose, onUpdateStatus, onAdvanceStatus, onCancelOrder }) {
  const [activeTab, setActiveTab] = useState('tracking'); // tracking | item | person | payment
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found another copy');
  const [advancing, setAdvancing] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen || !order) return null;

  const statusConfig = {
    Pending: { 
      badge: 'bg-amber-100 text-amber-900 border-amber-300', 
      text: 'Pending Confirmation', 
      icon: Clock,
      dotColor: 'bg-amber-500'
    },
    Confirmed: { 
      badge: 'bg-blue-100 text-blue-900 border-blue-300', 
      text: 'Order Confirmed', 
      icon: Package,
      dotColor: 'bg-blue-600'
    },
    Shipped: { 
      badge: 'bg-purple-100 text-purple-900 border-purple-300', 
      text: 'In Transit / Dispatched', 
      icon: Truck,
      dotColor: 'bg-purple-600'
    },
    'Out for Delivery': { 
      badge: 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse', 
      text: 'Out for Delivery / Arriving Today', 
      icon: Navigation,
      dotColor: 'bg-rose-600'
    },
    Completed: { 
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', 
      text: 'Delivered & Completed', 
      icon: CheckCircle2,
      dotColor: 'bg-emerald-600'
    },
    Cancelled: { 
      badge: 'bg-red-100 text-red-900 border-red-300', 
      text: 'Cancelled', 
      icon: AlertTriangle,
      dotColor: 'bg-red-600'
    }
  }[order.status] || { 
    badge: 'bg-slate-100 text-slate-800 border-slate-300', 
    text: order.status, 
    icon: Clock,
    dotColor: 'bg-slate-500'
  };

  const StatusIcon = statusConfig.icon;

  const handleCopyTracking = () => {
    if (navigator.clipboard && order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      addToast('Tracking number copied to clipboard', 'info');
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleCopyOtp = () => {
    if (navigator.clipboard && order.deliveryOtp) {
      navigator.clipboard.writeText(order.deliveryOtp);
      setCopiedOtp(true);
      addToast('Delivery security OTP copied', 'info');
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      if (onAdvanceStatus) {
        await onAdvanceStatus(order.id);
        addToast('Order tracking advanced to next live milestone!', 'success');
      }
    } catch (e) {
      addToast('Failed to advance order status', 'error');
    } finally {
      setAdvancing(false);
    }
  };

  const handleChat = () => {
    onClose();
    navigate('/chat');
  };

  const handleConfirmCancel = async () => {
    if (onCancelOrder) {
      await onCancelOrder(order.id, cancelReason);
      setShowCancelPrompt(false);
      addToast('Order cancelled. Escrow refund initiated.', 'info');
    }
  };

  // Steps definition for visual progress bar
  const trackerSteps = [
    { label: 'Placed', status: 'Pending', desc: 'Escrow Secured' },
    { label: 'Confirmed', status: 'Confirmed', desc: 'Seller Accepted' },
    { label: 'In Transit', status: 'Shipped', desc: 'Dispatched' },
    { label: 'Arriving', status: 'Out for Delivery', desc: 'Last Mile' },
    { label: 'Delivered', status: 'Completed', desc: 'Handed Over' }
  ];

  const currentStepIndex = trackerSteps.findIndex(s => s.status === order.status);
  const effectiveIndex = currentStepIndex >= 0 ? currentStepIndex : (order.status === 'Cancelled' ? -1 : 1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-900 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="track-order-heading"
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="track-order-heading" className="font-serif font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  Track Order & Fulfillment
                </h3>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {order.id}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Placed {order.date}</span>
                <span className="text-slate-300">·</span>
                <span>{order.type === 'buying' ? 'Purchase' : 'Sale Order'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              title="View Invoice"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              <span>Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* Urgent / Live Status Banner (Featuring requested Red & Gold Accents) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            order.status === 'Out for Delivery' 
              ? 'bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border-red-200 shadow-2xs' 
              : order.status === 'Completed'
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-gradient-to-r from-amber-50/70 via-yellow-50/40 to-slate-50 border-amber-200/80 shadow-2xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full mt-0.5 sm:mt-0 shrink-0 ${statusConfig.dotColor} animate-ping`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Current Status:
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${statusConfig.badge}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.text}</span>
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    {order.urgentBanner || `Estimated arrival: ${order.estimatedDelivery}`}
                  </div>
                </div>
              </div>

              {/* Delivery OTP Security Badge (Authentic Indian marketplace feature) */}
              {order.deliveryOtp && order.status !== 'Completed' && order.status !== 'Cancelled' && (
                <div className="bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-amber-300 shadow-2xs flex items-center justify-between sm:justify-start gap-3">
                  <div>
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      <span>Delivery OTP</span>
                    </div>
                    <div className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                      {order.deliveryOtp}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyOtp}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Copy OTP"
                  >
                    {copiedOtp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Visual Interactive Multi-Step Stepper */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Live Delivery Progress</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Carrier: <strong className="text-slate-800">{order.carrier || 'BookLoop Direct'}</strong>
              </span>
            </div>

            {/* Stepper bar */}
            <div className="pt-2 pb-1">
              <div className="grid grid-cols-5 relative gap-2 sm:gap-4">
                {/* Connecting track line */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0" />
                <div 
                  className="absolute top-4 left-6 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-600 -z-0 transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(0, (effectiveIndex / (trackerSteps.length - 1)) * 92))}%` }}
                />

                {trackerSteps.map((step, idx) => {
                  const isDone = effectiveIndex >= idx && order.status !== 'Cancelled';
                  const isCurrent = effectiveIndex === idx && order.status !== 'Cancelled';
                  return (
                    <div key={step.label} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isDone 
                          ? isCurrent 
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-xs' 
                            : 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}>
                        {isDone && !isCurrent ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-semibold mt-2 line-clamp-1 ${
                        isCurrent ? 'text-amber-800 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline-block">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulation Controller (Allows testing status changes dynamically) */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Need to update tracking? You can simulate step progression:</span>
              </div>
              <div className="flex items-center gap-2">
                {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                  <button
                    type="button"
                    onClick={handleAdvance}
                    disabled={advancing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${advancing ? 'animate-spin' : ''}`} />
                    <span>Advance to Next Status</span>
                  </button>
                )}
                {order.status !== 'Completed' && (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(order.id, 'Completed')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark Completed</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Info Bar: Tracking No & ETA Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tracking Number Card */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Tracking Number / AWB
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  {order.trackingNumber || `BL-${order.id}`}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyTracking}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Estimated Delivery / Handover Card */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Estimated Delivery / Handover
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  {order.estimatedDelivery || 'Today by 6:00 PM'}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Interactive Tab Navigation */}
          <div className="border-b border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto pb-px">
              {[
                { id: 'tracking', label: 'Milestones & Route', icon: Navigation },
                { id: 'item', label: 'Book Details', icon: Package },
                { id: 'person', label: order.type === 'buying' ? 'Seller Contact' : 'Buyer Contact', icon: User },
                { id: 'payment', label: 'Payment & Invoice', icon: CreditCard }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: Tracking Timeline & Route */}
          {activeTab === 'tracking' && (
            <div className="space-y-5">
              {/* Delivery Address / Meetup Point Card */}
              {order.deliveryLocation && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {order.deliveryLocation.type === 'meetup' ? 'Scheduled Meetup Location' : 'Doorstep Delivery Address'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {order.deliveryMethod}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">
                        {order.deliveryLocation.title}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {order.deliveryLocation.address}
                      </div>
                      {order.deliveryLocation.instructions && (
                        <div className="mt-2 text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span><strong>Note:</strong> {order.deliveryLocation.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Chronological Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detailed Milestones Activity
                </h4>
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(order.timeline || []).map((event, idx) => (
                    <div key={idx} className="relative">
                      {/* Node circle */}
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                        event.current
                          ? 'bg-amber-500 ring-4 ring-amber-100'
                          : event.completed
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-2 border-slate-300'
                      }`}>
                        {event.completed && !event.current && <Check className="w-3 h-3" />}
                        {event.current && <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                          <span className={`text-xs font-bold ${
                            event.current ? 'text-amber-800 text-sm' : event.completed ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {event.title}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {event.time}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${event.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                          {event.description}
                        </p>
                        {event.location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Book Details */}
          {activeTab === 'item' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={order.bookImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'}
                  alt={order.bookTitle}
                  className="w-20 h-28 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {order.category || 'Academic'}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Condition: {order.condition || 'Used - Good'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-base">
                    {order.bookTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    By {order.bookAuthor || 'Independent Author'}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-extrabold text-slate-900">
                      ₹{order.price}
                    </span>
                    {order.originalPrice > order.price && (
                      <>
                        <span className="text-xs text-slate-400 line-through">
                          MRP ₹{order.originalPrice}
                        </span>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          Save ₹{order.originalPrice - order.price} ({Math.round(((order.originalPrice - order.price) / order.originalPrice) * 100)}% OFF)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {order.bookId && (
                  <Link
                    to={`/books/${order.bookId}`}
                    onClick={onClose}
                    className="self-end sm:self-center px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* 100% Escrow Protection Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-emerald-950 font-bold block mb-0.5">
                    100% BookLoop Escrow Protection Included
                  </strong>
                  <span className="text-emerald-800">
                    Your money is held safely in escrow. If the book pages are torn, water-damaged, or do not match the listed condition, you can reject the book on the spot for an immediate full refund.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Counterparty Contact (Seller or Buyer) */}
          {activeTab === 'person' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={order.partyAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                    alt={order.partyName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-slate-900 text-base">
                        {order.partyName}
                      </h4>
                      {order.partyVerified && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Role: <strong>{order.partyRole || (order.type === 'buying' ? 'Seller' : 'Buyer')}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-800">{order.partyRating || '4.9'}</span>
                      <span className="text-slate-400">· Fast Response</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleChat}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Now</span>
                  </button>
                  <a
                    href={`tel:${order.partyPhone || '+919876543210'}`}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* Safety guidelines */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Meetup & Transaction Guidelines:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-slate-500">
                  <li>Meet during daylight hours in well-lit public areas (metro stations, library gates, campus plazas).</li>
                  <li>Check book edition, ISBN, and page readability before finalizing.</li>
                  <li>Do not share verification OTP until you have inspected the book in person.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: Payment Breakdown & Invoice */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Payment Method</div>
                    <div className="text-xs text-slate-500 mt-0.5">{order.payment?.method || 'UPI (BookLoop Escrow Protection)'}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {order.payment?.status || 'Paid & Secured'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Book Selling Price</span>
                    <span className="font-semibold text-slate-900">₹{order.payment?.subtotal || order.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Delivery / Handshake Fee</span>
                    <span className="font-semibold text-emerald-600">
                      {order.payment?.deliveryFee > 0 ? `₹${order.payment.deliveryFee}` : 'FREE (Local Meetup)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>BookLoop Escrow Protection Fee</span>
                    <span className="font-semibold text-emerald-600">₹0 (Waived)</span>
                  </div>
                  {order.payment?.discount > 0 && (
                    <div className="flex items-center justify-between text-red-600 font-medium">
                      <span>Total Savings vs MRP</span>
                      <span>-₹{order.payment.discount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-base text-blue-600">₹{order.payment?.total || order.price}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 font-mono">
                  Transaction Reference: {order.payment?.transactionId || 'UPI/260924/88924109'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>View & Print Official Marketplace Tax Receipt</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {order.status !== 'Completed' && order.status !== 'Cancelled' && (
              <button
                type="button"
                onClick={() => setShowCancelPrompt(true)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                addToast('Dispute case created. BookLoop Support will reach out via Chat within 30 mins.', 'info');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Need Help?
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleChat}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact {order.type === 'buying' ? 'Seller' : 'Buyer'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>

        {/* Cancel Confirmation Prompt */}
        {showCancelPrompt && (
          <div className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-2xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">
                Cancel this Order?
              </h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel order <strong>{order.id}</strong>? Any locked escrow funds will be refunded back immediately.
              </p>
              <div className="text-left">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Reason for cancellation:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Found another copy">Found another copy</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Meetup location inconvenient">Meetup location inconvenient</option>
                  <option value="Seller unresponsive">Seller unresponsive</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Tax Invoice Modal */}
        {showInvoiceModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-2xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-serif font-black text-sm">
                    BL
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900">BookLoop Tax Invoice</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Invoice #{order.id}-INV</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs space-y-3">
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-[11px]">
                  <div>
                    <strong className="text-slate-700 block">Sold By:</strong>
                    <span>{order.partyName}</span>
                    <span className="block text-slate-400">Verified Marketplace Seller</span>
                  </div>
                  <div>
                    <strong className="text-slate-700 block">Billed To:</strong>
                    <span>Dev Gupta</span>
                    <span className="block text-slate-400">Noida, Uttar Pradesh</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{order.bookTitle}</div>
                      <div className="text-[11px] text-slate-500">Author: {order.bookAuthor} · Condition: {order.condition}</div>
                    </div>
                    <span className="font-bold text-slate-900">₹{order.price}</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-slate-600">
                    <span>Fulfillment / Handshake Delivery</span>
                    <span>{order.payment?.deliveryFee > 0 ? `₹${order.payment.deliveryFee}` : '₹0.00'}</span>
                  </div>
                  <div className="py-2 flex items-center justify-between text-slate-600">
                    <span>Escrow Buyer Guarantee</span>
                    <span className="text-emerald-600">FREE</span>
                  </div>
                  <div className="py-2 flex items-center justify-between font-extrabold text-sm text-slate-900">
                    <span>Total Amount Paid</span>
                    <span className="text-blue-600">₹{order.payment?.total || order.price}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-900">
                  Payment confirmed via {order.payment?.method || 'UPI'}. Transaction ID: {order.payment?.transactionId}.
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderTrackingModal;
