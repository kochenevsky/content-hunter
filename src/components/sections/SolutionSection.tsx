import { Check, ArrowRight } from 'lucide-react'

export function SolutionSection() {
  return (
    <section className="section bg-neutral-950 text-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <div>
            <h2 className="heading-2 text-white mb-6">
              Холодная математика
              <br />
              <span className="text-primary-500">вместо надежды</span>
            </h2>
            
            <div className="space-y-6 mb-8">
              <p className="text-xl text-neutral-300">
                1 ролик на миллион просмотров — это удача.
              </p>
              <p className="text-xl text-white font-semibold">
                1000 роликов по 1000 просмотров — это гарантированный миллион.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                'Один ролик превращаем в несколько уникальных версий',
                'Публикуем через сетку из 20+ аккаунтов',
                'Охватываем все платформы: Reels, Shorts, TikTok',
                'Получаем стабильный поток целевых просмотров',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
              {/* Formula */}
              <div className="text-center mb-8">
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">
                  Формула результата
                </p>
                <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-bold">
                  <span className="text-neutral-400">1 ролик</span>
                  <ArrowRight className="w-6 h-6 text-primary-500" />
                  <span className="text-neutral-400">20 копий</span>
                  <ArrowRight className="w-6 h-6 text-primary-500" />
                  <span className="text-primary-500">20K+</span>
                </div>
                <p className="text-neutral-500 mt-4">просмотров гарантированно</p>
              </div>

              {/* Monthly stats */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-800">
                <div className="text-center p-4 rounded-xl bg-neutral-800/50">
                  <p className="text-3xl font-bold text-white">50</p>
                  <p className="text-sm text-neutral-500">роликов/мес</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-neutral-800/50">
                  <p className="text-3xl font-bold text-white">20</p>
                  <p className="text-sm text-neutral-500">аккаунтов</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-neutral-800/50">
                  <p className="text-3xl font-bold text-white">1000</p>
                  <p className="text-sm text-neutral-500">публикаций</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-primary-500/20 border border-primary-500/30">
                  <p className="text-3xl font-bold text-primary-500">1М+</p>
                  <p className="text-sm text-primary-400">просмотров</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
