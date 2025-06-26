export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div style={{
      position:'fixed',top:0,left:0,right:0,bottom:0,
      background:'rgba(0,0,0,0.5)',display:'flex',
      justifyContent:'center',alignItems:'center',zIndex:1000
    }}
      onClick={onClose}              /* клик по фону закрывает */
    >
      <div
        style={{
          background:'#fff',padding:20,borderRadius:8,
          maxWidth:300,width:'90%',boxShadow:'0 4px 12px rgba(0,0,0,0.2)'
        }}
        onClick={e=>e.stopPropagation()}   /* клик внутри НЕ закрывает */
      >
        {children}
        <button onClick={onClose} style={{marginTop:12,width:'100%'}}>ОК</button>
      </div>
    </div>
  );
}
