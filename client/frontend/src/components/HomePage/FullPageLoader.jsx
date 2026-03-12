const FullPageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-stone-100 via-white to-stone-200">
      
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>

        <div className="absolute w-16 h-16 border-4 border-t-amber-500 border-r-rose-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-sm tracking-widest font-semibold text-neutral-600 animate-pulse">
        Loading Store...
      </p>

      {/* Animated dots */}
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
        <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
      </div>

    </div>
  );
};

export default FullPageLoader;