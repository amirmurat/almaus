import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import ScheduleCard from '../components/ScheduleCard';
import UpcomingTaskCard from '../components/UpcomingTaskCard';
import { loadDone } from '../utils/doneStore';

/* утилиты ---------------------------------------------------- */
const weekday = i => ['Понедельник','Вторник','Среда','Четверг','Пятница'][i] || '';

const parseTime = (d,time) => {
  const [h,m] = time.split(':').map(Number);
  const dt    = new Date(d);
  dt.setHours(h, m, 0, 0);
  return dt;
};

const todayIdx = (()=>{ const i=new Date().getDay()-1; return i>=0&&i<=4?i:0; })();

/* MAIN COMPONENT -------------------------------------------- */
export default function Schedule() {

  const [week,setWeek]       = useState(null);   // schedule.json
  const [tasks,setTasks]     = useState(null);   // assignments.json
  const [view,setView]       = useState('today');/* today|week */
  const doneSet              = loadDone();       // Set выполненных id

  /* --- загрузка данных --- */
  useEffect(()=>{ fetchJson('schedule.json').then(d=>setWeek(d.week)); },[]);
  useEffect(()=>{ fetchJson('assignments.json').then(setTasks); },[]);

  if(!week || !tasks){
    return <p style={{textAlign:'center',marginTop:'20vh'}}>Загрузка…</p>;
  }

  /* --- фильтруем актуальные задачи --- */
  const upcoming = tasks.filter(t=>{
    if(doneSet.has(t.id)) return false;
    const dl = new Date(t.deadline + 'T00:00:00');
    const diff = Math.floor((dl - todayDateMidnight())/86400000);
    return diff >=0 && diff <=3;
  });

  /* --- UI переключатель --- */
  const Toggle = ()=>(
    <div style={{display:'flex',gap:8,margin:'8px 8px 4px'}}>
      {['today','week'].map(v=>(
        <button key={v}
          onClick={()=>setView(v)}
          style={{
            flex:1,padding:6,border:'none',borderRadius:4,cursor:'pointer',
            background:view===v? '#673ab7':'#e0e0e0',
            color:    view===v? '#fff'    :'#000'
          }}>
          {v==='today'?'Сегодня':'Неделя'}
        </button>
      ))}
    </div>
  );

  /* --- WEEK view ------------------------------------------ */
  if(view==='week'){
    return (
      <>
        <Toggle/>
        {week.map((day,idx)=>(
          <section key={day.date} style={{padding:'0 8px'}}>
            <h4 style={{margin:'8px 0'}}>{weekday(idx)} • {day.date}</h4>
            {day.lessons.map((l,i)=>{
              const status = idx!==todayIdx ? null : getStatus(day.date, day.lessons, i);
              return <ScheduleCard key={l.id} lesson={l} status={status}/>;
            })}
          </section>
        ))}
      </>
    );
  }

  /* --- TODAY view ----------------------------------------- */
  const today = week[todayIdx];

  return (
    <>
      <Toggle/>

      {upcoming.length > 0 && (
        <section style={{padding:'0 8px',marginBottom:12}}>
          <h3 style={{margin:'6px 0'}}>Актуальные домашки (≤ 3 дней)</h3>
          {upcoming.map(t=><UpcomingTaskCard key={t.id} task={t}/>)}
        </section>
      )}

      {today.lessons.map((l,i)=>(
        <ScheduleCard key={l.id} lesson={l} status={getStatus(today.date, today.lessons, i)}/>
      ))}
    </>
  );
}

/* helpers --------------------------------------------------- */
function todayDateMidnight(){
  const d=new Date(); d.setHours(0,0,0,0); return d;
}

function getStatus(dateStr, lessons, idx){
  const now      = new Date();
  const start    = parseTime(dateStr, lessons[idx].start);
  const end      = parseTime(dateStr, lessons[idx].end);
  if(now < start){
    for(let j=0;j<idx;j++){
      if(now < parseTime(dateStr, lessons[j].start)) return 'upcoming';
    }
    return 'upcoming';
  }
  if(now >= start && now <= end) return 'ongoing';
  return 'passed';
}
