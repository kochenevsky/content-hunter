// app/api/amocrm/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Конфигурация amoCRM
const AMOCRM_CONFIG = {
  STATUS_ID: 82428286,
  PIPELINE_ID: 10433002,
  MANAGER_1: 13351410,
  MANAGER_2: 13351414,
  FIELD_FULL_NAME: 1065511,
  FIELD_TELEGRAM: 1065305,
  FIELD_PLATFORM_ID: 1065303
};

// Жёстко прописанные креды
const HARDCODED_CREDENTIALS = {
  AMO_TOKEN: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU4OWE4MmFmODNmMmFjM2UxZjcwMTIxN2ZkYzkzZjA2MjRlNzYyY2MwM2RlMjhhMTcxN2VhMDU0ZTU5YzJjMmMzMTgyZDVjOGU4M2YxYTg2In0.eyJhdWQiOiJlZjExMTRiMS1mZWIxLTQxNWUtOWFkZi05ODkwMmNmZGIxZjUiLCJqdGkiOiI1ODlhODJhZjgzZjJhYzNlMWY3MDEyMTdmZGM5M2YwNjI0ZTc2MmNjMDNkZTI4YTE3MTdlYTA1NGU1OWMyYzJjMzE4MmQ1YzhlODNmMWE4NiIsImlhdCI6MTc2Njc0MDA5OSwibmJmIjoxNzY2NzQwMDk5LCJleHAiOjE5MjQ0NzM2MDAsInN1YiI6IjEzMzUxMDIyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyODI4NTU4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNDJhYWJjOWEtMDFlOC00OGIwLTgwMTctN2Q5ZWQ0Nzg4YmNjIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.RX-o_CIvtnxQTazQTSU7tgiTXSGgVcHiiLuXu3wJKDVjAZsME8PsnPEHd9ULP4mZPI1El8WoTN1U7QszRuga1tj-7EfJMS9m6PqJIRKL-uGw2MXo62PkVby9tFnxyViu7Jd4uFmbjVSbpsW3kdGPDuqQezL1F0DohBPRXLzISRJRxqO_2uXyZZeQJkWaUQz5h6aO0WCLw8WeuUOgU3oLOMnpmmjzW_DtvKEeouEKEuygyJPxMhR5_KOhWkpD1wZgo0VXj5zMQxKReMVcojDqUZFovuSxhOa4RByIqc_wPsIUAaCa0cRr9KzqO7J-WfeWoLS_Dyaj-ngsmROnq3a43A",
  AMOCRM_SUBDOMAIN: "contenthunter"
};

function getNextManagerId(): number {
  const managers = [AMOCRM_CONFIG.MANAGER_1, AMOCRM_CONFIG.MANAGER_2];
  const index = Math.floor(Date.now() / 1000) % 2;
  return managers[index];
}

export async function POST(request: NextRequest) {
  let data: any = { phone: '' };
  
  try {
    data = await request.json();
    
    const isTestMode = data.test === true;
    const amoToken = process.env.AMO_TOKEN || HARDCODED_CREDENTIALS.AMO_TOKEN;
    const subdomain = process.env.AMOCRM_SUBDOMAIN || HARDCODED_CREDENTIALS.AMOCRM_SUBDOMAIN;
    const tokenSource = process.env.AMO_TOKEN ? 'env' : 'hardcoded';
    
    if (amoToken.includes('ЗАМЕНИ') || amoToken.includes('твой_токен')) {
      if (isTestMode) {
        return NextResponse.json({
          success: true,
          test: true,
          error: 'Токен не настроен',
          platform_id: `web_${data.phone?.replace(/\D/g, '') || '000'}_${Date.now()}`,
          manager_id: getNextManagerId(),
        });
      }
      return NextResponse.json({ success: false, error: 'AmoCRM token not configured' }, { status: 500 });
    }
    
    const platform_id = `web_${data.phone?.replace(/\D/g, '') || '000'}_${Date.now()}`;
    const manager_id = getNextManagerId();
    const contactName = (data.telegram ? `@${data.telegram}` : `Клиент ${data.phone || 'неизвестный'}`).slice(0, 255);
    
    // UTM поля
    const utmCustomFields: any[] = [];
    if (data.utm) {
      const utmMapping = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      utmMapping.forEach(field => {
        const value = data.utm?.[field];
        if (value) {
          utmCustomFields.push({
            field_code: field.toUpperCase(),
            values: [{ value }]
          });
        }
      });
    }
    
    // Формируем данные для amoCRM v4 (ИСПРАВЛЕННЫЙ ФОРМАТ)
    const leadData = [{
      name: `New lead ${platform_id}`,
      status_id: AMOCRM_CONFIG.STATUS_ID,
      pipeline_id: AMOCRM_CONFIG.PIPELINE_ID,
      responsible_user_id: manager_id,
      _embedded: {
        tags: [{ name: "bot" }],  // ← ИСПРАВЛЕНО: теги внутри _embedded
        contacts: [{
          first_name: contactName,
          custom_fields_values: [
            {
              field_code: "PHONE",
              values: [{ enum_code: "WORK", value: data.phone, is_main: true }]
            },
            {
              field_id: AMOCRM_CONFIG.FIELD_FULL_NAME,
              values: [{ value: contactName }]
            },
            {
              field_id: AMOCRM_CONFIG.FIELD_TELEGRAM,
              values: [{ value: data.telegram ? `@${data.telegram}` : '' }]
            },
            {
              field_id: AMOCRM_CONFIG.FIELD_PLATFORM_ID,
              values: [{ value: platform_id }]
            }
          ]
        }]
      },
      custom_fields_values: utmCustomFields
    }];
    
    // ТЕСТОВЫЙ РЕЖИМ
    if (isTestMode) {
      console.log('🧪 [TEST] Data:', JSON.stringify(leadData, null, 2));
      
      // Пробуем реальную отправку даже в тесте
      if (amoToken && subdomain) {
        try {
          const testResponse = await fetch(
            `https://${subdomain}.amocrm.ru/api/v4/leads/complex`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${amoToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(leadData)
            }
          );
          const testResult = await testResponse.json();
          console.log('🧪 [TEST] Response:', testResponse.status, JSON.stringify(testResult).substring(0, 500));
        } catch (e) {
          console.log('🧪 [TEST] Request failed:', e);
        }
      }
      
      return NextResponse.json({
        success: true,
        test: true,
        platform_id,
        manager_id,
        debug: {
          request: {
            input: data,
            leadData,
            config: { subdomain, tokenExists: !!amoToken, tokenSource }
          }
        }
      });
    }
    
    // ПРОДАКШН ОТПРАВКА
    console.log('📤 Sending lead:', JSON.stringify(leadData, null, 2));
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(
      `https://${subdomain}.amocrm.ru/api/v4/leads/complex`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${amoToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData),
        signal: controller.signal
      }
    );
    clearTimeout(timeout);
    
    const responseText = await response.text();
    console.log('📥 AmoCRM response status:', response.status);
    console.log('📥 AmoCRM response body:', responseText);
    
    if (!response.ok) {
      console.error('❌ AmoCRM error:', responseText);
      
      let errorMessage = `AmoCRM error: ${response.status}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage += ` - ${JSON.stringify(errorJson).substring(0, 300)}`;
      } catch {}
      
      throw new Error(errorMessage);
    }
    
    const result = JSON.parse(responseText);
    console.log('✅ Lead created:', result._embedded?.leads?.[0]?.id);
    
    return NextResponse.json({
      success: true,
      platform_id,
      manager_id,
      lead_id: result._embedded?.leads?.[0]?.id
    });
    
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testMode = searchParams.get('test') === 'true';
  
  const amoToken = process.env.AMO_TOKEN || HARDCODED_CREDENTIALS.AMO_TOKEN;
  const subdomain = process.env.AMOCRM_SUBDOMAIN || HARDCODED_CREDENTIALS.AMOCRM_SUBDOMAIN;
  
  return NextResponse.json({
    status: 'ok',
    test: testMode,
    config: testMode ? {
      subdomain,
      tokenConfigured: !amoToken.includes('ЗАМЕНИ'),
      managerRotation: {
        manager1: AMOCRM_CONFIG.MANAGER_1,
        manager2: AMOCRM_CONFIG.MANAGER_2,
        current: getNextManagerId()
      }
    } : undefined
  });
}
