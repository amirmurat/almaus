import { useState } from 'react';
import { useTheme } from '../theme';

export default function Profile() {
  // Примерные данные для статистики (заглушка)
  const [gpa] = useState(3.72);
  const [gpaPrev] = useState(3.60);
  const [passed] = useState(8);
  const [total] = useState(10);
  const [best] = useState({ subject: 'Математика', grade: 'A' });
  const [worst] = useState({ subject: 'История', grade: 'C' });
  const gpaDelta = gpa - gpaPrev;
  const gpaDeltaStr = gpaDelta > 0 ? `+${gpaDelta.toFixed(2)}` : gpaDelta.toFixed(2);
  const gpaDeltaColor = gpaDelta > 0 ? '#388e3c' : gpaDelta < 0 ? '#d32f2f' : '#888';
  const { theme, toggle } = useTheme();

  /* блок смены PIN – оставляем без изменений */
  const [showForm, setShowForm] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin1, setNewPin1] = useState('');
  const [newPin2, setNewPin2] = useState('');
  const [msg, setMsg] = useState('');

  const save = (e) => {
    e.preventDefault();
    const saved = localStorage.getItem('pin') || '';
    if (oldPin !== saved) return setMsg('❌ Старый PIN неверен');
    if (newPin1.length !== 4 || /\D/.test(newPin1)) return setMsg('❌ Новый PIN = 4 цифры');
    if (newPin1 !== newPin2) return setMsg('❌ Новый PIN не совпадает');

    localStorage.setItem('pin', newPin1);
    sessionStorage.removeItem('pinOk');
    setMsg('✅ PIN обновлён');
    setShowForm(false);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      {/* GPA статистика */}
      <div style={{
        background: 'var(--card, #fff)',
        borderRadius: 16,
        boxShadow: '0 2px 8px 0 rgba(60,60,60,0.07)',
        padding: 20,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>GPA: {gpa.toFixed(2)}
          <span style={{
            fontSize: 16,
            fontWeight: 500,
            color: gpaDeltaColor,
            marginLeft: 10,
            verticalAlign: 'middle',
          }}>
            {gpaDelta > 0 ? '↑' : gpaDelta < 0 ? '↓' : ''} {gpaDeltaStr} за семестр
          </span>
        </div>
        {/* Мини-график (заглушка) */}
        <div style={{ width: 120, height: 32, background: '#e3e3e3', borderRadius: 8, margin: '4px 0' }}>
          {/* Здесь может быть мини-график GPA */}
        </div>
        <div style={{ fontSize: 15 }}>Сдано предметов: <b>{passed}/{total}</b></div>
        <div style={{ fontSize: 15 }}>Лучший предмет: <b>{best.subject} ({best.grade})</b></div>
        <div style={{ fontSize: 15 }}>Худший предмет: <b>{worst.subject} ({worst.grade})</b></div>
      </div>
      <h2>Профиль студента</h2>

      {/* переключатель темы */}
      <p>
        Тема:&nbsp;
        <button onClick={toggle} style={{ padding: '4px 12px', fontSize: 15, border: '1px solid #bbb', borderRadius: 6, background: 'none', cursor: 'pointer' }}>
          {theme === 'light' ? 'Светлая' : 'Тёмная'}
        </button>
      </p>

      {!showForm && (
        <>
          <button onClick={() => { setMsg(''); setShowForm(true); }}>
            Изменить PIN
          </button>
          {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
        </>
      )}

      {showForm && (
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 240 }}>
          <input type="password" placeholder="Старый PIN" value={oldPin} onChange={e=>setOldPin(e.target.value.replace(/\D/g,'' ).slice(0,4))}/>
          <input type="password" placeholder="Новый PIN" value={newPin1} onChange={e=>setNewPin1(e.target.value.replace(/\D/g,'' ).slice(0,4))}/>
          <input type="password" placeholder="Повторите новый PIN" value={newPin2} onChange={e=>setNewPin2(e.target.value.replace(/\D/g,'' ).slice(0,4))}/>
          {msg && <span style={{ color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</span>}
          <button>Сохранить</button>
          <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
        </form>
      )}
    </div>
  );
}
