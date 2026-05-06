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
      input: LeadRequest;
      leadData: any[];
      config: {
        subdomain: string;
        tokenExists: boolean;
      };
    };
    response?: any;
    error?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<LeadResponse>> {
  try {
    const data: LeadRequest = await request.json();
    
    // Проверяем тестовый режим
    const isTestMode = data.test === true;
    
    if (isTestMode) {
      console.log('🧪 [AMOCRM TEST MODE] Starting test callback');
    }
    
    // Получаем конфигурацию
    const amoToken = process.env.AMO_TOKEN;
    const subdomain = process.env.AMOCRM_SUBDOMAIN;
    
    // Тестовые данные, если credentials не настроены
    const isTestCredentials = !amoToken || !subdomain;
    
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
      console.log('🔑 Token exists:', !!amoToken);
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
        console.log('🧪 [AMOCRM TEST] Skipping real request (no credentials)');
        console.log('🧪 [AMOCRM TEST] Request would be sent to:', 
          `https://${subdomain || 'YOUR_SUBDOMAIN'}.amocrm.ru/api/v4/leads/complex`);
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
              subdomain: subdomain || 'not_set',
              tokenExists: !!amoToken
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
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal error',
      debug: process.env.NODE_ENV === 'development' ? {
        request: {
          input: data || {} as LeadRequest,
          leadData: [],
          config: {
            subdomain: '',
            tokenExists: false
          }
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      } : undefined
    }, { status: 500 });
  }
}

// GET эндпоинт для проверки работоспособности
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testMode = searchParams.get('test') === 'true';
  
  if (testMode) {
    console.log('🧪 [AMOCRM TEST] GET health check with test mode');
    console.log('🧪 [AMOCRM TEST] Config:', {
      subdomain: process.env.AMOCRM_SUBDOMAIN || 'not_set',
      tokenExists: !!process.env.AMO_TOKEN,
      managers: [AMOCRM_CONFIG.MANAGER_1, AMOCRM_CONFIG.MANAGER_2],
      currentManager: getNextManagerId()
    });
  }
  
  return NextResponse.json({
    status: 'ok',
    test: testMode,
    config: testMode ? {
      subdomain: process.env.AMOCRM_SUBDOMAIN || 'not_set',
      tokenConfigured: !!process.env.AMO_TOKEN,
      managerRotation: {
        manager1: AMOCRM_CONFIG.MANAGER_1,
        manager2: AMOCRM_CONFIG.MANAGER_2,
        current: getNextManagerId()
      }
    } : undefined
  });
}
