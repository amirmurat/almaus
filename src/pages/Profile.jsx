import { useState } from 'react';

export default function Profile() {
  const [showForm, setShowForm] = useState(false);

  const [oldPin, setOldPin]   = useState('');
  const [newPin1, setNewPin1] = useState('');
  const [newPin2, setNewPin2] = useState('');
  const [msg,    setMsg]      = useState('');

  /* валидация + сохранение ---------------------------------- */
  const save = (e) => {
    e.preventDefault();
    const saved = localStorage.getItem('pin') || '';

    if (oldPin !== saved) {
      return setMsg('❌ Старый PIN неверен');
    }
    if (newPin1.length !== 4 || /\D/.test(newPin1)) {
      return setMsg('❌ Новый PIN должен содержать 4 цифры');
    }
    if (newPin1 !== newPin2) {
      return setMsg('❌ Новый PIN не совпадает');
    }

    localStorage.setItem('pin', newPin1);
    sessionStorage.removeItem('pinOk');   // заставит ввести заново
    setMsg('✅ PIN обновлён — введите его при следующем входе');
    setShowForm(false);
  };

  /* шаблон --------------------------------------------------- */
  return (
    <div style={{ padding: 16 }}>
      <h2>Профиль студента</h2>

      {!showForm && (
        <>
          <p>Здесь позже появятся персональные данные.</p>
          <button onClick={() => { setMsg(''); setShowForm(true); }}>
            Изменить PIN
          </button>
          {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
        </>
      )}

      {showForm && (
        <form
          onSubmit={save}
          style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 240 }}
        >
          <input
            type="password"
            placeholder="Старый PIN"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          />
          <input
            type="password"
            placeholder="Новый PIN"
            value={newPin1}
            onChange={(e) => setNewPin1(e.target.value.replace(/\D/g, '').slice(0, 4))}
          />
          <input
            type="password"
            placeholder="Повторите новый PIN"
            value={newPin2}
            onChange={(e) => setNewPin2(e.target.value.replace(/\D/g, '').slice(0, 4))}
          />

          {msg && <span style={{ color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</span>}

          <button>Сохранить</button>
          <button type="button" onClick={() => setShowForm(false)}>Отмена</button>
        </form>
      )}
    </div>
  );
}
