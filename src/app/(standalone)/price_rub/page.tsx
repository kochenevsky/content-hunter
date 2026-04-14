'use client';

import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

        /* ── HERO (уменьшенные отступы) ── */
        .farm-hero {
          padding: 40px 0 32px;
          position: relative;
        }
        @media (min-width: 768px) {
          .farm-hero { 
            padding: 48px 0 40px; 
          }
        }

        .farm-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 24px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #38bdf8;
          margin-bottom: 20px;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .farm-hero h1 {
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
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
          border: 1px solid rgba(56, 189, 248, 0.08);
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(10px);
          margin: 32px 0;
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
          border-bottom: 1px solid rgba(56, 189, 248, 0.1);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .tariff-table td {
          padding: 16px;
          text-align: center;
          border-bottom: 1px solid rgba(56, 189, 248, 0.06);
          color: #cbd5e1;
        }

        /* Разделитель между блоками */
        .section-divider td {
          border-bottom: 2px solid rgba(56, 189, 248, 0.2);
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
          color: #38bdf8;
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
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .views-cell {
          background: rgba(245, 158, 11, 0.08);
          color: #fbbf24;
          font-weight: 700;
          border-radius: 8px;
        }

        .help-icon-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .help-icon {
          width: 14px;
          height: 14px;
          color: #38bdf8;
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
          gap: 20px;
          margin: 32px 0;
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
          border: 1px solid rgba(56, 189, 248, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        }

        .tariff-card-header {
          padding: 20px;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(129, 140, 248, 0.02));
          border-bottom: 1px solid rgba(56, 189, 248, 0.1);
        }

        .tariff-card-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .tariff-card-price {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tariff-card-body {
          padding: 20px;
        }

        .tariff-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(56, 189, 248, 0.06);
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
          margin: 16px 0 8px;
          padding-top: 16px;
          border-top: 2px solid rgba(56, 189, 248, 0.15);
        }

        .section-label-mobile {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #38bdf8;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .tariff-views-highlight {
          background: rgba(245, 158, 11, 0.06);
          padding: 12px;
          border-radius: 10px;
          margin-top: 12px;
          border: 1px solid rgba(245, 158, 11, 0.1);
        }

        .tariff-views-highlight .tariff-row-value {
          color: #fbbf24;
          font-size: 18px;
          font-weight: 700;
        }

        /* Акценты */
        .accent-text {
          color: #38bdf8;
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
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)', 
                display: 'inline-block',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)'
              }} />
              Тарифы контент-фермы
            </div>

            <h1>
              Выберите подходящий{' '}
              <span style={{ 
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
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
                  <td>
                    <span className="help-icon-wrapper">
                      Создание фермы
                      <HelpCircle className="help-icon" />
                    </span>
                  </td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.rent}</td>
                  ))}
                </tr>
                <tr className="section-divider">
                  <td>Дней на подготовку</td>
                  {tariffData.map((tariff, idx) => (
                    <td key={idx}>{tariff.days}</td>
                  ))}
                </tr>

                {/* Блок 3: Ежемесячные публикации */}
                <tr>
                  <td>
                    <span className="help-icon-wrapper">
                      Пакет публикаций
                      <HelpCircle className="help-icon" />
                    </span>
                  </td>
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
                    <td key={idx} className="views-cell">{tariff.views}</td>
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
                  <div className="tariff-card-price">{tariff.price}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>в месяц</div>
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
                    <span className="tariff-row-label">
                      <span className="help-icon-wrapper">
                        Создание фермы
                        <HelpCircle className="help-icon" />
                      </span>
                    </span>
                    <span className="tariff-row-value">{tariff.rent}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Дней на подготовку</span>
                    <span className="tariff-row-value">{tariff.days}</span>
                  </div>

                  {/* Блок 3: Ежемесячные публикации */}
                  <div className="section-break-mobile">
                    <div className="section-label-mobile">Ежемесячные публикации</div>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">
                      <span className="help-icon-wrapper">
                        Пакет публикаций
                        <HelpCircle className="help-icon" />
                      </span>
                    </span>
                    <span className="tariff-row-value"><strong>{tariff.posts}</strong></span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Стоимость пакета</span>
                    <span className="tariff-row-value" style={{ 
                      background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 800,
                      fontSize: 18
                    }}>{tariff.price}</span>
                  </div>
                  <div className="tariff-views-highlight">
                    <div className="tariff-row">
                      <span className="tariff-row-label">🛡️ Гарантия просмотров</span>
                      <span className="tariff-row-value">{tariff.views}</span>
                    </div>
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
        </div>
      </div>
    </>
  );
}
