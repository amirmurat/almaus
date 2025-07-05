const API_BASE_URL = 'http://localhost:3001/api';

// Функция для загрузки JSON файлов (для совместимости со старым кодом)
export const fetchJson = (file) =>
  fetch(process.env.PUBLIC_URL + '/data/' + file).then(r => r.json());

// Общие функции для работы с API
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API для предметов
export const subjectsAPI = {
  // Получить все предметы
  getAll: () => apiRequest('/subjects'),
  
  // Получить предмет по ID
  getById: (id) => apiRequest(`/subjects/${id}`),
  
  // Создать новый предмет
  create: (data) => apiRequest('/subjects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Обновить предмет
  update: (id, data) => apiRequest(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Удалить предмет
  delete: (id) => apiRequest(`/subjects/${id}`, {
    method: 'DELETE',
  }),
};

// API для оценок
export const gradesAPI = {
  // Получить все оценки
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/grades${queryString ? `?${queryString}` : ''}`);
  },
  
  // Получить оценку по ID
  getById: (id) => apiRequest(`/grades/${id}`),
  
  // Создать новую оценку
  create: (data) => apiRequest('/grades', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Обновить оценку
  update: (id, data) => apiRequest(`/grades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Удалить оценку
  delete: (id) => apiRequest(`/grades/${id}`, {
    method: 'DELETE',
  }),
  
  // Получить типы оценок
  getTypes: () => apiRequest('/grades/types/all'),
  
  // Создать новый тип оценки
  createType: (data) => apiRequest('/grades/types', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// API для проверки состояния сервера
export const healthAPI = {
  // Проверка состояния сервера
  check: () => apiRequest('/health'),
  
  // Проверка подключения к БД
  testDB: () => apiRequest('/test-db'),
};

// Функция для округления оценок
export const roundGrade = (value) => {
  if (value === null || value === undefined) return 0;
  return Math.round(value);
};

// Функция для расчета среднего балла
export const calculateAverageGrade = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  const total = grades.reduce((sum, grade) => sum + grade.value, 0);
  return Math.round((total / grades.length));
};

// Функция для расчета процента прогресса
export const calculateProgressPercentage = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  const totalPossible = grades.reduce((sum, grade) => sum + grade.maxValue, 0);
  const totalEarned = grades.reduce((sum, grade) => sum + grade.value, 0);
  
  return Math.round((totalEarned / totalPossible) * 100);
};

// Функция для форматирования даты
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Функция для получения цвета оценки
export const getGradeColor = (value, maxValue = 100) => {
  if (value === null || value === undefined) return '#666';
  
  const roundedValue = roundGrade(value);
  const percentage = (roundedValue / maxValue) * 100;
  
  if (percentage >= 90) return '#4CAF50'; // Зеленый (90 и выше)
  if (percentage >= 70) return '#2196F3'; // Синий (70-89)
  if (percentage >= 50) return '#FF9800'; // Оранжевый (50-69)
  return '#F44336'; // Красный (менее 50)
};

const apiUtils = {
  subjectsAPI,
  gradesAPI,
  healthAPI,
  calculateAverageGrade,
  calculateProgressPercentage,
  formatDate,
  getGradeColor,
  roundGrade,
};

export default apiUtils;
