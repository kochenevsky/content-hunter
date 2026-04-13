// app/api/amocrm/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Ваши константы из Salebot
const AMOCRM_CONFIG = {
  STATUS_ID: 82428286,        // status_id из вашего кода
  PIPELINE_ID: 10433002,       // pipeline_id из вашего кода
  MANAGER_1: 13351410,         // первый менеджер
  MANAGER_2: 13351414,         // второй менеджер
  // ID кастомных полей из вашего кода
  FIELD_FULL_NAME: 1065511,    // поле для полного имени
  FIELD_TELEGRAM: 1065305,     // поле для Telegram
  FIELD_PLATFORM_ID: 1065303   // поле для platform_id
};

// Чередование менеджеров (как в Salebot)
let lastManagerId = AMOCRM_CONFIG.MANAGER_1;
function getNextManagerId(): number {
  lastManagerId = lastManagerId === AMOCRM_CONFIG.MANAGER_1 
    ? AMOCRM_CONFIG.MANAGER_2 
    : AMOCRM_CONFIG.MANAGER_1;
  return lastManagerId;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Получаем AmoToken из переменных окружения
    const amoToken = process.env.AMO_TOKEN;
    const subdomain = process.env.AMOCRM_SUBDOMAIN;
    
    if (!amoToken || !subdomain) {
      console.warn('AmoCRM not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'AmoCRM credentials not configured' 
      }, { status: 500 });
    }
    
    // Генерируем platform_id
    const platform_id = `web_${data.phone.replace(/\D/g, '')}_${Date.now()}`;
    
    // Получаем следующего менеджера
    const manager_id = getNextManagerId();
    
    // Подготавливаем имя контакта
    const contactName = data.telegram 
      ? `@${data.telegram}` 
      : `Клиент ${data.phone}`;
    
    // Формируем тело запроса точно как в Salebot
    const leadData = [{
      name: `Новый лид ${platform_id}`,
      status_id: AMOCRM_CONFIG.STATUS_ID,
      pipeline_id: AMOCRM_CONFIG.PIPELINE_ID,
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
              field_id: AMOCRM_CONFIG.FIELD_FULL_NAME,
              values: [{
                value: contactName
              }]
            },
            {
              field_id: AMOCRM_CONFIG.FIELD_TELEGRAM,
              values: [{
                value: data.telegram ? `@${data.telegram}` : ''
              }]
            },
            {
              field_id: AMOCRM_CONFIG.FIELD_PLATFORM_ID,
              values: [{
                value: platform_id
              }]
            }
          ]
        }]
      }
    }];

    console.log('Sending to AmoCRM:', JSON.stringify(leadData, null, 2));

    // Отправляем в AmoCRM с использованием AmoToken
    const response = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/complex`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${amoToken}`,
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
    console.log('AmoCRM success:', JSON.stringify(result, null, 2));

    return NextResponse.json({ 
      success: true, 
      platform_id,
      manager_id,
      lead_id: result._embedded?.leads?.[0]?.id 
    });
    
  } catch (error) {
    console.error('AmoCRM API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal error' 
    }, { status: 500 });
  }
}
