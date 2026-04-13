// app/api/google-sheets/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Ваша таблица
    const SPREADSHEET_ID = '1cOFfSFGpjSvXq4mJxvZ2HaBiGSEK8S-NsBnqdozr7Ks';
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    
    if (!API_KEY) {
      console.warn('Google Sheets API key not configured');
      return NextResponse.json({ success: false, error: 'Not configured' }, { status: 500 });
    }

    // Формируем platform_id (например, из телефона + timestamp)
    const platform_id = `web_${data.phone.replace(/\D/g, '')}_${Date.now()}`;
    
    // Форматируем дату как в Salebot
    const now = new Date();
    const current_date = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    
    // Собираем данные в том же порядке, что и в Salebot (A-O)
    const rowData = {
      values: [[
        current_date,                          // A: current_date
        platform_id,                           // B: platform_id
        '',                                    // C: client_id (пусто, можно добавить при необходимости)
        data.telegram ? `@${data.telegram}` : '', // D: tg_username
        '',                                    // E: full_name (пусто, т.к. не спрашиваем)
        'consult',                             // F: voronka
        data.utm?.utm_source || '',            // G: utm_source
        data.utm?.utm_medium || '',            // H: utm_medium
        data.utm?.utm_campaign || '',          // I: utm_campaign
        data.utm?.utm_term || '',              // J: utm_term
        data.utm?.utm_content || '',           // K: utm_content
        '',                                    // L: concept (пусто)
        'web',                                 // M: rfrvd_pltfrm (платформа)
        data.phone,                            // N: client.phone
        ''                                     // O: name_from_ml (пусто)
      ]]
    };

    // Отправляем в Google Sheets API на лист "Холодные лиды"
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/'Холодные лиды'!A:O:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Sheets API error:', error);
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    return NextResponse.json({ success: true, platform_id });
  } catch (error) {
    console.error('Google Sheets API error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
