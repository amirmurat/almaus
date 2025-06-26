import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJson } from '../utils/api';

export default function AssignmentDetails() {
  const { id }   = useParams();           // /assignments/1  →  id='1'
  const nav      = useNavigate();
  const [task,setTask] = useState(null);

  /* грузим JSON один раз, находим нужный объект */
  useEffect(()=>{
    fetchJson('assignments.json')
      .then(list => list.find(t => String(t.id) === id))
      .then(setTask);
  },[id]);

  if(!task) return <p style={{textAlign:'center',marginTop:'20vh'}}>Загрузка…</p>;

  const submit = e => {
    e.preventDefault();
    alert('Файл и комментарий «как будто» отправлены (заглушка).');
    /* в реальном бэкенде здесь был бы fetch POST */
  };

  return (
    <div style={{padding:16}}>
      <button onClick={()=>nav(-1)} style={{marginBottom:8}}>← Назад</button>
      <h2>{task.subject}: {task.title}</h2>
      <p><strong>Дедлайн:</strong> {task.deadline}</p>
      <p style={{margin:'12px 0'}}>{task.description}</p>

      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8,maxWidth:300}}>
        <textarea placeholder="Комментарий" rows={3} />
        <input type="file" />
        <button>Отправить</button>
      </form>
    </div>
  );
}
