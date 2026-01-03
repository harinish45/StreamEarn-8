'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '.';

export type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseMemo = useMemo(initializeFirebase, []);

  const contextValue = useMemo(() => {
    if (!firebaseMemo) return undefined;
    return {
      app: firebaseMemo.app,
      auth: firebaseMemo.auth,
      firestore: firebaseMemo.firestore,
    };
  }, [firebaseMemo]);


  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  return useContext(FirebaseContext) as FirebaseContextValue;
};

export const useFirebaseApp = () => {
  return useFirebase()?.app;
};

export const useFirestore = () => {
  return useFirebase()?.firestore;
};

export const useAuth = () => {
  return useFirebase()?.auth;
};

export { FirebaseContext };
