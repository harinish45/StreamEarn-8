'use client';

import { useState, useEffect, useMemo } from 'react';
import type { DocumentReference, DocumentData } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { fromDb } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useDoc<T>(docRef: DocumentReference<DocumentData> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      setData(null);
      return;
    };
    setLoading(true);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(fromDb({ ...snapshot.data(), id: snapshot.id }) as T);
      } else {
        setData(null);
      }
      setLoading(false);
    },
    async (error) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [docRef]);

  const memoizedData = useMemo(() => data, [data]);

  return { data: memoizedData, loading };
}
