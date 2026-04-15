'use client';

import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

const tariffData = [
  {
    name: 'Быстрый тест',
    phones: '1',
    accounts: '10',
    rent: '₽0',
    days: '10',
    posts: '200',
    price: '₽25 000',
    views: '60 000',
    forecast: '300 000',
    costPerPost: '₽125',
    costPerView: '₽0,08'
  },
  {
    name: 'Мини блог',
    phones: '3',
    accounts: '30',
    rent: '₽0',
    days: '10',
    posts: '400',
    price: '₽46 000',
    views: '120 000',
    forecast: '600 000',
    costPerPost: '₽115',
    costPerView: '₽0,08'
  },
  {
    name: 'Бизнес',
    phones: '5',
    accounts: '50',
    rent: '₽0',
    days: '10',
    posts: '600',
    price: '₽60 000',
    views: '180 000',
    forecast: '900 000',
    costPerPost: '₽100',
    costPerView: '₽0,07'
  },
  {
    name: 'Оптимус прайм',
    phones: '10',
    accounts: '100',
    rent: '₽0',
    days: '10',
    posts: '1 000',
    price: '₽90 000',
    views: '300 000',
    forecast: '1 500 000',
    costPerPost: '₽90',
    costPerView: '₽0,06'
  }
];

// Заготовка под FAQ
const faqData = [
  {
    question: 'Что делать, если не наберутся гарантированные просмотры?',
    answer: 'Мы добираем просмотры за свой счёт за счёт дополнительных публикаций. Гарантия фиксируется в договоре-оферте и выполняется в рамках месяца.'
  },
  {
    question: 'Как работает гарантия просмотров?',
    answer: 'Гарантия даётся на общий объём просмотров за месяц на опубликованных роликах. Если объём не набирается — мы докручиваем за свой счёт.'
  },
  {
    question: 'Откуда берутся просмотры?',
    answer: 'Все просмотры — органические. Контент публикуется в TikTok, Instagram и YouTube через сеть прогретых аккаунтов, без использования рекламы.'
  },
  {
    question: 'Будут ли просмотры от моей целевой аудитории?',
    answer: 'Аккаунты настраиваются под вашу нишу, гео и аудиторию. За счёт этого алгоритмы платформ подбирают релевантную аудиторию под ваш контент.'
  },
  {
    question: 'Что если аккаунты заблокируют?',
    answer: 'Мы полностью берём этот риск на себя. В случае блокировок создаём и прогреваем новые аккаунты за свой счёт без потери объёма публикаций.'
  },
  {
    question: 'Кому принадлежат аккаунты?',
    answer: 'Аккаунты создаются и обслуживаются нашей платформой под ваш проект. Мы полностью берём на себя управление и техническую часть.'
  },
  {
    question: 'Когда появятся первые результаты?',
    answer: 'На настройку системы уходит до 10 дней. После этого начинается публикация и набор просмотров практически сразу.'
  },
  {
    question: 'Что нужно делать с моей стороны?',
    answer: 'Вам нужно только загружать готовые ролики в платформу. Вся инфраструктура, публикация и масштабирование происходят автоматически.'
  },
  {
    question: 'Кому не подойдёт контент-ферма?',
    answer: 'Система подходит для массовых и разрешённых ниш. Если продукт узкий или запрещённый — результат может быть ограничен.'
  },
  {
    question: 'Почему у вас получается, а у других нет?',
    answer: 'Мы используем собственную инфраструктуру и проверенную систему масштабирования, подтверждённую кейсами и закреплённую гарантией в договоре.'
  },
  {
    question: 'Можно ли протестировать перед масштабированием?',
    answer: 'Да, минимальный формат — месяц работы. Этого достаточно, чтобы оценить объём публикаций и фактический результат.'
  },
  {
    question: 'Что входит в стоимость тарифа?',
    answer: 'В стоимость входит аренда инфраструктуры, публикации роликов, обслуживание аккаунтов и гарантия просмотров.'
  }
];

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <span className="tooltip-wrapper">
      <span 
        onClick={() => setShow(!show)} 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{ cursor: 'help', display: 'inline-flex' }}
      >
        {children}
      </span>
      {show && (
        <span className="tooltip-content" onClick={() => setShow(false)}>
          {text}
        </span>
      )}
    </span>
  );
}

export default function PriceRubPage() {
  return (
    <>
      <style>{`
        html, body { 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden; 
          background: #0a0e17;
        }
        /* Тултип */
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #e2e8f0;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-line;
  min-width: 280px;
  max-width: 350px;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(74, 222, 128, 0.2);
  pointer-events: auto;
  margin-bottom: 8px;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #1e293b;
}

@media (max-width: 768px) {
  .tooltip-content {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    top: auto;
    transform: none;
    min-width: auto;
    max-width: none;
    z-index: 9999;
  }
  
  .tooltip-content::after {
    display: none;
  }
}
        .farm-root {
          background: linear-gradient(180deg, #0a0e17 0%, #0d121c 100%);
          min-height: 100vh;
          font-family: -apple-system, 'SF Pro Display', 'Inter', system-ui, sans-serif;
          color: #e2e8f0;
          overflow-x: hidden;
          width: 100%;
        }

        .farm-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── HERO (минимальные отступы) ── */
        .farm-hero {
          padding: 20px 0 24px;
          position: relative;
        }
        @media (min-width: 768px) {
          .farm-hero { 
            padding: 24px 0 28px; 
          }
        }

        .farm-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 222, 128, 0.08);
          border: 1px solid rgba(74, 222, 128, 0.15);
          border-radius: 24px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgb(74, 222, 128);
          margin-bottom: 16px;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .farm-hero h1 {
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 0;
          color: #ffffff;
          background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Таблица */
        .tariff-table-wrapper {
          overflow-x: auto;
          border-radius: 16px;
          border: 1px solid rgba(74, 222, 128, 0.08);
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          margin: 24px 0 32px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        .tariff-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .tariff-table th {
          padding: 18px 16px;
          text-align: center;
          font-weight: 600;
          color: #94a3b8;
          border-bottom: 1px solid rgba(74, 222, 128, 0.1);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .tariff-table td {
          padding: 14px 16px;
          text-align: center;
          border-bottom: 1px solid rgba(74, 222, 128, 0.06);
          color: #cbd5e1;
        }

        /* Разрыв между секциями */
        /* Разрыв между секциями */
.section-break td {
  padding: 20px 0 0 0;  /* было 4px 0 0 0 */
  border-bottom: none;
}

.section-break + tr td {
  padding-top: 20px;  /* было 14px */
}

        .tariff-table tr:last-child td {
          border-bottom: none;
        }

        .tariff-table th:first-child,
        .tariff-table td:first-child {
          text-align: left;
          font-weight: 500;
          color: #94a3b8;
          position: sticky;
          left: 0;
          background: #0f172a;
          padding-left: 20px;
        }

        .tariff-table th:first-child {
          background: #0f172a;
          font-weight: 700;
          color: rgb(74, 222, 128);
        }

        .tariff-name-header {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .tariff-name-header small {
          display: block;
          font-size: 11px;
          font-weight: 400;
          color: #64748b;
          margin-top: 4px;
        }

        .price-cell {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, rgb(74, 222, 128) 0%, rgb(34, 197, 94) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .help-icon-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .help-icon {
          width: 14px;
          height: 14px;
          color: rgb(74, 222, 128);
          cursor: help;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .help-icon:hover {
          opacity: 1;
        }

        /* Mobile cards */
        .mobile-cards {
          display: none;
          flex-direction: column;
          gap: 16px;
          margin: 24px 0 32px;
        }

        @media (max-width: 768px) {
          .tariff-table-wrapper {
            display: none;
          }
          .mobile-cards {
            display: flex;
          }
        }

        .tariff-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(74, 222, 128, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        }

        .tariff-card-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(74, 222, 128, 0.05), rgba(34, 197, 94, 0.02));
          border-bottom: 1px solid rgba(74, 222, 128, 0.1);
        }

        .tariff-card-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .tariff-card-body {
          padding: 20px;
        }

        .tariff-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(74, 222, 128, 0.06);
        }

        .tariff-row:last-child {
          border-bottom: none;
        }

        .tariff-row-label {
          color: #94a3b8;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tariff-row-value {
          color: #e2e8f0;
          font-weight: 600;
        }

        .section-break-mobile {
          margin: 20px 0 8px;
          padding-top: 0;
          border-top: 1px solid rgba(74, 222, 128, 0.15);
        }

        .section-label-mobile {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgb(74, 222, 128);
          margin: 16px 0 12px;
          font-weight: 600;
        }

        .section-label-mobile:first-child {
          margin-top: 0;
        }

        /* Ссылки */
        .farm-links {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin: 32px 0 48px;
          flex-wrap: wrap;
        }

        .farm-link {
          color: rgb(74, 222, 128);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(74, 222, 128, 0.05);
          border: 1px solid rgba(74, 222, 128, 0.1);
          transition: all 0.2s;
        }

        .farm-link:hover {
          background: rgba(74, 222, 128, 0.1);
          border-color: rgba(74, 222, 128, 0.2);
        }

        /* FAQ секция */
        .faq-section {
          margin: 48px 0 64px;
        }

        .faq-title {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 32px;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .faq-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(74, 222, 128, 0.08);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s;
        }

        .faq-item:hover {
          border-color: rgba(74, 222, 128, 0.15);
          background: rgba(15, 23, 42, 0.8);
        }

        .faq-question {
          font-size: 16px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 8px;
        }

        .faq-answer {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
        }

        /* Акценты */
        .accent-text {
          color: rgb(74, 222, 128);
        }
      `}</style>

      <div className="farm-root">
        <div className="farm-container">
          {/* Hero Section */}
          <section className="farm-hero">
            <div className="farm-badge">
              <span style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, rgb(74, 222, 128), rgb(34, 197, 94))', 
                display: 'inline-block',
                boxShadow: '0 0 12px rgba(74, 222, 128, 0.5)'
              }} />
              Тарифы контент-фермы
            </div>

            <h1>
              Выберите подходящий{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, rgb(74, 222, 128) 0%, rgb(34, 197, 94) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                тариф
              </span>
            </h1>
          </section>

          {/* Desktop Table */}
          <div className="tariff-table-wrapper">
            <table className="tariff-table">
              <thead>
                <tr>
                  <th></th>
                  {tariffData.map((tariff, idx) => (
                    <th key={idx}>
                      <div className="tariff-name-header">
                        {tariff.name}
                        <small>тариф</small>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Блок 2: Подготовка фермы */}
                <tr>
                  <td>Телефонов</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.phones}</td>
                  ))}
                </tr>
                <tr>
                  <td>Аккаунтов в соцсетях</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.accounts}</td>
                  ))}
                </tr>
                <tr>
                  <td>Создание фермы</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.rent}</td>
                  ))}
                </tr>
                <tr>
                  <td>Дней на подготовку</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.days}</td>
                  ))}
                </tr>

                {/* Разрыв между секциями */}
                <tr className="section-break">
                  <td colSpan={5}></td>
                </tr>

                {/* Блок 3: Ежемесячные публикации */}
                <tr>
                  <td>Пакет публикаций</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}><strong>{tariff.posts}</strong></td>
                  ))}
                </tr>
                <tr>
                  <td>Стоимость пакета</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx} className="price-cell">{tariff.price}</td>
                  ))}
                </tr>
                <tr>
                  <td>🛡️ Гарантия просмотров</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.views}</td>
                  ))}
                </tr>
                <tr>
                  <td>Прогноз просмотров</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.forecast}</td>
                  ))}
                </tr>
                <tr>
                  <td>Стоимость 1 публикации</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.costPerPost}</td>
                  ))}
                </tr>
                <tr>
                  <td>Стоимость 1 просмотра</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.costPerView}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {tariffData.map((tariff, idx) => (
              <div key={idx} className="tariff-card">
                <div className="tariff-card-header">
                  <h3>{tariff.name}</h3>
                </div>
                <div className="tariff-card-body">
                  {/* Блок 2: Подготовка фермы */}
                  <div className="section-label-mobile">Подготовка фермы</div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Телефонов</span>
                    <span className="tariff-row-value">{tariff.phones}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Аккаунтов в соцсетях</span>
                    <span className="tariff-row-value">{tariff.accounts}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Создание фермы</span>
                    <span className="tariff-row-value">{tariff.rent}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Дней на подготовку</span>
                    <span className="tariff-row-value">{tariff.days}</span>
                  </div>

                  {/* Блок 3: Ежемесячные публикации */}
                  <div className="section-break-mobile"></div>
                  <div className="section-label-mobile">Ежемесячные публикации</div>
                  
                  <div className="tariff-row">
                    <span className="tariff-row-label">Пакет публикаций</span>
                    <span className="tariff-row-value"><strong>{tariff.posts}</strong></span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Стоимость пакета</span>
                    <span className="tariff-row-value" style={{ 
                      background: 'linear-gradient(135deg, rgb(74, 222, 128) 0%, rgb(34, 197, 94) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 800,
                      fontSize: 18
                    }}>{tariff.price}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">🛡️ Гарантия просмотров</span>
                    <span className="tariff-row-value">{tariff.views}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Прогноз просмотров</span>
                    <span className="tariff-row-value">{tariff.forecast}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Стоимость 1 публикации</span>
                    <span className="tariff-row-value">{tariff.costPerPost}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Стоимость 1 просмотра</span>
                    <span className="tariff-row-value">{tariff.costPerView}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ссылки */}
          <div className="farm-links">
            <Link href="/offer" className="farm-link">
              Гарантия по договору-оферте
            </Link>
            <Link href="/price_usd" className="farm-link">
              Тарифы в $ долларах
            </Link>
          </div>

          {/* FAQ секция */}
          <section className="faq-section">
            <h2 className="faq-title">Часто задаваемые вопросы</h2>
            <div className="faq-grid">
              {faqData.map((item, idx) => (
                <div key={idx} className="faq-item">
                  <div className="faq-question">{item.question || `Вопрос ${idx + 1}`}</div>
                  <div className="faq-answer">{item.answer || 'Ответ на вопрос будет добавлен позже'}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
