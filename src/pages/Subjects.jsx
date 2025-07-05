import { useNavigate } from 'react-router-dom';
import { MdOutlineFilterList } from 'react-icons/md';
import { useState, useEffect, useMemo } from 'react';
import { subjectsAPI, calculateAverageGrade, getGradeColor, roundGrade } from '../utils/api';
import { getProfile } from '../utils/profileAPI';

export default function SubjectsPage() {
  const nav = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsedSubjects, setCollapsedSubjects] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState(null);

  // ID студента для теста (заменить на реальный)
  const studentId = 'cmcpr60vq0008cxv87eo5ww0o';

  // Получаем доступные семестры для пользователя
  useEffect(() => {
    async function fetchSemesters() {
      try {
        const profile = await getProfile(studentId);
        setAvailableSemesters(profile.academicInfo?.availableSemesters || []);
      } catch (e) {
        setAvailableSemesters([]);
      }
    }
    fetchSemesters();
  }, [studentId]);

  // Вынести значения localStorage в переменные
  const selectedSemestersRaw = localStorage.getItem('selectedSemesters');
  const scoreRangeRaw = localStorage.getItem('scoreRange');

  // Получаем выбранные семестры из localStorage (useMemo)
  const selectedSemesters = useMemo(() => {
    try {
      const arr = JSON.parse(selectedSemestersRaw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [selectedSemestersRaw]);

  // Получаем диапазон баллов из localStorage (useMemo)
  const scoreRange = useMemo(() => {
    try {
      const saved = JSON.parse(scoreRangeRaw);
      if (saved && (saved.min !== '' || saved.max !== '')) return saved;
    } catch {}
    return { min: '', max: '' };
  }, [scoreRangeRaw]);

  // Фильтрация по семестрам, баллам и доступным семестрам для предметов
  const filteredSubjects = subjects.filter(subject => {
    // Проверяем, входит ли предмет в выбранные семестры
    const inSemester = selectedSemesters.length === 0 || selectedSemesters.includes(subject.semester);
    // Проверяем, входит ли предмет в доступные семестры
    const inAvailable = !availableSemesters || availableSemesters.includes(subject.semester);
    // Рассчитываем средний балл для фильтрации
    const avgGrade = calculateAverageGrade(subject.grades || []);
    const minOk = scoreRange.min === '' || avgGrade >= Number(scoreRange.min);
    const maxOk = scoreRange.max === '' || avgGrade <= Number(scoreRange.max);
    return inSemester && inAvailable && minOk && maxOk;
  });

  // Загрузка предметов с сервера
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const data = await subjectsAPI.getAll();
        setSubjects(data);
        // По умолчанию все предметы свернуты по фильтру
        const filtered = data.filter(subject => {
          const inSemester = selectedSemesters.length === 0 || selectedSemesters.includes(subject.semester);
          const inAvailable = !availableSemesters || availableSemesters.includes(subject.semester);
          const avgGrade = calculateAverageGrade(subject.grades || []);
          const minOk = scoreRange.min === '' || avgGrade >= Number(scoreRange.min);
          const maxOk = scoreRange.max === '' || avgGrade <= Number(scoreRange.max);
          return inSemester && inAvailable && minOk && maxOk;
        });
        setCollapsedSubjects(filtered.map(subject => subject.id));
        setError(null);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Ошибка загрузки предметов');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [selectedSemesters, scoreRange.min, scoreRange.max, availableSemesters]);

  if (loading) {
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
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          color: '#666',
          fontSize: 16
        }}>
          Загрузка предметов...
        </div>
      </div>
    );
  }

  if (error) {
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
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          color: '#d32f2f',
          fontSize: 16
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
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
        
        {/* Кнопка сворачивания всех предметов */}
        {filteredSubjects.length > 0 && (
          <button
            onClick={() => {
              if (collapsedSubjects.length === filteredSubjects.length) {
                // Если все свернуты - развернуть все
                setCollapsedSubjects([]);
              } else {
                // Иначе свернуть все только те, что в фильтре
                setCollapsedSubjects(filteredSubjects.map(s => s.id));
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#23272f',
              fontSize: 13,
              fontWeight: 500,
              transition: 'color 0.18s, transform 0.13s, opacity 0.13s',
              borderRadius: 0,
            }}
            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.88)'; e.currentTarget.style.opacity = '0.7'; }}
            onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
            onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = '#23272f'; }}
          >
            {collapsedSubjects.length === filteredSubjects.length ? 'Развернуть все' : 'Свернуть все'}
          </button>
        )}
        
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

      {/* Основная информация - средний балл */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1px',
          margin: '0px 2px 0px 0px',
          background: 'transparent',
          borderRadius: 0,
          width: '100%',
          minHeight: 0,
          fontWeight: 400,
          fontSize: 16,
          color: '#23272f',
          textAlign: 'left',
          boxSizing: 'border-box',
          position: 'relative',
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        }}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
            <span style={{fontSize:16, fontWeight:500, color:'#23272f'}}>Средний балл</span>
            <span style={{
              fontSize: 13,
              color: '#888',
              fontWeight: 400,
              marginTop: 1,
            }}>Общий средний балл по всем предметам</span>
          </div>
          <div style={{display:'flex',flexDirection:'row',alignItems:'baseline',gap:8}}>
            <span style={{
              fontSize: 20,
              fontWeight: 400,
              color: getGradeColor(calculateAverageGrade(subjects.flatMap(s => s.grades || []))),
              lineHeight: 1.1,
            }}>{calculateAverageGrade(subjects.flatMap(s => s.grades || [])) || 0}</span>
          </div>
        </div>
      </div>

      {/* Список предметов с детальной информацией */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
          width: '100%',
          minHeight: 220,
      }}>
        {filteredSubjects.map((subject) => {
          const avg = calculateAverageGrade(subject.grades || []);
          const isCollapsed = collapsedSubjects.includes(subject.id);
          
          return (
          <div
              key={subject.id}
            style={{
                background: 'transparent',
                borderRadius: 0,
              width: '100%',
              minHeight: 0,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              fontWeight: 400,
              fontSize: 16,
              color: '#23272f',
              textAlign: 'left',
                padding: '1px',
                margin: '2px 2px 2px 0px',
              boxSizing: 'border-box',
              position: 'relative',
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                transition: 'background 0.08s',
              }}
            >
              {/* Заголовок предмета с кнопкой сворачивания */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '4px 0',
                }}
                onClick={() => {
                  setCollapsedSubjects(prev =>
                    prev.includes(subject.id)
                      ? prev.filter(id => id !== subject.id)
                      : [...prev, subject.id]
                  );
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: 1,
                  justifyContent: 'space-between',
                  minWidth: 0,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 16,
                    marginBottom: 1,
                    wordBreak: 'break-word',
                  }}>
                    <span style={{fontSize:16, fontWeight:500, color:'#23272f'}}>{subject.name}</span>
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: '#888',
                    wordBreak: 'break-word',
                    marginBottom: 1,
                  }}>{subject.teacher?.name || 'Преподаватель не назначен'}</div>
                  <div style={{
                    fontSize: 13,
                    color: '#888',
                    wordBreak: 'break-word',
                    marginBottom: 1,
                  }}>Семестр {subject.semester}</div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 4,
                }}>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 400,
                    color: getGradeColor(avg),
                    lineHeight: 1.1,
                    textAlign: 'right',
                  }}>{avg || 0}</div>
                  <span style={{
                    display: 'inline-block',
                    transition: 'transform 0.2s',
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    width: 18, height: 18,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Детальные оценки */}
              <div style={{
                maxHeight: isCollapsed ? 0 : 1000,
                opacity: isCollapsed ? 0 : 1,
                overflow: 'hidden',
                pointerEvents: isCollapsed ? 'none' : 'auto',
                transition: 'max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                marginTop: 8,
              }}>
                {subject.sredniyTek1 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}>
                    <span style={{fontSize:13, fontWeight:500, color:'#23272f'}}>Ср.тек. 11</span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 400,
                      color: getGradeColor(roundGrade(subject.sredniyTek1)),
                      lineHeight: 1.1,
                    }}>{roundGrade(subject.sredniyTek1)}</span>
                  </div>
                )}
                
                {subject.sredniyTek2 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}>
                    <span style={{fontSize:13, fontWeight:500, color:'#23272f'}}>Ср.тек. 22</span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 400,
                      color: getGradeColor(roundGrade(subject.sredniyTek2)),
                      lineHeight: 1.1,
                    }}>{roundGrade(subject.sredniyTek2)}</span>
                  </div>
                )}
                
                {subject.rk1 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}>
                    <span style={{fontSize:13, fontWeight:500, color:'#23272f'}}>РК 1</span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 400,
                      color: getGradeColor(roundGrade(subject.rk1)),
                      lineHeight: 1.1,
                    }}>{roundGrade(subject.rk1)}</span>
                  </div>
                )}
                
                {subject.rk2 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}>
                    <span style={{fontSize:13, fontWeight:500, color:'#23272f'}}>РК 2</span>
              <span style={{
                      fontSize: 15,
                fontWeight: 400,
                      color: getGradeColor(roundGrade(subject.rk2)),
                      lineHeight: 1.1,
                    }}>{roundGrade(subject.rk2)}</span>
            </div>
                )}
                
                {subject.exam && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}>
                    <span style={{fontSize:13, fontWeight:500, color:'#23272f'}}>Экзамен</span>
            <span style={{
                      fontSize: 15,
              fontWeight: 400,
                      color: getGradeColor(roundGrade(subject.exam)),
              lineHeight: 1.1,
                    }}>{roundGrade(subject.exam)}</span>
                  </div>
                )}
              </div>
          </div>
          );
        })}
      </div>
    </div>
  );
} 