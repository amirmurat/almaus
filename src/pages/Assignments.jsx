import { useEffect, useState } from 'react';
import { fetchJson } from '../utils/api';
import AssignmentCard from '../components/AssignmentCard';
import { loadDone, saveDone } from '../utils/doneStore';

export default function Assignments() {
  const [tasks, setTasks] = useState(null);     // список из JSON
  const [done, setDone]   = useState(loadDone); // Set выполненных id

  // загрузка assignments.json один раз
  useEffect(() => {
    fetchJson('assignments.json').then(setTasks);
  }, []);

  // сохраняем Set при каждом изменении
  useEffect(() => {
    saveDone(done);
  }, [done]);

  const toggleDone = (id) => {
    const set = new Set(done);
    set.has(id) ? set.delete(id) : set.add(id);
    setDone(set);
  };

  if (!tasks) {
    return <p style={{ textAlign: 'center', marginTop: '20vh' }}>Загрузка…</p>;
  }

  return tasks.map((t) => (
    <AssignmentCard
      key={t.id}
      task={t}
      done={done.has(t.id)}
      onToggle={toggleDone}
    />
  ));
}
