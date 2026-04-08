'use client';

import React, { useState } from 'react';
import { OnboardingModal } from './OnboardingModal';

export default function ConstructorPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [botCreated, setBotCreated] = useState(false);

  const handleComplete = async (config: any) => {
    try {
      const res = await fetch(`https://ai-constructor.oxion-ezhkov.workers.dev/api/bots/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '1',
          idea: config.idea,
          structure: config.structure,
          content: config.content,
          tgToken: config.tgToken,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBotCreated(true);
        setShowOnboarding(false);
        setTimeout(() => {
          window.location.href = '/ai-constructor-lk';
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка при создании бота');
    }
  };

  return (
    <div className="constructor-page">
      <div className="constructor-container">
        <div className="constructor-header">
          <h1>BotStudio</h1>
          <p>Создайте бота за 5 минут без кода</p>
        </div>

        {botCreated ? (
          <div className="success-state">
            <div className="success-indicator" />
            <h2>Бот создан</h2>
            <p>Перенаправляем в кабинет...</p>
          </div>
        ) : (
          <div className="constructor-content">
            <button
              className="btn-primary"
              onClick={() => setShowOnboarding(true)}
            >
              <span>Создать бота</span>
              <span className="arrow">→</span>
            </button>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-meta">
                  <span>01</span>
                  <h3>Быстрый старт</h3>
                </div>
                <p>Создайте и запустите бота всего за 5 минут</p>
              </div>
              <div className="feature-item">
                <div className="feature-meta">
                  <span>02</span>
                  <h3>Тестирование</h3>
                </div>
                <p>Бесплатно проверьте гипотезы и идеи</p>
              </div>
              <div className="feature-item">
                <div className="feature-meta">
                  <span>03</span>
                  <h3>Монетизация</h3>
                </div>
                <p>Подключите приём платежей и зарабатывайте</p>
              </div>
            </div>
          </div>
        )}

        {showOnboarding && (
          <OnboardingModal
            onComplete={handleComplete}
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </div>

      <style jsx>{`
        .constructor-page {
          min-height: 100vh;
          background: #fafaf9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .constructor-container {
          max-width: 680px;
          width: 100%;
        }

        .constructor-header {
          text-align: left;
          margin-bottom: 3rem;
        }

        .constructor-header h1 {
          font-size: 2.5rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #171717;
          margin-bottom: 0.5rem;
        }

        .constructor-header p {
          font-size: 1rem;
          color: #6b6b6b;
          font-weight: 400;
        }

        .constructor-content {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 1rem 1.5rem;
          background: #171717;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
          text-align: left;
        }

        .btn-primary:hover {
          background: #2b2b2b;
        }

        .arrow {
          font-size: 1.25rem;
          opacity: 0.8;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-meta {
          border-bottom: 1px solid #e2e2e0;
          padding-bottom: 0.75rem;
        }

        .feature-meta span {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #a1a09a;
          margin-bottom: 0.25rem;
        }

        .feature-meta h3 {
          font-size: 1rem;
          font-weight: 500;
          color: #171717;
          margin: 0;
        }

        .feature-item p {
          font-size: 0.875rem;
          color: #6b6b6b;
          line-height: 1.4;
          margin: 0;
        }

        .success-state {
          text-align: center;
          padding: 2.5rem;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e2e0;
        }

        .success-indicator {
          width: 48px;
          height: 48px;
          background: #171717;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          position: relative;
        }

        .success-indicator::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 1.5rem;
        }

        .success-state h2 {
          font-size: 1.5rem;
          font-weight: 500;
          color: #171717;
          margin-bottom: 0.5rem;
        }

        .success-state p {
          color: #6b6b6b;
          margin: 0;
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .constructor-header h1 {
            font-size: 2rem;
          }

          .btn-primary {
            padding: 0.875rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
