'use client';

import { useMemo } from 'react';
import { FirebaseContext } from './provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: React.ReactNode; }) {
  const { app, auth, firestore } = useMemo(initializeFirebase, []);

  const contextValue = useMemo(() => {
    return {
      app,
      auth,
      firestore,
    };
  }, [app, auth, firestore]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}
