import React from 'react';
import { RotateCcw, Check, MapPin, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, CITIES } from '../../data/mockData';

export function FilterSidebar({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="font-serif font-bold text-slate-900 text-base">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Transaction Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Transaction Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'buy', label: 'Buy' },
            { id: 'exchange', label: 'Exchange' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleChange('transaction', t.id)}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filters.transaction === t.id
                  ? 'bg-white text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range (INR) */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Price Range (₹)
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs font-semibold">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <span className="text-slate-400 text-xs font-medium">to</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs font-semibold">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Categories
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => handleChange('category', 'all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              filters.category === 'all' || !filters.category
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleChange('category', cat.name)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                filters.category === cat.name
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="text-[10px] text-slate-400">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Book Condition */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Condition
        </label>
        <div className="space-y-1.5">
          {['all', 'Brand New', 'Like New', 'Used - Good', 'Acceptable'].map((cond) => (
            <label
              key={cond}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="radio"
                name="condition"
                value={cond}
                checked={filters.condition === cond || (cond === 'all' && (!filters.condition || filters.condition === 'all'))}
                onChange={() => handleChange('condition', cond)}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span>{cond === 'all' ? 'Any Condition' : cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location / Radius */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Location & Radius
        </label>
        <select
          value={filters.city || 'all'}
          onChange={(e) => handleChange('city', e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white mb-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          <option value="all">All Cities / Regions</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          {['5 km', '10 km', '25 km', '50 km'].map((rad) => (
            <button
              key={rad}
              type="button"
              onClick={() => handleChange('radius', rad)}
              className={`flex-1 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                filters.radius === rad
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {rad}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Type (Individual vs Professional) */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
          Seller Type
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Sellers' },
            { id: 'Individual', label: 'Individual Sellers (Readers)' },
            { id: 'Professional', label: 'Professional Bookstores' }
          ].map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer"
            >
              <input
                type="radio"
                name="listingType"
                value={type.id}
                checked={filters.listingType === type.id || (type.id === 'all' && (!filters.listingType || filters.listingType === 'all'))}
                onChange={() => handleChange('listingType', type.id)}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
          Delivery Method
        </label>
        <select
          value={filters.delivery || 'all'}
          onChange={(e) => handleChange('delivery', e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          <option value="all">All Options (Pickup & Courier)</option>
          <option value="Pickup">Hand-to-Hand Pickup Only</option>
          <option value="Delivery">Courier Delivery</option>
        </select>
      </div>

      {/* Verified Only checkbox */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.verifiedOnly)}
            onChange={(e) => handleChange('verifiedOnly', e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Verified Sellers Only</span>
        </label>
      </div>
    </div>
  );
}

export default FilterSidebar;
