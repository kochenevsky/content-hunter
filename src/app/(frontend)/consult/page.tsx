// app/(frontend)/consult/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    
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
    // Убираем @ в начале если есть
    if (value.startsWith('@')) value = value.slice(1);
    setFormData(prev => ({ ...prev, telegram: value }));
  };

  // Отправка в Google Sheets
  const sendToGoogleSheets = async (data: any) => {
    try {
      const response = await fetch('/api/google-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        console.error('Google Sheets error:', await response.text());
      }
    } catch (error) {
      console.error('Google Sheets API error:', error);
    }
  };

  // Отправка в AmoCRM
  const sendToAmoCRM = async (data: any) => {
    try {
      const response = await fetch('/api/amocrm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        console.error('AmoCRM error:', await response.text());
      }
    } catch (error) {
      console.error('AmoCRM API error:', error);
    }
  };

  // app/(frontend)/consult/page.tsx (только изменённая часть отправки)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitError(null);
  
  if (!formData.phone) {
    setErrors({ phone: 'Номер телефона обязателен' });
    return;
  }
  
  if (!validatePhone(formData.phone)) {
    setErrors({ phone: 'Введите корректный номер телефона' });
    return;
  }

  setIsSubmitting(true);

  try {
    // Генерируем platform_id (будет одинаковым для обоих систем)
    const platform_id = `web_${formData.phone.replace(/\D/g, '')}_${Date.now()}`;
    
    const leadData = {
      phone: formData.phone,
      telegram: formData.telegram || null,
      platform_id: platform_id,
      utm: {
        ...utmParams,
        // Добавляем platform_id как дополнительный параметр
        platform: platform_id
      },
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Отправляем параллельно
    await Promise.allSettled([
      sendToGoogleSheets(leadData),
      sendToAmoCRM(leadData)
    ]);

    setIsSubmitted(true);
  } catch (error) {
    console.error('Submit error:', error);
    setSubmitError('Произошла ошибка. Пожалуйста, попробуйте позже.');
  } finally {
    setIsSubmitting(false);
  }
};

// Обновлённая ссылка на бота (добавляем platform_id в UTM)
const getBotLinkWithUtm = () => {
  const baseUrl = 'https://sbsite.pro/ru_site_ch_1';
  const url = new URL(baseUrl);
  
  // Добавляем все UTM-метки
  Object.entries(utmParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  // Добавляем platform_id для отслеживания
  const platform_id = `web_${formData.phone.replace(/\D/g, '')}_${Date.now()}`;
  url.searchParams.append('utm_content', platform_id);
  
  return url.toString();
};

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Заявка отправлена!
            </CardTitle>
            <CardDescription className="text-base sm:text-lg mt-2">
              Менеджер свяжется с вами в течение часа
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              А пока можете получить экскурсию в нашем Telegram-боте:
            </p>
            <a 
  href={getBotLinkWithUtm()} 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-md font-medium transition-colors"
>
  Получить экскурсию
  <ExternalLink className="w-5 h-5" />
</a>
            <p className="text-sm text-gray-500">
              Ссылка откроется в Telegram
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Получить консультацию
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Оставьте заявку, и наш менеджер свяжется с вами в ближайшее время
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Телефон */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                  className={cn(
                    "h-12 text-base",
                    errors.phone && "border-red-500 focus:border-red-500"
                  )}
                  autoFocus
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Telegram */}
              <div className="space-y-2">
                <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
                  Telegram username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    @
                  </span>
                  <Input
                    id="telegram"
                    type="text"
                    placeholder="username"
                    value={formData.telegram}
                    onChange={handleTelegramChange}
                    disabled={isSubmitting}
                    className="h-12 text-base pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">Необязательно</p>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{submitError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  'Отправить заявку'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Основной компонент с Suspense обёрткой
export default function ConsultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <ConsultForm />
    </Suspense>
  );
}
