import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  saveDraftFragment,
  getDraftFragments,
  clearDraft,
  mergeDraftFragments,
  addSubmission
} from '../utils/videoDraftStore';

export default function AssignmentRecord() {
  const nav = useNavigate();
  const location = useLocation();
  const type = new URLSearchParams(location.search).get('type'); // 'screen' | 'camera'
  const { id } = useParams();
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [fragments, setFragments] = useState([]); // массив Blob
  const [previewUrl, setPreviewUrl] = useState(null); // итоговое видео
  const [sent, setSent] = useState(false);
  const videoRef = useRef();
  const chunksRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Загрузка черновика при входе
  useEffect(() => {
    getDraftFragments(id).then(setFragments);
  }, [id]);

  // Начать новую запись
  const startRecording = async () => {
    let mediaStream;
    try {
      if (type === 'screen') {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      } else {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(()=>{});
        setVideoError(false);
      }
      let mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        alert('Ваш браузер не поддерживает video/webm для записи!');
        return;
      }
      const rec = new MediaRecorder(mediaStream, { mimeType });
      setRecorder(rec);
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
        setStream(null);
        setRecording(false);
        setLoading(true);
        // Проверка: если есть фрагменты, сравнить размеры видео
        if (fragments.length > 0) {
          const prev = document.createElement('video');
          prev.src = URL.createObjectURL(fragments[0]);
          await new Promise(res => { prev.onloadedmetadata = res; });
          const newVid = document.createElement('video');
          newVid.src = URL.createObjectURL(blob);
          await new Promise(res => { newVid.onloadedmetadata = res; });
          if (prev.videoWidth !== newVid.videoWidth || prev.videoHeight !== newVid.videoHeight) {
            alert('Размеры видео не совпадают с предыдущими фрагментами! Записывайте все фрагменты с одного и того же экрана/окна.');
            setLoading(false);
            return;
          }
        }
        await saveDraftFragment(id, blob);
        const frags = await getDraftFragments(id);
        setFragments(frags);
        setLoading(false);
      };
      rec.start();
      setRecording(true);
    } catch (err) {
      alert('Ошибка при получении медиа: ' + err.message);
    }
  };

  // Остановить запись
  const stopRecording = () => {
    if (recorder) recorder.stop();
  };

  // Удалить черновик
  const handleClearDraft = async () => {
    await clearDraft(id);
    setFragments([]);
    setPreviewUrl(null);
  };

  // Слить и отправить
  const handleSend = async () => {
    setLoading(true);
    const merged = await mergeDraftFragments(id);
    if (!merged || merged.size === 0) {
      setLoading(false);
      alert('Ошибка: не удалось объединить фрагменты. Проверьте, что все фрагменты записаны с одного источника.');
      return;
    }
    await addSubmission(id, merged);
    await clearDraft(id);
    setFragments([]);
    setPreviewUrl(URL.createObjectURL(merged));
    setSent(true);
    setLoading(false);
  };

  // Просмотр объединённого видео
  const handlePreview = async () => {
    setLoading(true);
    const merged = await mergeDraftFragments(id);
    if (merged) setPreviewUrl(URL.createObjectURL(merged));
    setLoading(false);
  };

  return (
    <div style={{padding:16}}>
      <button onClick={()=>nav(-1)} style={{marginBottom:8}}>← Назад</button>
      <h2>Запись {type === 'screen' ? 'экрана' : 'камеры'}</h2>
      {loading && (
        <div style={{margin:'16px 0',textAlign:'center'}}>
          <div className="spinner" style={{width:40,height:40,border:'4px solid #eee',borderTop:'4px solid #673ab7',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto'}}></div>
          <div style={{fontSize:13,color:'#888',marginTop:8}}>Обработка...</div>
          <style>{`@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
        </div>
      )}
      {!recording && !loading && (
        <div style={{marginBottom:16}}>
          <button onClick={startRecording} style={{fontSize:18,padding:'8px 20px',marginRight:8}}>Начать запись</button>
          {fragments.length > 0 && <button onClick={handlePreview} style={{fontSize:16,padding:'8px 20px',marginRight:8}}>Просмотреть черновик</button>}
          {fragments.length > 0 && <button onClick={handleSend} style={{fontSize:16,padding:'8px 20px',marginRight:8,background:'#673ab7',color:'#fff',border:'none',borderRadius:6}}>Завершить и отправить</button>}
          {fragments.length > 0 && <button onClick={handleClearDraft} style={{fontSize:16,padding:'8px 20px',background:'#eee',color:'#d32f2f',border:'none',borderRadius:6}}>Удалить черновик</button>}
        </div>
      )}
      {recording && (
        <div>
          <div style={{position:'relative',display:'inline-block'}}>
            <video ref={videoRef} autoPlay muted style={{maxWidth:480,background:'#000',marginBottom:16}}
              onError={()=>setVideoError(true)}
              onLoadedData={()=>setVideoError(false)}
            />
            {videoError && (
              <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'#000a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>
                Не удаётся отобразить поток. Но запись продолжается!
              </div>
            )}
          </div>
          <div style={{marginBottom:8,color:'#888',fontSize:14}}>
            {videoError ? 'Возможно, окно экрана свернуто или скрыто.' : 'Идёт запись экрана...'}
          </div>
          <div>
            <button onClick={stopRecording} disabled={!recording} style={{fontSize:18,padding:'8px 20px'}}>Остановить и сохранить фрагмент</button>
          </div>
        </div>
      )}
      {fragments.length > 0 && !recording && !loading && (
        <div style={{margin:'16px 0'}}>
          <div style={{fontWeight:600,marginBottom:8}}>Фрагменты черновика:</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
            {fragments.map((blob,idx) => (
              <video key={idx} src={URL.createObjectURL(blob)} controls style={{width:160,maxHeight:90,background:'#000'}} />
            ))}
          </div>
        </div>
      )}
      {previewUrl && !recording && !loading && (
        <div style={{margin:'16px 0'}}>
          <div style={{fontWeight:600,marginBottom:8}}>Итоговое видео:</div>
          <video src={previewUrl} controls style={{width:320,maxHeight:180,background:'#000'}} />
        </div>
      )}
      {sent && <div style={{color:'#388e3c',marginTop:16,fontWeight:600}}>Видео отправлено!</div>}
    </div>
  );
} 