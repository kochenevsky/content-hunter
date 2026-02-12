import path from 'path'
import type { CollectionConfig, PayloadRequest } from 'payload'
import { createClient } from '@supabase/supabase-js'
import type { File } from '@payloadcms/plugin-cloud-storage/types'
import { getFilePrefix } from '@payloadcms/plugin-cloud-storage/utilities'

const bucket = process.env.SUPABASE_STORAGE_BUCKET || process.env.S3_BUCKET || 'media'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Supabase Storage')
  }
  return createClient(url, key)
}

export function createSupabaseStorageAdapter(prefix = '') {
  return ({ collection }: { collection: CollectionConfig }) => ({
    name: 'supabase',
    handleUpload: async ({
      data,
      file,
    }: {
      data: Record<string, unknown> & { prefix?: string }
      file: File
    }) => {
      const filePath = path.posix.join(data.prefix || prefix, file.filename)
      const supabase = getSupabase()
      const body = file.tempFilePath
        ? await (await import('fs/promises')).readFile(file.tempFilePath)
        : file.buffer

      const { error } = await supabase.storage.from(bucket).upload(filePath, new Uint8Array(body), {
        contentType: file.mimeType,
        upsert: true,
      })

      if (error) throw error
      return data
    },
    handleDelete: async ({
      doc,
      filename,
    }: {
      doc: { prefix?: string }
      filename: string
    }) => {
      const filePath = path.posix.join(doc.prefix || prefix, filename)
      const supabase = getSupabase()
      await supabase.storage.from(bucket).remove([filePath])
    },
    generateURL: ({ filename, prefix: p = '' }: { filename: string; prefix?: string }) => {
      const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!base) return ''
      const filePath = path.posix.join(p, encodeURIComponent(filename))
      return `${base.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${filePath}`
    },
    staticHandler: async (
      req: PayloadRequest,
      { params: { clientUploadContext, filename } }: { params: { clientUploadContext?: unknown; filename: string } }
    ) => {
      const prefix = await getFilePrefix({ clientUploadContext, collection, filename, req })
      const filePath = path.posix.join(prefix, filename)
      const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!base) {
        return new Response('Storage not configured', { status: 500 })
      }
      const url = `${base.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${filePath}`
      return Response.redirect(url, 302)
    },
  })
}
