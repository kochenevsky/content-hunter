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

// Жёстко прописанные креды (замени на свои реальные значения)
const HARDCODED_CREDENTIALS = {
  AMO_TOKEN: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU4OWE4MmFmODNmMmFjM2UxZjcwMTIxN2ZkYzkzZjA2MjRlNzYyY2MwM2RlMjhhMTcxN2VhMDU0ZTU5YzJjMmMzMTgyZDVjOGU4M2YxYTg2In0.eyJhdWQiOiJlZjExMTRiMS1mZWIxLTQxNWUtOWFkZi05ODkwMmNmZGIxZjUiLCJqdGkiOiI1ODlhODJhZjgzZjJhYzNlMWY3MDEyMTdmZGM5M2YwNjI0ZTc2MmNjMDNkZTI4YTE3MTdlYTA1NGU1OWMyYzJjMzE4MmQ1YzhlODNmMWE4NiIsImlhdCI6MTc2Njc0MDA5OSwibmJmIjoxNzY2NzQwMDk5LCJleHAiOjE5MjQ0NzM2MDAsInN1YiI6IjEzMzUxMDIyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyODI4NTU4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNDJhYWJjOWEtMDFlOC00OGIwLTgwMTctN2Q5ZWQ0Nzg4YmNjIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.RX-o_CIvtnxQTazQTSU7tgiTXSGgVcHiiLuXu3wJKDVjAZsME8PsnPEHd9ULP4mZPI1El8WoTN1U7QszRuga1tj-7EfJMS9m6PqJIRKL-uGw2MXo62PkVby9tFnxyViu7Jd4uFmbjVSbpsW3kdGPDuqQezL1F0DohBPRXLzISRJRxqO_2uXyZZeQJkWaUQz5h6aO0WCLw8WeuUOgU3oLOMnpmmjzW_DtvKEeouEKEuygyJPxMhR5_KOhWkpD1wZgo0VXj5zMQxKReMVcojDqUZFovuSxhOa4RByIqc_wPsIUAaCa0cRr9KzqO7J-WfeWoLS_Dyaj-ngsmROnq3a43A",
  AMOCRM_SUBDOMAIN: "https://contenthunter.amocrm.ru/"
};

// Чередование менеджеров на основе времени (для serverless)
function getNextManagerId(): number {
  const managers = [AMOCRM_CONFIG.MANAGER_1, AMOCRM_CONFIG.MANAGER_2];
  const index = Math.floor(Date.now() / 1000) % 2;
  return managers[index];
}

// Интерфейс для UTM-полей
interface UTMField {
  field_code: string;
  values: Array<{ value: string }>;
}

// Интерфейс для контактных полей
interface ContactField {
  field_code?: string;
  field_id?: number;
  values: Array<{
    value: string;
    enum_code?: string;
    is_main?: boolean;
  }>;
}

// Интерфейс для входящих данных
interface LeadRequest {
  phone: string;
  telegram?: string;
  utm?: Record<string, string>;
  page?: string;
  timestamp?: string;
  test?: boolean;
}

// Интерфейс для ответа
interface LeadResponse {
  success: boolean;
  error?: string;
  test?: boolean;
  platform_id?: string;
  manager_id?: number;
  lead_id?: number;
  debug?: {
    request: {
      input: LeadRequest | Record<string, never>;
      leadData: any[];
      config: {
        subdomain: string;
        tokenExists: boolean;
        tokenSource: string;
      };
    };
    response?: any;
    error?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<LeadResponse>> {
  // Объявляем data вне try/catch для доступа в catch
  let data: LeadRequest = { phone: '' };
  
  try {
    data = await request.json();
    
    // Проверяем тестовый режим
    const isTestMode = data.test === true;
    
    if (isTestMode) {
      console.log('🧪 [AMOCRM TEST MODE] Starting test callback');
    }
    
    // Получаем конфигурацию: сначала process.env, потом жёстко прописанные
    const amoToken = process.env.AMO_TOKEN || HARDCODED_CREDENTIALS.AMO_TOKEN;
    const subdomain = process.env.AMOCRM_SUBDOMAIN || HARDCODED_CREDENTIALS.AMOCRM_SUBDOMAIN;
    const tokenSource = process.env.AMO_TOKEN ? 'env' : 'hardcoded';
    
    // Проверяем, не остались ли заглушки
    const isPlaceholder = amoToken === "ЗАМЕНИ_НА_СВОЙ_ТОКЕН" || 
                          subdomain === "ЗАМЕНИ_НА_СВОЙ_СУБДОМЕН";
    
    if (isPlaceholder && !isTestMode) {
      console.warn('⚠️ AmoCRM credentials are placeholder values');
      return NextResponse.json({ 
        success: false, 
        error: 'AmoCRM credentials not configured. Replace placeholder values in code.',
        debug: {
          request: {
            input: data,
            leadData: [],
            config: {
              subdomain: subdomain,
              tokenExists: false,
              tokenSource: 'placeholder'
            }
          }
        }
      }, { status: 500 });
    }
    
    // Тестовые данные, если credentials не настроены
    const isTestCredentials = !amoToken || !subdomain || isPlaceholder;
    
    if (isTestCredentials && !isTestMode) {
      console.warn('⚠️ AmoCRM not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'AmoCRM credentials not configured' 
      }, { status: 500 });
    }
    
    // Генерируем platform_id
    const platform_id = `web_${data.phone.replace(/\D/g, '')}_${Date.now()}`;
    
    // Получаем менеджера
    const manager_id = getNextManagerId();
    
    // Формируем имя контакта
    const contactName = (data.telegram 
      ? `@${data.telegram}` 
      : `Клиент ${data.phone}`
    ).slice(0, 255);
    
    // Собираем UTM-поля с явной типизацией
    const utmCustomFields: UTMField[] = [];
    if (data.utm) {
      const utmMapping = [
        'utm_source', 
        'utm_medium', 
        'utm_campaign', 
        'utm_term', 
        'utm_content'
      ];
      
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
    
    // Формируем контактные поля с явной типизацией
    const contactFields: ContactField[] = [
      {
        field_code: "PHONE",
        values: [{
          enum_code: "WORK",
          value: data.phone,
          is_main: true
        }]
      },
      {
        field_id: AMOCRM_CONFIG.FIELD_FULL_NAME,
        values: [{ value: contactName }]
      },
      {
        field_id: AMOCRM_CONFIG.FIELD_TELEGRAM,
        values: [{
          value: data.telegram ? `@${data.telegram}` : ''
        }]
      },
      {
        field_id: AMOCRM_CONFIG.FIELD_PLATFORM_ID,
        values: [{ value: platform_id }]
      }
    ];
    
    // Формируем данные для отправки
    const leadData = [{
      name: `Новый лид ${platform_id}`,
      status_id: AMOCRM_CONFIG.STATUS_ID,
      pipeline_id: AMOCRM_CONFIG.PIPELINE_ID,
      responsible_user_id: manager_id,
      tags_to_add: [{ name: "бот" }],
      custom_fields_values: utmCustomFields,
      _embedded: {
        contacts: [{
          first_name: contactName,
          custom_fields_values: contactFields
        }]
      }
    }];
    
    // ============ ТЕСТОВЫЙ КОЛБЕК ============
    if (isTestMode) {
      console.log('🧪 [AMOCRM TEST MODE] ========================');
      console.log('🧪 [AMOCRM TEST MODE] Test Callback Active');
      console.log('🧪 [AMOCRM TEST MODE] ========================');
      console.log('📋 Input Data:', JSON.stringify(data, null, 2));
      console.log('📦 Prepared Lead:', JSON.stringify(leadData, null, 2));
      console.log('👤 Manager ID:', manager_id);
      console.log('🆔 Platform ID:', platform_id);
      console.log('🔑 Token source:', tokenSource);
      console.log('🔑 Token exists:', !!amoToken);
      console.log('🔑 Token prefix:', amoToken.substring(0, 10) + '...');
      console.log('🌐 Subdomain:', subdomain);
      console.log('📊 UTM Fields:', utmCustomFields.length);
      
      // Если credentials настроены - отправляем тестовый запрос
      if (!isTestCredentials) {
        console.log('🧪 Sending test request to AmoCRM...');
        
        try {
          const testController = new AbortController();
          const testTimeout = setTimeout(() => testController.abort(), 10000);
          
          const testResponse = await fetch(
            `https://${subdomain}.amocrm.ru/api/v4/leads/complex`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${amoToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(leadData),
              signal: testController.signal
            }
          );
          clearTimeout(testTimeout);
          
          const testResult = await testResponse.json();
          
          console.log('✅ [AMOCRM TEST] Response status:', testResponse.status);
          console.log('✅ [AMOCRM TEST] Response body:', JSON.stringify(testResult, null, 2));
          
          if (testResponse.ok) {
            console.log('🎉 [AMOCRM TEST] Lead created successfully!');
            console.log('📌 Lead ID:', testResult._embedded?.leads?.[0]?.id);
          }
        } catch (testError) {
          console.error('❌ [AMOCRM TEST] Request failed:', testError);
        }
      } else {
        console.log('🧪 [AMOCRM TEST] Skipping real request (invalid credentials)');
        console.log('🧪 [AMOCRM TEST] Would send to:', 
          `https://${subdomain}.amocrm.ru/api/v4/leads/complex`);
      }
      
      console.log('🧪 [AMOCRM TEST MODE] ========================');
      
      // Возвращаем тестовый ответ
      return NextResponse.json({ 
        success: true,
        test: true,
        platform_id,
        manager_id,
        debug: {
          request: {
            input: data,
            leadData,
            config: {
              subdomain: subdomain,
              tokenExists: !!amoToken && !isPlaceholder,
              tokenSource
            }
          }
        }
      });
    }
    
    // ============ ПРОДАКШН ОТПРАВКА ============
    console.log('📤 Sending to AmoCRM:', JSON.stringify(leadData, null, 2));
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AmoCRM error:', errorText);
      throw new Error(`AmoCRM error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ AmoCRM success:', JSON.stringify(result, null, 2));
    
    return NextResponse.json({ 
      success: true,
      platform_id,
      manager_id,
      lead_id: result._embedded?.leads?.[0]?.id
    });
    
  } catch (error) {
    console.error('❌ AmoCRM API error:', error);
    
    // Формируем debug ответ только в development режиме
    const debugResponse = process.env.NODE_ENV === 'development' ? {
      request: {
        input: data,
        leadData: [],
        config: {
          subdomain: process.env.AMOCRM_SUBDOMAIN || HARDCODED_CREDENTIALS.AMOCRM_SUBDOMAIN,
          tokenExists: !!(process.env.AMO_TOKEN || HARDCODED_CREDENTIALS.AMO_TOKEN),
          tokenSource: process.env.AMO_TOKEN ? 'env' : 'hardcoded'
        }
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    } : undefined;
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal error',
      debug: debugResponse
    }, { status: 500 });
  }
}

// GET эндпоинт для проверки работоспособности
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testMode = searchParams.get('test') === 'true';
  
  const amoToken = process.env.AMO_TOKEN || HARDCODED_CREDENTIALS.AMO_TOKEN;
  const subdomain = process.env.AMOCRM_SUBDOMAIN || HARDCODED_CREDENTIALS.AMOCRM_SUBDOMAIN;
  const tokenSource = process.env.AMO_TOKEN ? 'env' : 'hardcoded';
  const isPlaceholder = amoToken === "ЗАМЕНИ_НА_СВОЙ_ТОКЕН" || 
                        subdomain === "ЗАМЕНИ_НА_СВОЙ_СУБДОМЕН";
  
  if (testMode) {
    console.log('🧪 [AMOCRM TEST] GET health check with test mode');
    console.log('🧪 [AMOCRM TEST] Config:', {
      subdomain,
      tokenExists: !!amoToken && !isPlaceholder,
      tokenSource,
      isPlaceholder,
      managers: [AMOCRM_CONFIG.MANAGER_1, AMOCRM_CONFIG.MANAGER_2],
      currentManager: getNextManagerId()
    });
  }
  
  return NextResponse.json({
    status: 'ok',
    test: testMode,
    config: testMode ? {
      subdomain,
      tokenConfigured: !!amoToken && !isPlaceholder,
      tokenSource,
      isPlaceholder,
      managerRotation: {
        manager1: AMOCRM_CONFIG.MANAGER_1,
        manager2: AMOCRM_CONFIG.MANAGER_2,
        current: getNextManagerId()
      }
    } : undefined
  });
}
