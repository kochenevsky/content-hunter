'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, ExternalLink } from 'lucide-react';

// Компонент с useSearchParams должен быть обёрнут в Suspense
function ConsultForm() {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    phone: '',
    telegram: ''
  });
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [telegramBlocked, setTelegramBlocked] = useState(false);

  // Определяем, заблокирован ли Telegram (РКН)
  useEffect(() => {
    // Проверяем, доступен ли Telegram
    const checkTelegram = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        await fetch('https://t.me/', { 
          mode: 'no-cors',
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        setTelegramBlocked(false);
      } catch {
        setTelegramBlocked(true);
      }
    };
    
    checkTelegram();
  }, []);

  // Собираем UTM-метки при загрузке
  useEffect(() => {
    const utm: Record<string, string> = {};
    const urlParams = new URLSearchParams(window.location.search);
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
      const value = urlParams.get(param);
      if (value) utm[param] = value;
    });
    
    setUtmParams(utm);
  }, [searchParams]);

  // Валидация телефона
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 12;
  };

  // Форматирование телефона при вводе
  const formatPhone = (value: string): string => {
  // Сохраняем плюс если он есть в начале
  const hasPlus = value.startsWith('+');
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length === 0) return hasPlus ? '+' : '';
  
  // Всегда показываем + в начале
  if (cleaned.length <= 1) return `+${cleaned}`;
  if (cleaned.length <= 4) return `+${cleaned.slice(0, 1)} (${cleaned.slice(1)}`;
  if (cleaned.length <= 7) return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
  if (cleaned.length <= 9) return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
};

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    setErrors({});
  };

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith('@')) value = value.slice(1);
    setFormData(prev => ({ ...prev, telegram: value }));
  };

  // Отправка в Telegram
  const sendToTelegram = async (phone: string, telegram: string, page: string) => {
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, telegram, page })
    });
    
    if (!response.ok) {
      throw new Error('Telegram API error');
    }
    
    return await response.json();
  };

  // Отправка в Google Sheets
  const sendToGoogleSheets = async (data: any) => {
    try {
      await fetch('/api/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Google Sheets error:', error);
    }
  };

  // Отправка в AmoCRM
  const sendToAmoCRM = async (data: any) => {
    try {
      await fetch('/api/amocrm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('AmoCRM error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitError(null);
  
  // Очищаем телефон от форматирования для валидации
  const cleanPhone = formData.phone.replace(/\D/g, '');
  
  if (!cleanPhone) {
    setErrors({ phone: 'Номер телефона обязателен' });
    return;
  }
  
  if (cleanPhone.length < 10 || cleanPhone.length > 12) {
    setErrors({ phone: 'Введите корректный номер телефона' });
    return;
  }

  setIsSubmitting(true);

  try {
    // Форматируем телефон для отправки: +79313102888
    const formattedForApi = `+${cleanPhone}`;
    
    const leadData = {
      phone: formattedForApi,  // ← чистый формат для API
      telegram: formData.telegram || null,
      utm: utmParams,
      page: '/consult',
      timestamp: new Date().toISOString()
    };

    // Отправляем во все системы
    await Promise.allSettled([
      sendToTelegram(formattedForApi, formData.telegram, '/consult'),
      sendToGoogleSheets({ ...leadData, phone: formattedForApi }),
      sendToAmoCRM({ ...leadData, phone: formattedForApi })
    ]);

    setIsSubmitted(true);
  } catch (error) {
    console.error('Submit error:', error);
    setSubmitError('Произошла ошибка. Пожалуйста, попробуйте позже.');
  } finally {
    setIsSubmitting(false);
  }
};

  // Формируем ссылку на бота с UTM-метками
  const getBotLinkWithUtm = () => {
    const baseUrl = 'https://sbsite.pro/ru_site_ch_1';
    const url = new URL(baseUrl);
    
    Object.entries(utmParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  };

  if (isSubmitted) {
    return (
      <div className="consult-success">
        <div className="consult-success-icon">
          <CheckCircle2 />
        </div>
        <h2 className="consult-success-title">Заявка отправлена!</h2>
        <p className="consult-success-text">
          Менеджер свяжется с вами в течение часа
        </p>
        <a 
          href={getBotLinkWithUtm()}
          target="_blank"
          rel="noopener noreferrer"
          className="consult-success-btn"
        >
          Перейти в Telegram бот
          <ExternalLink />
        </a>
      </div>
    );
  }

  return (
    <div className="consult-form-wrapper">
      <div className="consult-badge">
        <span className="consult-badge-dot" />
        Content Hunter
      </div>
      
      <h1 className="consult-title">
        Получить<br />
        <span>консультацию</span>
      </h1>
      
      <p className="consult-subtitle">
        Оставьте заявку, и наш менеджер свяжется с вами в ближайшее время
      </p>

      <form onSubmit={handleSubmit} className="consult-form">
        <div className="consult-form-group">
          <label className="consult-label">
            Номер телефона <span className="consult-required">*</span>
          </label>
          <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={formData.phone}
            onChange={handlePhoneChange}
            disabled={isSubmitting}
            className={`consult-input ${errors.phone ? 'consult-input-error' : ''}`}
          />
          {errors.phone && (
            <p className="consult-error">{errors.phone}</p>
          )}
        </div>

        <div className="consult-form-group">
          <label className="consult-label">
            Telegram username
          </label>
          <div className="consult-input-wrapper">
            <span className="consult-input-prefix">@</span>
            <input
              type="text"
              placeholder="username"
              value={formData.telegram}
              onChange={handleTelegramChange}
              disabled={isSubmitting}
              className="consult-input consult-input-with-prefix"
            />
          </div>
          <p className="consult-hint">Необязательно</p>
        </div>

        {submitError && (
          <div className="consult-error-box">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="consult-submit-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="consult-spinner" />
              Отправка...
            </>
          ) : (
            'Отправить заявку'
          )}
        </button>

        <p className="consult-agreement">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
        </p>
      </form>

      {/* Блок про Telegram */}
      <div className="consult-telegram-note">
        <p className="consult-telegram-text">
          {telegramBlocked ? (
            <>Мы не смогли открыть Telegram на вашем устройстве, поэтому просим оставить контакт. Мы проведем экскурсию по платформе и ответим на все вопросы.</>
          ) : (
            <>Если у вас работает Telegram, перейдите в наш бот по кнопке ниже.</>
          )}
        </p>
        <a 
          href={getBotLinkWithUtm()}
          target="_blank"
          rel="noopener noreferrer"
          className="consult-telegram-btn"
        >
          {telegramBlocked ? 'Оставить заявку выше' : 'Открыть бот в Telegram'}
          <ExternalLink />
        </a>
      </div>
    </div>
  );
}

// Основной компонент страницы
export default function ConsultPage() {
  return (
    <>
      <style>{`
        /* Сброс */
        html, body { 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden; 
        }

        .consult-root {
          background: #0b1220;
          min-height: 100vh;
          font-family: -apple-system, 'SF Pro Display', 'Inter', system-ui, sans-serif;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          box-sizing: border-box;
        }

        .consult-container {
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
        }

        /* Бейдж */
        .consult-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          color: #4ade80;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .consult-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          display: inline-block;
        }

        /* Заголовок */
        .consult-title {
          font-size: clamp(32px, 8vw, 48px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
          color: #fff;
        }

        .consult-title span {
          color: #4ade80;
        }

        .consult-subtitle {
          font-size: clamp(15px, 3vw, 18px);
          color: #94a3b8;
          line-height: 1.65;
          margin-bottom: 32px;
        }

        /* Форма */
        .consult-form-wrapper {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 32px 24px;
          margin-bottom: 24px;
        }

        .consult-form-group {
          margin-bottom: 24px;
        }

        .consult-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #cbd5e1;
          margin-bottom: 8px;
        }

        .consult-required {
          color: #ef4444;
        }

        .consult-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          font-size: 16px;
          color: #fff;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }

        .consult-input:focus {
          border-color: #22c55e;
        }

        .consult-input::placeholder {
          color: #64748b;
        }

        .consult-input-error {
          border-color: #ef4444 !important;
        }

        .consult-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .consult-input-prefix {
          position: absolute;
          left: 16px;
          color: #64748b;
          font-size: 16px;
        }

        .consult-input-with-prefix {
          padding-left: 36px;
        }

        .consult-error {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }

        .consult-hint {
          color: #64748b;
          font-size: 12px;
          margin-top: 6px;
        }

        .consult-error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fca5a5;
          font-size: 14px;
          margin-bottom: 20px;
        }

        /* Кнопка отправки */
        .consult-submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
          transition: opacity 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .consult-submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .consult-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .consult-spinner {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .consult-agreement {
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }

        /* Блок про Telegram */
        .consult-telegram-note {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
        }

        .consult-telegram-text {
          font-size: 15px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .consult-telegram-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          background: transparent;
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #4ade80;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s;
        }

        .consult-telegram-btn:hover {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
        }

        .consult-telegram-btn svg {
          width: 18px;
          height: 18px;
        }

        /* Успешная отправка */
        .consult-success {
          text-align: center;
          padding: 48px 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }

        .consult-success-icon {
          width: 80px;
          height: 80px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .consult-success-icon svg {
          width: 48px;
          height: 48px;
          color: #22c55e;
        }

        .consult-success-title {
          font-size: clamp(24px, 5vw, 36px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
        }

        .consult-success-text {
          font-size: 16px;
          color: #94a3b8;
          margin-bottom: 32px;
        }

        .consult-success-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          border-radius: 14px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
          transition: opacity 0.15s;
        }

        .consult-success-btn:hover {
          opacity: 0.9;
        }

        .consult-success-btn svg {
          width: 20px;
          height: 20px;
        }

        /* Мобильная адаптация */
        @media (max-width: 480px) {
          .consult-root {
            padding: 16px 12px;
          }
          
          .consult-form-wrapper {
            padding: 24px 16px;
          }
          
          .consult-telegram-note {
            padding: 20px 16px;
          }
        }
      `}</style>

      <div className="consult-root">
        <div className="consult-container">
          <Suspense fallback={
            <div className="consult-form-wrapper" style={{ textAlign: 'center', color: '#94a3b8' }}>
              Загрузка...
            </div>
          }>
            <ConsultForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
