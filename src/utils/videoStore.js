// videoStore.js — хранение и объединение видеофрагментов по assignmentId в IndexedDB

const DB_NAME = 'video-store';
const STORE_NAME = 'videos';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}

export async function addVideoBlob(assignmentId, blob) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const req = store.get(assignmentId);
  const arr = await new Promise(res => {
    req.onsuccess = () => res(Array.isArray(req.result) ? req.result : []);
    req.onerror = () => res([]);
  });
  console.log('До добавления:', arr);
  arr.push(blob);
  store.put(arr, assignmentId);
  await tx.complete;
  db.close();
  // Проверяем, что сохранилось
  const db2 = await openDB();
  const tx2 = db2.transaction(STORE_NAME, 'readonly');
  const store2 = tx2.objectStore(STORE_NAME);
  const req2 = store2.get(assignmentId);
  req2.onsuccess = () => console.log('После добавления:', req2.result);
  req2.onerror = () => console.log('Ошибка чтения после добавления');
}

export async function getAllBlobs(assignmentId) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const req = store.get(assignmentId);
  return new Promise(res => {
    req.onsuccess = () => res(req.result || []);
    req.onerror = () => res([]);
  });
}

export function mergeBlobs(blobs) {
  // Объединяет все blobs в один (webm)
  return new Blob(blobs, { type: 'video/webm' });
} 