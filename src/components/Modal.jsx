export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.45)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      animation: 'modal-fade-bg 0.25s',
    }}
      onClick={onClose}              /* клик по фону закрывает */
    >
      <div
        className="modern-modal"
        style={{
          background: 'var(--card, #fff)', color: 'var(--text, #222)',
          border: 'none',
          borderRadius: 0,
          maxWidth: 420, width: '92%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          padding: 28,
          fontSize: 16,
          transform: 'scale(0.96)',
          opacity: 0,
          animation: 'modal-in 0.32s cubic-bezier(.33,1,.68,1) forwards',
        }}
        onClick={e => e.stopPropagation()}   /* клик внутри НЕ закрывает */
      >
        {children}
        <button onClick={onClose} style={{
          marginTop: 24, width: '100%', padding: '12px 0',
          background: 'var(--primary, #1976d2)', color: '#fff', border: 'none', borderRadius: 0,
          fontWeight: 500, fontSize: 16, cursor: 'pointer', letterSpacing: 0.5, boxShadow: '0 2px 8px #1976d222'
        }}>ОК</button>
      </div>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes modal-fade-bg {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
