// ── Bot Configuration ──
export interface BotConfig {
  id: string;
  userId: string;
  name: string;
  idea: string;
  structure: BotStructure;
  content: BotContent;
  tgToken: string;
  tgBotUsername: string;
  createdAt: number;
  updatedAt: number;
  webhookUrl: string;
}

export interface BotStructure {
  greeting: string;
  mainButtons: Button[];
  flows: Flow[];
  fallbackMessage: string;
}

export interface Button {
  id: string;
  text: string;
  action: string;
  emoji?: string;
}

export interface Flow {
  id: string;
  name: string;
  steps: Step[];
}

export interface Step {
  id: string;
  type: 'text' | 'buttons' | 'input' | 'confirmation';
  question: string;
  buttons?: Button[];
  placeholder?: string;
}

export interface BotContent {
  [key: string]: string;
}

// ── Analytics ──
export interface BotAnalytics {
  totalUsers: number;
  activeUsers7d: number;
  dailyActivity: DailyStats[];
  totalMessages: number;
  messagesPerDay: Record<string, number>;
  lastUpdated: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  messages: number;
  newUsers: number;
}

export interface UserEvent {
  userId: string;
  botId: string;
  type: 'message' | 'button_click' | 'start';
  timestamp: number;
  messageCount?: number;
}

// ── API Responses ──
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateBotPayload {
  idea: string;
  structure: BotStructure;
  content: BotContent;
  tgToken: string;
}

// ── Gemini Response ──
export interface GeminiStructure {
  name: string;
  greeting: string;
  mainButtons: Array<{
    text: string;
    action: string;
    emoji: string;
  }>;
  flows: Array<{
    id: string;
    name: string;
    steps: Array<{
      id: string;
      type: string;
      question: string;
      buttons?: Array<{ text: string; action: string }>;
    }>;
  }>;
  fallbackMessage: string;
}
