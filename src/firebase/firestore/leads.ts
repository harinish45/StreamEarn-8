'use client';

import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  type Firestore,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import type { Lead } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function createLead(
  db: Firestore,
  userId: string,
  lead: Omit<Lead, 'id'>
) {
  const docRef = doc(collection(db, 'users', userId, 'leads'));
  const newLead = { ...lead, id: docRef.id };
  return setDoc(docRef, newLead)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'create',
            requestResourceData: newLead,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function updateLead(
  db: Firestore,
  userId: string,
  leadId: string,
  updates: Partial<Lead>
) {
  const docRef = doc(db, 'users', userId, 'leads', leadId);
  return setDoc(docRef, updates, { merge: true })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: updates,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function updateLeads(
  db: Firestore,
  userId: string,
  leadIds: string[],
  updates: Partial<Lead>
) {
  const batch = writeBatch(db);
  leadIds.forEach((id) => {
    const docRef = doc(db, 'users', userId, 'leads', id);
    batch.update(docRef, updates);
  });
  return batch.commit()
    .catch((serverError) => {
        // Note: Batched writes don't provide individual document context on failure.
        const permissionError = new FirestorePermissionError({
            path: `/users/${userId}/leads/[MULTIPLE]`,
            operation: 'update',
            requestResourceData: updates,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function deleteLeads(db: Firestore, userId: string, leadIds: string[]) {
  const batch = writeBatch(db);
  leadIds.forEach((id) => {
    const docRef = doc(db, 'users', userId, 'leads', id);
    batch.delete(docRef);
  });
  return batch.commit()
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: `/users/${userId}/leads/[MULTIPLE]`,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}
