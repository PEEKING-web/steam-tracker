function LoadingSkeleton({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="bg-steam-dark rounded-lg p-4 border border-steam-blue/20 animate-pulse">
        <div className="h-32 bg-steam-darker rounded mb-3"></div>
        <div className="h-4 bg-steam-darker rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-steam-darker rounded w-1/2"></div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="bg-steam-dark rounded-xl p-8 border border-steam-blue/20 animate-pulse">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-steam-darker rounded-xl"></div>
          <div className="flex-1">
            <div className="h-8 bg-steam-darker rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-steam-darker rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-steam-darker rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default LoadingSkeleton;