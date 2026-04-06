import React, { useState } from 'react';
import { BotStructure, BotContent, Button, Flow } from './types';

import type { BotStructure, BotContent, Button } from './types';

interface OnboardingProps {
  onComplete: (config: { idea: string; structure: BotStructure; content: BotContent; tgToken: string }) => void;
  onClose: () => void;
}

export function OnboardingModal({ onComplete, onClose }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState('');
  const [structure, setStructure] = useState<BotStructure | null>(null);
  const [content, setContent] = useState<BotContent>({});
  const [tgToken, setTgToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Idea
  const handleIdeaSubmit = async () => {
    if (!idea.trim()) {
      setError('Опишите идею бота');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bots/generate-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (data.success) {
        setStructure(data.data);
        setStep(2);
      } else {
        setError(data.error || 'Ошибка генерации');
      }
    } catch (e) {
      setError('Ошибка подключения');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Structure agreement
  const handleStructureEdit = (field: string, value: any) => {
    setStructure(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleButtonEdit = (btnIndex: number, field: string, value: string) => {
    if (!structure) return;
    const newButtons = [...structure.mainButtons];
    newButtons[btnIndex] = { ...newButtons[btnIndex], [field]: value };
    setStructure({ ...structure, mainButtons: newButtons });
  };

  const handleStructureNext = () => {
    if (!structure?.greeting.trim() || structure.mainButtons.length === 0) {
      setError('Заполните приветствие и кнопки');
      return;
    }
    setError('');
    setStep(3);
  };

  // Step 3: Content
  const handleContentChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleContentSubmit = () => {
    setStep(4);
  };

  // Step 4: Telegram token
  const handleTgTokenSubmit = () => {
    if (!tgToken.trim()) {
      setError('Вставьте токен бота');
      return;
    }
    setError('');
    onComplete({ idea, structure: structure!, content, tgToken });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Создание бота — шаг {step}/4</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {step === 1 && <StepIdea idea={idea} setIdea={setIdea} loading={loading} error={error} onNext={handleIdeaSubmit} />}
          {step === 2 && structure && (
            <StepStructure 
              structure={structure} 
              error={error}
              onEditGreeting={(v) => handleStructureEdit('greeting', v)}
              onEditButton={handleButtonEdit}
              onNext={handleStructureNext}
            />
          )}
          {step === 3 && structure && (
            <StepContent 
              structure={structure}
              content={content}
              onChangeContent={handleContentChange}
              onNext={handleContentSubmit}
            />
          )}
          {step === 4 && (
            <StepTgToken 
              tgToken={tgToken}
              setTgToken={setTgToken}
              loading={loading}
              error={error}
              onSubmit={handleTgTokenSubmit}
            />
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && <button className="btn-secondary" onClick={() => setStep(step - 1)}>← Назад</button>}
          {step < 4 && <button className="btn-primary" onClick={() => {
            if (step === 1) handleIdeaSubmit();
            else if (step === 2) handleStructureNext();
            else if (step === 3) handleContentSubmit();
          }} disabled={loading}>Далее →</button>}
          {step === 4 && <button className="btn-primary" onClick={handleTgTokenSubmit} disabled={loading}>{loading ? '⏳' : '✓'} Создать</button>}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Idea ──
function StepIdea({ 
  idea, 
  setIdea, 
  loading, 
  error, 
  onNext 
}: {
  idea: string;
  setIdea: (value: string) => void;
  loading: boolean;
  error: string;
  onNext: () => void;
}) {
  return (
    <div>
      <h3>Опишите идею вашего бота</h3>
      <p className="subtitle">Например: "Бот для записи в барбершоп" или "FAQ помощник"</p>
      <textarea
        value={idea}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIdea(e.target.value)}
        placeholder="Мой бот будет..."
        rows={4}
        disabled={loading}
        className="input-textarea"
      />
      {error && <div className="error-text">{error}</div>}
      <p className="hint">💡 ИИ сам придумает структуру бота на основе вашей идеи</p>
    </div>
  );
}

// ── Step 2: Structure ──
function StepStructure({ 
  structure, 
  error, 
  onEditGreeting, 
  onEditButton, 
  onNext 
}: {
  structure: BotStructure;
  error: string;
  onEditGreeting: (value: string) => void;
  onEditButton: (index: number, field: string, value: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h3>Согласование структуры</h3>
      
      <div className="form-group">
        <label>Приветственное сообщение</label>
        <textarea
          value={structure.greeting}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onEditGreeting(e.target.value)}
          rows={2}
          className="input-textarea"
        />
      </div>

      <div className="form-group">
        <label>Главные кнопки</label>
        {structure.mainButtons.map((btn: Button, idx: number) => (
          <div key={idx} className="button-edit">
            <input
              type="text"
              placeholder="Текст кнопки"
              value={btn.text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEditButton(idx, 'text', e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Action ID"
              value={btn.action}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEditButton(idx, 'action', e.target.value)}
              className="input"
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Сообщение по умолчанию</label>
        <input
          type="text"
          value={structure.fallbackMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEditGreeting(e.target.value)}
          className="input"
        />
      </div>

      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

// ── Step 3: Content ──
function StepContent({ 
  structure, 
  content, 
  onChangeContent, 
  onNext 
}: {
  structure: BotStructure;
  content: BotContent;
  onChangeContent: (key: string, value: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h3>Наполнение контента</h3>
      <p className="subtitle">Заполните текст для каждого блока</p>

      <div className="form-group">
        <label>Приветствие</label>
        <textarea
          value={content['greeting'] || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChangeContent('greeting', e.target.value)}
          rows={2}
          className="input-textarea"
        />
      </div>

      {structure.mainButtons.map((btn: Button, idx: number) => (
        <div key={idx} className="form-group">
          <label>{btn.text}</label>
          <textarea
            value={content[btn.action] || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChangeContent(btn.action, e.target.value)}
            rows={2}
            placeholder={`Текст для ${btn.text}`}
            className="input-textarea"
          />
        </div>
      ))}
    </div>
  );
}

// ── Step 4: Telegram Token ──
function StepTgToken({ 
  tgToken, 
  setTgToken, 
  loading, 
  error, 
  onSubmit 
}: {
  tgToken: string;
  setTgToken: (value: string) => void;
  loading: boolean;
  error: string;
  onSubmit: () => void;
}) {
  return (
    <div>
      <h3>Подключение Telegram бота</h3>
      
      <div className="instruction">
        <p><strong>Как получить токен:</strong></p>
        <ol>
          <li>Напишите боту <code>@BotFather</code> в Telegram</li>
          <li>Команда <code>/newbot</code></li>
          <li>Выберите имя и юзернейм</li>
          <li>Копируйте токен и вставьте ниже</li>
        </ol>
      </div>

      <div className="form-group">
        <label>API Token BotFather</label>
        <input
          type="password"
          value={tgToken}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTgToken(e.target.value)}
          placeholder="123456:ABCdefGHIjklmnoPQRstuvWXYZ"
          className="input"
        />
        <p className="hint">🔒 Ваш ключ не будет доступен другим</p>
      </div>

      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

// ── Styles ──
const styles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e5e3de;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #a09e97;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e3de;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.input,
.input-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e5e3de;
  border-radius: 8px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  resize: none;
}

.input:focus,
.input-textarea:focus {
  outline: none;
  border-color: #f05a1a;
  box-shadow: 0 0 0 3px rgba(240,90,26,0.1);
}

.button-edit {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.button-edit input {
  flex: 1;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.btn-primary {
  background: #f05a1a;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #d94d0f;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #6b6860;
  border: 1.5px solid #e5e3de;
}

.btn-secondary:hover {
  background: #f3f2ef;
}

.subtitle {
  font-size: 13px;
  color: #6b6860;
  margin-bottom: 16px;
}

.error-text {
  color: #c0392b;
  font-size: 12px;
  margin-top: 8px;
}

.hint {
  font-size: 12px;
  color: #a09e97;
  margin-top: 6px;
}

.instruction {
  background: #f7f6f3;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
}

.instruction ol {
  margin-left: 20px;
  margin-top: 8px;
}

.instruction li {
  margin-bottom: 6px;
}

.instruction code {
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}
`;
