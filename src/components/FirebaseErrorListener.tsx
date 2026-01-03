'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This component is responsible for listening to Firestore permission errors
// and throwing them so that Next.js's development error overlay can catch them.
// This provides a much better debugging experience than just logging to the console.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // We throw the error in a timeout to break out of the current render cycle
      // and ensure it's caught by the global error handler (Next.js overlay).
      setTimeout(() => {
        throw error;
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.removeListener('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything.
}
