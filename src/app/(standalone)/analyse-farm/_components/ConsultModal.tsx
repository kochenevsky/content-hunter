'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';

interface ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultModal({ isOpen, onClose }: ConsultModalProps) {
  const [formData, setFormData] = useState({ phone: '', telegram: '' });
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [telegramBlocked, setTelegramBlocked] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const check = async () => {
      try {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), 2000);
        await fetch('https://t.me/', { mode: 'no-cors', signal: ctrl.signal });
        setTelegramBlocked(false);
      } catch {
        setTelegramBlocked(true);
      }
    };
    check();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    params.forEach((v, k) => { if (k.startsWith('utm_')) utm[k] = v; });
    setUtmParams(utm);
  }, []);

  const formatPhone = (value: string): string => {
    const hasPlus = value.startsWith('+');
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned.length) return hasPlus ? '+' : '';
    if (cleaned.length <= 1) return `+${cleaned}`;
    if (cleaned.length <= 4) return `+${cleaned.slice(0, 1)} (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  };

  const getBotLink = () => {
    const url = new URL('https://sbsite.pro/ru_site_ch_1');
    Object.entries(utmParams).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) { setErrors({ phone: 'Номер телефона обязателен' }); return; }
    if (cleanPhone.length < 10 || cleanPhone.length > 12) { setErrors({ phone: 'Введите корректный номер телефона' }); return; }

    setIsSubmitting(true);
    try {
      const formattedForApi = `+${cleanPhone}`;
      const leadData = {
        phone: formattedForApi,
        telegram: formData.telegram || null,
        utm: utmParams,
        page: '/farm2',
        timestamp: new Date().toISOString(),
      };
      await Promise.allSettled([
        fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedForApi, telegram: formData.telegram, page: '/farm2', utm: utmParams }),
        }),
        fetch('/api/google-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        }),
        fetch('/api/amocrm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        }),
      ]);
      setIsSubmitted(true);
    } catch {
      setSubmitError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X /></button>

        {isSubmitted ? (
          <div className="modal-success">
            <CheckCircle2 className="modal-success-icon" />
            <h3>Заявка отправлена!</h3>
            <p>Менеджер свяжется с вами в течение часа</p>
            <a href={getBotLink()} target="_blank" rel="noopener noreferrer" className="modal-btn">
              Перейти в Telegram бот <ExternalLink />
            </a>
          </div>
        ) : (
          <>
            <div className="modal-badge">
              <span className="modal-badge-dot" />
              Content Hunter
            </div>
            <h2 className="modal-title">Получить<br /><span>консультацию</span></h2>
            <p className="modal-subtitle">Оставьте заявку, и менеджер свяжется с вами</p>

            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label>Номер телефона <span className="modal-required">*</span></label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={e => { setFormData(p => ({ ...p, phone: formatPhone(e.target.value) })); setErrors({}); }}
                  className={errors.phone ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="modal-error">{errors.phone}</p>}
              </div>

              <div className="modal-field">
                <label>Telegram username</label>
                <div className="modal-input-wrapper">
                  <span className="modal-prefix">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={formData.telegram}
                    onChange={e => { let v = e.target.value; if (v.startsWith('@')) v = v.slice(1); setFormData(p => ({ ...p, telegram: v })); }}
                    className="modal-input-prefix"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="modal-hint">Необязательно</p>
              </div>

              {submitError && <div className="modal-error-box">{submitError}</div>}

              <button type="submit" className="modal-submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="spinner" /> Отправка...</> : 'Отправить заявку'}
              </button>
              <p className="modal-agreement">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
            </form>

            <div className="modal-telegram-note">
              <p>
                {telegramBlocked
                  ? 'Мы не смогли открыть Telegram, поэтому просим оставить контакт. Мы проведем экскурсию и ответим на вопросы.'
                  : 'Если у вас работает Telegram, перейдите в наш бот:'}
              </p>
              <a href={getBotLink()} target="_blank" rel="noopener noreferrer" className="modal-telegram-btn">
                {telegramBlocked ? 'Оставить заявку выше' : 'Открыть бот в Telegram'} <ExternalLink />
              </a>
            </div>
          </>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; padding: 16px; box-sizing: border-box;
        }
        .modal-content {
          background: #0b1220; border: 1px solid rgba(34,197,94,0.2);
          border-radius: 24px; padding: 32px 24px;
          max-width: 480px; width: 100%; max-height: 90vh;
          overflow-y: auto; position: relative;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          font-family: -apple-system,'SF Pro Display','Inter',system-ui,sans-serif;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .modal-content::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .modal-overlay { align-items: flex-start; padding: 12px; padding-top: 16px; }
          .modal-content { max-height: calc(100vh - 32px); padding: 24px 16px; }
        }
        .modal-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; color: #64748b;
          cursor: pointer; padding: 8px; border-radius: 8px;
          transition: all .15s; display: flex; align-items: center;
          justify-content: center; z-index: 10;
        }
        .modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .modal-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
          border-radius: 20px; padding: 5px 14px;
          font-size: 11px; font-weight: 700; letter-spacing: .07em;
          color: #4ade80; margin-bottom: 24px; text-transform: uppercase;
        }
        .modal-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; }
        .modal-title { font-size: clamp(28px,6vw,40px); font-weight: 900; line-height: 1.08; color: #fff; margin-bottom: 12px; }
        .modal-title span { color: #4ade80; }
        .modal-subtitle { color: #94a3b8; margin-bottom: 28px; }
        .modal-field { margin-bottom: 20px; }
        .modal-field label { display: block; font-size: 14px; font-weight: 500; color: #cbd5e1; margin-bottom: 8px; }
        .modal-required { color: #ef4444; }
        .modal-field input {
          width: 100%; padding: 14px 16px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; font-size: 16px; color: #fff; outline: none;
          box-sizing: border-box; font-family: inherit;
        }
        .modal-field input:focus { border-color: #22c55e; }
        .modal-field input.error { border-color: #ef4444; }
        .modal-error { color: #ef4444; font-size: 13px; margin-top: 6px; }
        .modal-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .modal-prefix { position: absolute; left: 16px; color: #64748b; font-size: 16px; pointer-events: none; z-index: 1; }
        .modal-input-prefix { padding-left: 36px !important; width: 100%; box-sizing: border-box; }
        .modal-hint { color: #64748b; font-size: 12px; margin-top: 6px; }
        .modal-error-box {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 12px; padding: 12px; color: #fca5a5; margin-bottom: 20px;
        }
        .modal-submit {
          width: 100%; padding: 16px; border-radius: 14px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff; font-size: 16px; font-weight: 700; border: none; cursor: pointer;
          box-shadow: 0 8px 24px rgba(34,197,94,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px;
        }
        .modal-submit:disabled { opacity: .5; cursor: not-allowed; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .modal-agreement { font-size: 12px; color: #64748b; text-align: center; }
        .modal-telegram-note {
          margin-top: 24px; padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06); text-align: center;
        }
        .modal-telegram-note p { color: #94a3b8; font-size: 14px; margin-bottom: 16px; }
        .modal-telegram-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 12px;
          border: 1px solid rgba(34,197,94,0.4);
          color: #4ade80; text-decoration: none; font-weight: 600; transition: all .15s;
        }
        .modal-telegram-btn:hover { background: rgba(34,197,94,0.1); border-color: #22c55e; }
        .modal-success { text-align: center; }
        .modal-success-icon { width: 64px; height: 64px; color: #22c55e; margin-bottom: 20px; }
        .modal-success h3 { font-size: 24px; font-weight: 900; color: #fff; margin-bottom: 8px; }
        .modal-success p { color: #94a3b8; margin-bottom: 28px; }
        .modal-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff; border-radius: 12px; text-decoration: none; font-weight: 700;
        }
      `}</style>
    </div>
  );
}
