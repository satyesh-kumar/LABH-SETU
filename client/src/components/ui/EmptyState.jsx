import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'Try adjusting your filters or search terms to find what you are looking for.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-500">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mx-auto mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error while loading the requested information. Please try again.',
  onRetry,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-rose-200 bg-rose-50/40">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mx-auto mb-5">{description}</p>
      {onRetry && (
        <Button variant="primary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
