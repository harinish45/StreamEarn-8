const DB_NAME = 'streamearn-local';
const DB_VERSION = 1;
const STORE = 'kv';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
  });
}

export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    return await navigator.storage.persist();
  } catch { return false; }
}

export async function getStorageEstimate(): Promise<{ usage: number; quota: number }> {
  try {
    const estimate = await navigator.storage?.estimate();
    return { usage: estimate?.usage ?? 0, quota: estimate?.quota ?? 0 };
  } catch { return { usage: 0, quota: 0 }; }
}

export async function localGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = await openDB();
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).get(key);
      request.onsuccess = () => resolve((request.result as T | undefined) ?? fallback);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    try { const raw = window.localStorage.getItem(`streamearn:${key}`); return raw ? (JSON.parse(raw) as T) : fallback; }
    catch { return fallback; }
  }
}

export async function localSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    });
  } catch { try { window.localStorage.setItem(`streamearn:${key}`, JSON.stringify(value)); } catch { /* unavailable */ } }
}

export async function localRemove(key: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error);
    });
  } catch { try { window.localStorage.removeItem(`streamearn:${key}`); } catch { /* unavailable */ } }
}

export async function clearLocalStore(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).clear();
      tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error);
    });
  } catch {
    try { Object.keys(window.localStorage).filter(k => k.startsWith('streamearn:')).forEach(k => window.localStorage.removeItem(k)); } catch { /* unavailable */ }
  }
}

export async function cacheSameOriginResponse(key: string, response: Response): Promise<void> {
  if (!('caches' in window)) return;
  try { const cache = await caches.open('streamearn-http-v1'); await cache.put(new Request(`/__streamearn_cache__/${encodeURIComponent(key)}`), response.clone()); } catch { /* optional */ }
}

export async function readCachedResponse(key: string): Promise<Response | undefined> {
  if (!('caches' in window)) return undefined;
  try { const cache = await caches.open('streamearn-http-v1'); return await cache.match(new Request(`/__streamearn_cache__/${encodeURIComponent(key)}`)); } catch { return undefined; }
}
