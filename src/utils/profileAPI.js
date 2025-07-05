const API_BASE_URL = 'http://localhost:3001/api';

// Получить профиль студента по ID
export const getProfile = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${studentId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Получить список всех студентов
export const getAllStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Функция для конвертации оценок в GPA (4.0 шкала)
export const convertToGPA = (grade, maxGrade = 100) => {
  return (grade / maxGrade) * 4.0;
};

// Функция для форматирования GPA
export const formatGPA = (gpa) => {
  return parseFloat(gpa).toFixed(2);
}; 