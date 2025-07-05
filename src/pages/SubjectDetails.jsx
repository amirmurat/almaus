import { useNavigate, useParams } from 'react-router-dom';
import { MdCalendarToday, MdAssignment, MdAttachFile, MdNote, MdTrendingUp, MdSchedule, MdGrade, MdPerson } from 'react-icons/md';

export default function SubjectDetailsPage() {
  const nav = useNavigate();
  const { subjectName } = useParams();

  // Получаем данные subgrades из localStorage
  let subgrades = [
    { label: 'Ср.тек. 11', value: 70 },
    { label: 'Ср.тек. 22', value: 80 },
    { label: 'РК 1', value: 70 },
    { label: 'РК 2', value: 80 },
    { label: 'Экз.', value: 70 }
  ];
  
  try {
    const savedSubgrades = JSON.parse(localStorage.getItem('subjectSubgrades'));
    if (savedSubgrades && Array.isArray(savedSubgrades)) {
      subgrades = [
        { label: 'Ср.тек. 11', value: savedSubgrades[0] },
        { label: 'Ср.тек. 22', value: savedSubgrades[1] },
        { label: 'РК 1', value: savedSubgrades[2] },
        { label: 'РК 2', value: savedSubgrades[3] },
        { label: 'Экз.', value: savedSubgrades[4] }
      ];
    }
  } catch {}

  // Моковые данные для предмета
  const subjectData = {
    name: decodeURIComponent(subjectName),
    subgrades: subgrades,
    credits: 4,
    semester: 2,
    teacher: 'Иванов А.П.',
    retake: 0,
    description: 'Подробная информация о предмете',
    progress: 75, // прогресс в процентах
    attendance: 85, // посещаемость
    assignments: [
      { title: 'Домашнее задание 1', dueDate: '2024-01-15', status: 'completed', grade: 85 },
      { title: 'Контрольная работа', dueDate: '2024-01-20', status: 'pending', grade: null },
      { title: 'Проект', dueDate: '2024-01-25', status: 'pending', grade: null },
      { title: 'Лабораторная работа', dueDate: '2024-01-18', status: 'completed', grade: 92 }
    ],
    schedule: [
      { day: 'Понедельник', time: '09:00-10:30', room: 'Ауд. 301', type: 'Лекция' },
      { day: 'Среда', time: '14:00-15:30', room: 'Ауд. 205', type: 'Практика' },
      { day: 'Пятница', time: '11:00-12:30', room: 'Лаб. 101', type: 'Лабораторная' }
    ],
    files: [
      { name: 'Лекция 1.pdf', size: '2.3 MB', date: '2024-01-10' },
      { name: 'Практикум.pdf', size: '1.8 MB', date: '2024-01-12' },
      { name: 'Методичка.pdf', size: '4.1 MB', date: '2024-01-08' }
    ],
    notes: [
      { title: 'Важные формулы', content: 'Не забыть выучить формулы для контрольной', date: '2024-01-14' },
      { title: 'Вопросы к экзамену', content: 'Подготовить ответы на вопросы 1-15', date: '2024-01-13' }
    ],
    statistics: {
      averageGrade: 78,
      totalAssignments: 12,
      completedAssignments: 8,
      missedClasses: 2,
      studyHours: 45
    }
  };

  const avg = Math.round(subjectData.subgrades.reduce((a, b) => a + b.value, 0) / subjectData.subgrades.length);

  function getGradeColor(grade) {
    if (grade > 90) return '#388e3c'; // зеленый
    if (grade > 70) return '#1976d2'; // синий
    if (grade > 50) return '#f57c00'; // оранжевый
    return '#d32f2f'; // красный
  }

  function getStatusColor(status) {
    switch (status) {
      case 'completed': return '#388e3c';
      case 'pending': return '#f57c00';
      case 'overdue': return '#d32f2f';
      default: return '#666';
    }
  }

  function getStatusText(status) {
    switch (status) {
      case 'completed': return 'Выполнено';
      case 'pending': return 'В процессе';
      case 'overdue': return 'Просрочено';
      default: return 'Неизвестно';
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        justifyContent: 'space-between',
        minHeight: 40,
      }}>
        {/* Кнопка назад */}
        <button
          onClick={() => nav(-1)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#23272f',
            fontSize: 0,
            transition: 'color 0.18s, transform 0.13s, opacity 0.13s',
          }}
          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.88)'; e.currentTarget.style.opacity = '0.7'; }}
          onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
          onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#23272f'; }}
          aria-label="Назад"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        
        {/* Заголовок страницы */}
        <h1 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: '#23272f',
          flex: 1,
          textAlign: 'center'
        }}>
          {subjectData.name}
        </h1>
        
        {/* Пустой элемент для баланса */}
        <div style={{ width: 28 }}></div>
      </div>

      {/* Основная информация о предмете */}
      <div style={{
        border: 'none',
        borderRadius: 0,
        width: '100%',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 16,
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#23272f' }}>
            Текущая оценка
          </span>
          <span style={{
            fontSize: 24,
            fontWeight: 600,
            color: getGradeColor(avg),
          }}>
            {avg}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: '#666' }}>
            Кредиты: {subjectData.credits}
          </span>
          <span style={{ fontSize: 14, color: '#666' }}>
            Семестр: {subjectData.semester}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#666' }}>
            Преподаватель: {subjectData.teacher}
          </span>
        </div>
        
        {subjectData.retake > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 14, color: '#d32f2f', fontWeight: 500 }}>
              Пересдача: {subjectData.retake}
            </span>
          </div>
        )}
      </div>

      {/* Прогресс и статистика */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 16
        }}>
          {/* Прогресс */}
          <div style={{
            padding: '16px',
            background: 'rgba(245,247,250,0.5)',
            borderRadius: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <MdTrendingUp style={{ fontSize: 16, color: '#666', marginRight: 6 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#23272f' }}>Прогресс</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{
                width: '100%',
                height: 6,
                background: '#e0e0e0',
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${subjectData.progress}%`,
                  height: '100%',
                  background: getGradeColor(avg),
                  borderRadius: 3,
                }} />
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#666' }}>{subjectData.progress}% завершено</span>
          </div>

          {/* Посещаемость */}
          <div style={{
            padding: '16px',
            background: 'rgba(245,247,250,0.5)',
            borderRadius: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <MdSchedule style={{ fontSize: 16, color: '#666', marginRight: 6 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#23272f' }}>Посещаемость</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{
                width: '100%',
                height: 6,
                background: '#e0e0e0',
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${subjectData.attendance}%`,
                  height: '100%',
                  background: '#1976d2',
                  borderRadius: 3,
                }} />
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#666' }}>{subjectData.attendance}% посещений</span>
          </div>
        </div>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          <div style={{ textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: getGradeColor(avg) }}>
              {subjectData.statistics.averageGrade}
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>Средний балл</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1976d2' }}>
              {subjectData.statistics.completedAssignments}/{subjectData.statistics.totalAssignments}
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>Задания</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#f57c00' }}>
              {subjectData.statistics.missedClasses}
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>Пропуски</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#388e3c' }}>
              {subjectData.statistics.studyHours}
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>Часов</div>
          </div>
        </div>
      </div>

      {/* Детальные оценки */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 400,
          color: '#23272f',
          margin: '0 0 12px 0'
        }}>
          Детальные оценки
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {subjectData.subgrades.map((grade, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: 'rgba(245,247,250,0.5)',
              borderRadius: 0,
            }}>
              <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>
                {grade.label}
              </span>
              <span style={{
                fontSize: 16,
                fontWeight: 600,
                color: getGradeColor(grade.value),
              }}>
                {grade.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Задания */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 400,
          color: '#23272f',
          margin: '0 0 12px 0'
        }}>
          Задания
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subjectData.assignments.map((assignment, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(245,247,250,0.5)',
              borderRadius: 0,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#23272f', marginBottom: 4 }}>
                  {assignment.title}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Срок: {assignment.dueDate}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {assignment.grade && (
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: getGradeColor(assignment.grade),
                  }}>
                    {assignment.grade}
                  </span>
                )}
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: getStatusColor(assignment.status),
                  textTransform: 'uppercase'
                }}>
                  {getStatusText(assignment.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Расписание */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 400,
          color: '#23272f',
          margin: '0 0 12px 0'
        }}>
          Расписание
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subjectData.schedule.map((lesson, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(245,247,250,0.5)',
              borderRadius: 0,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#23272f', marginBottom: 4 }}>
                  {lesson.day} • {lesson.time}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {lesson.type} • {lesson.room}
                </div>
              </div>
              <MdCalendarToday style={{ fontSize: 16, color: '#666' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Файлы */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 400,
          color: '#23272f',
          margin: '0 0 12px 0'
        }}>
          Файлы
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subjectData.files.map((file, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(245,247,250,0.5)',
              borderRadius: 0,
              cursor: 'pointer',
            }}
            onClick={() => alert(`Скачать ${file.name}`)}
            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#23272f', marginBottom: 4 }}>
                  {file.name}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {file.size} • {file.date}
                </div>
              </div>
              <MdAttachFile style={{ fontSize: 16, color: '#666' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Заметки */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 400,
          color: '#23272f',
          margin: '0 0 12px 0'
        }}>
          Заметки
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subjectData.notes.map((note, index) => (
            <div key={index} style={{
              padding: '12px 16px',
              background: 'rgba(245,247,250,0.5)',
              borderRadius: 0,
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#23272f', marginBottom: 4 }}>
                {note.title}
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4, lineHeight: 1.4 }}>
                {note.content}
              </div>
              <div style={{ fontSize: 11, color: '#999' }}>
                {note.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 