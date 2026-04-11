'use client';

import { useState, useEffect, useRef } from 'react';

// Константы
const API_BASE = 'https://helpmedoctor.oxion-ezhkov.workers.dev';

// Типы
interface Message {
  role: 'doctor' | 'patient' | 'summary';
  text: string;
  ts?: number;
}

interface Patient {
  id: string;
  name: string;
  age: number | string;
  sex: string;
  chief_complaint: string;
  true_diagnosis?: string;
  specialization?: string;
  status: string;
  is_alien?: boolean;
  closed_at?: number;
  consultations?: any[];
  test_results?: any[];
  conversation_history?: Message[];
  post_story?: string;
  _current_actions?: string[];
  _current_tests?: string[];
  _current_diagnosis?: string | null;
}

interface Profile {
  uid: string;
  name: string;
  level: string;
  profession: string;
  specializations: string[];
  stats: {
    patients_total: number;
    consultations_total: number;
    avg_rating: number;
  };
  streak?: number;
  xp?: number;
  daily_task?: any;
  sub_until?: number;
}

export default function HMDChatContent() {
  // Авторизация
  const [uid, setUid] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hmd_uid');
    }
    return null;
  });
  const [authInput, setAuthInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Данные
  const [profile, setProfile] = useState<Profile | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tests, setTests] = useState<any[]>([]);

  // UI состояние
  const [screen, setScreen] = useState<'patients' | 'profile' | 'tests' | 'chat'>('patients');
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showActions, setShowActions] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState<any>(null);

  // Панель пациента (модалка)
  const [panelPatient, setPanelPatient] = useState<Patient | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  // Модалка для ввода действия
  const [actionModal, setActionModal] = useState<{
    type: 'test' | 'physical' | 'diagnosis' | 'referral';
    visible: boolean;
  } | null>(null);

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Загрузка данных при входе
  useEffect(() => {
    if (uid) {
      loadData();
    }
  }, [uid]);

  // Автопрокрутка чата
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Обновление пациента из чата
  useEffect(() => {
    if (activePatient && screen === 'chat') {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/mini-app/patient?id=${activePatient.id}`);
          if (res.ok) {
            const pat = await res.json();
            setActivePatient(pat);
            setMessages(pat.conversation_history || []);
          }
        } catch (e) {
          // игнорируем
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activePatient, screen]);

  async function api(path: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api(`/mini-app/init?uid=${uid}`);
      if (data.not_registered) {
        // Авторегистрация через start
        await api(`/mini-app/action?uid=${uid}&action=register_auto`);
        const newData = await api(`/mini-app/init?uid=${uid}`);
        setProfile(newData.profile);
        setPatients(newData.patients || []);
        setTests(newData.tests || []);
      } else {
        setProfile(data.profile);
        setPatients(data.patients || []);
        setTests(data.tests || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogin() {
    if (authInput.trim()) {
      localStorage.setItem('hmd_uid', authInput.trim());
      setUid(authInput.trim());
    }
  }

  function handleLogout() {
    localStorage.removeItem('hmd_uid');
    setUid(null);
    setProfile(null);
    setPatients([]);
  }

  async function startConsultation(patId: string) {
    try {
      await api(`/mini-app/action?uid=${uid}&action=start_consultation&pat_id=${patId}`);
      const res = await fetch(`${API_BASE}/mini-app/patient?id=${patId}`);
      const pat = await res.json();
      setActivePatient(pat);
      setMessages(pat.conversation_history || []);
      setScreen('chat');
      setShowActions(false);
    } catch (e) {
      alert('Ошибка при начале приёма');
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim() || !activePatient || isSending) return;

    const text = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Оптимистично добавляем сообщение врача
    setMessages(prev => [...prev, { role: 'doctor', text }]);

    try {
      const res = await fetch(
        `${API_BASE}/mini-app/send-message?uid=${uid}&pat_id=${activePatient.id}&text=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      if (data.conversation_history) {
        setMessages(data.conversation_history);
      }
      // Обновляем активного пациента
      const patRes = await fetch(`${API_BASE}/mini-app/patient?id=${activePatient.id}`);
      if (patRes.ok) {
        setActivePatient(await patRes.json());
      }
    } catch (e) {
      alert('Ошибка отправки сообщения');
    } finally {
      setIsSending(false);
    }
  }

  async function doAction(action: string, value?: string) {
    if (!activePatient) return;

    try {
      let url = `${API_BASE}/mini-app/action?uid=${uid}&action=${action}&pat_id=${activePatient.id}`;
      if (value) url += `&value=${encodeURIComponent(value)}`;
      await fetch(url);

      // Обновляем пациента
      const res = await fetch(`${API_BASE}/mini-app/patient?id=${activePatient.id}`);
      if (res.ok) {
        const pat = await res.json();
        setActivePatient(pat);
        setMessages(pat.conversation_history || []);

        // Если приём завершён — показать оценку
        if (action === 'diagnosis' || action === 'end_empty' || action === 'confirm_end_empty') {
          const lastCons = pat.consultations?.[pat.consultations.length - 1];
          if (lastCons?.feedback) {
            setShowEvaluation({ patient: pat, feedback: lastCons.feedback, rating: lastCons.rating });
          }
          setScreen('patients');
          setActivePatient(null);
          loadData(); // обновить список пациентов
        }
      }
    } catch (e) {
      alert('Ошибка выполнения действия');
    }
    setShowActions(false);
    setActionModal(null);
  }

  async function newPatient() {
    try {
      await api(`/mini-app/action?uid=${uid}&action=new_patient`);
      await loadData();
    } catch (e) {
      alert('Ошибка создания пациента');
    }
  }

  async function rejectPatient(patId: string) {
    if (!confirm('Удалить пациента без возможности восстановления?')) return;
    try {
      await api(`/mini-app/action?uid=${uid}&action=reject_patient&pat_id=${patId}`);
      await loadData();
    } catch (e) {
      alert('Ошибка');
    }
  }

  function openPatientPanel(pat: Patient) {
    setPanelPatient(pat);
    setShowPanel(true);
  }

  // Рендер экрана авторизации
  if (!uid) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 20, background: 'var(--bg)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🏥</div>
        <h2 style={{ marginBottom: 20, color: 'var(--text)' }}>Help me, Doctor</h2>
        <input
          type="text"
          placeholder="Введите ваш Telegram ID"
          value={authInput}
          onChange={e => setAuthInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            padding: '12px 16px', fontSize: 16, borderRadius: 12, border: '1.5px solid var(--border)',
            width: '100%', maxWidth: 300, marginBottom: 12, outline: 'none', background: 'var(--surface)'
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            background: 'var(--pink)', color: 'white', border: 'none', borderRadius: 12,
            padding: '12px 24px', fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', maxWidth: 300
          }}
        >
          Войти
        </button>
        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text3)' }}>
          Ваш ID можно узнать у @userinfobot в Telegram
        </p>
      </div>
    );
  }

  // Экран загрузки
  if (isLoading && !profile) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">🏥</div>
        <div className="loading-title">Help me, Doctor</div>
        <div className="loading-sub">Загружаем кабинет...</div>
        <div className="spinner" />
      </div>
    );
  }

  // Экран ошибки
  if (error) {
    return (
      <div className="empty-screen">
        <div className="empty-icon">🌐</div>
        <div className="empty-title">Ошибка загрузки</div>
        <div className="empty-sub">{error}</div>
        <button className="btn-primary" onClick={loadData}>Повторить</button>
        <button className="btn-outline" onClick={handleLogout} style={{ marginTop: 12 }}>Выйти</button>
      </div>
    );
  }

  // Экран чата
  if (screen === 'chat' && activePatient) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <button onClick={() => { setScreen('patients'); setActivePatient(null); loadData(); }}>
            ← Назад
          </button>
          <span>{activePatient.name}, {activePatient.age} {typeof activePatient.age === 'number' ? 'лет' : ''}</span>
          <button onClick={() => setShowActions(!showActions)}>⚕️</button>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {isSending && (
            <div className="message doctor" style={{ opacity: 0.5 }}>...</div>
          )}
        </div>

        {showActions && (
          <div className="actions-panel">
            <button onClick={() => setActionModal({ type: 'test', visible: true })}>🔬 Обследование</button>
            <button onClick={() => setActionModal({ type: 'physical', visible: true })}>🤲 Осмотр</button>
            <button onClick={() => setActionModal({ type: 'diagnosis', visible: true })}>🩺 Диагноз</button>
            <button onClick={() => doAction('end_empty')} className="danger">🚪 Завершить</button>
          </div>
        )}

        <div className="chat-input">
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={isSending}
          />
          <button onClick={sendMessage} disabled={isSending || !inputMessage.trim()}>
            Отправить
          </button>
        </div>

        {/* Модалка для ввода действия */}
        {actionModal?.visible && (
          <>
            <div className="evaluation-overlay" onClick={() => setActionModal(null)} />
            <div className="action-modal">
              <h3 style={{ marginBottom: 16, color: 'var(--text)' }}>
                {actionModal.type === 'test' && 'Название обследования'}
                {actionModal.type === 'physical' && 'Опишите осмотр'}
                {actionModal.type === 'diagnosis' && 'Введите диагноз'}
              </h3>
              <input
                type="text"
                id="action-input"
                placeholder={
                  actionModal.type === 'test' ? 'Например: МРТ головного мозга' :
                  actionModal.type === 'physical' ? 'Например: пальпация живота' :
                  'Например: Острый аппендицит'
                }
                autoFocus
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => {
                  const input = document.getElementById('action-input') as HTMLInputElement;
                  if (input.value.trim()) {
                    doAction(actionModal.type, input.value.trim());
                  }
                }}>Выполнить</button>
                <button onClick={() => setActionModal(null)} style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
                  Отмена
                </button>
              </div>
            </div>
          </>
        )}

        {/* Модалка с оценкой */}
        {showEvaluation && (
          <>
            <div className="evaluation-overlay" onClick={() => setShowEvaluation(null)} />
            <div className="evaluation-modal">
              <h2 style={{ marginBottom: 16 }}>📋 Разбор приёма</h2>
              <p style={{ marginBottom: 12 }}><b>Оценка:</b> {'⭐'.repeat(Math.round(showEvaluation.rating || 0))} {showEvaluation.rating?.toFixed(1)}</p>
              <p style={{ marginBottom: 16, lineHeight: 1.5 }}>{showEvaluation.feedback?.expert_text}</p>
              <button className="btn-primary" onClick={() => setShowEvaluation(null)}>Закрыть</button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Основные экраны (пациенты, профиль, тарифы)
  const activePatients = patients.filter(p => p.status !== 'closed');
  const closedPatients = patients.filter(p => p.status === 'closed').sort((a, b) => (b.closed_at || 0) - (a.closed_at || 0));

  return (
    <>
      {/* Навигация */}
      <nav>
        <div className={`nav-item ${screen === 'patients' ? 'active' : ''}`} onClick={() => setScreen('patients')}>
          <div className="nav-dot" />
          <div className="nav-icon">🏥</div>
          <div className="nav-label">Пациенты</div>
        </div>
        <div className={`nav-item ${screen === 'profile' ? 'active' : ''}`} onClick={() => setScreen('profile')}>
          <div className="nav-dot" />
          <div className="nav-icon">👤</div>
          <div className="nav-label">Профиль</div>
        </div>
        <div className={`nav-item ${screen === 'tests' ? 'active' : ''}`} onClick={() => setScreen('tests')}>
          <div className="nav-dot" />
          <div className="nav-icon">💎</div>
          <div className="nav-label">Тарифы</div>
        </div>
      </nav>

      {/* Экран Пациенты */}
      <div className={`screen ${screen === 'patients' ? 'active' : ''}`} id="screen-patients">
        <div className="page-header">
          <div className="page-title">Пациенты</div>
          <div className="page-sub">
            {activePatients.length} активн{activePatients.length === 1 ? 'ый' : 'ых'}
            <button onClick={handleLogout} style={{ marginLeft: 16, fontSize: 12, color: 'var(--pink)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Выйти
            </button>
          </div>
        </div>

        <div className="patient-list">
          {activePatients.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text3)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🩺</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Очередь пуста</div>
              <div style={{ fontSize: 13 }}>Примите нового пациента чтобы начать</div>
            </div>
          )}

          {activePatients.map(pat => (
            <div key={pat.id} className="patient-card" onClick={() => openPatientPanel(pat)}>
              <div className="card-inner">
                <div className={`card-stripe ${pat.is_alien ? 'alien' : 'active'}`} />
                <div className="card-body">
                  <div className="card-top">
                    <div>
                      <div className="card-name">{pat.name}</div>
                      <div className="card-age">{pat.age} {typeof pat.age === 'number' ? 'лет' : ''} · {pat.sex === 'female' ? 'Жен.' : 'Муж.'}</div>
                    </div>
                    <div className={`card-tag ${pat.is_alien ? 'alien' : ''}`}>
                      {pat.is_alien ? '👽 Особый' : pat.specialization}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    <button className="card-btn" onClick={(e) => { e.stopPropagation(); startConsultation(pat.id); }}>
                      ▶️ Начать приём
                    </button>
                    <button className="card-btn secondary" onClick={(e) => { e.stopPropagation(); rejectPatient(pat.id); }}>
                      🚫 Отказать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-outline"
          onClick={newPatient}
          disabled={activePatients.length >= 6}
          style={{ marginBottom: 24 }}
        >
          {activePatients.length >= 6 ? '🔒 Максимум 6 пациентов' : '+ Принять нового пациента'}
        </button>

        {closedPatients.length > 0 && (
          <>
            <div className="section-label">Завершённые</div>
            {closedPatients.map(pat => (
              <div key={pat.id} className="patient-card" onClick={() => openPatientPanel(pat)}>
                <div className="card-inner">
                  <div className="card-stripe closed" />
                  <div className="card-body">
                    <div className="card-top">
                      <div>
                        <div className="card-name">{pat.name}</div>
                        <div className="card-age">{pat.age} · {pat.sex === 'female' ? 'Жен.' : 'Муж.'}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', margin: '8px 0' }}>
                      🔬 {pat.true_diagnosis || 'Диагноз не установлен'}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="card-btn secondary" style={{ flex: 1 }}>📝 Тест</button>
                      <button className="card-btn" style={{ flex: 1 }} onClick={() => startConsultation(pat.id)}>🔄 Заново</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Экран Профиль */}
      <div className={`screen ${screen === 'profile' ? 'active' : ''}`}>
        <div className="page-header">
          <div className="page-title">Мой профиль</div>
        </div>
        {profile && (
          <>
            <div style={{ background: 'linear-gradient(135deg,#FFB5C8,#FF8FAB)', borderRadius: 18, padding: '24px 20px', marginBottom: 16, textAlign: 'center', color: 'white' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, margin: '0 auto 12px' }}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{profile.name}</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>🔥 Стрик: {profile.streak || 0} {profile.streak === 1 ? 'день' : 'дней'}</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-val pink">{profile.stats?.patients_total || 0}</div>
                <div className="stat-label">Пациентов</div>
              </div>
              <div className="stat-card">
                <div className="stat-val pink">{profile.stats?.avg_rating ? profile.stats.avg_rating.toFixed(1) + ' ⭐' : '—'}</div>
                <div className="stat-label">Ср. рейтинг</div>
              </div>
            </div>

            <div className="section-label">Помощь</div>
            <div className="faq-item" onClick={(e) => (e.currentTarget as HTMLElement).classList.toggle('open')}>
              <div className="faq-header">📘 Как пользоваться сервисом?<span className="faq-arrow">▾</span></div>
              <div className="faq-body">
                <b>Приём пациента:</b> Нажмите «Начать приём». Задавайте вопросы, назначайте обследования через «⚕️», проводите осмотр.<br /><br />
                <b>Оценка:</b> После завершения получаете разбор от эксперта.<br /><br />
                <b>Тесты:</b> Генерируются по вашим пробелам.
              </div>
            </div>
            <div className="faq-item" onClick={(e) => (e.currentTarget as HTMLElement).classList.toggle('open')}>
              <div className="faq-header">⭐ Как улучшить рейтинг?<span className="faq-arrow">▾</span></div>
              <div className="faq-body">
                Собирайте полный анамнез, проводите осмотр, назначайте нужные обследования, ставьте точный диагноз.
              </div>
            </div>
            <div className="faq-item" onClick={(e) => (e.currentTarget as HTMLElement).classList.toggle('open')}>
              <div className="faq-header">🐛 Нашли ошибку?<span className="faq-arrow">▾</span></div>
              <div className="faq-body">
                Напишите разработчику.<br /><br />
                <a href="https://t.me/oleg_ezhkov" target="_blank" className="faq-contact">✈️ Написать Олегу</a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Экран Тарифы */}
      <div className={`screen ${screen === 'tests' ? 'active' : ''}`}>
        <div className="page-header">
          <div className="page-title">Тарифы</div>
          <div className="page-sub">Подписка на безлимит</div>
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 18, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>Бесплатно</div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>1 пациент в день</div>
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <a href="https://t.me/oleg_ezhkov" target="_blank" style={{ color: 'var(--pink)', textDecoration: 'none', fontWeight: 700 }}>
            ✈️ Написать Олегу для подключения
          </a>
        </div>
      </div>

      {/* Панель пациента */}
      {showPanel && panelPatient && (
        <>
          <div className="panel-overlay visible" onClick={() => setShowPanel(false)} />
          <div className="panel open">
            <div className="panel-handle" />
            <div className="panel-header">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div className="panel-name">{panelPatient.name}</div>
                  <div className="panel-sub">{panelPatient.age} · {panelPatient.specialization}</div>
                </div>
                <span className={`status-badge ${panelPatient.status === 'closed' ? 'closed' : 'active'}`}>
                  {panelPatient.status === 'closed' ? '⚫ Завершён' : '🟢 Активный'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', fontStyle: 'italic', marginTop: 8 }}>
                {panelPatient.chief_complaint}
              </div>
            </div>

            {panelPatient.status !== 'closed' && (
              <button className="btn-primary" style={{ marginBottom: 20 }} onClick={() => startConsultation(panelPatient.id)}>
                Начать приём
              </button>
            )}

            {panelPatient.status === 'closed' && panelPatient.true_diagnosis && (
              <div style={{ background: 'var(--pink-pale)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--pink)', marginBottom: 6 }}>Истинный диагноз</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{panelPatient.true_diagnosis}</div>
              </div>
            )}

            {panelPatient.test_results && panelPatient.test_results.length > 0 && (
              <div className="panel-section">
                <div className="panel-section-title">Обследования</div>
                {panelPatient.test_results.map((t: any, i: number) => (
                  <div key={i} className="test-item">
                    <div className="test-header" onClick={(e) => (e.currentTarget.parentElement as HTMLElement).classList.toggle('open')}>
                      <div className="test-name">{t.test}</div>
                      <span className="test-arrow">▾</span>
                    </div>
                    <div className="test-body">{t.result}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
