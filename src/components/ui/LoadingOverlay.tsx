import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-200 dark:border-gray-700">
        <Loader2 className="h-12 w-12 text-[#98867a] animate-spin" />
        <p className="text-gray-900 dark:text-white font-medium">{message}</p>
      </div>
    </div>
  );
}
