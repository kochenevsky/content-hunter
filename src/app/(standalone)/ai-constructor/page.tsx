'use client';

import React, { useState } from 'react';
import { OnboardingModal } from './OnboardingModal';

export default function ConstructorPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [botCreated, setBotCreated] = useState(false);

  const handleComplete = async (config: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bots/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '1', // TODO: Get from auth
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
        // Redirect to dashboard
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
      <div className="constructor-header">
        <h1>🤖 BotStudio</h1>
        <p>Создай бота за 5 минут без кода</p>
      </div>

      {botCreated ? (
        <div className="success-state">
          <div className="success-icon">✅</div>
          <h2>Бот создан!</h2>
          <p>Перенаправляем в кабинет...</p>
        </div>
      ) : (
        <div className="constructor-content">
          <button
            className="btn-create-large"
            onClick={() => setShowOnboarding(true)}
          >
            + Создать бота
          </button>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>5 минут</h3>
              <p>Создаёшь бота за 5 минут</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🆓</div>
              <h3>Тестируй</h3>
              <p>Бесплатно протестируй идею</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Зарабатывай</h3>
              <p>Подключи платежи и зарабатывай</p>
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

      <style jsx>{`
        .constructor-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f7f6f3 0%, #fff 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .constructor-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .constructor-header h1 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #f05a1a, #ff8c50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .constructor-header p {
          font-size: 18px;
          color: #6b6860;
        }

        .constructor-content {
          max-width: 600px;
          width: 100%;
        }

        .btn-create-large {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #f05a1a, #ff8c50);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 40px;
          box-shadow: 0 8px 24px rgba(240, 90, 26, 0.3);
        }

        .btn-create-large:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(240, 90, 26, 0.4);
        }

        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .feature {
          background: white;
          border: 1px solid #e5e3de;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .feature h3 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .feature p {
          font-size: 12px;
          color: #a09e97;
        }

        .success-state {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 16px;
          border: 2px solid #1a8a4a;
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .success-state h2 {
          color: #1a8a4a;
          margin-bottom: 8px;
        }

        .success-state p {
          color: #6b6860;
        }

        @media (max-width: 768px) {
          .features {
            grid-template-columns: 1fr;
          }

          .constructor-header h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}
