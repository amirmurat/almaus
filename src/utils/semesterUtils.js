// Утилиты для работы с семестрами

// Определяем текущий семестр на основе даты
// Предполагаем, что учебный год начинается в сентябре
export function getCurrentSemester() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Определяем учебный год
  // Если сейчас сентябрь-декабрь, то это первый семестр текущего учебного года
  // Если январь-июнь, то это второй семестр текущего учебного года
  // Если июль-август, то это летние каникулы
  
  let semester;
  
  if (currentMonth >= 9 && currentMonth <= 12) {
    // Осенний семестр
    semester = 1; // Будет скорректировано ниже
  } else if (currentMonth >= 1 && currentMonth <= 6) {
    // Весенний семестр
    semester = 2; // Будет скорректировано ниже
  } else {
    // Летние каникулы (июль-август) - показываем предыдущий семестр
    semester = 2;
  }
  
  // Определяем семестр в рамках обучения
  // Предполагаем, что студент поступил в 2022 году
  const startYear = 2022; // Год поступления
  const academicYear = currentYear;
  const yearsPassed = academicYear - startYear;
  
  // Определяем семестр на основе прошедших лет обучения
  if (yearsPassed === 0) {
    // Первый год обучения
    semester = currentMonth >= 9 && currentMonth <= 12 ? 1 : 2;
  } else if (yearsPassed === 1) {
    // Второй год обучения
    semester = currentMonth >= 9 && currentMonth <= 12 ? 3 : 4;
  } else if (yearsPassed === 2) {
    // Третий год обучения
    semester = currentMonth >= 9 && currentMonth <= 12 ? 5 : 6;
  } else if (yearsPassed === 3) {
    // Четвертый год обучения
    semester = currentMonth >= 9 && currentMonth <= 12 ? 7 : 8;
  } else {
    // Если прошло больше 4 лет, показываем последний семестр
    semester = 8;
  }
  
  return semester;
}

// Получаем текущий семестр из localStorage или устанавливаем 3 семестр
export function getCurrentSemesterOrDefault() {
  // Принудительно устанавливаем 3 семестр
  const current = 3;
  localStorage.setItem('currentSemester', current.toString());
  return current;
}

// Устанавливаем текущий семестр пользователя
export function setCurrentSemester(semester) {
  if (semester >= 1 && semester <= 8) {
    localStorage.setItem('currentSemester', semester.toString());
  }
} 