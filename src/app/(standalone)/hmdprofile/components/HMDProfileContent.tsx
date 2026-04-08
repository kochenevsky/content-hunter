'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
    tg: any;
  }
}

export default function HMDProfileContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myUid, setMyUid] = useState<string | null>(null);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [myPatients, setMyPatients] = useState<any[]>([]);
  const [currentScreen, setCurrentScreen] = useState('patients');

  // API helper
  const api = (path: string) => `/api/hmd${path}`;

  // Загрузка данных
  useEffect(() => {
    const init = async () => {
      try {
        // Получаем UID
        let uid: string | null = null;
        
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
          uid = String(window.Telegram.WebApp.initDataUnsafe.user.id);
        } else {
          uid = new URLSearchParams(window.location.search).get('uid');
        }
        
        if (!uid) {
          setError('not_registered');
          setLoading(false);
          return;
        }
        
        setMyUid(uid);
        
        // Таймаут 15 секунд
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(api(`/mini-app/init?uid=${uid}`), {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.not_registered) {
          setError('not_registered');
        } else {
          setMyProfile(data.profile);
          setMyPatients(data.patients);
        }
        
      } catch (err: any) {
        console.error('Ошибка:', err);
        if (err.name === 'AbortError') {
          setError('timeout');
        } else {
          setError('network');
        }
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  // Показать ошибку
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
          {error === 'timeout' ? '⏱️' : error === 'network' ? '🌐' : '🏥'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
          {error === 'timeout' && 'Слишком долгая загрузка'}
          {error === 'network' && 'Не удалось загрузить кабинет'}
          {error === 'not_registered' && 'Help me, Doctor 👩‍⚕️'}
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          {error === 'timeout' && 'Сервер не отвечает, попробуйте позже'}
          {error === 'network' && (
            <>
              Проверьте интернет-соединение
              <br />
              <br />
              <strong>Если используете VPN:</strong>
              <br />
              Добавьте домен <code>helpmedoctor.oxion-ezhkov.workers.dev</code> в исключения
            </>
          )}
          {error === 'not_registered' && 'Пройдите регистрацию чтобы начать принимать пациентов'}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{ background: '#FF8FAB', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' }}
        >
          🔄 Перезагрузить
        </button>
      </div>
    );
  }

  // Показать загрузку
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>🏥</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Help me, Doctor</div>
        <div style={{ fontSize: '13px', color: '#aaa' }}>Загружаем кабинет...</div>
        <div style={{ width: '28px', height: '28px', border: '3px solid #FFB5C8', borderTopColor: '#FF8FAB', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Показать список пациентов
  const activePatients = myPatients.filter(p => p.status !== 'closed');
  
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Пациенты</div>
        <div className="page-sub">{activePatients.length} активн{activePatients.length === 1 ? 'ый' : 'ых'}</div>
      </div>
      
      {activePatients.length === 0 ? (
        <div className="empty-screen">
          <div className="empty-icon">🩺</div>
          <div className="empty-title">Очередь пуста</div>
          <div className="empty-sub">Примите нового пациента чтобы начать</div>
        </div>
      ) : (
        <div className="patient-list">
          {activePatients.map((p, i) => (
            <div key={p.id} className="patient-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="card-inner">
                <div className={`card-stripe ${p.is_alien ? 'alien' : 'active'}`}></div>
                <div className="card-body">
                  <div className="card-top">
                    <div>
                      <div className="card-name">{p.name}</div>
                      <div className="card-age">{p.age} {p.is_alien ? '' : 'лет'} · {p.sex === 'female' ? 'Жен.' : 'Муж.'}</div>
                    </div>
                    <div className={`card-tag ${p.is_alien ? 'alien' : ''}`}>
                      {p.is_alien ? '👽 Особый' : (p.specialization || '')}
                    </div>
                  </div>
                  <div className="card-complaint">{p.chief_complaint}</div>
                  <button 
                    className="card-btn"
                    onClick={() => {
                      fetch(api(`/mini-app/action?uid=${myUid}&action=start_consultation&pat_id=${p.id}`));
                      if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
                    }}
                  >
                    ▶️ Начать приём
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="btn-outline"
        onClick={() => {
          fetch(api(`/mini-app/action?uid=${myUid}&action=new_patient`));
          if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
        }}
      >
        + Принять нового пациента
      </button>
    </div>
  );
}
