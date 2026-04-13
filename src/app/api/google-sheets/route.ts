// app/api/google-sheets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

// Данные сервисного аккаунта из переменных окружения
const getServiceAccountCredentials = () => {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  
  if (!privateKey || !clientEmail) {
    throw new Error('Google service account credentials not configured');
  }
  
  return { privateKey, clientEmail };
};

// Получение access token через JWT
async function getAccessToken(): Promise<string> {
  const { privateKey, clientEmail } = getServiceAccountCredentials();
  
  const client = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const tokens = await client.authorize();
  return tokens.access_token!;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Ваша таблица
    const SPREADSHEET_ID = '1cOFfSFGpjSvXq4mJxvZ2HaBiGSEK8S-NsBnqdozr7Ks';
    
    // Получаем access token
    const accessToken = await getAccessToken();
    
    // Формируем platform_id
    const platform_id = `web_${data.phone.replace(/\D/g, '')}_${Date.now()}`;
    
    // Форматируем дату
    const now = new Date();
    const current_date = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    
    // Собираем данные в том же порядке, что и в Salebot (A-O)
    const values = [[
      current_date,                          // A: current_date
      platform_id,                           // B: platform_id
      '',                                    // C: client_id
      data.telegram ? `@${data.telegram}` : '', // D: tg_username
      '',                                    // E: full_name
      'consult',                             // F: voronka
      data.utm?.utm_source || '',            // G: utm_source
      data.utm?.utm_medium || '',            // H: utm_medium
      data.utm?.utm_campaign || '',          // I: utm_campaign
      data.utm?.utm_term || '',              // J: utm_term
      data.utm?.utm_content || '',           // K: utm_content
      '',                                    // L: concept
      'web',                                 // M: rfrvd_pltfrm
      data.phone,                            // N: client.phone
      ''                                     // O: name_from_ml
    ]];

    // Отправляем в Google Sheets API
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/'Холодные лиды'!A:O:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Sheets API error:', error);
      
      // Если лист "Холодные лиды" не найден, пробуем "Лист1"
      if (error.includes('Unable to parse range')) {
        const fallbackResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1!A:O:append?valueInputOption=RAW`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values })
          }
        );
        
        if (!fallbackResponse.ok) {
          throw new Error(`Google Sheets API error: ${fallbackResponse.status}`);
        }
      } else {
        throw new Error(`Google Sheets API error: ${response.status}`);
      }
    }

    const result = await response.json();
    console.log('Google Sheets success:', result);

    return NextResponse.json({ 
      success: true, 
      platform_id,
      updatedRange: result.updates?.updatedRange 
    });
  } catch (error) {
    console.error('Google Sheets API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal error' 
    }, { status: 500 });
  }
}
