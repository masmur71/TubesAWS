export default function LoadingSpinner({ text = 'Memuat...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner ring */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-surface-800 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-brand-500 rounded-full animate-spin" />
          <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-b-brand-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <span className="text-surface-500 font-mono text-xs tracking-[0.3em] uppercase">{text}</span>
      </div>
    </div>
  );
}
