import { useState } from 'react';

export default function PinLock({ firstSetup=false }) {
  const [step,setStep]=useState(firstSetup?'create':'enter'); // create | confirm | enter
  const [pin1,setPin1]=useState('');
  const [pin2,setPin2]=useState('');
  const [err,setErr]=useState('');

  const handleChange=e=>{
    const v=e.target.value.replace(/\D/g,'').slice(0,4);
    if(step==='create' || step==='enter') setPin1(v); else setPin2(v);
  };

  const next=()=>{
    if(step==='create'){
      if(pin1.length!==4) return setErr('Введите 4 цифры');
      setErr(''); setStep('confirm'); return;
    }
    if(step==='confirm'){
      if(pin1!==pin2) return setErr('PIN не совпадает');
      localStorage.setItem('pin',pin1);
      sessionStorage.setItem('pinOk','1');
      window.location.reload(); return;
    }
    const saved=localStorage.getItem('pin')||'';
    if(pin1===saved){sessionStorage.setItem('pinOk','1');window.location.reload();}
    else setErr('Неверный PIN');
  };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:'30vh'}}>
      <h3>{{create:'Создай PIN',confirm:'Повтори PIN',enter:'Введите PIN'}[step]}</h3>
      <input type="password" value={step==='confirm'?pin2:pin1}
             onChange={handleChange}
             style={{fontSize:'2rem',textAlign:'center',width:'8rem',letterSpacing:'0.5rem'}}/>
      {err && <span style={{color:'red'}}>{err}</span>}
      <button onClick={next} style={{marginTop:8}}>ОК</button>
      {step==='enter' && (
        <button style={{fontSize:12,marginTop:4}}
          onClick={()=>{localStorage.removeItem('pin');sessionStorage.removeItem('pinOk');setStep('create');setPin1('');setPin2('');setErr('');}}>
          Сбросить PIN
        </button>
      )}
    </div>
  );
}
