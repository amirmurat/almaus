import { MdDescription, MdBarChart, MdPerson, MdOutlineLibraryBooks } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Services() {
  const nav = useNavigate();
  
  const services = [
    {
      title: 'Справки',
      icon: <MdDescription style={{fontSize: 24, color: '#23272f'}} />,
      path: '/docs',
      description: 'Получение справок и документов'
    },
    {
      title: 'Предметы',
      icon: <MdOutlineLibraryBooks style={{fontSize: 24, color: '#23272f'}} />,
      path: '/subjects',
      description: 'Успеваемость по предметам'
    },
    {
      title: 'Статистика',
      icon: <MdBarChart style={{fontSize: 24, color: '#23272f'}} />,
      path: '/statistics',
      description: 'Аналитика и отчеты'
    },
    {
      title: 'Профиль',
      icon: <MdPerson style={{fontSize: 24, color: '#23272f'}} />,
      path: '/profile-page',
      description: 'Личные данные и настройки'
    }
  ];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        width: '100%',
      }}>
        {services.map((service, index) => (
          <div
            key={index}
            style={{
              border: 'none',
              borderRadius: 0,
              width: '100%',
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 400,
              fontSize: 16,
              color: '#23272f',
              textAlign: 'center',
              padding: '20px',
              boxSizing: 'border-box',
              position: 'relative',
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              transition: 'transform 0.13s',
              cursor: 'pointer',
            }}
            onClick={() => nav(service.path)}
            onPointerDown={e => { 
              e.currentTarget.style.transform = 'scale(0.96)'; 
            }}
            onPointerUp={e => { 
              e.currentTarget.style.transform = 'scale(1)'; 
            }}
            onPointerLeave={e => { 
              e.currentTarget.style.transform = 'scale(1)'; 
            }}
          >
            <div style={{ marginBottom: 12 }}>
              {service.icon}
            </div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#23272f', marginBottom: 4 }}>
              {service.title}
            </div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.3 }}>
              {service.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 