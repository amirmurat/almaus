import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJson } from '../utils/api';
import { MdAssignment, MdOutlineScreenShare, MdVideocam, MdAttachFile, MdUpload } from 'react-icons/md';

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

function FileAttachButton() {
  const inputRef = useRef();
  const [files, setFiles] = useState([]); // [{file, progress, done}]

  // Имитация загрузки для каждого файла
  useEffect(() => {
    if (files.length === 0) return;
    let active = true;
    const timers = files.map((f, idx) => {
      if (f.done) return null;
      return setInterval(() => {
        if (!active) return;
        setFiles(prev => {
          const arr = prev.slice();
          if (arr[idx].done) return arr;
          let next = Math.min(100, (arr[idx].progress || 0) + 4 + Math.random() * 6);
          arr[idx] = {...arr[idx], progress: next};
          if (next >= 100) arr[idx] = {...arr[idx], progress: 100, done: true};
          return arr;
        });
      }, 40);
    });
    return () => {
      active = false;
      timers.forEach(t => t && clearInterval(t));
    };
  }, [files]);

  function handleFiles(e) {
    const newFiles = Array.from(e.target.files).map(f => ({file: f, progress: 0, done: false}));
    setFiles(prev => [...prev, ...newFiles]);
  }

  function removeFile(idx) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  return (
    <div style={{margin:'0 0 24px 0'}}>
      <button
        type="button"
        onClick={()=>inputRef.current.click()}
        style={{
          display:'flex',alignItems:'center',gap:8,
          background:'none',border:'none',borderRadius:6,
          color:'#23272f',padding:'7px 14px',fontSize:15,fontWeight:400,
          cursor:'pointer',transition:'color .18s',
          outline:'none',boxShadow:'none',
        }}
        onMouseOver={e=>e.currentTarget.style.color='var(--primary,#1976d2)'}
        onMouseOut={e=>e.currentTarget.style.color='#23272f'}
      >
        <MdUpload style={{fontSize:20,marginRight:2}}/>
        <span>Вложить файл</span>
      </button>
      <input
        type="file"
        ref={inputRef}
        style={{display:'none'}}
        multiple
        onChange={handleFiles}
      />
      {files.length > 0 && (
        <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:8}}>
          {files.map((f, idx) => (
            <div key={idx} style={{
              display:'flex',flexDirection:'column',alignItems:'stretch',gap:0,
              background:'none',
              borderRadius:10,
              padding:'8px 14px',
              fontSize:15,
              color:'#23272f',
              position:'relative',
              minHeight:36,
              wordBreak:'break-all',
              transition:'box-shadow .18s',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <MdAttachFile style={{fontSize:20,opacity:0.7}}/>
                <span style={{flex:1}}>{f.file.name}</span>
                {f.done && (
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{display:'inline',verticalAlign:'middle',marginRight:2}}>
                    <polyline points="3,9 7,13 13,5" fill="none" stroke="#43a047" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <button
                  type="button"
                  aria-label="Удалить файл"
                  onClick={() => removeFile(idx)}
                  style={{
                    background:'none',border:'none',padding:0,margin:0,
                    color:'#888',fontSize:18,cursor:'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    borderRadius:4,transition:'color .18s',
                  }}
                  onMouseOver={e=>e.currentTarget.style.color='#d32f2f'}
                  onMouseOut={e=>e.currentTarget.style.color='#888'}
                >
                  ×
                </button>
              </div>
              {/* Индивидуальный прогрессбар */}
              {!f.done && (
                <div style={{height:3,marginTop:6,background:'#e3eafc',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:(f.progress||0)+'%',background:'#1976d2',transition:'width .25s cubic-bezier(.4,0,.2,1)'}} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssignmentDetails() {
  const { id }   = useParams();           // /assignments/1  →  id='1'
  const nav      = useNavigate();
  const [task,setTask] = useState(null);
  const [showScreenModal, setShowScreenModal] = useState(false);
  // --- Новое для записи экрана ---
  const [screenRecording, setScreenRecording] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [screenVideoUrl, setScreenVideoUrl] = useState(null);
  const videoRef = useRef();
  const mediaRecorderRef = useRef();
  const recordedChunksRef = useRef([]);

  // Остановка записи экрана
  const stopScreenRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    setScreenRecording(false);
  };

  // Запуск записи экрана
  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenStream(stream);
      setShowScreenModal(false);
      setScreenRecording(true);
      recordedChunksRef.current = [];
      const mediaRecorder = new window.MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setScreenVideoUrl(URL.createObjectURL(blob));
        setScreenRecording(false);
        setScreenStream(null);
      };
      mediaRecorder.start();
    } catch (err) {
      setShowScreenModal(false);
      setScreenRecording(false);
      setScreenStream(null);
    }
  };

  useEffect(() => {
    // Показывать live stream в video
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // --- Новое для записи с камеры ---
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraRecording, setCameraRecording] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraVideoUrl, setCameraVideoUrl] = useState(null);
  const cameraVideoRef = useRef();
  const cameraMediaRecorderRef = useRef();
  const cameraRecordedChunksRef = useRef([]);

  const stopCameraRecording = () => {
    if (cameraMediaRecorderRef.current) {
      cameraMediaRecorderRef.current.stop();
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraRecording(false);
  };

  const startCameraRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
      setShowCameraModal(false);
      setCameraRecording(true);
      cameraRecordedChunksRef.current = [];
      const mediaRecorder = new window.MediaRecorder(stream, { mimeType: 'video/webm' });
      cameraMediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) cameraRecordedChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(cameraRecordedChunksRef.current, { type: 'video/webm' });
        setCameraVideoUrl(URL.createObjectURL(blob));
        setCameraRecording(false);
        setCameraStream(null);
      };
      mediaRecorder.start();
    } catch (err) {
      setShowCameraModal(false);
      setCameraRecording(false);
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

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

  // const goToRecord = (type) => {
  //   nav(`/assignments/${id}/record?type=${type}`);
  // };

  return (
    <div style={{
      padding: '16px',
      margin: '8px',
      maxWidth: 680,
      boxSizing: 'border-box',
    }}>
      {/* --- Блок прямой трансляции записи экрана --- */}
      {screenRecording && screenStream && (
        <div style={{margin:'-8px -16px 24px -16px',padding:'0',background:'#fff',borderRadius:0,boxShadow:'0 2px 12px #0001',border:'1px solid #eee',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <video ref={videoRef} autoPlay muted style={{width:'100%',maxHeight:320,background:'#000',borderRadius:0}} />
        </div>
      )}
      {/* --- Блок прямой трансляции записи с камеры --- */}
      {cameraRecording && cameraStream && (
        <div style={{margin:'-8px -16px 24px -16px',padding:'0',background:'#fff',borderRadius:0,boxShadow:'0 2px 12px #0001',border:'1px solid #eee',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <video ref={cameraVideoRef} autoPlay muted style={{width:'100%',maxHeight:320,background:'#000',borderRadius:0}} />
        </div>
      )}
      {/* --- Блок предпросмотра после остановки --- */}
      {screenVideoUrl && !screenRecording && (
        <div style={{margin:'-8px -16px 24px -16px',padding:'0',background:'#fff',borderRadius:0,boxShadow:'0 2px 12px #0001',border:'1px solid #eee',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <video src={screenVideoUrl} controls style={{width:'100%',maxHeight:320,background:'#000',borderRadius:0}} />
        </div>
      )}
      {/* --- Блок предпросмотра после остановки записи с камеры --- */}
      {cameraVideoUrl && !cameraRecording && (
        <div style={{margin:'-8px -16px 24px -16px',padding:'0',background:'#fff',borderRadius:0,boxShadow:'0 2px 12px #0001',border:'1px solid #eee',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <video src={cameraVideoUrl} controls style={{width:'100%',maxHeight:320,background:'#000',borderRadius:0}} />
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18,justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button
            onClick={()=>nav(-1)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#23272f',
              fontSize: 0,
              transition: 'color 0.18s',
            }}
            onMouseDown={e => e.currentTarget.style.color = 'var(--primary,#1976d2)'}
            onMouseUp={e => e.currentTarget.style.color = '#23272f'}
            onMouseLeave={e => e.currentTarget.style.color = '#23272f'}
            aria-label="Назад"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          {!deadlinePassed && (
            <div style={{display:'flex',gap:10}}>
              {/* --- Кнопка-индикатор записи экрана --- */}
              {screenRecording ? (
                <button
                  onClick={stopScreenRecording}
                  aria-label="Остановить запись экрана"
                  title="Остановить запись экрана"
                  style={{
                    background:'#d32f2f',color:'#fff',border:'none',borderRadius:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',transition:'background .18s,color .18s',outline:'none',boxShadow:'0 0 0 2px #d32f2f44',
                  }}
                >
                  <MdOutlineScreenShare />
                </button>
              ) : cameraRecording ? (
                <button
                  aria-label="Запись экрана (недоступно во время записи с камеры)"
                  title="Запись экрана (недоступно во время записи с камеры)"
                  style={{
                    background:'#eee',color:'#bbb',border:'none',borderRadius:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'not-allowed',pointerEvents:'none',transition:'background .18s,color .18s',outline:'none'
                  }}
                  disabled
                >
                  <MdOutlineScreenShare />
                </button>
              ) : (
                <button
                  onClick={()=>setShowScreenModal(true)}
                  aria-label="Запись экрана"
                  title="Запись экрана"
                  style={{
                    background:'#fff',color:'#23272f',border:'none',borderRadius:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',transition:'background .18s,color .18s',outline:'none'
                  }}
                  onMouseDown={e=>e.currentTarget.style.color='var(--primary,#1976d2)'}
                  onMouseUp={e=>e.currentTarget.style.color='#23272f'}
                  onMouseLeave={e=>e.currentTarget.style.color='#23272f'}
                >
                  <MdOutlineScreenShare />
                </button>
              )}
              {cameraRecording ? (
                <button
                  onClick={stopCameraRecording}
                  aria-label="Остановить запись с камеры"
                  title="Остановить запись с камеры"
                  style={{
                    background:'#d32f2f',color:'#fff',border:'none',borderRadius:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',transition:'background .18s,color .18s',outline:'none',boxShadow:'0 0 0 2px #d32f2f44',
                  }}
                >
                  <MdVideocam />
                </button>
              ) : screenRecording ? (
                <button
                  aria-label="Запись с камеры (недоступно во время записи экрана)"
                  title="Запись с камеры (недоступно во время записи экрана)"
                  style={{
                    background:'#eee',color:'#bbb',border:'none',borderRadius:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'not-allowed',pointerEvents:'none',transition:'background .18s,color .18s',outline:'none'
                  }}
                  disabled
                >
                  <MdVideocam />
                </button>
              ) : (
                <button
                  onClick={()=>setShowCameraModal(true)}
                  aria-label="Запись с камеры"
                  title="Запись с камеры"
                  style={{
                    background:'#fff',color:'#23272f',border:'none',borderRadius:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',transition:'background .18s,color .18s',outline:'none'
                  }}
                  onMouseDown={e=>e.currentTarget.style.color='var(--primary,#1976d2)'}
                  onMouseUp={e=>e.currentTarget.style.color='#23272f'}
                  onMouseLeave={e=>e.currentTarget.style.color='#23272f'}
                >
                  <MdVideocam />
                </button>
              )}
              <button
                onClick={()=>nav(`/assignments/${id}/submissions`)}
                aria-label="Мои отправки"
                title="Мои отправки"
                style={{
                  background:'#fff',color:'#23272f',border:'none',borderRadius:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',transition:'background .18s,color .18s',outline:'none'
                }}
                onMouseDown={e=>e.currentTarget.style.color='var(--primary,#1976d2)'}
                onMouseUp={e=>e.currentTarget.style.color='#23272f'}
                onMouseLeave={e=>e.currentTarget.style.color='#23272f'}
              >
                <MdAssignment />
              </button>
            </div>
          )}
        </div>
        {/* Кнопка отправить запись справа */}
        {(screenVideoUrl && !screenRecording) || (cameraVideoUrl && !cameraRecording) ? (
          <button style={{background:'#1976d2',color:'#fff',border:'none',borderRadius:0,padding:'0 18px',height:40,fontSize:15,cursor:'pointer',fontWeight:500,letterSpacing:0.2}} onClick={()=>alert('Видео отправлено!')}>Отправить запись</button>
        ) : null}
      </div>
      <h2 style={{margin:'0 0 18px 0',fontWeight:400,fontSize:20,lineHeight:1.22}}>{task.title}</h2>
      <p style={{margin:'0 0 18px 0',fontSize:15,lineHeight:1.5}}><span style={{fontWeight:400}}>Дедлайн:</span> {formatDateTime(task.deadline)} {remaining && <span style={{color:'#d32f2f'}}>({remaining} осталось)</span>}</p>
      <p style={{margin:'0 0 28px 0',fontSize:15,fontWeight:400,lineHeight:1.6}}>{task.description}</p>

      {/* Блок прикреплённых учителем файлов */}
      {Array.isArray(task.attachments) && task.attachments.length > 0 && (
        <div style={{margin:'0 0 24px 0',display:'flex',flexDirection:'column',gap:8}}>
          {task.attachments.map((file, i) => (
            <a
              key={i}
              href={file.url}
              download
              style={{
                display:'inline-flex',alignItems:'center',gap:8,
                background:'none',border:'none',borderRadius:6,
                color:'#1976d2',padding:'7px 14px',fontSize:15,fontWeight:400,
                textDecoration:'none',transition:'color .18s',
                outline:'none',boxShadow:'none',cursor:'pointer',
              }}
              onMouseOver={e=>{e.currentTarget.style.color='#0d47a1';}}
              onMouseOut={e=>{e.currentTarget.style.color='#1976d2';}}
            >
              <MdAttachFile style={{fontSize:20,marginRight:2}}/>
              <span style={{wordBreak:'break-all'}}>{file.name}</span>
            </a>
          ))}
        </div>
      )}

      {/* Кнопка для вложения файлов */}
      <FileAttachButton />

      <div style={{display:'flex',gap:12,margin:'24px 0'}}>
        {/* Старые кнопки записи убраны */}
      </div>
      {/* Модалка для записи экрана */}
      {showScreenModal && (
        <div
          style={{position:'fixed',zIndex:2000,top:0,left:0,right:0,bottom:0,background:'rgba(30,32,38,0.32)',display:'flex',alignItems:'center',justifyContent:'center'}}
          onClick={e => { if (e.target === e.currentTarget) setShowScreenModal(false); }}
        >
          <div style={{background:'#fff',color:'#23272f',padding:'32px 24px',borderRadius:0,minWidth:280,maxWidth:360,boxShadow:'0 8px 32px #0002',textAlign:'center',position:'relative'}}>
            <div style={{fontSize:22,marginBottom:12}}><MdOutlineScreenShare style={{verticalAlign:'middle',fontSize:28,marginRight:6}}/>Запись экрана</div>
            <div style={{fontSize:16,opacity:0.85,marginBottom:24}}>Нажмите, чтобы начать запись экрана.<br/>Всё, что вы будете делать на экране, будет записано.</div>
            <button onClick={startScreenRecording} style={{marginTop:8,padding:'12px 0',width:'100%',fontSize:17,border:'none',borderRadius:0,background:'#1976d2',color:'#fff',cursor:'pointer',fontWeight:500,letterSpacing:0.2}}>Начать запись</button>
          </div>
        </div>
      )}
      {/* Модалка для записи с камеры */}
      {showCameraModal && (
        <div
          style={{position:'fixed',zIndex:2000,top:0,left:0,right:0,bottom:0,background:'rgba(30,32,38,0.32)',display:'flex',alignItems:'center',justifyContent:'center'}}
          onClick={e => { if (e.target === e.currentTarget) setShowCameraModal(false); }}
        >
          <div style={{background:'#fff',color:'#23272f',padding:'32px 24px',borderRadius:0,minWidth:280,maxWidth:360,boxShadow:'0 8px 32px #0002',textAlign:'center',position:'relative'}}>
            <div style={{fontSize:22,marginBottom:12}}><MdVideocam style={{verticalAlign:'middle',fontSize:28,marginRight:6}}/>Запись с камеры</div>
            <div style={{fontSize:16,opacity:0.85,marginBottom:24}}>Нажмите, чтобы начать запись с камеры.<br/>Всё, что попадёт в объектив, будет записано.</div>
            <button onClick={startCameraRecording} style={{marginTop:8,padding:'12px 0',width:'100%',fontSize:17,border:'none',borderRadius:0,background:'#1976d2',color:'#fff',cursor:'pointer',fontWeight:500,letterSpacing:0.2}}>Начать запись</button>
          </div>
        </div>
      )}
    </div>
  );
}
