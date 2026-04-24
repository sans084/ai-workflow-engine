'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequestRecord, deleteRequest } from '@/lib/api';

const categoryColors: Record<string, string> = {
  billing: 'bg-yellow-100 text-yellow-800',
  support: 'bg-blue-100 text-blue-800',
  feedback: 'bg-purple-100 text-purple-800',
  general: 'bg-gray-100 text-gray-700',
};

const urgencyColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-green-100 text-green-700',
};

const urgencyDot: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-orange-400',
  low: 'bg-green-500',
};

export default function RequestCard({ request }: { request: RequestRecord }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const date = new Date(request.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await deleteRequest(request._id);
      router.refresh();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${deleting ? 'opacity-50 scale-95' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-medium text-gray-900 text-sm">{request.name}</p>
          <p className="text-xs text-gray-400">{request.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">{date}</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title={confirmDelete ? 'Click again to confirm delete' : 'Delete request'}
            className={`p-1 rounded-md transition-colors ${
              confirmDelete
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
            }`}
          >
            {deleting ? (
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : confirmDelete ? (
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {confirmDelete && (
        <p className="text-xs text-red-500 mb-2">Click again to confirm deletion</p>
      )}

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{request.message}</p>

      {request.summary ? (
        <p className="text-xs text-gray-500 italic mb-4 border-l-2 border-indigo-200 pl-3">
          {request.summary}
        </p>
      ) : (
        <p className="text-xs text-gray-400 italic mb-4">AI analysis in progress…</p>
      )}

      <div className="flex flex-wrap gap-2">
        {request.category ? (
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColors[request.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {request.category}
          </span>
        ) : (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
            categorising…
          </span>
        )}

        {request.urgency ? (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${urgencyColors[request.urgency] ?? ''}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${urgencyDot[request.urgency]}`} />
            {request.urgency}
          </span>
        ) : (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
            urgency…
          </span>
        )}
      </div>
    </div>
  );
}