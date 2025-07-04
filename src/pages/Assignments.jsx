import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import AssignmentCard from '../components/AssignmentCard';

export default function Assignments() {
  const [tasks, setTasks] = useState(null);     // список из JSON
  const [collapsedSubjects, setCollapsedSubjects] = useState([]); // список свернутых предметов
  const [collapsedArchives, setCollapsedArchives] = useState([]); // <-- для архивов
  // Удалить строку вида: const nav = ...

  // загрузка assignments.json один раз
  useEffect(() => {
    fetchJson('assignments.json').then(setTasks);
  }, []);

  // Сворачиваем архивы по умолчанию
  useEffect(() => {
    if (tasks) {
      const now = new Date();
      const subjectsWithArchives = tasks
        .filter(t => new Date(t.deadline) < now)
        .map(t => t.subject);
      setCollapsedArchives(Array.from(new Set(subjectsWithArchives)));
      // --- автосворачивание предметов без активных задач ---
      const subjectMap = {};
      tasks.forEach(t => {
        if (!subjectMap[t.subject]) subjectMap[t.subject] = { active: [], archived: [] };
        const deadlineDate = new Date(t.deadline);
        if (deadlineDate < now) subjectMap[t.subject].archived.push(t);
        else subjectMap[t.subject].active.push(t);
      });
      const subjectsNoActive = Object.keys(subjectMap).filter(s => subjectMap[s].active.length === 0);
      setCollapsedSubjects(prev => Array.from(new Set([...prev, ...subjectsNoActive])));
    }
  }, [tasks]);

  if (!tasks) {
    return <p style={{ textAlign: 'center', marginTop: '20vh' }}>Загрузка…</p>;
  }

  // Группируем задачи по предметам на активные и архивные
  const now = new Date();

  const subjectMap = {};
  tasks.forEach(t => {
    if (!subjectMap[t.subject]) {
      subjectMap[t.subject] = { active: [], archived: [] };
    }
    const deadlineDate = new Date(t.deadline);
    if (deadlineDate < now) {
      subjectMap[t.subject].archived.push(t);
    } else {
      subjectMap[t.subject].active.push(t);
    }
  });
  // Сортируем задачи внутри предмета по дедлайну (по возрастанию)
  Object.values(subjectMap).forEach(group => {
    group.active.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    group.archived.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  });
  // Сортируем предметы: те, у кого есть активные задачи, идут выше, сортируются по ближайшему дедлайну; архивные — внизу
  const subjects = Object.keys(subjectMap).sort((s1, s2) => {
    const g1 = subjectMap[s1];
    const g2 = subjectMap[s2];
    const next1 = g1.active[0] ? new Date(g1.active[0].deadline) : new Date(8640000000000000);
    const next2 = g2.active[0] ? new Date(g2.active[0].deadline) : new Date(8640000000000000);
    return next1 - next2;
  });

  return (
    <div style={{
      padding: '16px',
      maxWidth: 800,
      margin: '0 auto',
      boxSizing: 'border-box',
    }}>
      {subjects.map(subject => {
        // padding для секции, как у schedule
        const sectionStyle = {
          marginBottom: 18,
          padding: '0 8px',
          opacity: (!subjectMap[subject].active.length > 0 && subjectMap[subject].archived.length > 0) ? 0.6 : 1,
          transition: 'opacity 0.25s'
        };
        const isCollapsed = collapsedSubjects.includes(subject);
        const subjectData = subjectMap[subject];
        const hasActive = subjectData.active.length > 0;
        const hasArchive = subjectData.archived.length > 0;
        const isArchiveCollapsed = collapsedArchives.includes(subject);

        if (!hasActive && !hasArchive) return null;

        return (
          <section key={subject} style={sectionStyle}>
            <h3
              style={{
                margin: '18px 0 10px 0',
                fontWeight: 500,
                fontSize: '18px',
                color: '#23272f',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // стрелка справа
              }}
              onClick={() => setCollapsedSubjects(prev =>
                prev.includes(subject)
                  ? prev.filter(s => s !== subject)
                  : [...prev, subject]
              )}
            >
              {subject}
              <span style={{
                display: 'inline-block',
                transition: 'transform 0.2s',
                transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                width: 18, height: 18
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </span>
            </h3>
            
            {/* --- Активные задачи --- */}
            <div style={{
              maxHeight: isCollapsed ? 0 : 999,
              opacity: isCollapsed ? 0 : 1,
              overflow: 'hidden',
              transition: 'max-height 0.32s cubic-bezier(.33,1,.68,1), opacity 0.22s',
            }}>
              {!isCollapsed && subjectData.active.map(t => (
                <AssignmentCard
                  key={t.id}
                  task={t}
                  hideSubject={true}
                />
              ))}

              {/* --- Архив --- */}
              {hasArchive && (
                <div style={{ marginTop: 12, paddingLeft: 12, borderLeft: '2px solid #eee' }}>
                  <h4
                    style={{ cursor: 'pointer', userSelect: 'none', color: '#888', margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    onClick={() => setCollapsedArchives(prev =>
                      prev.includes(subject)
                        ? prev.filter(s => s !== subject)
                        : [...prev, subject]
                    )}
                  >
                    Архив
                    <span style={{
                      display: 'inline-block',
                      transition: 'transform 0.2s',
                      transform: isArchiveCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      width: 18, height: 18
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </h4>
                  <div style={{
                    maxHeight: isArchiveCollapsed ? 0 : 999,
                    opacity: isArchiveCollapsed ? 0 : 1,
                    overflow: 'hidden',
                    transition: 'max-height 0.32s cubic-bezier(.33,1,.68,1), opacity 0.22s',
                  }}>
                    {!isArchiveCollapsed && subjectData.archived.map(t => (
                      <AssignmentCard
                        key={t.id}
                        task={t}
                        hideSubject={true}
                        isPastDeadline={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
