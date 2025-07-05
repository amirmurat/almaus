const API_BASE_URL = 'http://localhost:3001/api';

// Получить расписание для группы на текущий семестр
export const getScheduleForGroup = async (groupName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule/${encodeURIComponent(groupName)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
}; 