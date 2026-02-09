import { Button } from '@/components/ui/Button'
import { ArrowRight, MessageCircle } from 'lucide-react'

export function CTASection() {
  return (
    <section className="section-hero bg-neutral-950 text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-1 text-white mb-6">
            Готовы запустить
            <br />
            <span className="text-primary-500">контент-завод?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10">
            Получите бесплатную консультацию и узнайте, сколько просмотров 
            и лидов вы можете получать ежемесячно.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" size="lg">
              Получить консультацию
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              href="https://t.me/contenthunter_bot" 
              variant="outline" 
              size="lg"
              className="border-neutral-700 text-white hover:border-neutral-500"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Написать в Telegram
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-12 border-t border-neutral-800">
            <p className="text-neutral-500 mb-4">Гарантии:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400">
              <span>✓ KPI по охватам в договоре</span>
              <span>✓ Бесплатный аудит</span>
              <span>✓ Первые результаты через 1.5 месяца</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
