import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdRefresh } from 'react-icons/md';
import { getCurrentSemesterOrDefault } from '../utils/semesterUtils';

const ALL_SEMESTERS = [1,2,3,4,5,6,7,8];

export default function Filter() {
  const nav = useNavigate();
  
  // Получаем текущий семестр пользователя
  const currentSemester = getCurrentSemesterOrDefault();
  
  // Инициализация из localStorage с учетом текущего семестра
  const getInitialSelected = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('selectedSemesters'));
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch {}
    // Если нет сохраненных данных, по умолчанию выбираем текущий семестр
    return [currentSemester];
  };
  
  const getInitialScore = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('scoreRange'));
      if (saved && (saved.min !== undefined || saved.max !== undefined)) {
        return {
          min: saved.min === '' ? '' : saved.min,
          max: saved.max === '' ? '' : saved.max
        };
      }
    } catch {}
    return { min: '', max: '' };
  };
  
  const [selected, setSelected] = useState(getInitialSelected);
  const [score, setScore] = useState(getInitialScore);
  const [mounted, setMounted] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(true);
  
  useEffect(() => { 
    setMounted(true); 
    // Убираем принудительный сброс к текущему семестру
    // (теперь пользователь может снять все галочки)
    
    // Разрешаем кнопку сброса через 1 секунду после загрузки страницы
    const timer = setTimeout(() => setResetCooldown(false), 1000);
    return () => clearTimeout(timer);
  }, [currentSemester]);
  
  useEffect(() => {
    localStorage.setItem('selectedSemesters', JSON.stringify(selected));
  }, [selected]);
  
  useEffect(() => {
    localStorage.setItem('scoreRange', JSON.stringify(score));
  }, [score]);
  
  const toggleSemester = (n) => {
    setSelected(sel => sel.includes(n) ? sel.filter(x => x !== n) : [...sel, n]);
  };
  
  const resetFilter = () => {
    // При сбросе выбираем текущий семестр пользователя
    const targetSemester = currentSemester || 3; // Гарантируем, что всегда есть значение
    setSelected([targetSemester]);
    localStorage.setItem('selectedSemesters', JSON.stringify([targetSemester]));
    setScore({ min: '', max: '' });
    localStorage.setItem('scoreRange', JSON.stringify({ min: '', max: '' }));
  };
  
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
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
        
        {/* Кнопка сброса - перемещена правее для избежания конфликта */}
        {mounted && (
          <button
            onClick={resetCooldown ? undefined : resetFilter}
            style={{
              background: 'none',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#23272f',
              fontSize: 0,
              transition: 'color 0.18s, transform 0.13s, opacity 0.13s',
              borderRadius: '4px',
            }}
            onPointerDown={e => { 
              if (!resetCooldown) {
                e.currentTarget.style.transform = 'scale(0.88)'; 
                e.currentTarget.style.opacity = '0.7'; 
              }
            }}
            onPointerUp={e => { 
              if (!resetCooldown) {
                e.currentTarget.style.transform = 'scale(1)'; 
                e.currentTarget.style.opacity = '1'; 
              }
            }}
            onPointerLeave={e => { 
              if (!resetCooldown) {
                e.currentTarget.style.transform = 'scale(1)'; 
                e.currentTarget.style.opacity = '1'; 
                e.currentTarget.style.color = '#23272f'; 
              }
            }}
            aria-label="Сбросить фильтры"
          >
            <MdRefresh style={{fontSize:24, color:'#23272f'}} />
          </button>
        )}
      </div>
      
      <div style={{marginTop:18}} />
      
      <div style={{padding:'0 12px 32px 12px', textAlign:'center', color:'#888', fontSize:16}}>
        <div>
          <div style={{fontWeight:500,fontSize:17,textAlign:'left', marginBottom: 12, color:'#000'}}>Семестр</div>
          
          {/* Показатель текущего семестра под заголовком */}
          <div style={{
            fontSize: 13,
            color: '#666',
            marginBottom: 8,
            textAlign: 'left'
          }}>
            Текущий семестр: <b>{currentSemester}</b>
          </div>
          
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(4, 1fr)',
            gap:12,
            justifyContent:'center',
            alignItems:'center',
            marginTop:4
          }}>
            {ALL_SEMESTERS.map(n => (
              <button
                key={n}
                onClick={() => toggleSemester(n)}
                style={{
                  padding:'7px 0',
                  borderRadius:0,
                  border:'none',
                  background: selected.includes(n) ? '#1976d2' : '#e3eafc',
                  color: selected.includes(n) ? '#fff' : '#1976d2',
                  fontWeight:500,
                  fontSize:15,
                  cursor:'pointer',
                  transition:'background .18s, color .18s',
                  width:'100%'
                }}
              >{n}</button>
            ))}
          </div>
          
          <div style={{marginTop:20, marginBottom:8, textAlign:'left'}}>
            <div style={{fontWeight:500, fontSize:17, marginBottom:8, color:'#000'}}>Баллы</div>
            <div style={{display:'flex', gap:8}}>
              <input
                type="number"
                placeholder="Минимум"
                value={score.min}
                min={0}
                max={score.max || undefined}
                onChange={e => setScore(s => ({ ...s, min: e.target.value === '' ? '' : Number(e.target.value) }))}
                style={{flex:1, minWidth:0, padding:'6px 8px', borderRadius:0, border:'1px solid #c3c8d0', fontSize:15}}
              />
              <input
                type="number"
                placeholder="Максимум"
                value={score.max}
                min={score.min || 0}
                onChange={e => setScore(s => ({ ...s, max: e.target.value === '' ? '' : Number(e.target.value) }))}
                style={{flex:1, minWidth:0, padding:'6px 8px', borderRadius:0, border:'1px solid #c3c8d0', fontSize:15}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 