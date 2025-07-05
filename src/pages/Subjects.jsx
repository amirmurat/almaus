import { useNavigate } from 'react-router-dom';
import { MdOutlineFilterList } from 'react-icons/md';

export default function SubjectsPage() {
  const nav = useNavigate();
  const courses = [
    { name: 'Математика', subgrades: [70, 80, 70, 80, 70], credits: 5, semester: 1, teacher: 'Иванов А.П.', retake: 0 },
    { name: 'История', subgrades: [65, 75, 70, 80, 70], credits: 3, semester: 1, teacher: 'Петрова М.С.', retake: 0 },
    { name: 'Экономика', subgrades: [60, 70, 65, 75, 65], credits: 4, semester: 2, teacher: 'Сидоров В.И.', retake: 1 },
    { name: 'Английский язык', subgrades: [45, 55, 50, 60, 55], credits: 2, semester: 2, teacher: 'Козлова Е.А.', retake: 2 },
    { name: 'Физика', subgrades: [85, 90, 88, 92, 87], credits: 4, semester: 3, teacher: 'Морозов Д.К.', retake: 0 },
    { name: 'Химия', subgrades: [70, 75, 72, 78, 74], credits: 3, semester: 3, teacher: 'Волкова Н.Л.', retake: 0 },
    { name: 'Биология', subgrades: [90, 95, 92, 98, 94], credits: 2, semester: 4, teacher: 'Соколова И.В.', retake: 0 },
    { name: 'Информатика', subgrades: [80, 85, 82, 88, 84], credits: 5, semester: 4, teacher: 'Лебедев С.М.', retake: 0 },
    { name: 'География', subgrades: [65, 70, 68, 72, 69], credits: 2, semester: 5, teacher: 'Новикова О.Р.', retake: 0 },
    { name: 'Литература', subgrades: [50, 55, 52, 58, 54], credits: 3, semester: 5, teacher: 'Кузнецова Т.А.', retake: 1 },
    { name: 'Искусство', subgrades: [75, 80, 77, 83, 79], credits: 2, semester: 6, teacher: 'Романова Л.Д.', retake: 0 },
    { name: 'Физкультура', subgrades: [95, 100, 97, 100, 98], credits: 1, semester: 6, teacher: 'Смирнов А.В.', retake: 0 },
    { name: 'Обществознание', subgrades: [65, 70, 68, 72, 69], credits: 3, semester: 7, teacher: 'Федорова К.П.', retake: 0 },
    { name: 'Технология', subgrades: [80, 85, 82, 88, 84], credits: 2, semester: 8, teacher: 'Александров Г.Н.', retake: 0 },
  ];
  function getGradeColor(grade) {
    if (grade > 90) return '#388e3c'; // зеленый
    if (grade > 70) return '#1976d2'; // синий
    if (grade > 50) return '#f57c00'; // оранжевый
    return '#d32f2f'; // красный
  }
  // Получаем выбранные семестры из localStorage (например, после выбора на странице фильтра предметов)
  let selectedSemesters = [];
  try {
    selectedSemesters = JSON.parse(localStorage.getItem('selectedSemesters'));
  } catch {}
  if (!Array.isArray(selectedSemesters)) {
    selectedSemesters = [];
  }
  // Получаем диапазон баллов из localStorage
  let scoreRange = { min: '', max: '' };
  try {
    const saved = JSON.parse(localStorage.getItem('scoreRange'));
    if (saved && (saved.min !== '' || saved.max !== '')) scoreRange = saved;
  } catch {}
  // Фильтрация по семестрам и баллам для предметов
  const filteredCourses = courses.filter(c => {
    const inSemester = selectedSemesters.includes(c.semester);
    const minOk = scoreRange.min === '' || c.grade >= Number(scoreRange.min);
    const maxOk = scoreRange.max === '' || c.grade <= Number(scoreRange.max);
    return inSemester && minOk && maxOk;
  });
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
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
          onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#23272f'; }}
          aria-label="Назад"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {/* Иконка фильтра справа */}
        <span
          style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.13s', cursor: 'pointer' }}
          tabIndex={0}
          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.88)'; }}
          onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; nav('/filter'); }}
          onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <MdOutlineFilterList style={{fontSize:28, color:'#23272f'}} />
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%',
          minHeight: 220,
        }}
      >
        {filteredCourses.map((course, i) => {
          const avg = Math.round(course.subgrades.reduce((a, b) => a + b, 0) / course.subgrades.length);
          return (
            <div
              key={i}
              style={{
                border: 'none',
                borderRadius: 0,
                width: '100%',
                height: 55,
                minHeight: 0,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 400,
                fontSize: 16,
                color: '#23272f',
                textAlign: 'left',
                padding: '12px 18px',
                boxSizing: 'border-box',
                position: 'relative',
                fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                transition: 'transform 0.13s',
                cursor: 'pointer',
              }}
              onClick={() => {
                localStorage.setItem('subjectSubgrades', JSON.stringify(course.subgrades));
                nav(`/subject/${course.name}`);
              }}
              onPointerDown={e => { 
                e.currentTarget.style.transform = 'scale(0.96)'; 
              }}
              onPointerUp={e => { 
                e.currentTarget.style.transform = 'scale(1)'; 
              }}
              onPointerLeave={e => { 
                e.currentTarget.style.transform = 'scale(1)'; 
              }}
            >
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                <span style={{fontSize:16, fontWeight:500, color:'#23272f'}}>{course.name}</span>
                <span style={{
                  fontSize: 13,
                  color: '#666',
                  fontWeight: 400,
                  marginTop: 2,
                }}>{course.teacher}</span>
              </div>
              <div style={{display:'flex',flexDirection:'row',alignItems:'baseline',gap:8}}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'baseline',gap:6,marginRight:10}}>
                  {course.subgrades.map((val, idx) => (
                    <span key={idx} style={{fontSize:11, color:getGradeColor(val), fontWeight:400}}>{val}</span>
                  ))}
                </div>
                <span style={{
                  fontSize: 24,
                  fontWeight: 400,
                  color: getGradeColor(avg),
                  lineHeight: 1.1,
                  marginLeft: 4,
                }}>{avg}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 