// app/api/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Telegram бот - ключ прямо в коде
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Замените на ваш токен
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE'; // Замените на ваш chat ID

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received lead for Telegram:', data);
    
    const { phone, telegram, page, utm, timestamp } = data;
    
    // Формируем красивое сообщение
    const message = `
🆕 **Новая заявка с сайта!**

📞 **Телефон:** ${phone}
💬 **Telegram:** ${telegram ? `@${telegram}` : 'не указан'}
📄 **Страница:** ${page || 'не указана'}
⏰ **Время:** ${new Date(timestamp || Date.now()).toLocaleString('ru-RU')}

${utm?.utm_source ? `📊 **UTM:** ${utm.utm_source} ${utm.utm_medium ? `/${utm.utm_medium}` : ''}` : ''}
    `.trim();
    
    // Отправляем в Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', result);
      throw new Error(`Telegram API error: ${result.description}`);
    }
    
    console.log('Telegram sent successfully:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Заявка отправлена в Telegram' 
    });
    
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal error' 
    }, { status: 500 });
  }
}

// GET для проверки работоспособности
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'telegram-bot',
    configured: TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE'
  });
}
