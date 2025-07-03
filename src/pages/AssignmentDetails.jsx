import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJson } from '../utils/api';
import { MdAssignment, MdOutlineScreenShare, MdVideocam, MdFiberManualRecord } from 'react-icons/md';

// --- Хелпер для форматирования даты и времени ---
const formatDateTime = (isoStr) => {
  const d = new Date(isoStr);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const getTimeRemaining = (deadlineStr) => {
  const deadlineDate = new Date(deadlineStr);
  const diff = deadlineDate.getTime() - new Date().getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} д.`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} ч.`;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `${minutes} мин.`;
  return null;
};

export default function AssignmentDetails() {
  const { id }   = useParams();           // /assignments/1  →  id='1'
  const nav      = useNavigate();
  const [task,setTask] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);

  /* грузим JSON один раз, находим нужный объект */
  useEffect(()=>{
    fetchJson('assignments.json')
      .then(list => list.find(t => String(t.id) === id))
      .then(setTask);
  },[id]);

  if(!task) return <p style={{textAlign:'center',marginTop:'20vh'}}>Загрузка…</p>;

  // --- дедлайн и блокировка ---
  const remaining = getTimeRemaining(task.deadline);
  const deadlinePassed = !remaining;

  const goToRecord = (type) => {
    nav(`/assignments/${id}/record?type=${type}`);
  };

  return (
    <div style={{padding:16}}>
      <button onClick={()=>nav(-1)} style={{marginBottom:8}}>← Назад</button>
      <h2>{task.subject}: {task.title}</h2>
      <p><strong>Дедлайн:</strong> {formatDateTime(task.deadline)} {remaining && <span style={{color:'#d32f2f'}}>({remaining} осталось)</span>}</p>
      <p style={{margin:'12px 0'}}>{task.description}</p>

      {/* Здесь можно добавить отображение файлов учителя, если появятся */}

      <div style={{display:'flex',gap:12,margin:'24px 0'}}>
        {/* Старые кнопки записи убраны */}
      </div>
      {/* FAB меню записи и отправки */}
      {!deadlinePassed ? (
        <div style={{position:'fixed',right:24,bottom:72,zIndex:1000,display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
          {/* Кнопки меню, появляются с анимацией */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',pointerEvents:fabOpen?'auto':'none'}}>
            <button
              onClick={()=>{setFabOpen(false);goToRecord('screen')}}
              aria-label="Запись экрана"
              title="Запись экрана"
              style={{
                marginBottom:fabOpen?12:0,
                opacity:fabOpen?1:0,
                transform:fabOpen?'translateY(0)':'translateY(20px)',
                transition:'all .25s cubic-bezier(.4,0,.2,1)',
                background:'#fff',color:'#673ab7',border:'none',borderRadius:0,width:48,height:48,boxShadow:'0 2px 8px #0002',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,cursor:'pointer',pointerEvents:fabOpen?'auto':'none'
              }}
            >
              <MdOutlineScreenShare />
            </button>
            <button
              onClick={()=>{setFabOpen(false);goToRecord('camera')}}
              aria-label="Запись с камеры"
              title="Запись с камеры"
              style={{
                marginBottom:fabOpen?12:0,
                opacity:fabOpen?1:0,
                transform:fabOpen?'translateY(0)':'translateY(20px)',
                transition:'all .3s cubic-bezier(.4,0,.2,1) .05s',
                background:'#fff',color:'#673ab7',border:'none',borderRadius:0,width:48,height:48,boxShadow:'0 2px 8px #0002',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,cursor:'pointer',pointerEvents:fabOpen?'auto':'none'
              }}
            >
              <MdVideocam />
            </button>
          </div>
          {/* Основная FAB */}
          <button
            onClick={()=>setFabOpen(v=>!v)}
            aria-label="Запись выполнения"
            title="Запись выполнения"
            style={{
              background:'#d32f2f',color:'#fff',border:'none',borderRadius:0,width:48,height:48,boxShadow:'0 2px 8px #0003',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,cursor:'pointer',transition:'transform .2s, opacity .2s',animation:'fabIn .4s cubic-bezier(.4,0,.2,1)',outline:fabOpen?'2px solid #fff':'none',outlineOffset:2
            }}
          >
            <MdFiberManualRecord />
          </button>
          {/* FAB 'Мои отправки' всегда показывать, если есть отправка или черновик */}
          <button
            onClick={()=>nav(`/assignments/${id}/submissions`)}
            aria-label="Мои отправки"
            title="Мои отправки"
            style={{
              marginTop:16,
              background:'#673ab7',
              color:'#fff',
              border:'none',
              borderRadius:0,
              width:48,
              height:48,
              boxShadow:'0 2px 8px #0003',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:22,
              cursor:'pointer',
              transition:'transform .2s, opacity .2s',
              animation:'fabIn .4s cubic-bezier(.4,0,.2,1)'
            }}
          >
            <MdAssignment />
          </button>
          <style>{`
            @keyframes fabIn {
              from { transform: scale(0.7); opacity: 0; }
              to   { transform: scale(1); opacity: 1; }
            }
            @media (max-width: 600px) {
              div[style*='position:fixed'] button {
                right: 12px;
                bottom: 64px;
                width: 44px;
                height: 44px;
                font-size: 18px;
              }
            }
          `}</style>
        </div>
      ) : (
        <div style={{margin:'32px 0',textAlign:'center',color:'#d32f2f',fontWeight:500,fontSize:16}}>
          Дедлайн прошёл. Можно только просматривать вложения.
          <div style={{marginTop:16,display:'flex',justifyContent:'center'}}>
            <button
              onClick={()=>nav(`/assignments/${id}/submissions`)}
              aria-label="Мои отправки"
              title="Мои отправки"
              style={{
                background:'#673ab7',
                color:'#fff',
                border:'none',
                borderRadius:0,
                width:48,
                height:48,
                boxShadow:'0 2px 8px #0003',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:22,
                cursor:'pointer',
                transition:'transform .2s, opacity .2s',
                animation:'fabIn .4s cubic-bezier(.4,0,.2,1)'
              }}
            >
              <MdAssignment />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
