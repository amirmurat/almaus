export default function AnnouncementItem({ note }) {
  return (
    <div style={{borderBottom:'1px solid #eee',padding:'6px 0',fontSize:15}}>
      {note.title}<br/>
      <small>{note.author}</small>
    </div>
  );
}
