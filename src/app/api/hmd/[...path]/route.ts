const WORKER_URL = 'https://helpmedoctor.oxion-ezhkov.workers.dev';

export async function GET(request: Request) {
  const { searchParams, pathname } = new URL(request.url);
  const path = pathname.replace('/api/hmd/', '');
  const query = searchParams.toString();
  const url = `${WORKER_URL}/${path}${query ? '?' + query : ''}`;
  const r = await fetch(url);
  const data = await r.json();
  return Response.json(data);
}

export async function POST(request: Request) {
  const { searchParams, pathname } = new URL(request.url);
  const path = pathname.replace('/api/hmd/', '');
  const query = searchParams.toString();
  const url = `${WORKER_URL}/${path}${query ? '?' + query : ''}`;
  const body = await request.text();
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await r.json();
  return Response.json(data);
}
