import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/payload-data'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Calendar, User } from 'lucide-react'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Блог — Статьи о контент-маркетинге',
  description: 'Полезные статьи о контент-заводах, SMM, продвижении в социальных сетях и создании видеоконтента.',
}

const categoryLabels: Record<string, string> = {
  cases: 'Кейсы',
  analysis: 'Аналитика',
  process: 'Процессы',
  myths: 'Разрушаем мифы',
  guides: 'Гайды',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              Блог
            </h1>
            <p className="text-xl text-neutral-400">
              Полезные статьи о контент-заводах, SMM и продвижении 
              в социальных сетях. Разборы кейсов, гайды, аналитика.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="h-full rounded-2xl bg-neutral-50 border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:from-neutral-300 group-hover:to-neutral-400 transition-colors" />
                  
                  <div className="p-6">
                    {/* Category */}
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
                      {categoryLabels[post.category] || post.category}
                    </span>
                    
                    {/* Title */}
                    <h2 className="heading-4 text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt)}
                      </span>
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {typeof post.author === 'string' ? post.author : post.author.name}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-white mb-6">
              Хотите обсудить ваш проект?
            </h2>
            <p className="text-xl text-neutral-400 mb-10">
              Получите бесплатную консультацию и узнайте, как контент-завод 
              может работать в вашей нише.
            </p>
            <Button href="/contact" size="lg">
              Получить консультацию
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
