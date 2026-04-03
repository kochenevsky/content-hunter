import React, { useState, useEffect } from 'react';
import { BotConfig, BotAnalytics } from './types';

interface DashboardProps {
  userId: string;
}

export function Dashboard({ userId }: DashboardProps) {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<BotConfig | null>(null);
  const [analytics, setAnalytics] = useState<BotAnalytics | null>(null);

  useEffect(() => {
    fetchBots();
  }, [userId]);

  async function fetchBots() {
    try {
      const res = await fetch(`/api/bots?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setBots(data.data);
        if (data.data.length > 0) {
          setSelectedBot(data.data[0]);
          fetchAnalytics(data.data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalytics(botId: string) {
    try {
      const res = await fetch(`/api/bots/${botId}/analytics`);
      const data = await res.json();
      if (data.success) setAnalytics(data.data);
    } catch (e) {
      console.error(e);
    }
  }

  const handleSelectBot = (bot: BotConfig) => {
    setSelectedBot(bot);
    fetchAnalytics(bot.id);
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Мои боты</h1>
        <button className="btn-create">+ Создать бота</button>
      </div>

      {bots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h2>У вас ещё нет ботов</h2>
          <p>Создайте первого бота и начните зарабатывать</p>
          <button className="btn-primary">+ Создать бота</button>
        </div>
      ) : (
        <div className="dashboard-content">
          {/* Bot list */}
          <div className="bot-list">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className={`bot-card ${selectedBot?.id === bot.id ? 'active' : ''}`}
                onClick={() => handleSelectBot(bot)}
              >
                <div className="bot-name">{bot.name}</div>
                <div className="bot-handle">@{bot.tgBotUsername}</div>
                <div className="bot-date">Создан {new Date(bot.createdAt).toLocaleDateString('ru')}</div>
              </div>
            ))}
          </div>

          {/* Bot details */}
          {selectedBot && (
            <div className="bot-details">
              <div className="details-header">
                <div>
                  <h2>{selectedBot.name}</h2>
                  <p className="subtitle">@{selectedBot.tgBotUsername}</p>
                </div>
                <button className="btn-edit" onClick={() => console.log('edit')}>✏️ Редактировать</button>
              </div>

              {/* Analytics */}
              {analytics && (
                <div className="analytics-section">
                  <h3>Статистика</h3>

                  <div className="analytics-grid">
                    <div className="metric-card">
                      <div className="metric-label">Пользователей</div>
                      <div className="metric-value">{analytics.totalUsers}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Сообщений сегодня</div>
                      <div className="metric-value">
                        {analytics.dailyActivity[0]?.messages || 0}
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Новых пользователей</div>
                      <div className="metric-value">
                        {analytics.dailyActivity.reduce((sum, d) => sum + d.newUsers, 0)}
                      </div>
                    </div>
                  </div>

                  {/* Daily activity chart */}
                  <div className="chart-section">
                    <h4>Активность по дням</h4>
                    <div className="chart-bars">
                      {analytics.dailyActivity.map((day, idx) => (
                        <div key={idx} className="bar-container" title={day.date}>
                          <div
                            className="bar"
                            style={{
                              height: `${Math.max(10, (day.messages / 100) * 100)}%`,
                            }}
                          />
                          <div className="bar-label">{day.date.split('-')[2]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Editor */}
              <div className="editor-section">
                <h3>ИИ-редактор</h3>
                <AIEditor botId={selectedBot.id} onUpdate={() => fetchBots()} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AI Editor Component ──
function AIEditor({ botId, onUpdate }: { botId: string; onUpdate: () => void }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: 'Привет! Готов редактировать вашего бота. Что нужно изменить?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // In real implementation, send to AI editor API
      const response = await fetch(`/api/bots/${botId}/ai-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: userMessage }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.data.response }]);
        onUpdate();
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Ошибка при обновлении' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-avatar">{msg.role === 'ai' ? '🤖' : 'ОЕ'}</div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="editor-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Например: добавь кнопку для связи"
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading} className="btn-send">
          {loading ? '⏳' : '→'}
        </button>
      </div>
    </div>
  );
}

// ── Styles ──
const styles = `
.dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 700;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}

.bot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bot-card {
  padding: 16px;
  border: 1.5px solid #e5e3de;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  background: white;
}

.bot-card:hover {
  border-color: #c4c1bb;
  background: #f7f6f3;
}

.bot-card.active {
  border-color: #f05a1a;
  background: rgba(240, 90, 26, 0.05);
}

.bot-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.bot-handle {
  font-size: 12px;
  color: #a09e97;
  margin-bottom: 8px;
}

.bot-date {
  font-size: 11px;
  color: #c4c1bb;
}

.bot-details {
  background: white;
  border: 1px solid #e5e3de;
  border-radius: 12px;
  padding: 24px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0ede8;
}

.details-header h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.btn-edit {
  padding: 8px 16px;
  background: #f05a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

.analytics-section {
  margin-bottom: 32px;
}

.analytics-section h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.metric-card {
  background: #f7f6f3;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.metric-label {
  font-size: 11px;
  color: #a09e97;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 800;
  color: #f05a1a;
}

.chart-section {
  background: #f7f6f3;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 24px;
}

.chart-section h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.chart-bars {
  display: flex;
  gap: 6px;
  height: 80px;
  align-items: flex-end;
}

.bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.bar {
  width: 100%;
  background: #f05a1a;
  border-radius: 4px 4px 0 0;
  transition: opacity 0.15s;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
}

.bar-label {
  font-size: 10px;
  color: #a09e97;
}

.editor-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0ede8;
}

.editor-section h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
}

.editor {
  background: #f7f6f3;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: 400px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.message.ai .message-avatar {
  background: #f05a1a;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user {
  justify-content: flex-end;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #f05a1a, #ff8c50);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
}

.message-text {
  max-width: 70%;
  padding: 10px 12px;
  border-radius: 8px;
  background: white;
  line-height: 1.5;
}

.message.ai .message-text {
  background: white;
}

.message.user .message-text {
  background: #f05a1a;
  color: white;
}

.editor-input {
  padding: 12px;
  border-top: 1px solid #e5e3de;
  display: flex;
  gap: 8px;
}

.editor-input input {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid #e5e3de;
  border-radius: 8px;
  font-family: Inter, sans-serif;
  font-size: 13px;
}

.editor-input input:focus {
  outline: none;
  border-color: #f05a1a;
}

.btn-send {
  width: 36px;
  height: 36px;
  background: #f05a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.btn-send:hover:not(:disabled) {
  background: #d94d0f;
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e5e3de;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.empty-state p {
  color: #6b6860;
  margin-bottom: 20px;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 14px;
  color: #6b6860;
}

.btn-primary {
  padding: 12px 24px;
  background: #f05a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}

.btn-primary:hover {
  background: #d94d0f;
}

.btn-create {
  padding: 10px 18px;
  background: #f05a1a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

.subtitle {
  font-size: 13px;
  color: #a09e97;
}
`;
