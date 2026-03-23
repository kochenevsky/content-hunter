import { StickyCta } from '../_components/StickyCta'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Как работает контент-ферма — Content Hunter',
  description: 'Почему 1 ролик приносит 300 просмотров, а не 300 000. Разбираем механику контент-фермы и почему ваши конкуренты растут быстрее.',
}

const STEPS = [
  {
    number: '01',
    title: 'Оборудование',
    body: 'Офис со стеллажами телефонов. Каждый телефон — отдельная SIM-карта, отдельный IP, отдельный аккаунт. Алгоритм видит живого пользователя, не бота.',
  },
  {
    number: '02',
    title: 'Прогрев аккаунтов — 10 дней',
    body: 'Новый аккаунт как новый сотрудник: ему не доверяют сразу. Программа 10 дней имитирует поведение живого человека: листает ленту, смотрит ролики конкурентов, подписывается. Алгоритм начинает доверять и показывать контент в рекомендациях.',
  },
  {
    number: '03',
    title: 'Уникализация ролика',
    body: '1 ролик загружается в программу. Меняется цвет, скорость, музыка, рамка, логотип — получается 20–30 уникальных версий. Алгоритм не распознаёт дубль, каждый ролик получает отдельный охват.',
  },
  {
    number: '04',
    title: 'Массовая публикация',
    body: 'Все версии автоматически распределяются по аккаунтам и выкладываются по расписанию в Instagram Reels, YouTube Shorts, TikTok одновременно.',
  },
  {
    number: '05',
    title: 'Аналитика',
    body: 'Каждый день система собирает просмотры по всем аккаунтам. Раз в неделю вы получаете отчёт: топы просмотров, динамика, рекомендации что снять дальше.',
  },
]

const CASES = [
  {
    tag: 'E-commerce',
    title: 'Маркетплейс электроники',
    before: 'Новый магазин без отзывов. Реклама съедала 40–60% дохода. Конкуренты с тысячами отзывов занимали всю выдачу.',
    tariff: 'Бизнес — 30 аккаунтов, 600 публикаций в месяц',
    mechanic: 'Сняли живой контент с товарами, сделали из каждого ролика 30 копий, прогрели аккаунты под аудиторию маркетплейса. Ролики начали набирать охваты, карточки товаров поднялись в выдаче.',
    result1: '800 единиц продано, склад опустел',
    result2: '1 000 000 ₽ выручки с нуля',
    result3: 'Рекламные расходы — 16% вместо 40–60%',
    cost: '0,07 ₽ за просмотр',
  },
  {
    tag: 'Онлайн-школа',
    title: 'Школа иностранных языков',
    before: 'Эксперт вёл блог два года. Каждый ролик набирал 400–500 просмотров. Заявки шли непредсказуемо, стоимость лида росла.',
    tariff: 'Мини блог — 20 аккаунтов, 400 публикаций в месяц',
    mechanic: 'Взяли уже снятые ролики — те, что были оплачены. Уникализировали каждый в 20 копий, прогрели аккаунты под аудиторию интересующуюся языками. Тот же контент заработал в 20 раз интенсивнее.',
    result1: '553 000 просмотров за месяц вместо 487 на ролик',
    result2: '$80 000 выручки',
    result3: 'Стоимость лида снизилась в 5 раз',
    cost: '0,08 ₽ за просмотр',
  },
  {
    tag: 'Digital',
    title: 'Digital-агентство',
    before: 'Продукт сильный, но о нём никто не знал. Контент вели через один аккаунт. 6–8 заявок в месяц — для окупаемости нужно было в 5 раз больше.',
    tariff: 'Оптимус Прайм — 50 аккаунтов, 1 000 публикаций в месяц',
    mechanic: 'Прогрели аккаунты под аудиторию предпринимателей. Акцент на охватном контенте — ролики объясняли боли и показывали результат. Клиенты приходили на разбор уже прогретыми.',
    result1: '275 000 просмотров через 50 аккаунтов',
    result2: '$31 000 выручки',
    result3: 'Количество заявок выросло в 4 раза',
    cost: '0,06 ₽ за просмотр',
  },
]

const FAQ = [
  {
    q: 'Это законно?',
    a: 'Да. Аккаунты регистрируются на официальных SIM-картах, каждый на отдельном телефоне с уникальным IP. Никаких нарушений правил платформ.',
  },
  {
    q: 'Соцсети не заблокируют аккаунты?',
    a: 'Алгоритм видит живых пользователей — поведение имитируется корректно. За два года работы и 50+ проектов блокировок по этой причине не было.',
  },
  {
    q: 'Мне нужно снимать больше роликов?',
    a: 'Нет. Достаточно 1 ролика в неделю. Из каждого мы делаем 20–30 уникальных версий. Ваши текущие ролики уже подходят для запуска.',
  },
  {
    q: 'Как быстро будет результат?',
    a: 'Первые публикации — через 10 дней после старта (прогрев аккаунтов). Стабильный рост просмотров — с 3–4 недели. Контент-маркетинг работает накопительно: каждый месяц лучше предыдущего.',
  },
  {
    q: 'Чем это отличается от накрутки?',
    a: 'Накрутка — фейковые просмотры без реального охвата, аккаунт быстро блокируют. Ферма — реальные люди видят ролик в рекомендациях, подписываются, переходят на сайт.',
  },
  {
    q: 'Что если контент не очень хороший?',
    a: 'Ферма усиливает то что есть. Мы даём рекомендации по контенту после анализа ниши, а 15% сетки публикаций заполняем охватными роликами бесплатно — они разгоняют аккаунты.',
  },
]

const TARIFFS = [
  { name: 'Быстрый тест', phones: 1, accounts: 10, pubs: 200, views: '60 000', price: '25 000 ₽' },
  { name: 'Мини блог', phones: 2, accounts: 20, pubs: 400, views: '120 000', price: '46 000 ₽' },
  { name: 'Бизнес', phones: 3, accounts: 30, pubs: 600, views: '180 000', price: '60 000 ₽' },
  { name: 'Оптимус Прайм', phones: 5, accounts: 50, pubs: 1000, views: '300 000', price: '90 000 ₽', highlight: true },
]

const CTA_HREF = 'https://sbsite.pro//eu_site_calc_1'

function SectionCta({ label = 'Получить экскурсию', stickyLabel = 'Рассчитать для моей ниши' }: { label?: string; stickyLabel?: string }) {
  return (
    <div className="mt-10">
      <StickyCta href={CTA_HREF} label={label} stickyLabel={stickyLabel} />
    </div>
  )
}

export default function LongreadPage() {
  return (
    <>
      {/* ─── 1. HERO ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white overflow-hidden">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-primary-400 text-sm font-medium uppercase tracking-widest mb-4">
              Разбор механики
            </p>
            <h1 className="heading-display text-white mb-6 !text-4xl md:!text-6xl">
              Почему 1 ролик приносит 300 просмотров, а не 300 000
            </h1>
            <p className="text-xl text-neutral-400">
              Разберёте механику — и поймёте, почему ваши конкуренты растут быстрее.
            </p>
            <SectionCta label="Получить экскурсию" />
          </div>
        </div>
      </section>

      {/* ─── 2. ПРОБЛЕМА ─────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-6">
              Дорогой и бесполезный SMM
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              SMM-щик стоит 60–90 тыс. ₽ в месяц. За это вы получаете 20–25 роликов.
              Один ролик обходится примерно в <strong className="text-neutral-900">3 000 ₽</strong>.
            </p>
            <p className="text-lg text-neutral-600 mb-6">
              Средний органический охват одного ролика — 300–500 просмотров.
              Иногда больше. Но клиентов с этого — кот наплакал.
            </p>

            <div className="bg-neutral-100 rounded-2xl p-6 mb-8">
              <p className="text-neutral-500 text-sm uppercase tracking-widest font-medium mb-3">
                Вопрос напрямую
              </p>
              <p className="text-xl font-semibold text-neutral-900">
                Сколько клиентов вы получили из соцсетей за последние 3 месяца?
              </p>
            </div>

            <p className="text-lg text-neutral-600 mb-2">
              Скорее всего, немного. И дело не в качестве контента.
            </p>
            <p className="text-lg text-neutral-600">
              Контент создаётся — но не распространяется. Это как напечатать листовки и оставить их на складе.
            </p>

            <SectionCta label="Как это исправить →" />
          </div>
        </div>
      </section>

      {/* ─── 3. АЛГОРИТМЫ ────────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-6">
              Почему так происходит
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              Соцсети показывают новый ролик сначала небольшой аудитории — это тест.
              Если за первые несколько часов нет реакций — ролик не продвигается дальше.
            </p>
            <p className="text-lg text-neutral-600 mb-6">
              Один аккаунт = одна попытка на один ролик. Промахнулся — всё.
            </p>
            <div className="bg-neutral-950 text-white rounded-2xl p-6">
              <p className="text-lg font-medium">
                Проблема не в качестве контента.<br />
                Проблема в количестве точек распространения.
              </p>
            </div>
            <SectionCta label="Посмотреть решение →" />
          </div>
        </div>
      </section>

      {/* ─── 4. АНАЛОГИЯ ─────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-6">
              Магнит, Пятёрочка, Детский мир
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              У каждого — сотни филиалов. Один магазин в одном районе даёт ограниченный охват.
              Сеть филиалов охватывает весь город.
            </p>
            <p className="text-lg text-neutral-600 mb-6">
              С аккаунтами — то же самое.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-100 rounded-xl p-5">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-2">Обычный SMM</p>
                <p className="font-semibold text-neutral-900">Основной аккаунт</p>
                <p className="text-neutral-500 text-sm mt-1">= главный офис</p>
              </div>
              <div className="bg-neutral-950 rounded-xl p-5 text-white">
                <p className="text-sm font-medium text-primary-400 uppercase tracking-widest mb-2">Система ферм</p>
                <p className="font-semibold">Сеть аккаунтов</p>
                <p className="text-neutral-400 text-sm mt-1">= сеть филиалов</p>
              </div>
            </div>

            <p className="text-lg text-neutral-600">
              Каждый «филиал» публикует тот же контент, но алгоритм видит его как уникального живого пользователя.
            </p>
            <SectionCta label="Получить экскурсию" />
          </div>
        </div>
      </section>

      {/* ─── 5. КАК РАБОТАЕТ ─────────────────────────────────────── */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-white mb-10">
              Как технически работает система — пошагово
            </h2>

            <div className="space-y-8">
              {STEPS.map((step) => (
                <div key={step.number} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                    {step.number}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg mb-2">{step.title}</p>
                    <p className="text-neutral-400 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <SectionCta label="Посмотреть как выглядит изнутри →" />
          </div>
        </div>
      </section>

      {/* ─── 6. МАТЕМАТИКА ───────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-6">
              Математика — почему это выгодно
            </h2>

            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-neutral-100">
                <span className="text-2xl">📹</span>
                <div>
                  <p className="font-semibold text-neutral-900">Вы заплатили 3 000 ₽ за 1 ролик</p>
                  <p className="text-neutral-500 text-sm">Стандартная стоимость производства</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-neutral-100">
                <span className="text-2xl">✂️</span>
                <div>
                  <p className="font-semibold text-neutral-900">Из него сделали 30 копий — бесплатно</p>
                  <p className="text-neutral-500 text-sm">Уникализация включена в стоимость тарифа</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-neutral-950 text-white">
                <span className="text-2xl">🧮</span>
                <div>
                  <p className="font-semibold text-white text-lg">3 000 ÷ 31 = <span className="text-primary-400">97 ₽ за одну публикацию</span></p>
                  <p className="text-neutral-400 text-sm mt-1">Вместо 3 000 ₽ за один ролик в одном аккаунте</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 text-center">
              <div className="p-4 rounded-xl bg-neutral-100">
                <p className="text-xl font-bold text-neutral-900">15–50 ₽</p>
                <p className="text-xs text-neutral-500 mt-1">1 клик в таргете</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-100">
                <p className="text-xl font-bold text-neutral-900">97 ₽</p>
                <p className="text-xs text-neutral-500 mt-1">1 публикация на ферме</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 text-white">
                <p className="text-xl font-bold text-primary-400">0,01 ₽</p>
                <p className="text-xs text-neutral-400 mt-1">1 просмотр на ферме</p>
              </div>
            </div>

            <p className="text-neutral-600 text-lg">
              Ферма даёт охват дешевле любого платного канала — и этот охват накапливается каждый месяц.
            </p>

            <SectionCta label="Рассчитать для моей ниши" />
          </div>
        </div>
      </section>

      {/* ─── 7. КЕЙСЫ ────────────────────────────────────────────── */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-10">
              Реальные результаты в трёх нишах
            </h2>

            <div className="space-y-8">
              {CASES.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                  <div className="bg-neutral-950 px-6 py-4 flex items-center justify-between">
                    <span className="text-primary-400 text-xs font-medium uppercase tracking-widest">{c.tag}</span>
                    <span className="text-white font-semibold text-sm">{c.title}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-1">До</p>
                      <p className="text-neutral-700">{c.before}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-1">Тариф</p>
                      <p className="text-neutral-700">{c.tariff}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-1">Механика</p>
                      <p className="text-neutral-700">{c.mechanic}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">Результат</p>
                      {[c.result1, c.result2, c.result3].map((r, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="text-primary-500 mt-0.5">—</span>
                          <p className="text-neutral-900 font-medium text-sm">{r}</p>
                        </div>
                      ))}
                      <p className="text-neutral-400 text-xs mt-2">Стоимость просмотра: {c.cost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SectionCta label="Хочу такой же результат →" />
          </div>
        </div>
      </section>

      {/* ─── 8. FAQ ───────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-10">
              Частые вопросы
            </h2>

            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="bg-neutral-50 px-6 py-4">
                    <p className="font-semibold text-neutral-900">{item.q}</p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-neutral-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <SectionCta label="Остались вопросы? Получить консультацию" />
          </div>
        </div>
      </section>

      {/* ─── 9. ТАРИФЫ ───────────────────────────────────────────── */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-1 text-white mb-4">
              Тарифы
            </h2>
            <p className="text-neutral-400 text-lg mb-10">
              Первичные вложения — 0 ₽. Оборудование настраиваем бесплатно. Гарантия просмотров прописана в договоре.
            </p>

            <div className="space-y-4">
              {TARIFFS.map((t) => (
                <div
                  key={t.name}
                  className={`rounded-2xl p-6 ${t.highlight ? 'bg-primary-500 text-white' : 'bg-neutral-900 border border-neutral-800'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className={`font-bold text-lg ${t.highlight ? 'text-white' : 'text-white'}`}>{t.name}</p>
                      {t.highlight && (
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                          Популярный
                        </span>
                      )}
                    </div>
                    <p className={`text-xl font-bold ${t.highlight ? 'text-white' : 'text-primary-400'}`}>{t.price}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ['Телефонов', t.phones],
                      ['Аккаунтов', t.accounts],
                      ['Публикаций/мес', t.pubs],
                      ['Гарантия просмотров', t.views],
                    ].map(([label, value]) => (
                      <div key={label as string}>
                        <p className={t.highlight ? 'text-white/60' : 'text-neutral-500'}>{label}</p>
                        <p className={`font-semibold ${t.highlight ? 'text-white' : 'text-white'}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <SectionCta label="Рассчитать для моей ниши" />
          </div>
        </div>
      </section>

      {/* ─── 10. ФИНАЛЬНЫЙ CTA ───────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-1 text-neutral-900 mb-4">
              Рассчитайте стоимость для вашей ниши
            </h2>
            <p className="text-lg text-neutral-600 mb-10">
              Бесплатно. Без обязательств. Специалист разберёт вашу нишу и покажет что реально для вашего бизнеса.
            </p>

            <div className="bg-neutral-950 rounded-2xl p-8 mb-8 text-left">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🏭</span>
                <div>
                  <p className="text-white font-semibold text-lg mb-1">Построить такую систему самостоятельно</p>
                  <p className="text-neutral-400">Оборудование, разработка ПО, команда — от 20 000 000 ₽</p>
                </div>
              </div>
              <div className="border-t border-neutral-800 my-4" />
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚡️</span>
                <div>
                  <p className="text-primary-400 font-semibold text-lg mb-1">Арендовать у Content Hunter</p>
                  <p className="text-neutral-400">От 25 000 ₽ в месяц. Старт через 10 дней.</p>
                </div>
              </div>
            </div>

            <StickyCta
              href={CTA_HREF}
              label="Получить консультацию"
              stickyLabel="Получить консультацию"
            />
            <p className="text-neutral-400 text-sm mt-4">50+ проектов · 20М+ просмотров в месяц · 37 ниш</p>
          </div>
        </div>
      </section>
    </>
  )
}
