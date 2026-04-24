export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm animate-pulse">
      <div className="flex justify-between mb-3">
        <div>
          <div className="h-4 bg-gray-200 rounded w-28 mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-36" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-16" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
      <div className="h-3 bg-indigo-50 rounded w-3/4 mb-4" />
      <div className="flex gap-2">
        <div className="h-5 bg-gray-100 rounded-full w-16" />
        <div className="h-5 bg-gray-100 rounded-full w-12" />
      </div>
    </div>
  );
}