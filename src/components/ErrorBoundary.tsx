import React, { useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    let message = "An unexpected error occurred.";
    try {
      const parsed = JSON.parse(error.message || "");
      if (parsed.error && parsed.error.includes("insufficient permissions")) {
        message = "Security Access Denied: You don't have permission to perform this action.";
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-red-500/5 border border-red-500/20 rounded-3xl">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Intelligence System Error</h2>
        <p className="text-brand-muted mb-8 max-w-md">{message}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <RefreshCcw size={18} className="mr-2" />
          Reload Briefing
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
