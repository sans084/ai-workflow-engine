import { Suspense } from 'react';
import { fetchRequests } from '@/lib/api';
import RequestCard from '@/components/RequestCard';
import SkeletonCard from '@/components/SkeletonCard';
import CategoryFilter from '@/components/CategoryFilter';
import ErrorState from '@/components/ErrorState';

interface PageProps {
  searchParams: { category?: string; page?: string };
}

async function RequestsList({ category, page }: { category?: string; page?: string }) {
  try {
    const { data, meta } = await fetchRequests(Number(page) || 1, 10, category);

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No requests yet</h3>
          <p className="text-gray-500 text-sm mb-5">
            {category && category !== 'all'
              ? `No requests in the "${category}" category.`
              : 'Be the first to submit a request.'}
          </p>
          <a
            href="/submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Submit your first request
          </a>
        </div>
      );
    }

    return (
      <div>
        <p className="text-sm text-gray-500 mb-4">{meta.total} request{meta.total !== 1 ? 's' : ''} found</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((req) => (
            <RequestCard key={req._id} request={req} />
          ))}
        </div>
      </div>
    );
  } catch {
    return <ErrorState />;
  }
}

function LoadingSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function DashboardPage({ searchParams }: PageProps) {
  const { category, page } = searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Requests Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">AI-enriched support requests</p>
          </div>
          <a
            href="/submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Request
          </a>
        </div>

        <CategoryFilter current={category || 'all'} />

        <Suspense fallback={<LoadingSkeletons />}>
          <RequestsList category={category} page={page} />
        </Suspense>
      </div>
    </div>
  );
}