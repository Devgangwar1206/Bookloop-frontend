import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { CITIES } from '../../data/mockData';
import { useMarketplace } from '../../context/MarketplaceContext';

export function LocationSelector({ className = '' }) {
  const { selectedLocation, setSelectedLocation } = useMarketplace();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
        title="Select marketplace city"
      >
        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="truncate max-w-[110px] sm:max-w-[130px] font-medium">
          {selectedLocation}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-56 max-h-64 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Marketplace Cities
          </div>
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setSelectedLocation(city);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>{city}</span>
              {selectedLocation === city && (
                <Check className="w-3.5 h-3.5 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationSelector;
