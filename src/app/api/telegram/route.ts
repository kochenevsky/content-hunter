// app/api/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Telegram бот - вставьте ваши реальные данные
const TELEGRAM_BOT_TOKEN = '8620593971:AAGzMAqFNC2uHTvwnYjy6VViSdyVi7xXVDE';
const TELEGRAM_CHAT_ID = '8333494416';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { phone, telegram, page, utm, timestamp } = data;
    
    // Формируем красивое сообщение
    let message = `🆕 **Новая заявка с сайта!**\n\n`;
    message += `📞 **Телефон:** ${phone}\n`;
    message += `💬 **Telegram:** ${telegram ? `@${telegram}` : 'не указан'}\n`;
    message += `📄 **Страница:** ${page || '/consult'}\n`;
    message += `⏰ **Время:** ${new Date(timestamp || Date.now()).toLocaleString('ru-RU')}\n`;
    
    if (utm && Object.keys(utm).length > 0) {
      message += `\n📊 **UTM-метки:**\n`;
      if (utm.utm_source) message += `• source: ${utm.utm_source}\n`;
      if (utm.utm_medium) message += `• medium: ${utm.utm_medium}\n`;
      if (utm.utm_campaign) message += `• campaign: ${utm.utm_campaign}\n`;
    }
    
    // Отправляем в Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', result);
      return NextResponse.json(
        { success: false, error: result.description },
        { status: 500 }
      );
    }
    
    console.log('Telegram sent successfully');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in telegram API:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// GET функция для проверки статуса
export async function GET() {
  const isConfigured = TELEGRAM_BOT_TOKEN !== '' && 
                       TELEGRAM_CHAT_ID !== '' && 
                       TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID_HERE';
  
  return NextResponse.json({
    status: 'ok',
    service: 'telegram-bot',
    configured: isConfigured,
    botTokenSet: !!TELEGRAM_BOT_TOKEN,
    chatIdSet: !!TELEGRAM_CHAT_ID
  });
}
