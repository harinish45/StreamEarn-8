'use client';

import { useMemo } from 'react';
import { FirebaseContext } from './provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: React.ReactNode; }) {
  const firebaseMemo = useMemo(initializeFirebase, []);

  const contextValue = useMemo(() => {
    if (!firebaseMemo) return undefined;
    return {
      app: firebaseMemo.app,
      auth: firebaseMemo.auth,
      firestore: firebaseMemo.firestore,
    };
  }, [firebaseMemo]);

  if (!contextValue) {
    return <>{children}</>;
  }


  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}
