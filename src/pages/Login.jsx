import { useState } from 'react';
import Modal from '../components/Modal';

export default function Login() {
  const [login,setLogin]=useState('');
  const [pass,setPass]=useState('');
  const [err,setErr]=useState('');
  const [show,setShow]=useState(false);

  const handle=()=>{
    if(pass==='1234'){
      localStorage.setItem('token','dummy');
      window.location.reload();
    }else setErr('Неверный пароль');
  };

  return (
    <div style={{display:'flex',flexDirection:'column',maxWidth:240,margin:'20vh auto',gap:8}}>
      <h2>Вход</h2>
      <input placeholder="Логин" value={login} onChange={e=>setLogin(e.target.value)}/>
      <input placeholder="Пароль" type="password" value={pass} onChange={e=>setPass(e.target.value)}/>
      {err && <span style={{color:'red'}}>{err}</span>}
      <button onClick={handle}>Войти</button>
      <button
        style={{fontSize:12}}
        type="button"
        onClick={()=>setShow(true)}
      >
        Забыл пароль
      </button>

      {/* модалка-подсказка */}
      <Modal open={show} onClose={()=>setShow(false)}>
        <h3 style={{marginTop:0}}>Как восстановить пароль?</h3>
        <p style={{fontSize:14,lineHeight:1.4}}>
          Пароли выдаёт IT-отдел AlmaU.<br/>
          • Напишите&nbsp;на&nbsp;<b>helpdesk@almau.kz</b><br/>
          • Или подойдите в&nbsp;каб.&nbsp;В-103
        </p>
      </Modal>
    </div>
  );
}
