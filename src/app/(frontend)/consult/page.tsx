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

  // Отправка в Telegram (исправленная версия)
  const sendToTelegram = async (phone: string, telegram: string, page: string) => {
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, telegram, page })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Telegram error:', errorText);
        throw new Error(errorText);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Telegram API error:', error);
      throw error;
    }
  };

  // Отправка формы (исправленная версия)
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
      // Отправляем данные в Telegram
      await sendToTelegram(
        formData.phone,
        formData.telegram,
        '/consult'
      );
      
      // Если успешно - показываем сообщение
      setIsSubmitted(true);
      
      // Очищаем форму
      setFormData({ phone: '', telegram: '' });
      
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Не удалось отправить заявку. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl mb-2">Заявка принята!</CardTitle>
          <CardDescription>
            Спасибо за обращение. Мы свяжемся с вами в ближайшее время.
          </CardDescription>
          <Button 
            className="mt-6"
            onClick={() => setIsSubmitted(false)}
          >
            Отправить ещё
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Получить консультацию</CardTitle>
        <CardDescription>
          Оставьте свои контакты, и мы свяжемся с вами
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={cn(errors.phone && "border-red-500")}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <Input
              type="text"
              placeholder="Telegram (опционально)"
              value={formData.telegram}
              onChange={handleTelegramChange}
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-xs mt-1">
              Без @, просто username
            </p>
          </div>
          
          {submitError && (
            <p className="text-red-500 text-sm">{submitError}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              'Отправить'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Основной компонент страницы
export default function ConsultPage() {
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Suspense fallback={
        <Card>
          <CardContent className="py-12 text-center">
            Загрузка...
          </CardContent>
        </Card>
      }>
        <ConsultForm />
      </Suspense>
    </div>
  );
}
