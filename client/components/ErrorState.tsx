'use client';

import { useRouter } from 'next/navigation';

export default function ErrorState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load requests</h3>
      <p className="text-gray-500 text-sm mb-5">
        The server may be unreachable. Check that your backend is running and try again.
      </p>
      <button
        onClick={() => router.refresh()}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}