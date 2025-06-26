import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import ScheduleCard from '../components/ScheduleCard';

/* ───── helpers ───── */
const weekday = i => ['Понедельник','Вторник','Среда','Четверг','Пятница'][i] || '';

const parse = (d,time) => {
  const [h,m] = time.split(':').map(Number);
  const dt    = new Date(d);
  dt.setHours(h, m, 0, 0);
  return dt;
};

const now = () => new Date();

export default function Schedule() {
  const [data,setData] = useState(null);
  const [view,setView] = useState('today');             // today | week

  /* индекс сегодняшнего дня для week-view (0-Пн) */
  const todayIdx = (()=>{ const i=new Date().getDay()-1; return i>=0&&i<=4?i:0; })();

  useEffect(()=>{ fetchJson('schedule.json').then(setData); },[]);
  if(!data) return <p style={{textAlign:'center',marginTop:'20vh'}}>Загрузка…</p>;

  /* ───── переключатель ───── */
  const Toggle = () => (
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

  /* ───── режим "Неделя" ───── */
  if(view==='week'){
    return (
      <>
        <Toggle/>
        {data.week.map((day,idx)=>(
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

  /* ───── режим "Сегодня" ───── */
  const today = data.week[todayIdx];
  return (
    <>
      <Toggle/>
      {today.lessons.map((l,i)=>(
        <ScheduleCard key={l.id} lesson={l} status={getStatus(today.date, today.lessons, i)}/>
      ))}
    </>
  );
}

/* определяем passed / ongoing / upcoming */
function getStatus(dateStr, lessons, idx){
  const n      = now();
  const start  = parse(dateStr, lessons[idx].start);
  const end    = parse(dateStr, lessons[idx].end);

  if(n < start) {
    /* первый lesson у которого n < start — это upcoming */
    for(let j=0;j<idx;j++){
      if(now() < parse(dateStr, lessons[j].start)) return 'upcoming';
    }
    return 'upcoming';
  }
  if(n >= start && n <= end) return 'ongoing';
  return 'passed';
}
