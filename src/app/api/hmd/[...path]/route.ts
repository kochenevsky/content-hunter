const WORKER_URL = 'https://helpmedoctor.oxion-ezhkov.workers.dev';

export async function GET(request: Request) {
  const { searchParams, pathname } = new URL(request.url);
  const path = pathname.replace('/api/hmd/', '');
  const query = searchParams.toString();
  const url = `${WORKER_URL}/${path}${query ? '?' + query : ''}`;
  
  const response = await fetch(url);
  
  // Проксируем ответ как есть (поддерживает JSON, текст, изображения и т.д.)
  const data = await response.text();
  
  return new Response(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}

export async function POST(request: Request) {
  const { searchParams, pathname } = new URL(request.url);
  const path = pathname.replace('/api/hmd/', '');
  const query = searchParams.toString();
  const url = `${WORKER_URL}/${path}${query ? '?' + query : ''}`;
  
  const body = await request.text();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': request.headers.get('Content-Type') || 'application/json',
    },
    body,
  });
  
  const data = await response.text();
  
  return new Response(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}
