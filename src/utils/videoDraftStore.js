// videoDraftStore.js
// Утилита для хранения видео-черновиков и отправленных видео через IndexedDB

const DB_NAME = 'almau-app-videos';
const DB_VERSION = 1;
const DRAFT_STORE = 'drafts';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DRAFT_STORE)) db.createObjectStore(DRAFT_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDraftFragment(assignmentId, blob) {
  const db = await openDB();
  const tx = db.transaction(DRAFT_STORE, 'readwrite');
  const store = tx.objectStore(DRAFT_STORE);
  // Получаем текущий массив фрагментов через Promise
  const arr = await new Promise((resolve, reject) => {
    const req = store.get(assignmentId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
  arr.push(blob);
  store.put(arr, assignmentId);
  await tx.complete;
  db.close();
}

export async function getDraftFragments(assignmentId) {
  const db = await openDB();
  const tx = db.transaction(DRAFT_STORE, 'readonly');
  const store = tx.objectStore(DRAFT_STORE);
  const req = store.get(assignmentId);
  return new Promise(res => {
    req.onsuccess = () => {
      db.close();
      res(req.result || []);
    };
    req.onerror = () => {
      db.close();
      res([]);
    };
  });
}

export async function clearDraft(assignmentId) {
  const db = await openDB();
  const tx = db.transaction(DRAFT_STORE, 'readwrite');
  tx.objectStore(DRAFT_STORE).delete(assignmentId);
  await tx.complete;
  db.close();
}

export async function mergeDraftFragments(assignmentId) {
  // Возвращает один Blob из всех фрагментов (WebM)
  const fragments = await getDraftFragments(assignmentId);
  if (!fragments.length) return null;
  return new Blob(fragments, { type: 'video/webm' });
}

export async function saveSubmission(assignmentId, blob) {
  const db = await openDB();
  const tx = db.transaction(DRAFT_STORE, 'readwrite');
  tx.objectStore(DRAFT_STORE).put(blob, assignmentId);
  await tx.complete;
  db.close();
}

export async function getSubmission(assignmentId) {
  const db = await openDB();
  const tx = db.transaction(DRAFT_STORE, 'readonly');
  const req = tx.objectStore(DRAFT_STORE).get(assignmentId);
  return new Promise(res => {
    req.onsuccess = () => {
      db.close();
      res(req.result || null);
    };
    req.onerror = () => {
      db.close();
      res(null);
    };
  });
}

export async function deleteSubmission(assignmentId) {
  const db = await openDB();
  const tx = db.transaction(DRAFT_STORE, 'readwrite');
  tx.objectStore(DRAFT_STORE).delete(assignmentId);
  await tx.complete;
  db.close();
}

export async function addSubmission(assignmentId, blob) {
  const db = await openDB();
  const tx = db.transaction(DRAFT_STORE, 'readwrite');
  const store = tx.objectStore(DRAFT_STORE);
  // Получаем текущий массив отправок
  const arr = await new Promise((resolve, reject) => {
    const req = store.get(assignmentId);
    req.onsuccess = () => {
      const val = req.result;
      if (Array.isArray(val)) resolve(val);
      else if (val) resolve([val]);
      else resolve([]);
    };
    req.onerror = () => resolve([]);
  });
  arr.push({ blob, date: Date.now() });
  store.put(arr, assignmentId);
  await tx.complete;
  db.close();
} 