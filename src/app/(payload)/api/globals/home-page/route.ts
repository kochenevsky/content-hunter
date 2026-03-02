/**
 * Обходной маршрут для home-page: подставляем id в тело запроса до передачи в Payload,
 * иначе при сохранении из админки приходит 400 "The following field is invalid: id".
 * Контекст с params.slug нужен, иначе Payload возвращает 404 "Route not found".
 */
import config from '@payload-config'
import {
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

const GET = REST_GET(config)
const OPTIONS = REST_OPTIONS(config)
const PATCH_ORIG = REST_PATCH(config)
const POST_ORIG = REST_POST(config)
const PUT_ORIG = REST_PUT(config)

/** Контекст как у [...slug] для /api/globals/home-page */
const PAYLOAD_CTX = { params: Promise.resolve({ slug: ['globals', 'home-page'] }) }

function ensureIdInBody(body: unknown): unknown {
  if (body == null || typeof body !== 'object') return body
  const out = { ...body } as Record<string, unknown>
  if (out.id == null || out.id === undefined) out.id = 1
  if (typeof out.id !== 'number') {
    const n = Number(out.id)
    out.id = Number.isNaN(n) ? 1 : n
  }
  return out
}

async function withFixedBody(
  request: Request,
  handler: (req: Request, ctx: { params: Promise<Record<string, string | string[]>> }) => Promise<Response>,
): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return handler(request, PAYLOAD_CTX)
  }
  const fixed = ensureIdInBody(body)
  const newRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(fixed),
  })
  return handler(newRequest, PAYLOAD_CTX)
}

export { GET, OPTIONS }

export async function PATCH(
  request: Request,
  _ctx: { params: Promise<Record<string, string | string[]>> },
) {
  return withFixedBody(request, PATCH_ORIG)
}

export async function POST(
  request: Request,
  _ctx: { params: Promise<Record<string, string | string[]>> },
) {
  return withFixedBody(request, POST_ORIG)
}

export async function PUT(
  request: Request,
  _ctx: { params: Promise<Record<string, string | string[]>> },
) {
  return withFixedBody(request, PUT_ORIG)
}
