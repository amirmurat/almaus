export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.45)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}
      onClick={onClose}              /* клик по фону закрывает */
    >
      <div
        style={{
          background: 'var(--card, #fff)', color: 'var(--text, #222)',
          border: '1px solid var(--border, #ccc)',
          borderRadius: 0,
          maxWidth: 340, width: '92%',
          boxShadow: '0 2px 16px rgba(0,0,0,0.13)',
          padding: 16,
          fontSize: 15,
        }}
        onClick={e => e.stopPropagation()}   /* клик внутри НЕ закрывает */
      >
        {children}
        <button onClick={onClose} style={{
          marginTop: 16, width: '100%', padding: '10px 0',
          background: 'var(--primary, #673ab7)', color: '#fff', border: 'none', borderRadius: 0,
          fontWeight: 500, fontSize: 15, cursor: 'pointer', letterSpacing: 0.5
        }}>ОК</button>
      </div>
    </div>
  );
}
