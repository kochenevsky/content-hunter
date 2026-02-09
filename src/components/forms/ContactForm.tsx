'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
  company: z.string().optional(),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
  niche: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

const niches = [
  { value: '', label: 'Выберите нишу' },
  { value: 'ecommerce', label: 'E-commerce / Маркетплейсы' },
  { value: 'edu', label: 'Онлайн-школы' },
  { value: 'expert', label: 'Эксперты / Коучи' },
  { value: 'horeca', label: 'HoReCa' },
  { value: 'beauty', label: 'Beauty / Клиники' },
  { value: 'travel', label: 'Тревел' },
  { value: 'realestate', label: 'Недвижимость' },
  { value: 'other', label: 'Другое' },
]

const budgets = [
  { value: '', label: 'Бюджет на маркетинг' },
  { value: '100-200', label: '100 000 - 200 000 ₽/мес' },
  { value: '200-500', label: '200 000 - 500 000 ₽/мес' },
  { value: '500-1000', label: '500 000 - 1 000 000 ₽/мес' },
  { value: '1000+', label: 'Более 1 000 000 ₽/мес' },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // TODO: Интеграция с AmoCRM или отправка в Telegram
      console.log('Form data:', data)
      
      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Заявка отправлена!
        </h3>
        <p className="text-green-700 mb-6">
          Мы свяжемся с вами в течение 2 часов в рабочее время.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
          Имя *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder="Как вас зовут?"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${
            errors.name ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
          Компания
        </label>
        <input
          {...register('company')}
          type="text"
          id="company"
          placeholder="Название компании или проекта"
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
          Телефон *
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          placeholder="+7 (___) ___-__-__"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${
            errors.phone ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="email@example.com"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${
            errors.email ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Niche & Budget */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-neutral-700 mb-2">
            Ниша
          </label>
          <select
            {...register('niche')}
            id="niche"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow bg-white"
          >
            {niches.map((niche) => (
              <option key={niche.value} value={niche.value}>
                {niche.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-neutral-700 mb-2">
            Бюджет
          </label>
          <select
            {...register('budget')}
            id="budget"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow bg-white"
          >
            {budgets.map((budget) => (
              <option key={budget.value} value={budget.value}>
                {budget.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
          Сообщение
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={4}
          placeholder="Расскажите о вашем проекте и задачах..."
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-none"
        />
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            Отправить заявку
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      <p className="text-sm text-neutral-500 text-center">
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  )
}
