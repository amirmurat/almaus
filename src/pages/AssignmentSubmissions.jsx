import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllSubmissions, mergeAllSubmissions, deleteSubmissionAtIndex } from '../utils/videoDraftStore';

export default function AssignmentSubmissions() {
  const { id } = useParams();
  const nav = useNavigate();
  const [subs, setSubs] = useState([]); // массив {blob, date}
  const [loading, setLoading] = useState(true);
  const [mergedUrl, setMergedUrl] = useState(null);
  const [mergeError, setMergeError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(null);
  const [modalAnswer, setModalAnswer] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllSubmissions(id).then(arr => {
      if (Array.isArray(arr)) setSubs(arr);
      else if (arr) setSubs([arr]);
      else setSubs([]);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    // Автоматически сливать все отправки, если их больше одной
    if (subs.length > 1) {
      setMergeError(null);
      setMergedUrl(null);
      mergeAllSubmissions(id).then(merged => {
        if (!merged) {
          setMergeError('Нет отправленных работ для слияния.');
          return;
        }
        if (merged.error) {
          setMergeError(merged.error);
          return;
        }
        setMergedUrl(URL.createObjectURL(merged));
      });
    } else {
      setMergedUrl(null);
      setMergeError(null);
    }
  }, [id, subs.length]);

  // Приводим subs к единому виду: {blob, date}
  const normalizedSubs = subs
    .map(s => {
      if (s && s.blob instanceof Blob) return s;
      if (s instanceof Blob) return { blob: s, date: null };
      return null;
    })
    .filter(Boolean);

  const openDeleteModal = (idx) => {
    setModalIdx(idx);
    setModalOpen(true);
    setModalAnswer('');
    setModalError('');
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalIdx(null);
    setModalAnswer('');
    setModalError('');
  };
  const confirmDelete = async () => {
    if (modalAnswer !== '4') {
      setModalError('Неверный ответ!');
      return;
    }
    setLoading(true);
    await deleteSubmissionAtIndex(id, modalIdx);
    const arr = await getAllSubmissions(id);
    if (Array.isArray(arr)) setSubs(arr);
    else if (arr) setSubs([arr]);
    else setSubs([]);
    setLoading(false);
    closeModal();
  };

  return (
    <div style={{padding:16}}>
      <button onClick={()=>nav(-1)} style={{marginBottom:8}}>← Назад</button>
      <h2>Мои отправленные работы</h2>
      {loading ? (
        <div style={{color:'#888',margin:'24px 0'}}>Загрузка...</div>
      ) : normalizedSubs.length === 0 ? (
        <p style={{color:'#888'}}>Нет отправленных работ для этого задания.</p>
      ) : (
        <>
          {mergedUrl && (
            <div style={{marginBottom:16}}>
              <div style={{fontWeight:600,marginBottom:4}}>Все отправки слиты в одно видео:</div>
              <video src={mergedUrl} controls style={{width:320,maxHeight:180,background:'#000'}} />
            </div>
          )}
          {mergeError && <div style={{color:'#d32f2f',marginBottom:12}}>{mergeError}</div>}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {normalizedSubs.map((s,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12}}>
                <video src={URL.createObjectURL(s.blob)} controls style={{width:160,maxHeight:90,background:'#000'}} />
                <span style={{color:'#888',fontSize:13}}>{s.date ? new Date(s.date).toLocaleString() : ''}</span>
                <button onClick={()=>openDeleteModal(i)} style={{background:'#d32f2f',color:'#fff',border:'none',borderRadius:4,padding:'4px 10px',cursor:'pointer'}}>Удалить</button>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Модальное окно подтверждения удаления */}
      {modalOpen && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#0008',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:32,borderRadius:12,boxShadow:'0 4px 24px #0003',minWidth:320,maxWidth:'90vw',textAlign:'center',position:'relative'}}>
            <div style={{fontWeight:600,fontSize:18,marginBottom:12}}>Подтвердите удаление</div>
            <div style={{marginBottom:16}}>Вы уверены, что хотите удалить это видео?<br/>Сколько будет <b>2+2</b>?</div>
            <input type="text" value={modalAnswer} onChange={e=>{setModalAnswer(e.target.value);setModalError('')}} style={{fontSize:16,padding:'6px 12px',border:'1px solid #ccc',borderRadius:6,width:'60px',textAlign:'center',marginBottom:8}} autoFocus />
            <div style={{color:'#d32f2f',height:20,fontSize:14,marginBottom:8}}>{modalError}</div>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <button onClick={closeModal} style={{padding:'8px 20px',background:'#eee',color:'#333',border:'none',borderRadius:6,cursor:'pointer'}}>Отмена</button>
              <button onClick={confirmDelete} disabled={modalAnswer!=="4"} style={{padding:'8px 20px',background:modalAnswer==="4"?'#d32f2f':'#eee',color:modalAnswer==="4"?'#fff':'#888',border:'none',borderRadius:6,cursor:modalAnswer==="4"?'pointer':'not-allowed'}}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 