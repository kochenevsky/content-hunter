import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const TO_EMAIL = process.env.CONTACT_EMAIL || 'antonkochenevskiy@gmail.com'
const FROM_EMAIL = process.env.EMAIL_FROM || 'Content Hunter <onboarding@resend.dev>'

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return NextResponse.json(
      { error: 'Сервис отправки писем не настроен. Добавьте RESEND_API_KEY в .env' },
      { status: 503 }
    )
  }

  const resend = new Resend(apiKey)

  try {
    const body = await request.json()
    const { name, company, phone, email, niche, budget, message } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      )
    }

    const nicheLabels: Record<string, string> = {
      ecommerce: 'E-commerce / Маркетплейсы',
      edu: 'Онлайн-школы',
      expert: 'Эксперты / Коучи',
      horeca: 'HoReCa',
      beauty: 'Beauty / Клиники',
      travel: 'Тревел',
      realestate: 'Недвижимость',
      other: 'Другое',
    }
    const budgetLabels: Record<string, string> = {
      '100-200': '100 000 - 200 000 ₽/мес',
      '200-500': '200 000 - 500 000 ₽/мес',
      '500-1000': '500 000 - 1 000 000 ₽/мес',
      '1000+': 'Более 1 000 000 ₽/мес',
    }

    const subject = `Заявка с сайта: ${name}${company ? ` — ${company}` : ''}`
    const html = `
      <h2>Новая заявка с сайта Content Hunter</h2>
      <table style="border-collapse: collapse; max-width: 560px;">
        <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;"><strong>Имя</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;"><strong>Компания</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${escapeHtml(company || '—')}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;"><strong>Телефон</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${escapeHtml(phone)}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;"><strong>Email</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${escapeHtml(email || '—')}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;"><strong>Ниша</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${niche ? escapeHtml(nicheLabels[niche] || niche) : '—'}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5;"><strong>Бюджет</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${budget ? escapeHtml(budgetLabels[budget] || budget) : '—'}</td></tr>
        <tr><td style="padding: 8px 12px; border: 1px solid #e5e5e5; vertical-align: top;"><strong>Сообщение</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${escapeHtml(message || '—')}</td></tr>
      </table>
      <p style="margin-top: 16px; color: #737373; font-size: 12px;">Отправлено с формы контактов contenthunter.ru</p>
    `

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: error.message || 'Не удалось отправить письмо' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'Ошибка при отправке заявки. Попробуйте позже.' },
      { status: 500 }
    )
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />')
}
