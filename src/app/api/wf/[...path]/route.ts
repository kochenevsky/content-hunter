const WORKER_URL = 'https://morning-wind-dc5e.oxion-ezhkov.workers.dev';

type Params = Promise<{ path: string[] }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { path } = await params;
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const url = `${WORKER_URL}/mini-app/${path.join('/')}${query ? '?' + query : ''}`;
  const r = await fetch(url);
  const data = await r.json();
  return Response.json(data);
}

export async function POST(request: Request, { params }: { params: Params }) {
  const { path } = await params;
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const url = `${WORKER_URL}/mini-app/${path.join('/')}${query ? '?' + query : ''}`;
  const body = await request.text();
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await r.json();
  return Response.json(data);
}
