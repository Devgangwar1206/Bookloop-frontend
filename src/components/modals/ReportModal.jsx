import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { adminApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { AlertCircle } from 'lucide-react';

const REASONS = [
  'Fake listing',
  'Wrong information',
  'Inappropriate content',
  'Fraud / Scam',
  'Duplicate listing',
  'Other'
];

export function ReportModal({ isOpen, onClose, book }) {
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!book) return;
    setSubmitting(true);
    try {
      await adminApi.submitReport({
        bookId: book.id,
        bookTitle: book.title,
        reason: selectedReason,
        details
      });
      addToast('Thank you. This listing has been reported to the BookLoop Trust & Safety team.', 'info');
      onClose();
      setDetails('');
    } catch (err) {
      addToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report this listing">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            You are reporting <strong>"{book?.title}"</strong>. Help us maintain a safe, trusted book marketplace.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Why are you reporting this listing? *
          </label>
          <div className="space-y-2">
            {REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                  selectedReason === reason
                    ? 'border-blue-600 bg-blue-50/50 text-slate-900 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Additional Details (Optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="Describe what is wrong or misleading about this listing..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ReportModal;
