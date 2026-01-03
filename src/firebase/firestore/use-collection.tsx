'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { produce } from 'immer';
import { fromDb } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


interface UseCollectionOptions {
  listen?: boolean;
}

export function useCollection<T extends { id: string }>(
  query: Query<DocumentData> | null,
  options: UseCollectionOptions = { listen: true }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  const add = useCallback((item: T) => {
    setData(produce(draft => {
      if (draft && !draft.some(d => d.id === item.id)) {
        draft.push(item);
      }
    }));
  }, []);

  const update = useCallback((itemId: string, updates: Partial<T>) => {
    setData(produce(draft => {
      const item = draft?.find(i => i.id === itemId);
      if (item) {
        Object.assign(item, updates);
      }
    }));
  }, []);

  const remove = useCallback((itemId: string) => {
    setData(produce(draft => {
      if (draft) {
        const index = draft.findIndex(i => i.id === itemId);
        if (index > -1) {
          draft.splice(index, 1);
        }
      }
    }));
  }, []);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const handleSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      const newData = snapshot.docs.map(doc => {
          const docData = doc.data();
          const id = doc.id;
          
          const tasksCollection = collection(doc.ref, 'tasks');
          onSnapshot(tasksCollection, (tasksSnapshot) => {
              const tasks = tasksSnapshot.docs.map(taskDoc => ({...taskDoc.data(), id: taskDoc.id})) as T['tasks'];
              update(id, { tasks: tasks });
          });

          return fromDb({ ...docData, id: doc.id })
      }) as T[];

      setData(newData);
      setLoading(false);
    };

    const handleError = async (error: Error) => {
        // This is a hack to get the collection path from the query
        const path = (query as any)._query.path.segments.join('/');
        const permissionError = new FirestorePermissionError({
            path: path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
    };

    if (!options.listen) {
      // One-time fetch is not implemented in this hook, but could be added.
      // For now, we always listen if a query is provided.
    }

    const unsubscribe = onSnapshot(query, handleSnapshot, handleError);

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, options.listen]);

  const memoizedData = useMemo(() => data, [data]);

  return { data: memoizedData, loading, add, update, remove };
}
