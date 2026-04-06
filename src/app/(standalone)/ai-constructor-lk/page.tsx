'use client';

import React, { useEffect, useState } from 'react';
import { Dashboard } from './Dashboard';

export default function CabinetPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Get userId from Telegram auth
    // For now, use hardcoded for testing
    const testUserId = '1';
    setUserId(testUserId);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="auth-required">
        <h2>Требуется авторизация</h2>
        <p>Используй Telegram для входа</p>
      </div>
    );
  }

  return <Dashboard userId={userId} />;
}

const styles = `
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f7f6f3;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e3de;
  border-top-color: #f05a1a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  margin-top: 16px;
  color: #6b6860;
}

.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f7f6f3;
  text-align: center;
}

.auth-required h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.auth-required p {
  color: #6b6860;
}
`;
