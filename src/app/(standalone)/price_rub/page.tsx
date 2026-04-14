'use client';

import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StickyCta } from './_components/StickyCta';

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
    costPerView: '₽0,08',
    popular: false
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
    costPerView: '₽0,08',
    popular: true
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
    costPerView: '₽0,07',
    popular: false
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
    costPerView: '₽0,06',
    popular: false
  }
];

function RowItem({ 
  label, 
  value, 
  valueClassName 
}: { 
  label: string; 
  value: string; 
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={cn("font-medium text-gray-900", valueClassName)}>{value}</span>
    </div>
  );
}

export default function PriceRubPage() {
  return (
    <>
      <style>{`
        /* сброс — убираем любые внешние отступы/рамки */
        html, body { margin: 0; padding: 0; overflow-x: hidden; }

        .farm-root {
          background: #0b1220;
          min-height: 100vh;
          font-family: -apple-system,'SF Pro Display','Inter',system-ui,sans-serif;
          color: #f1f5f9;
          overflow-x: hidden;
          width: 100%;
        }

        .farm-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 16px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── HERO ── */
        .farm-hero {
          padding: 60px 0 48px;
          position: relative;
        }
        @media (min-width: 768px) {
          .farm-hero { padding: 80px 0 64px; }
        }

        .farm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          color: #4ade80;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .farm-hero h1 {
          font-size: clamp(26px, 5vw, 52px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
          color: #fff;
        }

        /* ── SECTIONS ── */
        .farm-section {
          padding: 56px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          width: 100%;
          box-sizing: border-box;
        }

        .farm-section h2 {
          font-size: clamp(22px, 4vw, 40px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 32px;
        }

        .farm-divider {
          width: 40px;
          height: 3px;
          background: #22c55e;
          border-radius: 2px;
          margin-bottom: 28px;
        }

        /* Таблица */
        .tariff-table-wrapper {
          overflow-x: auto;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          margin: 32px 0;
        }

        .tariff-table {
          width: 100%;
          border-collapse: collapse;
        }

        .tariff-table th {
          padding: 20px 16px;
          text-align: center;
          font-weight: 600;
          color: #94a3b8;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 14px;
        }

        .tariff-table td {
          padding: 16px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          color: #cbd5e1;
        }

        .tariff-table tr:last-child td {
          border-bottom: none;
        }

        .tariff-table th:first-child,
        .tariff-table td:first-child {
          text-align: left;
          font-weight: 600;
          color: #f1f5f9;
          position: sticky;
          left: 0;
          background: #0b1220;
        }

        .tariff-name {
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .popular-badge {
          display: inline-block;
          background: rgba(34,197,94,0.2);
          color: #4ade80;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 600;
        }

        .price-cell {
          font-size: 20px;
          font-weight: 800;
          color: #4ade80;
        }

        .views-cell {
          background: rgba(245,158,11,0.1);
          color: #fbbf24;
          font-weight: 700;
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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
        }

        .tariff-card.popular {
          border-color: rgba(34,197,94,0.4);
          box-shadow: 0 0 0 1px rgba(34,197,94,0.2);
        }

        .tariff-card-header {
          padding: 20px;
          background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(22,163,74,0.04));
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .tariff-card-header h3 {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }

        .tariff-card-price {
          font-size: 28px;
          font-weight: 900;
          color: #4ade80;
        }

        .tariff-card-body {
          padding: 20px;
        }

        .tariff-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .tariff-row:last-child {
          border-bottom: none;
        }

        .tariff-row-label {
          color: #94a3b8;
          font-size: 14px;
        }

        .tariff-row-value {
          color: #f1f5f9;
          font-weight: 600;
        }

        .tariff-views-highlight {
          background: rgba(245,158,11,0.1);
          padding: 12px;
          border-radius: 12px;
          margin-top: 12px;
        }

        .tariff-views-highlight .tariff-row-value {
          color: #fbbf24;
          font-size: 20px;
          font-weight: 800;
        }

        /* Final CTA */
        .farm-final {
          background: linear-gradient(135deg,rgba(34,197,94,0.1),rgba(22,163,74,0.04));
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 20px;
          padding: 36px 24px;
          text-align: center;
          margin: 48px 0 64px;
          box-sizing: border-box;
          width: 100%;
        }
        @media (min-width: 768px) {
          .farm-final { padding: 52px 72px; }
        }

        .farm-final h3 {
          font-size: clamp(20px, 3vw, 30px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .farm-final p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 22px;
        }

        .farm-final-btn {
          display: block;
          max-width: 360px;
          margin: 0 auto;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 24px rgba(34,197,94,0.3);
          transition: opacity 0.15s;
          text-align: center;
        }
        .farm-final-btn:hover { opacity: 0.9; }

        .farm-final-note {
          font-size: 11px;
          color: #334155;
          margin-top: 10px;
        }

        .help-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-left: 6px;
          color: #475569;
          cursor: help;
        }
      `}</style>

      <div className="farm-root">
        <div className="farm-container">
          {/* Hero Section */}
          <section className="farm-hero">
            <div className="farm-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              Тарифы контент-фермы
            </div>

            <h1>
              Выберите подходящий{' '}
              <span style={{ color: '#4ade80' }}>
                тариф
              </span>
            </h1>
          </section>

          {/* Desktop Table */}
          <div className="tariff-table-wrapper">
            <table className="tariff-table">
              <thead>
                <tr>
                  <th>Параметр</th>
                  {tariffData.map((tariff, idx) => (
                    <th key={idx}>
                      <div className="tariff-name">{tariff.name}</div>
                      {tariff.popular && <span className="popular-badge">Популярный</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Телефонов-ферм</td>
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
                  <td>Аренда фермы в месяц</td>
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
              <div key={idx} className={`tariff-card ${tariff.popular ? 'popular' : ''}`}>
                <div className="tariff-card-header">
                  <h3>{tariff.name}</h3>
                  <div className="tariff-card-price">{tariff.price}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>в месяц</div>
                  {tariff.popular && <span className="popular-badge" style={{ marginTop: 8 }}>Популярный</span>}
                </div>
                <div className="tariff-card-body">
                  <div className="tariff-row">
                    <span className="tariff-row-label">Телефонов-ферм</span>
                    <span className="tariff-row-value">{tariff.phones}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Аккаунтов в соцсетях</span>
                    <span className="tariff-row-value">{tariff.accounts}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Аренда фермы</span>
                    <span className="tariff-row-value">{tariff.rent}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Дней на подготовку</span>
                    <span className="tariff-row-value">{tariff.days}</span>
                  </div>
                  <div className="tariff-row">
                    <span className="tariff-row-label">Пакет публикаций</span>
                    <span className="tariff-row-value"><strong>{tariff.posts}</strong></span>
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

          {/* Final CTA */}
          <div className="farm-final">
            <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
            <h3>
              Готовы запустить<br />
              <span style={{ color: '#4ade80' }}>свою ферму?</span>
            </h3>
            <p>
              Построить такую ферму самостоятельно — ~20 000 000 ₽.<br />
              Аренда в Content Hunter — от 25 000 ₽ в месяц.<br />
              Настройка и установка — 0 ₽.
            </p>
            <a
              href="https://sbsite.pro//eu_site_calc_1"
              target="_blank"
              rel="noopener noreferrer"
              className="farm-final-btn"
            >
              Рассчитать для моей ниши →
            </a>
            <p className="farm-final-note">Бесплатно · Гарантия просмотров в договоре</p>
          </div>
        </div>
      </div>

      <StickyCta
        href="https://sbsite.pro//eu_site_calc_1"
        label="Рассчитать для моей ниши"
        stickyLabel="Рассчитать для моей ниши"
        alwaysShowSticky
      />
    </>
  );
}
