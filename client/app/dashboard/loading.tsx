import SkeletonCard from '@/components/SkeletonCard';

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}