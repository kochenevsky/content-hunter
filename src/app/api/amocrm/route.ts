// app/api/amocrm/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface AmoCRMTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

let tokenCache: AmoCRMTokens | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expires_at > Date.now()) {
    return tokenCache.access_token;
  }

  const clientId = process.env.AMOCRM_CLIENT_ID;
  const clientSecret = process.env.AMOCRM_CLIENT_SECRET;
  const refreshToken = process.env.AMOCRM_REFRESH_TOKEN;
  const subdomain = process.env.AMOCRM_SUBDOMAIN;

  if (!clientId || !clientSecret || !refreshToken || !subdomain) {
    throw new Error('AmoCRM credentials not configured');
  }

  const response = await fetch(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      redirect_uri: process.env.AMOCRM_REDIRECT_URI || 'https://contenthunter.ru'
    })
  });

  if (!response.ok) {
    throw new Error(`AmoCRM auth error: ${response.status}`);
  }

  const tokens = await response.json();
  
  tokenCache = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in * 1000) - 60000
  };

  console.log('New refresh token (сохраните в .env):', tokens.refresh_token);

  return tokens.access_token;
}

// Чередование менеджеров (как в вашем коде)
let lastManagerId = 13351410;
function getNextManagerId(): number {
  lastManagerId = lastManagerId === 13351410 ? 13351414 : 13351410;
  return lastManagerId;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const subdomain = process.env.AMOCRM_SUBDOMAIN;

    if (!subdomain) {
      console.warn('AmoCRM not configured');
      return NextResponse.json({ success: false, error: 'Not configured' }, { status: 500 });
    }

    const accessToken = await getAccessToken();
    
    // Генерируем platform_id
    const platform_id = `web_${data.phone.replace(/\D/g, '')}_${Date.now()}`;
    
    // Получаем следующего менеджера
    const manager_id = getNextManagerId();
    
    // Подготавливаем имя контакта
    const contactName = data.telegram 
      ? `@${data.telegram}` 
      : `Клиент ${data.phone}`;

    // Формируем тело запроса как в Salebot
    const leadData = [{
      name: `Новый лид ${platform_id}`,
      status_id: 82428286,                    // Ваш статус
      pipeline_id: 10433002,                   // Ваша воронка
      responsible_user_id: manager_id,
      tags_to_add: [{
        name: "бот"
      }],
      custom_fields_values: [
        {
          field_code: "UTM_SOURCE",
          values: [{ value: data.utm?.utm_source || '' }]
        },
        {
          field_code: "UTM_MEDIUM",
          values: [{ value: data.utm?.utm_medium || '' }]
        },
        {
          field_code: "UTM_CAMPAIGN",
          values: [{ value: data.utm?.utm_campaign || '' }]
        },
        {
          field_code: "UTM_TERM",
          values: [{ value: data.utm?.utm_term || '' }]
        },
        {
          field_code: "UTM_CONTENT",
          values: [{ value: data.utm?.utm_content || '' }]
        }
      ],
      _embedded: {
        contacts: [{
          first_name: contactName,
          custom_fields_values: [
            {
              field_code: "PHONE",
              values: [{
                enum_code: "WORK",
                value: data.phone
              }]
            },
            {
              field_id: 1065511,              // Ваше поле для полного имени
              values: [{
                value: contactName
              }]
            },
            {
              field_id: 1065305,              // Ваше поле для Telegram
              values: [{
                value: data.telegram ? `@${data.telegram}` : ''
              }]
            },
            {
              field_id: 1065303,              // Ваше поле для platform_id
              values: [{
                value: platform_id
              }]
            }
          ]
        }]
      }
    }];

    // Отправляем в AmoCRM
    const response = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/complex`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AmoCRM error:', errorText);
      throw new Error(`AmoCRM error: ${response.status}`);
    }

    const result = await response.json();
    console.log('AmoCRM success:', result);

    return NextResponse.json({ 
      success: true, 
      platform_id,
      manager_id 
    });
  } catch (error) {
    console.error('AmoCRM API error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
