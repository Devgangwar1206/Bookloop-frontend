import React from 'react';
import { ShieldCheck, Store } from 'lucide-react';

export function SellerBadge({ verified = false, isBusiness = false, compact = false, className = '' }) {
  if (isBusiness) {
    if (compact) {
      return (
        <span 
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 text-blue-600 border border-blue-200/80 ${className}`} 
          title="Verified Bookstore / Merchant"
        >
          <Store className="w-2.5 h-2.5" />
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/80 ${className}`} title="Verified Bookstore / Merchant">
        <Store className="w-3 h-3 text-blue-600" />
        <span>Store</span>
      </span>
    );
  }

  if (verified) {
    if (compact) {
      return (
        <span 
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 ${className}`} 
          title="Verified Reader"
        >
          <ShieldCheck className="w-2.5 h-2.5" />
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 ${className}`} title="Verified Reader">
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>Verified</span>
      </span>
    );
  }

  return null;
}

export default SellerBadge;
