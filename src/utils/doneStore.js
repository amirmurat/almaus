const KEY = 'assignmentsDone';   // ключ в localStorage

// вернуть Set выполненных id (строки)
export const loadDone = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
  } catch {
    return new Set();
  }
};

// сохранить Set в localStorage
export const saveDone = (set) => {
  localStorage.setItem(KEY, JSON.stringify([...set]));
};
