'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequestRecord, deleteRequest } from '@/lib/api';

const categoryStyles: Record<string, string> = {
  billing: 'background:#FAEEDA;color:#854F0B;',
  support: 'background:#E6F1FB;color:#185FA5;',
  feedback: 'background:#EEEDFE;color:#3C3489;',
  general: 'background:#F1EFE8;color:#5F5E5A;',
};

const urgencyStyles: Record<string, string> = {
  high: 'background:#FCEBEB;color:#A32D2D;',
  medium: 'background:#FAEEDA;color:#854F0B;',
  low: 'background:#EAF3DE;color:#3B6D11;',
};

const urgencyDot: Record<string, string> = {
  high: '#E24B4A',
  medium: '#EF9F27',
  low: '#639922',
};

const avatarColors = [
  'background:#E6F1FB;color:#185FA5;',
  'background:#EEEDFE;color:#3C3489;',
  'background:#EAF3DE;color:#3B6D11;',
  'background:#FAEEDA;color:#854F0B;',
  'background:#FAECE7;color:#993C1D;',
  'background:#FBEAF0;color:#993556;',
];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarStyle(name: string) {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

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
    <div
      style={{ opacity: deleting ? 0.5 : 1, transform: deleting ? 'scale(0.97)' : 'scale(1)', transition: 'all 0.2s' }}
      className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            style={{ cssText: getAvatarStyle(request.name) } as React.CSSProperties}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
          >
            {getInitials(request.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 leading-tight">{request.name}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          style={confirmDelete ? { background: '#FCEBEB', color: '#A32D2D', borderColor: '#F09595' } : {}}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          {deleting ? (
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      {confirmDelete && (
        <p className="text-xs text-red-500 mb-2">Click again to confirm deletion</p>
      )}

      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{request.message}</p>

      {request.summary ? (
        <p className="text-xs text-gray-400 italic mb-3 border-l-2 pl-2.5 leading-relaxed" style={{ borderColor: '#AFA9EC' }}>
          {request.summary}
        </p>
      ) : (
        <p className="text-xs text-gray-300 italic mb-3">AI analysis in progress…</p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {request.category ? (
          <span
            style={{ ...(Object.fromEntries(categoryStyles[request.category]?.split(';').filter(Boolean).map(s => s.split(':')) ?? [])) }}
            className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {request.category}
          </span>
        ) : (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
            categorising…
          </span>
        )}

        {request.urgency ? (
          <span
            style={{ ...(Object.fromEntries(urgencyStyles[request.urgency]?.split(';').filter(Boolean).map(s => s.split(':')) ?? [])) }}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            <span style={{ background: urgencyDot[request.urgency] }} className="w-1.5 h-1.5 rounded-full" />
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