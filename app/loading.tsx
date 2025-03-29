export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-screen-xl mx-auto p-4">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />

          {/* Content skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
