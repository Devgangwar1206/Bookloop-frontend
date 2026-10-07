import React from 'react';
import { Modal } from '../common/Modal';
import { FilterSidebar } from './FilterSidebar';

export function FilterModal({ isOpen, onClose, filters, onChange, onReset, totalResults }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Marketplace Filters" maxWidth="max-w-md">
      <div className="space-y-4">
        <FilterSidebar
          filters={filters}
          onChange={onChange}
          onReset={onReset}
        />
        <div className="sticky bottom-0 bg-white pt-3 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-2 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
          >
            Show {totalResults ? `${totalResults} Results` : 'Results'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default FilterModal;
