/**
 * Обходной маршрут для home-page: подставляем id в тело и вызываем операцию обновления напрямую.
 * Иначе при сохранении из админки возможны 400 "invalid id" или 500 при переадресации в REST.
 */
import config from '@payload-config'
import {
  createPayloadRequest,
  deepCopyObjectSimple,
  updateOperationGlobal,
  sanitizePopulateParam,
  sanitizeSelectParam,
} from 'payload'
import {
  REST_GET,
  REST_OPTIONS,
} from '@payloadcms/next/routes'
import { revalidateFrontend } from '@/lib/revalidate'

const GET = REST_GET(config)
const OPTIONS = REST_OPTIONS(config)

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

export { GET, OPTIONS }

export async function PATCH(
  request: Request,
  _ctx: { params: Promise<Record<string, string | string[]>> },
) {
  return handleUpdate(request)
}

export async function POST(
  request: Request,
  _ctx: { params: Promise<Record<string, string | string[]>> },
) {
  return handleUpdate(request)
}

export async function PUT(
  request: Request,
  _ctx: { params: Promise<Record<string, string | string[]>> },
) {
  return handleUpdate(request)
}

async function handleUpdate(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    body = { id: 1 }
  }
  const fixed = ensureIdInBody(body) as Record<string, unknown>

  const newRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(fixed),
  })

  let req: Awaited<ReturnType<typeof createPayloadRequest>>
  try {
    req = await createPayloadRequest({
      request: newRequest,
      config,
      canSetHeaders: true,
    })
  } catch (initErr) {
    const msg = initErr instanceof Error ? initErr.message : String(initErr)
    console.error('[home-page route] createPayloadRequest failed:', initErr)
    return Response.json(
      {
        error: msg,
        hint:
          msg.includes('Postgres') || msg.includes('connect')
            ? 'Проверьте DATABASE_URI в Vercel и доступность БД из сервера.'
            : undefined,
      },
      { status: 500, headers: { 'X-Payload-Error': msg } },
    )
  }
  try {
    req.routeParams = { global: 'home-page' }
    // Не вызываем addDataAndFileToRequest — в serverless повторное чтение body может давать 500. Используем уже распарсенные данные.
    req.data = deepCopyObjectSimple(fixed) as Record<string, unknown>

    const globalConfig = req.payload.globals.config.find(
      (c: { slug: string }) => c.slug === 'home-page',
    )
    if (!globalConfig) {
      return Response.json(
        { message: 'Global home-page not found' },
        { status: 404 },
      )
    }

    const depthParam = req.searchParams?.get('depth')
    const depth =
      depthParam != null && depthParam !== '' && !Number.isNaN(Number(depthParam))
        ? Number(depthParam)
        : undefined

    const result = await updateOperationGlobal({
      slug: 'home-page',
      data: deepCopyObjectSimple(req.data) as Record<string, unknown>,
      req,
      globalConfig,
      depth,
      draft: req.searchParams?.get('draft') === 'true',
      autosave: req.searchParams?.get('autosave') === 'true',
      publishAllLocales: req.searchParams?.get('publishAllLocales') === 'true',
      unpublishAllLocales:
        req.searchParams?.get('unpublishAllLocales') === 'true',
      populate: sanitizePopulateParam(req.query?.populate),
      select: sanitizeSelectParam(req.query?.select),
      publishSpecificLocale:
        typeof req.query?.publishSpecificLocale === 'string'
          ? req.query.publishSpecificLocale
          : undefined,
    })

    // Явная инвалидация кэша главной (afterChange в глобале тоже вызывает revalidateFrontend, но в serverless дубль не помешает)
    await revalidateFrontend()

    const message = req.t('general:updatedSuccessfully')
    return Response.json({ message, result }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[home-page route] updateOperationGlobal failed:', err)
    return Response.json(
      {
        error: message,
        ...(stack && { stack }),
        hint: 'В Network → ответ запроса POST: смотрите поле error и заголовок X-Payload-Error.',
      },
      { status: 500, headers: { 'X-Payload-Error': message } },
    )
  }
}
