import React from 'react';
import {
  ArrowLeftRight,
  Check,
  X,
  MessageSquare,
  Loader2
} from 'lucide-react';

export function ExchangeCard({
  exchange,
  currentUserId,
  onAccept,
  onReject,
  onCancel,
  onChat,
  actionLoading
}) {

  const status = exchange.status?.toUpperCase() || 'PENDING';

  const isRequester =
    Boolean(currentUserId && String(exchange.requesterId) === String(currentUserId));

  const statusColor = {
    PENDING:
      'text-amber-700 bg-amber-50 border-amber-200',

    ACCEPTED:
      'text-emerald-700 bg-emerald-50 border-emerald-200',

    REJECTED:
      'text-rose-700 bg-rose-50 border-rose-200',

    CANCELLED:
      'text-slate-700 bg-slate-100 border-slate-200',

    COMPLETED:
      'text-blue-700 bg-blue-50 border-blue-200'

  }[status] ||
    'text-slate-700 bg-slate-100 border-slate-200';

  const formattedDate = exchange.createdAt
    ? new Date(exchange.createdAt).toLocaleString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    : '';

  const accepting =
    actionLoading === `accept-${exchange.id}`;

  const rejecting =
    actionLoading === `reject-${exchange.id}`;

  const cancelling =
    actionLoading === `cancel-${exchange.id}`;

  const isActionLoading =
    accepting || rejecting || cancelling;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-shadow">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5" />
          </div>

          <div>

            <div className="text-sm font-semibold text-slate-900">
              {isRequester
                ? `You proposed a book swap to ${exchange.ownerName || 'Book Owner'}`
                : `${exchange.requesterName || 'Reader'} wants to swap books with you`}
            </div>

            <div className="text-xs text-slate-500">
              {formattedDate}
            </div>

          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${statusColor}`}
        >
          {status}
        </span>

      </div>

      {/* Book comparison */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">

        {/* Requested Book */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {isRequester ? 'Book You Requested' : 'Your Book (Requested)'}
          </div>

          <div className="font-serif font-semibold text-slate-900 text-sm mb-1">
            {exchange.requestedBookTitle || 'Book'}
          </div>

          <div className="text-xs text-slate-500">
            Book ID: #{exchange.requestedBookId}
          </div>

        </div>

        {/* Offered Book */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">

          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">

            <ArrowLeftRight className="w-3 h-3" />

            <span>
              {isRequester ? 'Your Book (Offered in Exchange)' : 'Book Offered To You'}
            </span>

          </div>

          <div className="font-serif font-semibold text-slate-900 text-sm mb-1">
            {exchange.offeredBookTitle || 'Offered Book'}
          </div>

          <div className="text-xs text-slate-500">
            Book ID: #{exchange.offeredBookId}
          </div>

        </div>

      </div>

      {/* Message */}
      {exchange.message && (
        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl italic mb-4">
          "{exchange.message}"
        </p>
      )}

      {/* Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">

        {status === 'PENDING' ? (

          <div className="flex items-center gap-2">

            {/* OWNER / RECEIVER ACTIONS: Accept / Decline */}
            {!isRequester ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onAccept(exchange.id)
                  }
                  disabled={isActionLoading}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >

                  {accepting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}

                  <span>
                    {accepting
                      ? 'Accepting...'
                      : 'Accept Swap'}
                  </span>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    onReject(exchange.id)
                  }
                  disabled={isActionLoading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >

                  {rejecting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}

                  <span>
                    {rejecting
                      ? 'Declining...'
                      : 'Decline'}
                  </span>

                </button>
              </>
            ) : (
              /* REQUESTER / SENDER ACTIONS: Cancel proposal */
              <>
                <button
                  type="button"
                  onClick={() =>
                    onCancel && onCancel(exchange.id)
                  }
                  disabled={isActionLoading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-rose-700 hover:bg-rose-50 transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >

                  {cancelling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}

                  <span>
                    {cancelling
                      ? 'Cancelling...'
                      : 'Cancel Proposal'}
                  </span>

                </button>

                <span className="text-xs text-slate-500">
                  Waiting for owner's response
                </span>
              </>
            )}

          </div>

        ) : (

          <div className="text-xs text-slate-500 font-medium">
            Exchange request marked as{' '}
            {status?.toLowerCase()}
          </div>

        )}

        {onChat && (
          <button
            type="button"
            onClick={() =>
              onChat(exchange)
            }
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-auto cursor-pointer"
          >

            <MessageSquare className="w-3.5 h-3.5" />

            <span>
              Discuss Details
            </span>

          </button>
        )}

      </div>

    </div>
  );
}

export default ExchangeCard;