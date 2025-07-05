import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMoon, FaSun, FaKey, FaSyncAlt, FaFilter } from 'react-icons/fa';
import { getProfile } from '../utils/profileAPI';

export default function Profile() {
  const nav = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ID студента для тестирования (в реальном приложении это будет из авторизации)
  const studentId = 'cmcpr60vq0008cxv87eo5ww0o'; // Реальный ID из базы данных

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProfile(studentId);
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  if (loading) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
        {/* Верхний навбар */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, justifyContent: 'flex-start', minHeight: 40
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          color: '#666',
          fontSize: 16
        }}>
          Загрузка профиля...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
        {/* Верхний навбар */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, justifyContent: 'flex-start', minHeight: 40
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>
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

  if (!profileData) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
        {/* Верхний навбар */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, justifyContent: 'flex-start', minHeight: 40
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          color: '#666',
          fontSize: 16
        }}>
          Данные профиля не найдены
        </div>
      </div>
    );
  }

  const { student, gpa, statistics, academicInfo } = profileData;
  const initials = student.name.split(' ').map(w => w[0]).join('').toUpperCase();

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      {/* Верхний навбар */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, justifyContent: 'flex-start', minHeight: 40
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>
      
      {/* Аватар с инициалами */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', minHeight: 59, gap: 12 }}>
        <div style={{
          width: 59,
          height: 59,
          background: '#e3e3e3',
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color: '#b0b0b0',
          boxShadow: '0 2px 8px 0 rgba(60,60,60,0.07)'
        }}>
          <FaUser />
        </div>
        <div style={{}}>
          <div style={{ fontSize: 16, color: '#23272f', lineHeight: 1.2 }}>
            {student.name}
          </div>
          <div style={{ fontSize: 14, color: '#666', lineHeight: 1.2, marginTop: 4 }}>
            {(() => {
              const sem = academicInfo?.currentSemester || 1;
              let course;
              if (sem >= 7) course = 3;
              else if (sem >= 4) course = 2;
              else course = 1;
              return `${course} курс • ${sem} семестр`;
            })()}
          </div>
          <div style={{ fontSize: 14, color: '#666', lineHeight: 1.2, marginTop: 2 }}>
            {student.groupName} • {student.faculty}
          </div>
        </div>
      </div>
      
      {/* GPA и статистика */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 16, color: '#23272f', marginBottom: 12 }}>
          GPA: {gpa.overall}
        </div>
        
        {/* GPA по семестрам */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            По семестрам:
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {/* Левая колонка */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, alignItems: 'center' }}>
              {Object.entries(gpa.bySemester).slice(0, 4).map(([semester, gpaValue]) => (
                <div key={semester} style={{ fontSize: 14, color: '#23272f' }}>
                  {semester} семестр: {gpaValue}
                </div>
              ))}
            </div>
            {/* Правая колонка */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, alignItems: 'center' }}>
              {Object.entries(gpa.bySemester).slice(4, 8).map(([semester, gpaValue]) => (
                <div key={semester} style={{ fontSize: 14, color: '#23272f' }}>
                  {semester} семестр: {gpaValue}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
