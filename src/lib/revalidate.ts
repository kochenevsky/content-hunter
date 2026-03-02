import { revalidatePath } from 'next/cache'

/**
 * Инвалидирует кэш всех страниц фронтенда после изменений в админке.
 * Вызывается из Payload hooks (afterChange).
 * layout = сегмент + все дочерние (включая /cases/[slug], /blog/[slug]).
 */
export async function revalidateFrontend() {
  try {
    // Сначала главная — чаще всего правят именно её
    revalidatePath('/', 'page')
    revalidatePath('/', 'layout')
    revalidatePath('/about', 'page')
    revalidatePath('/cases', 'layout')
    revalidatePath('/blog', 'layout')
    revalidatePath('/pricing', 'page')
    revalidatePath('/faq', 'page')
    revalidatePath('/contact', 'page')
    revalidatePath('/services', 'layout')
    revalidatePath('/offer', 'page')
  } catch (e) {
    console.error('[revalidate]', e)
  }
}
