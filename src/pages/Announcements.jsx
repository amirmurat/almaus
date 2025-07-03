import { useEffect,useState } from 'react';
import { fetchJson } from '../utils/api';
import AnnouncementItem from '../components/AnnouncementItem';

export default function Announcements(){
  const[notes,setNotes]=useState(null);
  useEffect(()=>{fetchJson('announcements.json').then(setNotes);},[]);
  if(!notes) return <p style={{textAlign:'center',marginTop:'20vh'}}>Загрузка…</p>;
  return <div style={{padding:16,margin:8,maxWidth:680,boxSizing:'border-box'}}>
    {notes.map(n=><AnnouncementItem key={n.id} note={n}/>)}
  </div>;
}
