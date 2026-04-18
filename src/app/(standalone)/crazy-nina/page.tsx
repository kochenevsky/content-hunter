// src/app/(standalone)/crazy-nina/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


// ============================================================================
// Types
// ============================================================================

type Currency = {
  code: string;
  sym: string;
  name: string;
};

type Category = {
  id: string;
  label: string;
  color: string;
};

type Day = {
  id: number;
  name: string;
  date: string;
};

type Event = {
  id: number;
  dayId: number | null;
  cat: string;
  icon: string;
  name: string;
  desc: string;
  price: number;
  duration: string;
  links: string[];
};

type Idea = {
  id: number;
  icon: string;
  title: string;
  desc: string;
};

type Doc = {
  id: number;
  icon: string;
  name: string;
  desc: string;
  links: string[];
};

type Trip = {
  id: number;
  name: string;
  icon: string;
  country: string;
  route: string;
  start: string;
  end: string;
  people: number;
  budget: number;
  currency: string;
  theme: "dark" | "light";
  mainColor: "green" | "blue" | "orange" | "purple";
  days: Day[];
  events: Event[];
  ideas: Idea[];
  docs: Doc[];
};

type AppState = {
  currentTrip: number;
  trips: Trip[];
  currentSection: Section;
  aiOpen: boolean;
  navOpen: boolean;
  username: string | null;
};

type Section = "days" | "budget" | "transport" | "hotels" | "docs" | "ideas";

type AIMessage = {
  role: "user" | "bot";
  content: string;
  confirmAction?: () => void;
};

// ============================================================================
// Constants
// ============================================================================

const CURRENCIES: Currency[] = [
  { code: "RUB", sym: "₽", name: "Рубль" },
  { code: "USD", sym: "$", name: "Доллар" },
  { code: "EUR", sym: "€", name: "Евро" },
  { code: "THB", sym: "฿", name: "Бат" },
  { code: "IDR", sym: "Rp", name: "Рупия" },
  { code: "TRY", sym: "₺", name: "Лира" },
  { code: "GEL", sym: "₾", name: "Лари" },
  { code: "AED", sym: "د.إ", name: "Дирхам" },
];

const CATEGORIES: Category[] = [
  { id: "transport", label: "✈️ Транспорт", color: "var(--blue)" },
  { id: "hotel", label: "🏨 Жильё", color: "var(--leaf)" },
  { id: "food", label: "🍜 Еда", color: "var(--sun)" },
  { id: "activity", label: "🎢 Активность", color: "var(--pink)" },
  { id: "document", label: "📄 Документ", color: "#90A4AE" },
  { id: "note", label: "📝 Заметка", color: "rgba(255,255,255,.4)" },
];

const ICONS_ALL = [
  "✈️", "🚂", "🚌", "🛥️", "🚖", "🚗", "🛵", "🛸", "🏨", "🏡", "⛺", "🏕️",
  "🍜", "🍣", "🍕", "🍺", "☕", "🛕", "🏖️", "🏔️", "🤿", "🏄", "🎭", "🛍️",
  "💆", "🐘", "🦁", "🦜", "🐼", "📄", "🎫", "🗺️", "💊", "📸", "🌅", "🎆",
  "💡", "⚡", "📝", "🔑", "💳", "🛂", "🌐",
];

const TRIP_ICONS = [
  "🌴", "🏝️", "🗺️", "🌍", "🏔️", "🏕️", "✈️", "🚀", "⛵", "🎒",
  "🌊", "🌺", "🦁", "🐘", "🦜", "🐼", "🎡", "🏯", "🗼", "🌋",
];

const DAY_COLORS = [
  "linear-gradient(135deg,#43A047,#1B5E20)",
  "linear-gradient(135deg,#1E88E5,#0D47A1)",
  "linear-gradient(135deg,#F06292,#880E4F)",
  "linear-gradient(135deg,#FFD700,#FF8C00)",
  "linear-gradient(135deg,#8E24AA,#4A148C)",
  "linear-gradient(135deg,#0097A7,#004D40)",
  "linear-gradient(135deg,#E53935,#B71C1C)",
  "linear-gradient(135deg,#F57F17,#BF360C)",
];

const BUDGET_CATS = [
  { id: "transport", label: "✈️ Транспорт", color: "linear-gradient(90deg,#1E88E5,#0D47A1)" },
  { id: "hotel", label: "🏨 Жильё", color: "linear-gradient(90deg,#43A047,#1B5E20)" },
  { id: "activity", label: "🎢 Активности", color: "linear-gradient(90deg,#F06292,#880E4F)" },
  { id: "food", label: "🍜 Еда", color: "linear-gradient(90deg,#FFD700,#FF8C00)" },
  { id: "document", label: "📄 Прочее", color: "linear-gradient(90deg,#90A4AE,#546E7A)" },
];

const API_BASE = "https://crazy-nina.oxion-ezhkov.workers.dev";
const API_ACTION = `${API_BASE}/api/action`; // 👈 ДОБАВИТЬ

// ============================================================================
// Default Data
// ============================================================================

const createEmptyTrip = (): Trip => ({
  id: 0,
  name: "Новое путешествие",
  icon: "🌴",
  country: "",
  route: "",
  start: "",
  end: "",
  people: 1,
  budget: 0,
  currency: "RUB",
  theme: "dark",
  mainColor: "green",
  days: [],
  events: [],
  ideas: [],
  docs: [],
});

// 👇 ДОБАВИТЬ СЮДА - функцию загрузки с Worker
const loadTripsFromWorker = async (username: string): Promise<Trip[] | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/trips/${username}`);
    if (!res.ok) return null;
    const trips = await res.json();
    
    // 👇 Проверка что это массив и не пустой
    if (!Array.isArray(trips) || trips.length === 0) return null;
    
    // 👇 Проверка что есть хотя бы один трип с данными
    const hasData = trips.some(t => t.name || t.days?.length > 0);
    
    return hasData ? trips : null;
  } catch (e) {
    console.error("Failed to load from worker:", e);
    return null;
  }
};

// 👇 ДОБАВИТЬ СЮДА - функцию сохранения в Worker
const saveTripsToWorker = async (username: string, trips: Trip[]): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/trips/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trips),
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to save to worker:", e);
    return false;
  }
};

// 👇 ДОБАВИТЬ СЮДА
const applyActionOnWorker = async (
  username: string, 
  tripId: number, 
  action: any
): Promise<Trip | null> => {
  try {
    const res = await fetch(API_ACTION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, tripId, action }),
    });
    
    if (!res.ok) {
      console.error("Action failed:", res.status);
      return null;
    }
    
    const data = await res.json();
    console.log("Action response:", data); // ← ДОБАВИТЬ ЛОГ
    return data.trip || null;
  } catch (e) {
    console.error("Failed to apply action:", e);
    return null;
  }
};

// ============================================================================
// Hooks & Utilities
// ============================================================================

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue];
};

const dateStr = (d: string): string => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
};

const nightsBetween = (a: string, b: string): number => {
  if (!a || !b) return 0;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
};

// ============================================================================
// Main Component
// ============================================================================

export default function CrazyNinaPage() {
  // State
  const [appState, setAppState] = useLocalStorage<AppState>("crazy-nina-state", {
    currentTrip: 0,
  trips: [createEmptyTrip()],
    currentSection: "days",
    aiOpen: false,
    navOpen: false,
    username: null,
  });

  const [showUsernamePrompt, setShowUsernamePrompt] = useState(!appState.username);
  const [tempUsername, setTempUsername] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<(() => void) | null>(null);

  // Modals state
  const [modalEvent, setModalEvent] = useState<{ open: boolean; editId: number | null; sectionOverride: string | null }>({ open: false, editId: null, sectionOverride: null });
  const [modalDay, setModalDay] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });
  const [modalTrip, setModalTrip] = useState<{ open: boolean; isNew: boolean }>({ open: false, isNew: false });
  const [modalIdea, setModalIdea] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });

  // Form state
  const [eventForm, setEventForm] = useState({ cat: "activity", icon: "🎢", name: "", desc: "", price: "", duration: "", links: "", dayId: "" });
  const [dayForm, setDayForm] = useState({ name: "", date: "" });
  const [tripForm, setTripForm] = useState({ name: "", icon: "🌴", country: "", route: "", start: "", end: "", people: 2, budget: "", currency: "RUB"});
  const [ideaForm, setIdeaForm] = useState({ icon: "💡", title: "", desc: "" });

  // Refs
  const mainRef = useRef<HTMLDivElement>(null);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);

  const trip = appState.trips[appState.currentTrip];
  const sym = CURRENCIES.find((c) => c.code === trip.currency)?.sym || "₽";
  const fmt = (v: number) => (v ? `${sym} ${v.toLocaleString("ru")}` : "");

    // 👇 ДОБАВИТЬ СЮДА - ref для отслеживания первого рендера
  const isFirstRender = useRef(true);
  
  // 👇 ДОБАВИТЬ СЮДА - ref для отслеживания изменений trips
  const prevTripsRef = useRef(appState.trips);
  // ==========================================================================
  // Theme & Color Application
  // ==========================================================================

useEffect(() => {
  if (!appState.username && appState.trips.length > 0) {
    const hasRealData = appState.trips.some(t => t.name !== "" || t.days.length > 0);
    if (hasRealData) {
      setAppState({
        ...appState,
        trips: [createEmptyTrip()],
        currentTrip: 0,
      });
    }
  }
}, []);
    
  useEffect(() => {
    const root = document.documentElement;
    const t = trip;

    // Theme
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(t.theme === "light" ? "light-theme" : "dark-theme");

    // Main color
    const colorMap = {
  green: { 
    leaf: "#8BC34A", 
    mid: "#2d5a3d", 
    bright: "#3d7a50", 
    border: "rgba(139,195,74,0.2)",
    sun: "#FFD700",
    sun2: "#FF8C00",
  },
  blue: { 
    leaf: "#42A5F5", 
    mid: "#1565C0", 
    bright: "#1E88E5", 
    border: "rgba(66,165,245,0.3)",
    sun: "#FFD700",
    sun2: "#FF8C00",
  },
  orange: { 
    leaf: "#FFA726", 
    mid: "#E65100", 
    bright: "#FB8C00", 
    border: "rgba(255,167,38,0.3)",
    sun: "#FFD700",
    sun2: "#FF8C00",
  },
  purple: { 
    leaf: "#AB47BC", 
    mid: "#6A1B9A", 
    bright: "#8E24AA", 
    border: "rgba(171,71,188,0.3)",
    sun: "#FFD700",
    sun2: "#FF8C00",
  },
};

const c = colorMap[t.mainColor];
root.style.setProperty("--leaf", c.leaf);
root.style.setProperty("--j-mid", c.mid);
root.style.setProperty("--j-bright", c.bright);
root.style.setProperty("--border", c.border);
root.style.setProperty("--sun", c.sun);
root.style.setProperty("--sun2", c.sun2);
  }, [trip]);
// 👇 ДОБАВИТЬ СЮДА - загрузка данных при входе
useEffect(() => {
  const loadData = async () => {
    if (appState.username && isFirstRender.current) {
      isFirstRender.current = false;
      
      const workerTrips = await loadTripsFromWorker(appState.username);
      
      if (workerTrips) {
        // Данные есть в Worker - используем их
        setAppState({
          ...appState,
          trips: workerTrips,
          currentTrip: 0,
        });
        showToast(`Синхронизировано с облаком 🦜`);
      } else if (appState.trips.length === 1 && appState.trips[0].name === "") {
        // Пустой трип - отправляем в Worker
        await saveTripsToWorker(appState.username, appState.trips);
      }
    }
  };
  
  loadData();
}, [appState.username]);

// 👇 ДОБАВИТЬ СЮДА - синхронизация при изменении trips
useEffect(() => {
  const syncData = async () => {
    // Пропускаем первый рендер (уже обработан выше)
    if (isFirstRender.current) return;
    
    // Проверяем, что trips реально изменились
    if (JSON.stringify(prevTripsRef.current) === JSON.stringify(appState.trips)) return;
    
    prevTripsRef.current = appState.trips;
    
    if (appState.username) {
      const success = await saveTripsToWorker(appState.username, appState.trips);
      if (success) {
        console.log("🦜 Synced to worker");
      }
    }
  };
  
  syncData();
}, [appState.trips, appState.username]);
    
  // ==========================================================================
  // Username
  // ==========================================================================

  const handleSetUsername = async () => {
  const trimmed = tempUsername.trim();
  if (/^[a-zA-Z0-9_-]{3,30}$/.test(trimmed)) {
    setShowUsernamePrompt(false);
    
    // 👇 Сначала ставим пустой трип из LocalStorage (мгновенно)
    const emptyTrip = createEmptyTrip();
    setAppState({
      ...appState,
      username: trimmed,
      trips: [emptyTrip],
      currentTrip: 0,
    });
    
    // 👇 Потом в фоне пробуем загрузить из Worker
    const workerTrips = await loadTripsFromWorker(trimmed);
    
    if (workerTrips) {
      // Обновляем UI данными из облака
      setAppState({
        ...appState,
        trips: workerTrips,
      });
      showToast(`С возвращением, @${trimmed}! 🦜`);
    } else {
      // Сохраняем пустой трип в Worker
      await saveTripsToWorker(trimmed, [emptyTrip]);
      showToast(`Привет, @${trimmed}! 🦜`);
    }
  }
};

  // ==========================================================================
  // Helpers
  // ==========================================================================

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const closeAllModals = () => {
    setModalEvent({ open: false, editId: null, sectionOverride: null });
    setModalDay({ open: false, editId: null });
    setModalTrip({ open: false, isNew: false });
    setModalIdea({ open: false, editId: null });
  };

  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  // ==========================================================================
  // Trip CRUD
  // ==========================================================================

  const saveTrip = () => {
    if (!tripForm.name.trim()) {
      showToast("Введите название");
      return;
    }

    const newTrip: Trip = {
      id: modalTrip.isNew ? generateId() : trip.id,
      name: tripForm.name,
      icon: tripForm.icon,
      country: tripForm.country,
      route: tripForm.route,
      start: tripForm.start,
      end: tripForm.end,
      people: tripForm.people,
      budget: parseFloat(tripForm.budget) || 0,
      currency: tripForm.currency,
      theme: "dark",
      mainColor: "green",
      days: modalTrip.isNew ? [] : trip.days,
      events: modalTrip.isNew ? [] : trip.events,
      ideas: modalTrip.isNew ? [] : trip.ideas,
      docs: modalTrip.isNew ? [] : trip.docs,
    };

    const newTrips = modalTrip.isNew
      ? [...appState.trips, newTrip]
      : appState.trips.map((t) => (t.id === trip.id ? newTrip : t));

    setAppState({
      ...appState,
      trips: newTrips,
      currentTrip: modalTrip.isNew ? newTrips.length - 1 : appState.currentTrip,
    });

    closeAllModals();
    showToast(modalTrip.isNew ? "Путешествие создано!" : "Сохранено");
    if (appState.username) {
  saveTripsToWorker(appState.username, newTrips);
}
  };

  const deleteTrip = (id: number) => {
    if (appState.trips.length === 1) {
      showToast("Нельзя удалить последнее путешествие");
      return;
    }
    const newTrips = appState.trips.filter((t) => t.id !== id);
    setAppState({
      ...appState,
      trips: newTrips,
      currentTrip: Math.min(appState.currentTrip, newTrips.length - 1),
    });
    showToast("Путешествие удалено");
    // 👇 ДОБАВИТЬ
if (appState.username) {
  saveTripsToWorker(appState.username, newTrips);
}
  };

  // ==========================================================================
  // Day CRUD
  // ==========================================================================

  const saveDay = () => {
    if (!dayForm.name.trim()) {
      showToast("Введите название дня");
      return;
    }

    const newDay: Day = {
      id: modalDay.editId || generateId(),
      name: dayForm.name,
      date: dayForm.date,
    };

    const newDays = modalDay.editId
      ? trip.days.map((d) => (d.id === modalDay.editId ? newDay : d))
      : [...trip.days, newDay];

    setAppState({
      ...appState,
      trips: appState.trips.map((t) => (t.id === trip.id ? { ...t, days: newDays } : t)),
    });

    closeAllModals();
    showToast("День сохранён");
  };

  const deleteDay = (id: number) => {
    const newDays = trip.days.filter((d) => d.id !== id);
    const newEvents = trip.events.filter((e) => e.dayId !== id);
    setAppState({
      ...appState,
      trips: appState.trips.map((t) =>
        t.id === trip.id ? { ...t, days: newDays, events: newEvents } : t
      ),
    });
    showToast("День удалён");
  };

  // ==========================================================================
  // Event CRUD
  // ==========================================================================

  const saveEvent = () => {
    if (!eventForm.name.trim()) {
      showToast("Введите название");
      return;
    }

    const newEvent: Event = {
      id: modalEvent.editId || generateId(),
      dayId: eventForm.dayId ? parseInt(eventForm.dayId) : null,
      cat: eventForm.cat,
      icon: eventForm.icon,
      name: eventForm.name,
      desc: eventForm.desc,
      price: parseFloat(eventForm.price) || 0,
      duration: eventForm.duration,
      links: eventForm.links.split("\n").filter(Boolean),
    };

    const newEvents = modalEvent.editId
      ? trip.events.map((e) => (e.id === modalEvent.editId ? newEvent : e))
      : [...trip.events, newEvent];

    setAppState({
      ...appState,
      trips: appState.trips.map((t) => (t.id === trip.id ? { ...t, events: newEvents } : t)),
    });

    closeAllModals();
    showToast("Событие сохранено");
  };

  const deleteEvent = (id: number) => {
    const newEvents = trip.events.filter((e) => e.id !== id);
    setAppState({
      ...appState,
      trips: appState.trips.map((t) => (t.id === trip.id ? { ...t, events: newEvents } : t)),
    });
    showToast("Событие удалено");
  };

  // ==========================================================================
  // Idea CRUD
  // ==========================================================================

  const saveIdea = () => {
    if (!ideaForm.title.trim()) {
      showToast("Введите название");
      return;
    }

    const newIdea: Idea = {
      id: modalIdea.editId || generateId(),
      icon: ideaForm.icon,
      title: ideaForm.title,
      desc: ideaForm.desc,
    };

    const newIdeas = modalIdea.editId
      ? trip.ideas.map((i) => (i.id === modalIdea.editId ? newIdea : i))
      : [...trip.ideas, newIdea];

    setAppState({
      ...appState,
      trips: appState.trips.map((t) => (t.id === trip.id ? { ...t, ideas: newIdeas } : t)),
    });

    closeAllModals();
    showToast("Идея сохранена");
  };

  const deleteIdea = (id: number) => {
    const newIdeas = trip.ideas.filter((i) => i.id !== id);
    setAppState({
      ...appState,
      trips: appState.trips.map((t) => (t.id === trip.id ? { ...t, ideas: newIdeas } : t)),
    });
    showToast("Идея удалена");
  };

  // ==========================================================================
  // Doc CRUD
  // ==========================================================================

  const deleteDoc = (id: number) => {
    const newDocs = trip.docs.filter((d) => d.id !== id);
    setAppState({
      ...appState,
      trips: appState.trips.map((t) => (t.id === trip.id ? { ...t, docs: newDocs } : t)),
    });
    showToast("Документ удалён");
  };

  // ==========================================================================
  // AI
  // ==========================================================================

  const sendAIMessage = async (message: string) => {
  if (!message.trim()) return;

  setAiMessages((prev) => [...prev, { role: "user", content: message }]);
  setAiInput("");
  setIsLoadingAI(true);

  const thinkingId = Date.now();
  setAiMessages((prev) => [...prev, { role: "bot", content: "..." }]);

  try {
    const context = {
      name: trip.name,
      country: trip.country,
      route: trip.route,
      start: trip.start,
      end: trip.end,
      people: trip.people,
      currency: trip.currency,
      budget: trip.budget,
      days: trip.days.map((d) => ({ id: d.id, name: d.name, date: d.date })),
      events: trip.events.map((e) => ({ id: e.id, dayId: e.dayId, name: e.name, cat: e.cat, price: e.price })),
      ideas: trip.ideas.map((i) => i.title),
      username: appState.username,
    };

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });

    const data = await res.json();
    const reply = data.reply || "Попугай задумался...";
    const action = data.action; // 👈 Получаем действие от ИИ

    setAiMessages((prev) =>
      prev.map((m, i) => (i === prev.length - 1 ? { role: "bot", content: reply } : m))
    );

    // 👇 Если есть действие — показываем подтверждение
    if (action) {
      setPendingConfirmation(() => async () => {
  const updatedTrip = await applyActionOnWorker(
    appState.username!,
    trip.id,
    action
  );
  
  console.log("Updated trip from worker:", updatedTrip); // ← ДОБАВИТЬ ЛОГ
  
  if (updatedTrip) {
  // Обновляем локальный стейт
  const newTrips = appState.trips.map(t => 
    t.id === trip.id ? updatedTrip : t
  );
  setAppState({
    ...appState,
    trips: newTrips,
  });
  showToast("✅ Изменения применены!");
  
  setAiMessages((prev) => [
    ...prev,
    { role: "bot", content: "Готово! Я добавил это в твой план 🦜" },
  ]);
}
  
  setPendingConfirmation(null);
});
    }
  } catch (error) {
    setAiMessages((prev) =>
      prev.map((m, i) => (i === prev.length - 1 ? { role: "bot", content: "Ошибка соединения 🦜💥" } : m))
    );
  } finally {
    setIsLoadingAI(false);
  }
};

  const sendAIChip = (text: string) => {
    setAiInput(text);
    sendAIMessage(text);
  };

  const confirmAIAction = () => {
    if (pendingConfirmation) {
      pendingConfirmation();
      setPendingConfirmation(null);
      setAiMessages((prev) => [...prev, { role: "bot", content: "Готово! 🦜" }]);
    }
  };

  const rejectAIAction = () => {
    setPendingConfirmation(null);
    setAiMessages((prev) => [...prev, { role: "bot", content: "Хорошо, ничего не меняю 👍" }]);
  };

  // ==========================================================================
  // Render Components
  // ==========================================================================

  const renderEvent = (ev: Event) => {
    const links = ev.links
      .map((l) => (
        <a key={l} className="event-link" href={l} target="_blank" rel="noopener noreferrer">
          🔗 {l.replace(/https?:\/\//, "").substring(0, 40)}
        </a>
      ))
      .filter(Boolean);

    return (
      <div key={ev.id} className={`event ${ev.cat}`}>
        <div className="event-actions">
          <button className="event-btn" onClick={() => { setModalEvent({ open: true, editId: ev.id, sectionOverride: null }); setEventForm({ ...eventForm, cat: ev.cat, icon: ev.icon, name: ev.name, desc: ev.desc, price: String(ev.price), duration: ev.duration, links: ev.links.join("\n"), dayId: String(ev.dayId || "") }); }}>✏️</button>
          <button className="event-btn del" onClick={() => deleteEvent(ev.id)}>🗑️</button>
        </div>
        <div className="event-icon">{ev.icon}</div>
        <div className="event-content">
          <div className="event-title">{ev.name}</div>
          {ev.desc && <div className="event-detail">{ev.desc}{ev.duration ? ` · ${ev.duration}` : ""}</div>}
          {links}
        </div>
        {ev.price > 0 && <div className="event-price">{fmt(ev.price)}</div>}
      </div>
    );
  };

  const renderDays = () => (
    <>
      {trip.days.map((day, di) => {
        const dayEvents = trip.events.filter((e) => e.dayId === day.id);
        const total = dayEvents.reduce((s, e) => s + e.price, 0);
        const cats = [...new Set(dayEvents.map((e) => e.cat))];

        return (
          <div key={day.id} className="day-card open">
            <div className="day-header" onClick={(e) => { e.stopPropagation(); }}>
              <div className="day-num" style={{ background: DAY_COLORS[di % DAY_COLORS.length] }}>{di + 1}</div>
              <div className="day-info">
                <div className="day-name">{day.name}</div>
                <div className="day-date">{day.date ? dateStr(day.date) : ""}</div>
              </div>
              <div className="day-pills">
                {cats.slice(0, 3).map((cat) => {
                  const def = CATEGORIES.find((c) => c.id === cat);
                  const cls = cat === "transport" ? "pill-b" : cat === "hotel" ? "pill-g" : cat === "activity" ? "pill-r" : "pill-y";
                  return <div key={cat} className={`pill ${cls}`}>{def?.label.split(" ")[0]}</div>;
                })}
                {total > 0 && <div className="pill pill-y">{fmt(total)}</div>}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 4 }}>
                <button className="event-btn" onClick={(e) => { e.stopPropagation(); setModalDay({ open: true, editId: day.id }); setDayForm({ name: day.name, date: day.date }); }}>✏️</button>
                <button className="event-btn del" onClick={(e) => { e.stopPropagation(); deleteDay(day.id); }}>🗑️</button>
                <div className="day-chevron">▼</div>
              </div>
            </div>
            <div className="day-body">
              <DragDropContext onDragEnd={(result) => {
  if (!result.destination) return;
  const items = Array.from(dayEvents);
  const [reordered] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reordered);
  
  // Обновить порядок в стейте
  const newEvents = trip.events.filter(e => e.dayId !== day.id).concat(items);
  setAppState({
    ...appState,
    trips: appState.trips.map(t => 
      t.id === trip.id ? { ...t, events: newEvents } : t
    ),
  });
}}>
  <Droppable droppableId={`day-${day.id}`}>
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {dayEvents.map((ev, index) => (
          <Draggable key={ev.id} draggableId={String(ev.id)} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                {renderEvent(ev)}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
              <button className="btn-add-evt" onClick={() => { setModalEvent({ open: true, editId: null, sectionOverride: null }); setEventForm({ cat: "activity", icon: "🎢", name: "", desc: "", price: "", duration: "", links: "", dayId: String(day.id) }); }}>+ Добавить событие</button>
            </div>
          </div>
        );
      })}
      <button className="btn-add-day" onClick={() => { setModalDay({ open: true, editId: null }); setDayForm({ name: "", date: "" }); }}>+ Добавить день</button>
    </>
  );

  const renderBudget = () => {
    const total = trip.events.reduce((s, e) => s + e.price, 0);
    return (
      <div className="budget-card">
        {BUDGET_CATS.map((cat) => {
          const sum = trip.events.filter((e) => e.cat === cat.id).reduce((s, e) => s + e.price, 0);
          if (sum === 0) return null;
          const pct = total ? Math.round((sum / total) * 100) : 0;
          return (
            <div key={cat.id} className="budget-row">
              <div className="budget-lbl">{cat.label}</div>
              <div className="budget-bar"><div className="budget-fill" style={{ width: `${pct}%`, background: cat.color }} /></div>
              <div className="budget-amt">{fmt(sum)}</div>
            </div>
          );
        })}
        <div className="budget-total">
          <div className="budget-total-lbl">Итого</div>
          <div className="budget-total-val">{fmt(total) || `${sym} 0`}</div>
        </div>
      </div>
    );
  };

  const renderTransport = () => {
    const evs = trip.events.filter((e) => e.cat === "transport");
    if (!evs.length) return <div style={{ color: "var(--text3)", textAlign: "center", padding: 30 }}>Транспорт не добавлен</div>;
    return evs.map((ev) => {
      const day = trip.days.find((d) => d.id === ev.dayId);
      return (
        <div key={ev.id} className="simple-card">
          <div className="simple-card-header">
            <div className="simple-icon">{ev.icon}</div>
            <div><div className="simple-title">{ev.name}</div><div className="simple-sub">{ev.desc}{day ? ` · ${day.name}` : ""}</div></div>
            <div className="simple-price">{ev.price ? fmt(ev.price) : ""}</div>
          </div>
          <div className="simple-actions">
            <button className="sa-btn" onClick={() => { setModalEvent({ open: true, editId: ev.id, sectionOverride: "transport" }); setEventForm({ cat: ev.cat, icon: ev.icon, name: ev.name, desc: ev.desc, price: String(ev.price), duration: ev.duration, links: ev.links.join("\n"), dayId: String(ev.dayId || "") }); }}>✏️</button>
            <button className="sa-btn del" onClick={() => deleteEvent(ev.id)}>🗑️</button>
          </div>
        </div>
      );
    });
  };

  const renderHotels = () => {
    const evs = trip.events.filter((e) => e.cat === "hotel");
    if (!evs.length) return <div style={{ color: "var(--text3)", textAlign: "center", padding: 30 }}>Жильё не добавлено</div>;
    return evs.map((ev) => {
      const day = trip.days.find((d) => d.id === ev.dayId);
      return (
        <div key={ev.id} className="simple-card">
          <div className="simple-card-header">
            <div className="simple-icon">{ev.icon}</div>
            <div><div className="simple-title">{ev.name}</div><div className="simple-sub">{ev.desc}{day ? ` · ${day.name}` : ""}</div></div>
            <div className="simple-price">{ev.price ? fmt(ev.price) : ""}</div>
          </div>
          <div className="simple-actions">
            <button className="sa-btn" onClick={() => { setModalEvent({ open: true, editId: ev.id, sectionOverride: "hotel" }); setEventForm({ cat: ev.cat, icon: ev.icon, name: ev.name, desc: ev.desc, price: String(ev.price), duration: ev.duration, links: ev.links.join("\n"), dayId: String(ev.dayId || "") }); }}>✏️</button>
            <button className="sa-btn del" onClick={() => deleteEvent(ev.id)}>🗑️</button>
          </div>
        </div>
      );
    });
  };

  const renderDocs = () => {
    const docEvs = trip.events.filter((e) => e.cat === "document");
    const allDocs = [...trip.docs, ...docEvs.map((e) => ({ ...e, isEvent: true }))];
    if (!allDocs.length) return <div style={{ color: "var(--text3)", textAlign: "center", padding: 30 }}>Документы не добавлены</div>;
    return allDocs.map((doc) => (
      <div key={doc.id} className="doc-card">
        <div className="doc-icon">{doc.icon}</div>
        <div className="doc-info">
          <div className="doc-name">{doc.name}</div>
          <div className="doc-detail">{doc.desc}</div>
        </div>
        <div className="doc-actions">
          <button className="sa-btn" onClick={() => { if ("isEvent" in doc) { setModalEvent({ open: true, editId: doc.id, sectionOverride: "document" }); setEventForm({ cat: "document", icon: doc.icon, name: doc.name, desc: doc.desc, price: "0", duration: "", links: "", dayId: "" }); } }}>✏️</button>
          <button className="sa-btn del" onClick={() => ("isEvent" in doc ? deleteEvent(doc.id) : deleteDoc(doc.id))}>🗑️</button>
        </div>
      </div>
    ));
  };

  const renderIdeas = () => (
    <div className="ideas-grid">
      {trip.ideas.map((idea) => (
        <div key={idea.id} className="idea-card">
          <div className="event-actions">
            <button className="event-btn" onClick={() => { setModalIdea({ open: true, editId: idea.id }); setIdeaForm({ icon: idea.icon, title: idea.title, desc: idea.desc }); }}>✏️</button>
            <button className="event-btn del" onClick={() => deleteIdea(idea.id)}>🗑️</button>
          </div>
          <span className="idea-emoji">{idea.icon}</span>
          <div className="idea-title">{idea.title}</div>
          <div className="idea-text">{idea.desc}</div>
        </div>
      ))}
      <div className="idea-card idea-add" onClick={() => { setModalIdea({ open: true, editId: null }); setIdeaForm({ icon: "💡", title: "", desc: "" }); }}>
        <div className="idea-add-plus">+</div>
        <div className="idea-add-lbl">Добавить идею</div>
      </div>
    </div>
  );

  const nights = nightsBetween(trip.start, trip.end);
  const ds = trip.start && trip.end
    ? `${new Date(trip.start).toLocaleDateString("ru", { day: "numeric", month: "short" })} – ${new Date(trip.end).toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" })}`
    : "";

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --j-deep: #0d2118; --j-dark: #1a3a2a; --j-mid: #2d5a3d; --j-bright: #3d7a50;
          --leaf: #8BC34A; --sun: #FFD700; --sun2: #FF8C00;
          --blue: #1E88E5; --pink: #F06292;
          --text: #f0f7f0; --text2: rgba(240,247,240,0.6); --text3: rgba(240,247,240,0.35);
          --card: rgba(255,255,255,0.06); --border: rgba(139,195,74,0.2);
          --radius: 18px; --radius-sm: 12px; --nav-w: 280px;
        }
        body.light-theme {
  --j-deep: #f8faf8;
  --j-dark: #e8f0e8;
  --j-mid: #d0e0d0;
  --j-bright: #b0d0b0;
  --leaf: #4CAF50;
  --sun: #F5A623;
  --sun2: #E8912D;
  --text: #1a2e1a;
  --text2: rgba(26, 46, 26, 0.7);
  --text3: rgba(26, 46, 26, 0.4);
  --card: rgba(0, 0, 0, 0.03);
  --border: rgba(76, 175, 80, 0.25);
}
body.light-theme .btn-primary {
  color: #1a2e0a;
}
body.light-theme .event-btn {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text2);
}
/* Крестики закрытия модалок */
.modal-close {
  background: var(--card) !important;
  border: 1px solid var(--border) !important;
  color: var(--text2) !important;
  transition: all 0.2s;
}
.modal-close:hover {
  background: var(--j-mid) !important;
  border-color: var(--leaf) !important;
  color: var(--text) !important;
}

/* Кнопки листания (дней/событий) */
.day-chevron {
  color: var(--leaf) !important;
  font-size: 1rem;
  transition: transform 0.3s;
}

/* Скроллбары в нашем стиле */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--leaf);
}
body.light-theme .event-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text);
}
body.light-theme .modal {
  background: #f0f8f0;
  border-color: var(--border);
}
body.light-theme .form-input,
body.light-theme .form-select,
body.light-theme .form-textarea {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
  color: var(--text);
}
        body {
          font-family: 'Nunito', sans-serif;
          background: var(--j-deep);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          user-select: none;
          transition: background 0.3s, color 0.3s;
          margin: 0;
        }
        #app {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

#main {
  flex: 1;
  max-width: 1000px;
  margin: 0 auto;  /* ← центрирование, а не прижатие вправо */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px 80px;
  width: 100%;
}

@media (min-width: 1400px) {
  #main {
    max-width: 1200px;
  }
}
/* Кастомный календарь */
.react-datepicker {
  font-family: 'Nunito', sans-serif !important;
  background: var(--j-dark) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
  overflow: hidden;
}

.react-datepicker__header {
  background: var(--j-mid) !important;
  border-bottom: 1px solid var(--border) !important;
  padding: 12px 0 !important;
}

.react-datepicker__current-month {
  color: var(--text) !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  margin-bottom: 8px !important;
}

.react-datepicker__day-name {
  color: var(--leaf) !important;
  font-weight: 600 !important;
  width: 2rem !important;
  line-height: 2rem !important;
  margin: 0 !important;
}

.react-datepicker__day {
  color: var(--text) !important;
  width: 2rem !important;
  line-height: 2rem !important;
  margin: 0 !important;
  border-radius: 8px !important;
  transition: all 0.15s !important;
}

.react-datepicker__day:hover {
  background: var(--j-bright) !important;
  color: white !important;
}

.react-datepicker__day--selected {
  background: var(--leaf) !important;
  color: var(--j-deep) !important;
  font-weight: 700 !important;
}

.react-datepicker__day--keyboard-selected {
  background: var(--j-bright) !important;
}

.react-datepicker__day--disabled {
  color: var(--text3) !important;
  opacity: 0.5;
}

.react-datepicker__day--disabled:hover {
  background: transparent !important;
}

.react-datepicker__navigation {
  top: 12px !important;
}

.react-datepicker__navigation-icon::before {
  border-color: var(--text2) !important;
}

.react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
  border-color: var(--leaf) !important;
}

.react-datepicker__triangle {
  display: none !important;
}

/* Для светлой темы (если вернёшь) */
body.light-theme .react-datepicker {
  background: #f0f8f0 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
}
body.light-theme .react-datepicker__header {
  background: #d0e8d0 !important;
}
@media (max-width: 768px) {
  #main {
    padding-left: 12px;
    padding-right: 12px;
  }
}
        #main::-webkit-scrollbar { width: 4px; }
        #main::-webkit-scrollbar-thumb { background: rgba(139,195,74,.3); border-radius: 2px; }

        /* Sidenav */
        #sidenav {
          position: fixed; right: 0; top: 0; bottom: 0; width: var(--nav-w);
          background: rgba(13,33,24,.97); border-left: 1px solid var(--border);
          backdrop-filter: blur(20px); z-index: 200;
          transform: translateX(100%); transition: transform .3s;
          display: flex; flex-direction: column; padding: 28px 0 20px;
        }
        body.light-theme #sidenav { background: rgba(244,249,244,.95); }
        #sidenav.open { transform: translateX(0); }
        .nav-logo { padding: 0 22px 24px; border-bottom: 1px solid rgba(255,255,255,.07); margin-bottom: 8px; }
        .nav-logo-title { font-family: 'Baloo 2', cursive; font-size: 1.5rem; font-weight: 800; color: var(--sun); }
        .nav-item {
          display: flex; align-items: center; gap: 12px; padding: 13px 22px;
          cursor: pointer; transition: background .15s;
          font-weight: 600; font-size: .92rem; color: var(--text2); position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,.05); color: var(--text); }
        .nav-item.active { color: var(--sun); background: rgba(255,215,0,.07); }
        .nav-item.active::before { content: ''; position: absolute; left: 0; top: 4px; bottom: 4px; width: 3px; background: var(--sun); border-radius: 0 3px 3px 0; }
        .nav-icon { font-size: 1.2rem; width: 24px; text-align: center; }
        .nav-badge { margin-left: auto; background: rgba(255,215,0,.15); color: var(--sun); font-size: .7rem; font-weight: 700; padding: 2px 7px; border-radius: 50px; }

        #nav-toggle {
          position: fixed; right: 14px; top: 14px; z-index: 300;
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(13,33,24,.9); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1.2rem; backdrop-filter: blur(10px);
        }
        #nav-overlay { position: fixed; inset: 0; z-index: 190; display: none; }
        #nav-overlay.show { display: block; }

        /* Topbar */
        #topbar {
          display: flex; align-items: center; gap: 14px; padding: 20px 0 0;
          position: sticky; top: 0; z-index: 100;
          background: linear-gradient(to bottom, var(--j-deep) 60%, transparent);
          padding-bottom: 12px;
        }
        .topbar-trip { flex: 1; }
        .topbar-trip-name { font-weight: 700; font-size: 1rem; color: var(--text); }
        .topbar-trip-sub { font-size: .78rem; color: var(--text2); }

        /* Trip Hero */
        #trip-hero {
          margin: 14px 0 4px; padding: 24px 26px;
          background: linear-gradient(135deg,#1e5c32,#2a6e40,#1a4a2e);
          border-radius: 24px; border: 1px solid rgba(139,195,74,.3);
          box-shadow: 0 8px 40px rgba(0,0,0,.3); position: relative; overflow: hidden;
          cursor: pointer;
        }
        .hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .hero-badge {
          display: flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.12);
          border-radius: 50px; padding: 4px 12px; font-size: .78rem; font-weight: 600;
          color: rgba(255,255,255,.85); backdrop-filter: blur(4px);
        }
        .hero-name { font-family: 'Baloo 2', cursive; font-size: 1.7rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .hero-sub { color: rgba(255,255,255,.6); font-size: .85rem; }
        .hero-stats { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.1); }
        .stat-val { font-family: 'Baloo 2', cursive; font-size: 1.4rem; font-weight: 800; color: var(--sun); }
        .stat-lbl { font-size: .72rem; color: rgba(255,255,255,.5); font-weight: 600; text-transform: uppercase; }
        .hero-edit {
          position: absolute; top: 14px; right: 14px;
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
          border-radius: 10px; padding: 5px 10px; font-size: .75rem; font-weight: 600;
          color: rgba(255,255,255,.7); cursor: pointer;
        }

        /* Section */
        .section { display: none; }
        .section.active { display: block; }
        .sec-title {
          font-family: 'Baloo 2', cursive; font-size: 1.2rem; font-weight: 800; color: var(--sun);
          margin: 22px 0 14px; display: flex; align-items: center; gap: 8px;
        }

        /* Day Cards */
        .day-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 12px; overflow: hidden; }
        .day-header { display: flex; align-items: center; gap: 12px; padding: 14px 18px; cursor: pointer; }
        .day-num { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: 'Baloo 2', cursive; font-size: 1.1rem; font-weight: 800; }
        .day-info { flex: 1; }
        .day-name { font-weight: 700; font-size: .95rem; color: var(--text); }
        .day-date { font-size: .76rem; color: var(--text2); }
        .day-pills { display: flex; gap: 5px; flex-wrap: wrap; }
        .pill { padding: 3px 9px; border-radius: 50px; font-size: .72rem; font-weight: 700; display: flex; align-items: center; gap: 3px; }
        .pill-g { background: rgba(76,175,80,.18); color: #81C784; border: 1px solid rgba(76,175,80,.25); }
        .pill-b { background: rgba(30,136,229,.18); color: #64B5F6; border: 1px solid rgba(30,136,229,.25); }
        .pill-r { background: rgba(229,57,53,.18); color: #EF9A9A; border: 1px solid rgba(229,57,53,.25); }
        .pill-y { background: rgba(255,215,0,.12); color: var(--sun); border: 1px solid rgba(255,215,0,.25); }
        .day-chevron { font-size: .9rem; color: var(--text3); }
        .day-body { display: block; padding: 4px 18px 16px; }

        /* Events */
        .event {
          display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px;
          background: rgba(255,255,255,.04); border-radius: 12px; border-left: 3px solid;
          margin-bottom: 9px; position: relative;
        }
        .event.transport { border-color: var(--blue); }
        .event.hotel { border-color: var(--leaf); }
        .event.food { border-color: var(--sun); }
        .event.activity { border-color: var(--pink); }
        .event-icon { font-size: 1.3rem; }
        .event-content { flex: 1; }
        .event-title { font-weight: 700; font-size: .88rem; }
        .event-detail { font-size: .76rem; color: var(--text2); }
        .event-price { font-family: 'Baloo 2', cursive; font-weight: 700; font-size: .9rem; color: var(--sun); }
        .event-actions { position: absolute; top: 8px; right: 10px; display: flex; gap: 4px; opacity: 0; transition: opacity .2s; }
        .event:hover .event-actions { opacity: 1; }
        .event-btn {
          background: rgba(255,255,255,.08); border: none; border-radius: 8px; padding: 3px 7px;
          cursor: pointer; font-size: .75rem; color: var(--text2);
        }
        .event-btn.del:hover { background: rgba(229,57,53,.25); color: #EF9A9A; }

        .btn-add-evt {
          width: 100%; margin-top: 4px; padding: 9px;
          background: transparent; border: 1.5px dashed rgba(255,255,255,.13); border-radius: 10px;
          color: var(--text3); font-size: .82rem; font-weight: 600; cursor: pointer;
        }
        .btn-add-day {
          width: 100%; padding: 12px; margin-top: 4px;
          background: transparent; border: 1.5px dashed rgba(255,215,0,.2); border-radius: var(--radius);
          color: rgba(255,215,0,.4); font-size: .85rem; font-weight: 700; cursor: pointer;
        }

        /* Simple Cards */
        .simple-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 12px; }
        .simple-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .simple-icon { font-size: 1.8rem; }
        .simple-title { font-weight: 700; font-size: .95rem; }
        .simple-price { font-family: 'Baloo 2', cursive; font-weight: 700; font-size: 1.1rem; color: var(--sun); margin-left: auto; }
        .simple-actions { display: flex; gap: 6px; margin-top: 10px; }
        .sa-btn {
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px; padding: 5px 12px; font-size: .78rem; font-weight: 600; color: var(--text2); cursor: pointer;
        }

        /* Ideas */
        .ideas-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 12px; }
        .idea-card {
          background: var(--card); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius);
          padding: 16px; cursor: pointer; position: relative;
        }
        .idea-emoji { font-size: 2rem; display: block; }
        .idea-title { font-weight: 700; font-size: .88rem; }
        .idea-text { font-size: .76rem; color: var(--text2); }
        .idea-add {
          border: 1.5px dashed rgba(255,255,255,.12); display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 5px; min-height: 120px;
        }
        .idea-add-plus { font-size: 1.5rem; color: var(--text3); }

        /* Budget */
        .budget-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
        .budget-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .budget-lbl { font-size: .82rem; font-weight: 600; color: var(--text2); width: 110px; }
        .budget-bar { flex: 1; height: 8px; background: rgba(255,255,255,.08); border-radius: 50px; }
        .budget-fill { height: 100%; border-radius: 50px; }
        .budget-amt { font-family: 'Baloo 2', cursive; font-size: .88rem; font-weight: 700; width: 60px; text-align: right; }
        .budget-total { display: flex; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.08); }
        .budget-total-val { font-family: 'Baloo 2', cursive; font-size: 1.6rem; font-weight: 800; color: var(--sun); }

        /* Docs */
        .doc-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); }
        .doc-icon { font-size: 2rem; }
        .doc-info { flex: 1; }
        .doc-name { font-weight: 700; font-size: .9rem; }

        /* Modals */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.65); backdrop-filter: blur(6px);
          z-index: 500; display: flex; align-items: flex-end; justify-content: center;
        }
        .modal {
          background: #152a1e; border: 1px solid rgba(139,195,74,.3);
          border-radius: 24px 24px 0 0; width: 100%; max-width: 600px; max-height: 90vh;
          overflow-y: auto; padding: 28px 24px 36px;
        }
        .modal::-webkit-scrollbar {
  width: 4px;
}
.modal::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
.modal::-webkit-scrollbar-track {
  background: transparent;
}
        body.light-theme .modal { background: #e8f0e8; }
        .modal-title { font-family: 'Baloo 2', cursive; font-size: 1.3rem; font-weight: 800; color: var(--sun); margin-bottom: 20px; display: flex; justify-content: space-between; }

        .form-group { margin-bottom: 16px; }
        .form-label { display: block; font-size: .8rem; font-weight: 700; color: var(--text2); margin-bottom: 6px; text-transform: uppercase; }
        .form-input, .form-select, .form-textarea {
          width: 100%; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px; padding: 10px 14px; font-size: .9rem; color: var(--text); outline: none;
        }
        .form-select option {
  background: var(--j-dark);
  color: var(--text);
}
body.light-theme .form-select option {
  background: var(--j-deep);
  color: var(--text);
}
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .btn-primary {
          width: 100%; padding: 13px; background: linear-gradient(135deg,var(--sun),var(--sun2));
          border: none; border-radius: 14px; font-size: .95rem; font-weight: 800; color: #1a2e0a; cursor: pointer;
        }
        .btn-secondary {
          width: 100%; padding: 12px; background: transparent; border: 1.5px solid rgba(255,255,255,.15);
          border-radius: 14px; font-size: .88rem; font-weight: 700; color: var(--text2); cursor: pointer; margin-top: 8px;
        }
        #bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: linear-gradient(160deg, var(--j-deep) 0%, var(--j-dark) 40%, var(--j-mid) 100%);
  pointer-events: none;
}
@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  40% { transform: rotate(2.5deg); }
  70% { transform: rotate(-1.5deg); }
}
.leaf-bg {
  animation: sway 7s ease-in-out infinite;
}
.ff {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #FFD700;
  box-shadow: 0 0 8px 4px rgba(255, 215, 0, 0.5);
  animation: ffloat 9s ease-in-out infinite;
  opacity: 0;
}
@keyframes ffloat {
  0%, 100% { opacity: 0; transform: translate(0, 0); }
  20% { opacity: 1; }
  50% { opacity: 0.7; transform: translate(25px, -35px); }
  80% { opacity: 0.2; }
}
        /* AI Panel */
        #ai-panel {
          position: fixed; bottom: 90px; right: 18px; width: 340px;
          background: #1a0d2e; border: 1px solid rgba(240,98,146,.3); border-radius: 20px;
          z-index: 299; display: flex; flex-direction: column; max-height: 70vh;
        }
        #ai-msgs { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; max-height: 280px; }
        .ai-msg { padding: 9px 13px; border-radius: 14px; font-size: .82rem; max-width: 90%; }
        .ai-msg.bot { background: rgba(255,255,255,.07); align-self: flex-start; }
        .ai-msg.user { background: linear-gradient(135deg,#a31c4a,var(--pink)); color: #fff; align-self: flex-end; }
        .ai-confirm { background: rgba(255,215,0,.08); border: 1px solid rgba(255,215,0,.2); border-radius: 10px; padding: 10px 12px; }
        .ai-chip {
          padding: 5px 11px; border-radius: 50px; background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.7);
          font-size: .72rem; font-weight: 600; cursor: pointer;
        }
        #ai-input-wrap { padding: 10px 12px; border-top: 1px solid rgba(255,255,255,.07); display: flex; gap: 8px; }
        #ai-input {
          flex: 1; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px; padding: 8px 12px; font-size: .85rem; color: var(--text); outline: none;
        }

        #parrot-btn {
          position: fixed; bottom: 24px; right: 18px; z-index: 300;
          width: 58px; height: 58px; border-radius: 50%;
          background: linear-gradient(135deg,#a31c4a,var(--pink));
          border: none; display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; cursor: pointer;
        }
        #parrot-btn:hover {
  animation: none;
  transform: scale(1.12);
}

        #toast {
          position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
          background: #1e3a2a; border: 1px solid var(--leaf); border-radius: 12px;
          padding: 10px 20px; font-size: .85rem; font-weight: 600; color: var(--leaf);
          z-index: 600; white-space: nowrap;
        }

        @media (max-width: 768px) {
          #main { padding-left: 12px; padding-right: 12px; }
          #ai-panel { width: calc(100% - 20px); right: 10px; }
          .form-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
  .day-header {
    flex-wrap: wrap;
  }
  .day-num {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
  .day-pills {
    margin-left: 0;
    width: 100%;
    margin-top: 8px;
  }
  .event {
    flex-wrap: wrap;
  }
  .event-price {
    margin-left: 43px;
    width: 100%;
    text-align: left;
  }
  .event-actions {
    top: 4px;
    right: 4px;
  }
  .simple-card-header {
    flex-wrap: wrap;
  }
  .simple-price {
    margin-left: 0;
    width: 100%;
    text-align: left;
    margin-top: 4px;
  }
  #ai-panel {
    width: calc(100vw - 20px) !important;
    max-width: 400px;
    left: 10px;
    right: 10px;
  }
  .modal {
    padding: 20px 16px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
/* Селекты и календари */
.form-select,
.form-input[type="date"] {
  color: var(--text) !important;
  color-scheme: dark;
}
.form-select option {
  background: var(--j-dark);
  color: var(--text);
}
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.7;
  cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
a, .event-link, .doc-link {
  color: var(--leaf) !important;
  text-decoration: none;
  transition: color 0.2s;
}
a:hover, .event-link:hover, .doc-link:hover {
  color: var(--sun) !important;
  text-decoration: underline;
}
.event {
  padding-right: 70px; /* место под кнопки */
}
.event-actions {
  right: 8px;
  top: 8px;
}
.event-price {
  margin-right: 60px;
}

@media (max-width: 640px) {
  .event {
    padding-right: 14px;
  }
  .event-price {
    margin-right: 0;
  }
}
      `}</style>

      {/* Background */}
      <div id="bg">
  <svg className="leaf-bg" style={{ left: "-3%", top: "3%", width: 240, position: "absolute", opacity: 0.13 }} viewBox="0 0 240 300">
    <path d="M20 290 Q80 170 220 10 Q235 65 195 145 Q155 225 20 290Z" fill="#4CAF50" />
  </svg>
  <svg className="leaf-bg" style={{ right: "-2%", top: "0%", width: 220, transform: "scaleX(-1)", position: "absolute", opacity: 0.13 }} viewBox="0 0 240 300">
    <path d="M20 290 Q80 170 220 10 Q235 65 195 145 Q155 225 20 290Z" fill="#66BB6A" />
  </svg>
  <svg className="leaf-bg" style={{ left: "-4%", bottom: "8%", width: 200, position: "absolute", opacity: 0.13 }} viewBox="0 0 200 260">
    <path d="M10 10 Q90 80 190 250 Q145 255 100 205 Q55 155 10 10Z" fill="#388E3C" />
  </svg>
  <svg className="leaf-bg" style={{ right: "-3%", bottom: "4%", width: 210, transform: "scaleX(-1)", position: "absolute", opacity: 0.13 }} viewBox="0 0 200 260">
    <path d="M10 10 Q90 80 190 250 Q145 255 100 205 Q55 155 10 10Z" fill="#43A047" />
  </svg>
  {/* Огоньки */}
  <div className="ff" style={{ left: "12%", top: "35%" }} />
  <div className="ff" style={{ left: "78%", top: "55%", animationDelay: "-3s", animationDuration: "11s" }} />
  <div className="ff" style={{ left: "45%", top: "18%", animationDelay: "-6s", animationDuration: "8s" }} />
  <div className="ff" style={{ left: "25%", bottom: "25%", animationDelay: "-1.5s", animationDuration: "10s" }} />
  <div className="ff" style={{ left: "65%", top: "70%", animationDelay: "-4.5s", animationDuration: "7s" }} />
</div>
      
      {/* Username Prompt */}
      <AnimatePresence>
        {showUsernamePrompt && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="modal" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }}>
              <div className="modal-title">👋 Привет!</div>
              <div className="form-group">
                <div className="form-label">Как тебя зовут?</div>
                <input
  className="form-input"
  value={tempUsername}
  onChange={(e) => setTempUsername(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSetUsername()}
  placeholder="oleg-ezhkov"
  autoFocus
/>
              </div>
              <button className="btn-primary" onClick={handleSetUsername}>Продолжить 🦜</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Overlay */}
      <div id="nav-overlay" className={appState.navOpen ? "show" : ""} onClick={() => setAppState({ ...appState, navOpen: false })} />

      {/* Sidenav */}
      <div id="sidenav" className={appState.navOpen ? "open" : ""} onMouseEnter={() => setAppState({ ...appState, navOpen: true })} onMouseLeave={() => setAppState({ ...appState, navOpen: false })}>
        <div className="nav-logo">
          <div className="nav-logo-title">🦜 Crazy Nina</div>
          <div className="nav-logo-sub">Твой джунгли-планировщик</div>
        </div>
        {(["days", "budget", "transport", "hotels", "docs", "ideas"] as Section[]).map((sec) => (
          <div key={sec} className={`nav-item ${appState.currentSection === sec ? "active" : ""}`} onClick={() => { setAppState({ ...appState, currentSection: sec, navOpen: false }); }}>
            <span className="nav-icon">{sec === "days" ? "🗓️" : sec === "budget" ? "💰" : sec === "transport" ? "✈️" : sec === "hotels" ? "🏨" : sec === "docs" ? "📄" : "💡"}</span>
            {sec === "days" ? "По дням" : sec === "budget" ? "Бюджет" : sec === "transport" ? "Транспорт" : sec === "hotels" ? "Отели" : sec === "docs" ? "Документы" : "Идеи"}
            {sec === "days" && <span className="nav-badge">{trip.days.length}</span>}
            {sec === "transport" && <span className="nav-badge">{trip.events.filter((e) => e.cat === "transport").length}</span>}
            {sec === "hotels" && <span className="nav-badge">{trip.events.filter((e) => e.cat === "hotel").length}</span>}
          </div>
        ))}
        <div style={{ marginTop: 24, padding: "0 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--text3)" }}>Мои путешествия</span>
            <button className="event-btn" onClick={() => { setModalTrip({ open: true, isNew: true }); setTripForm({ name: "", icon: "🌴", country: "", route: "", start: "", end: "", people: 2, budget: "", currency: "RUB" }); }}>+</button>
          </div>
          {appState.trips.map((t, i) => (
            <div key={t.id} className={`nav-trip-item ${i === appState.currentTrip ? "active-trip" : ""}`} onClick={() => setAppState({ ...appState, currentTrip: i })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, cursor: "pointer", color: "var(--text2)" }}>
              <span style={{ fontSize: "1.3rem" }}>{t.icon}</span>
              <div><div style={{ fontWeight: 700 }}>{t.name}</div><div style={{ fontSize: ".72rem" }}>{t.country}</div></div>
              {appState.trips.length > 1 && (
                <button className="event-btn del" style={{ marginLeft: "auto" }} onClick={(e) => { e.stopPropagation(); deleteTrip(t.id); }}>🗑️</button>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
  <div style={{ fontSize: ".75rem", color: "var(--text3)", marginBottom: 8 }}>ПУТЕШЕСТВЕННИК</div>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span style={{ fontWeight: 700 }}>{appState.username || "Гость"}</span>
    {appState.username && (
      <span style={{ fontSize: ".7rem", color: "var(--leaf)" }} title="Синхронизировано с облаком">☁️</span>
    )}
  </div>
  <button 
  className="event-btn" 
  style={{ marginTop: 8 }} 
  onClick={() => { 
    // 👇 Очищаем всё перед сменой пользователя
    setAppState({ 
      ...appState, 
      username: null, 
      trips: [createEmptyTrip()],
      currentTrip: 0,
      currentSection: "days",
    }); 
    setShowUsernamePrompt(true); 
  }}
>
  Сменить имя
</button>
</div>
      </div>

      {/* Nav Toggle */}
      <div id="nav-toggle" onClick={() => setAppState({ ...appState, navOpen: !appState.navOpen })}>☰</div>

      {/* Main */}
      <div id="app">
        <div id="main" ref={mainRef}>
          {/* Topbar */}
          <div id="topbar">
            <div className="topbar-trip">
              <div className="topbar-trip-name">{trip.icon} {trip.name}</div>
              <div className="topbar-trip-sub">{trip.country}{ds ? ` · ${ds}` : ""}</div>
            </div>
          </div>

          {/* Trip Hero */}
          {appState.currentSection === "days" && (
            <div id="trip-hero" onClick={() => { setModalTrip({ open: true, isNew: false }); setTripForm({ name: trip.name, icon: trip.icon, country: trip.country, route: trip.route, start: trip.start, end: trip.end, people: trip.people, budget: String(trip.budget), currency: trip.currency }); }}>
              <div className="hero-edit" onClick={(e) => { e.stopPropagation(); setModalTrip({ open: true, isNew: false }); setTripForm({ name: trip.name, icon: trip.icon, country: trip.country, route: trip.route, start: trip.start, end: trip.end, people: trip.people, budget: String(trip.budget), currency: trip.currency }); }}>✏️ Изменить</div>
              <div className="hero-meta">
                <div className="hero-badge">🗓️ {ds}</div>
                <div className="hero-badge">👥 {trip.people} чел.</div>
                <div className="hero-badge">🌏 {trip.country}</div>
              </div>
              <div className="hero-name">{trip.name} {trip.icon}</div>
              <div className="hero-sub">{trip.route}</div>
              <div className="hero-stats">
                <div><div className="stat-val">{nights || "–"}</div><div className="stat-lbl">Ночей</div></div>
                <div><div className="stat-val">{trip.budget ? fmt(trip.budget) : "–"}</div><div className="stat-lbl">Бюджет</div></div>
                <div><div className="stat-val">{trip.events.length}</div><div className="stat-lbl">Событий</div></div>
              </div>
            </div>
          )}

          {/* Sections */}
          <div className={`section ${appState.currentSection === "days" ? "active" : ""}`}>
            <div className="sec-title">🗓️ По дням</div>
            {renderDays()}
          </div>
          <div className={`section ${appState.currentSection === "budget" ? "active" : ""}`}>
            <div className="sec-title">💰 Бюджет</div>
            {renderBudget()}
          </div>
          <div className={`section ${appState.currentSection === "transport" ? "active" : ""}`}>
            <div className="sec-title">✈️ Транспорт</div>
            {renderTransport()}
            <button className="btn-add-day" onClick={() => { setModalEvent({ open: true, editId: null, sectionOverride: "transport" }); setEventForm({ cat: "transport", icon: "✈️", name: "", desc: "", price: "", duration: "", links: "", dayId: "" }); }}>+ Добавить транспорт</button>
          </div>
          <div className={`section ${appState.currentSection === "hotels" ? "active" : ""}`}>
            <div className="sec-title">🏨 Отели</div>
            {renderHotels()}
            <button className="btn-add-day" onClick={() => { setModalEvent({ open: true, editId: null, sectionOverride: "hotel" }); setEventForm({ cat: "hotel", icon: "🏨", name: "", desc: "", price: "", duration: "", links: "", dayId: "" }); }}>+ Добавить жильё</button>
          </div>
          <div className={`section ${appState.currentSection === "docs" ? "active" : ""}`}>
            <div className="sec-title">📄 Документы</div>
            {renderDocs()}
            <button className="btn-add-day" onClick={() => { setModalEvent({ open: true, editId: null, sectionOverride: "document" }); setEventForm({ cat: "document", icon: "📄", name: "", desc: "", price: "", duration: "", links: "", dayId: "" }); }}>+ Добавить документ</button>
          </div>
          <div className={`section ${appState.currentSection === "ideas" ? "active" : ""}`}>
            <div className="sec-title">💡 Идеи</div>
            {renderIdeas()}
          </div>
        </div>
      </div>

      {/* AI Panel */}
      <AnimatePresence>
        {appState.aiOpen && (
          <motion.div id="ai-panel" ref={aiPanelRef} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}>
            <div id="ai-header" style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pink)" }} />
              <span style={{ fontWeight: 700, fontSize: ".88rem", flex: 1 }}>🦜 Попугай-планировщик</span>
              <button className="modal-close" onClick={() => setAppState({ ...appState, aiOpen: false })}>✕</button>
            </div>
            <div id="ai-msgs">
              {aiMessages.length === 0 && <div className="ai-msg bot">Привет! Спроси меня о путешествии 🦜</div>}
              {aiMessages.map((msg, i) => (
                <div key={i} className={`ai-msg ${msg.role}`}>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</div>
              ))}
              {pendingConfirmation && (
  <div className="ai-confirm">
    <div>Применить изменения?</div>
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      <button 
        className="ai-confirm-yes" 
        onClick={() => {
          pendingConfirmation(); // 👈 Выполняет действие
        }}
      >
        ✅ Да
      </button>
      <button 
        className="ai-confirm-no" 
        onClick={() => {
          setPendingConfirmation(null);
          setAiMessages((prev) => [...prev, { role: "bot", content: "Хорошо, ничего не меняю 👍" }]);
        }}
      >
        ✕ Нет
      </button>
    </div>
  </div>
)}
              <div ref={aiMessagesEndRef} />
            </div>
            <div id="ai-chips-wrap" style={{ padding: "6px 10px", borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["📋 Что не учли?", "💸 Оптимизировать бюджет", "🗺️ Что посмотреть?", "🍜 Что попробовать?", "✅ Чек-лист"].map((chip) => (
                <span key={chip} className="ai-chip" onClick={() => sendAIChip(chip)}>{chip}</span>
              ))}
            </div>
            <div id="ai-input-wrap">
              <input id="ai-input" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendAIMessage(aiInput)} placeholder="Спроси попугая..." disabled={isLoadingAI} />
              <button id="ai-send" onClick={() => sendAIMessage(aiInput)} disabled={isLoadingAI} style={{ background: "linear-gradient(135deg,#a31c4a,var(--pink))", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer" }}>➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parrot Button */}
      <button id="parrot-btn" onClick={() => setAppState({ ...appState, aiOpen: !appState.aiOpen })}>🦜</button>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div id="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modalEvent.open && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllModals}>
            <motion.div className="modal" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-title"><span>{modalEvent.editId ? "Редактировать" : "Новое событие"}</span><button className="modal-close" onClick={closeAllModals}>✕</button></div>
              <div className="form-group">
                <div className="form-label">Категория</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} className={`cat-pill ${eventForm.cat === cat.id ? "selected" : ""}`} onClick={() => setEventForm({ ...eventForm, cat: cat.id })} style={{ padding: "7px 14px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,.15)", background: eventForm.cat === cat.id ? "rgba(255,215,0,.12)" : "transparent", color: eventForm.cat === cat.id ? "var(--sun)" : "var(--text2)" }}>{cat.label}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <div className="form-label">Иконка</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 120, overflowY: "auto" }}>
                  {ICONS_ALL.map((ic) => (
                    <button key={ic} className={`icon-opt ${eventForm.icon === ic ? "selected" : ""}`} onClick={() => setEventForm({ ...eventForm, icon: ic })} style={{ width: 36, height: 36, borderRadius: 10, background: eventForm.icon === ic ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.06)", border: eventForm.icon === ic ? "1.5px solid var(--sun)" : "1.5px solid transparent" }}>{ic}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><div className="form-label">Название *</div><input className="form-input" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} placeholder="Рейс SU270..." /></div>
              <div className="form-group"><div className="form-label">Описание</div><textarea className="form-textarea" value={eventForm.desc} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} placeholder="Время, детали..." /></div>
              <div className="form-row">
                <div className="form-group"><div className="form-label">Цена</div><input className="form-input" type="number" value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })} placeholder="0" /></div>
                <div className="form-group"><div className="form-label">Длительность</div><input className="form-input" value={eventForm.duration} onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })} placeholder="2 ч" /></div>
              </div>
              <div className="form-group"><div className="form-label">Ссылки</div><textarea className="form-textarea" value={eventForm.links} onChange={(e) => setEventForm({ ...eventForm, links: e.target.value })} placeholder="https://..." /></div>
              {/* Всегда показывать выбор дня для транспорта/отеля/документа */}
{(modalEvent.sectionOverride === "transport" || 
  modalEvent.sectionOverride === "hotel" || 
  modalEvent.sectionOverride === "document" ||
  !modalEvent.sectionOverride) && (
  <div className="form-group">
    <div className="form-label">День путешествия</div>
    <select className="form-select" value={eventForm.dayId} onChange={(e) => setEventForm({ ...eventForm, dayId: e.target.value })}>
      <option value="">Без привязки к дню</option>
      {trip.days.map((d, i) => (
        <option key={d.id} value={d.id}>День {i + 1}: {d.name} {d.date ? `(${d.date})` : ''}</option>
      ))}
    </select>
  </div>
)}
              <button className="btn-primary" onClick={saveEvent}>💾 Сохранить</button>
              <button className="btn-secondary" onClick={closeAllModals}>Отмена</button>
            </motion.div>
          </motion.div>
        )}

        {modalDay.open && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllModals}>
            <motion.div className="modal" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-title"><span>{modalDay.editId ? "Редактировать день" : "Новый день"}</span><button className="modal-close" onClick={closeAllModals}>✕</button></div>
              <div className="form-group"><div className="form-label">Название</div><input className="form-input" value={dayForm.name} onChange={(e) => setDayForm({ ...dayForm, name: e.target.value })} placeholder="Прилёт в Бангкок..." /></div>
              <div className="form-group"><div className="form-label">Дата</div><DatePicker
  selected={dayForm.date ? new Date(dayForm.date) : null}
  onChange={(date) => setDayForm({ ...dayForm, date: date ? date.toISOString().split('T')[0] : '' })}
  dateFormat="dd.MM.yyyy"
  placeholderText="Выбери дату"
  className="form-input"
/></div>
              <button className="btn-primary" onClick={saveDay}>💾 Сохранить</button>
              <button className="btn-secondary" onClick={closeAllModals}>Отмена</button>
            </motion.div>
          </motion.div>
        )}

        {modalTrip.open && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllModals}>
            <motion.div className="modal" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-title"><span>{modalTrip.isNew ? "Новое путешествие" : "Настройки"}</span><button className="modal-close" onClick={closeAllModals}>✕</button></div>
              <div className="form-group"><div className="form-label">Название</div><input className="form-input" value={tripForm.name} onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })} placeholder="Летний отпуск" /></div>
              <div className="form-group"><div className="form-label">Страна</div><input className="form-input" value={tripForm.country} onChange={(e) => setTripForm({ ...tripForm, country: e.target.value })} placeholder="Таиланд" /></div>
              <div className="form-group"><div className="form-label">Маршрут</div><input className="form-input" value={tripForm.route} onChange={(e) => setTripForm({ ...tripForm, route: e.target.value })} placeholder="Бангкок → Краби" /></div>
              <div className="form-row">
                <div className="form-group"><div className="form-label">Начало</div><DatePicker
  selected={tripForm.start ? new Date(tripForm.start) : null}
  onChange={(date) => setTripForm({ ...tripForm, start: date ? date.toISOString().split('T')[0] : '' })}
  dateFormat="dd.MM.yyyy"
  placeholderText="Выбери дату"
  className="form-input"
  calendarClassName="crazy-calendar"
/></div>
                <div className="form-group"><div className="form-label">Конец</div><DatePicker
  selected={tripForm.end ? new Date(tripForm.end) : null}
  onChange={(date) => setTripForm({ ...tripForm, end: date ? date.toISOString().split('T')[0] : '' })}
  dateFormat="dd.MM.yyyy"
  placeholderText="Выбери дату"
  className="form-input"
  minDate={tripForm.start ? new Date(tripForm.start) : undefined}
/></div>
              </div>
              <div className="form-group"><div className="form-label">Путешественников</div><input className="form-input" type="number" min={1} value={tripForm.people} onChange={(e) => setTripForm({ ...tripForm, people: parseInt(e.target.value) || 1 })} /></div>
              <div className="form-group"><div className="form-label">Иконка</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TRIP_ICONS.map((ic) => (
                    <button key={ic} className={`icon-opt ${tripForm.icon === ic ? "selected" : ""}`} onClick={() => setTripForm({ ...tripForm, icon: ic })} style={{ width: 36, height: 36, borderRadius: 10, background: tripForm.icon === ic ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.06)", border: tripForm.icon === ic ? "1.5px solid var(--sun)" : "1.5px solid transparent" }}>{ic}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><div className="form-label">Валюта</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CURRENCIES.map((c) => (
                    <button key={c.code} className={`curr-btn ${tripForm.currency === c.code ? "selected" : ""}`} onClick={() => setTripForm({ ...tripForm, currency: c.code })} style={{ padding: "7px 14px", borderRadius: 50, border: tripForm.currency === c.code ? "1.5px solid var(--sun)" : "1.5px solid rgba(255,255,255,.15)", background: tripForm.currency === c.code ? "rgba(255,215,0,.12)" : "transparent" }}>{c.sym} {c.name}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><div className="form-label">Бюджет</div><input className="form-input" type="number" value={tripForm.budget} onChange={(e) => setTripForm({ ...tripForm, budget: e.target.value })} placeholder="250000" /></div>
              {/* Тема и цвет зафиксированы */}
<input type="hidden" value="dark" />
<input type="hidden" value="green" />
              <button className="btn-primary" onClick={saveTrip}>💾 Сохранить</button>
              <button className="btn-secondary" onClick={closeAllModals}>Отмена</button>
            </motion.div>
          </motion.div>
        )}

        {modalIdea.open && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllModals}>
            <motion.div className="modal" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-title"><span>{modalIdea.editId ? "Редактировать идею" : "Новая идея"}</span><button className="modal-close" onClick={closeAllModals}>✕</button></div>
              <div className="form-group"><div className="form-label">Иконка</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 120, overflowY: "auto" }}>
                  {ICONS_ALL.map((ic) => (
                    <button key={ic} className={`icon-opt ${ideaForm.icon === ic ? "selected" : ""}`} onClick={() => setIdeaForm({ ...ideaForm, icon: ic })} style={{ width: 36, height: 36, borderRadius: 10, background: ideaForm.icon === ic ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.06)", border: ideaForm.icon === ic ? "1.5px solid var(--sun)" : "1.5px solid transparent" }}>{ic}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><div className="form-label">Название</div><input className="form-input" value={ideaForm.title} onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })} placeholder="Дайвинг, Рынок..." /></div>
              <div className="form-group"><div className="form-label">Описание</div><textarea className="form-textarea" value={ideaForm.desc} onChange={(e) => setIdeaForm({ ...ideaForm, desc: e.target.value })} placeholder="Подробности..." /></div>
              <button className="btn-primary" onClick={saveIdea}>💾 Сохранить</button>
              <button className="btn-secondary" onClick={closeAllModals}>Отмена</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
