export default function AnnouncementItem({ note }) {
  return (
    <li style={{borderBottom:'1px solid #eee',padding:'6px 0'}}>
      <strong>{note.title}</strong><br/>
      <small>{note.author}</small>
    </li>
  );
}
