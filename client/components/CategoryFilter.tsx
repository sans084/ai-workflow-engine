'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'billing', label: 'Billing' },
  { value: 'support', label: 'Support' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'general', label: 'General' },
];

export default function CategoryFilter({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCategory = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all') {
        params.delete('category');
      } else {
        params.set('category', value);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            current === cat.value
              ? 'bg-indigo-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}