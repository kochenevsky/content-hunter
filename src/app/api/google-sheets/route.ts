// app/api/google-sheets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

// Данные сервисного аккаунта из переменных окружения
const getServiceAccountCredentials = () => {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
  let clientEmail = process.env.GOOGLE_CLIENT_EMAIL || '';
  
  // Очистка от кавычек
  privateKey = privateKey.replace(/^"|"$/g, '');
  // Замена \n на реальные переносы строк
  privateKey = privateKey.replace(/\\n/g, '\n');
  // Удаление лишних пробелов
  privateKey = privateKey.trim();
  clientEmail = clientEmail.trim();
  
  if (!privateKey || !clientEmail) {
    console.error('Missing credentials:', { 
      hasPrivateKey: !!privateKey, 
      hasClientEmail: !!clientEmail,
      privateKeyLength: privateKey?.length,
      clientEmailValue: clientEmail
    });
    throw new Error('Google service account credentials not configured');
  }
  
  console.log('Credentials loaded:', { 
    clientEmail, 
    privateKeyLength: privateKey.length,
    privateKeyStart: privateKey.substring(0, 30)
  });
  
  return { privateKey, clientEmail };
};

async function checkSheetExists(accessToken: string, spreadsheetId: string, sheetName: string): Promise<boolean> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );
  
  if (!response.ok) return false;
  
  const data = await response.json();
  return data.sheets.some((sheet: any) => sheet.properties.title === sheetName);
}

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
    console.log('Received data:', data);
    
    const SPREADSHEET_ID = '1cOFfSFGpjSvXq4mJxvZ2HaBiGSEK8S-NsBnqdozr7Ks';
    
    // Получаем access token
    const accessToken = await getAccessToken();
    console.log('Access token obtained, length:', accessToken.length);
    
    // Проверяем существование листа
    const sheetName = 'Холодные лиды';
    const sheetExists = await checkSheetExists(accessToken, SPREADSHEET_ID, sheetName);
    console.log(`Sheet "${sheetName}" exists:`, sheetExists);
    
    // Если листа нет, используем первый лист
    const targetSheet = sheetExists ? sheetName : 'Лист1';
    
    // Формируем platform_id
    const platform_id = data.platform_id || `web_${data.phone.replace(/\D/g, '')}_${Date.now()}`;
    
    // Форматируем дату
    const now = new Date();
    const current_date = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    
    // Собираем данные
    const values = [[
      current_date,                          // A: current_date
      platform_id,                           // B: platform_id
      data.client_id || '',                  // C: client_id
      data.telegram ? (data.telegram.startsWith('@') ? data.telegram : `@${data.telegram}`) : '', // D: tg_username
      data.full_name || '',                  // E: full_name
      data.page === '/consult' ? 'consult' : 'price', // F: voronka
      data.utm?.utm_source || '',            // G: utm_source
      data.utm?.utm_medium || '',            // H: utm_medium
      data.utm?.utm_campaign || '',          // I: utm_campaign
      data.utm?.utm_term || '',              // J: utm_term
      data.utm?.utm_content || '',           // K: utm_content
      data.concept || '',                    // L: concept
      'web',                                 // M: rfrvd_pltfrm
      data.phone,                            // N: client.phone
      data.name_from_ml || ''                // O: name_from_ml
    ]];

    console.log('Prepared values:', values);
    console.log('Target sheet:', targetSheet);
    
    // Отправляем в Google Sheets API
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(targetSheet)}!A:O:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    
    console.log('Request URL:', appendUrl);
    
    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    });

    const responseText = await response.text();
    console.log('Google Sheets API response status:', response.status);
    console.log('Google Sheets API response body:', responseText);

    if (!response.ok) {
      throw new Error(`Google Sheets API error (${response.status}): ${responseText}`);
    }

    const result = JSON.parse(responseText);
    
    return NextResponse.json({ 
      success: true, 
      platform_id,
      updatedRange: result.updates?.updatedRange 
    });
    
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Проверяем переменные окружения (без вывода секретов)
    const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;
    const hasClientEmail = !!process.env.GOOGLE_CLIENT_EMAIL;
    
    // Пытаемся получить токен
    let tokenStatus = 'not_tested';
    let sheetStatus = 'not_tested';
    
    if (hasPrivateKey && hasClientEmail) {
      try {
        const accessToken = await getAccessToken();
        tokenStatus = accessToken ? 'success' : 'failed';
        
        if (accessToken) {
          const SPREADSHEET_ID = '1cOFfSFGpjSvXq4mJxvZ2HaBiGSEK8S-NsBnqdozr7Ks';
          const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
          );
          sheetStatus = response.ok ? 'accessible' : `error_${response.status}`;
        }
      } catch (error) {
        tokenStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`;
      }
    }
    
    return NextResponse.json({
      status: 'ok',
      config: {
        hasPrivateKey,
        hasClientEmail,
        tokenStatus,
        sheetStatus,
        spreadsheetId: '1cOFfSFGpjSvXq4mJxvZ2HaBiGSEK8S-NsBnqdozr7Ks'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
