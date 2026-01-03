'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import dynamic from 'next/dynamic';

const FirebaseClientProvider = dynamic(() => import('./client-provider').then(mod => mod.FirebaseClientProvider), {
  ssr: false,
});


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
  return (
    <FirebaseClientProvider>
      {children}
    </FirebaseClientProvider>
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
