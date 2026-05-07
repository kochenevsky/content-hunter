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
  { id: "hotel",     label: "🏨 Жильё",     color: "var(--leaf)" },
  { id: "food",      label: "🍜 Еда",        color: "var(--sun)" },
  { id: "activity",  label: "🎡 Активность", color: "var(--pink)" },
  { id: "document",  label: "📄 Документ",   color: "#94a3b8" },
  { id: "note",      label: "📝 Заметка",    color: "rgba(255,255,255,.3)" },
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
  const [showTemplates, setShowTemplates] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("crazy-nina-dark", true);
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
    if (!trip) {
  return <div>Создай путешествие</div>;
}
  const sym = CURRENCIES.find((c) => c.code === trip.currency)?.sym || "₽";
  const fmt = (v: number) => (v ? `${sym} ${v.toLocaleString("ru")}` : "");

    // 👇 ДОБАВИТЬ СЮДА - ref для отслеживания первого рендера
  const [synced, setSynced] = useState(false);
  
  // 👇 ДОБАВИТЬ СЮДА - ref для отслеживания изменений trips
  const prevTripsRef = useRef(appState.trips);

    const [confirmDelete, setConfirmDelete] = useState<{
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}>({ open: false, title: "", message: "", onConfirm: () => {} });

const showConfirm = (title: string, message: string, onConfirm: () => void) => {
  setConfirmDelete({ open: true, title, message, onConfirm });
};
  // ==========================================================================
  // Theme & Color Application
  // ==========================================================================

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (appState.aiOpen && aiPanelRef.current && !aiPanelRef.current.contains(e.target as Node) && 
        (e.target as Element).id !== 'parrot-btn' && !(e.target as Element).closest('#parrot-btn')) {
      setAppState({ ...appState, aiOpen: false });
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [appState.aiOpen]);
    
  // Apply dark/light mode whenever darkMode changes
  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(darkMode ? "dark-theme" : "light-theme");
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const t = trip;

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
    
useEffect(() => {
  const loadData = async () => {
    if (appState.username && !synced) {
      const workerTrips = await loadTripsFromWorker(appState.username);
      if (workerTrips) {
        prevTripsRef.current = workerTrips; // ← добавить эту строку
        setAppState(prev => ({ ...prev, trips: workerTrips, currentTrip: 0 }));
        showToast(`Синхронизировано с облаком 🦜`);
      }
      setSynced(true);
    }
  };
  loadData();
}, [appState.username, synced]);

useEffect(() => {
  if (!synced) return; // ❌ не пишем пока не загрузили
  if (!appState.username) return;
  if (JSON.stringify(prevTripsRef.current) === JSON.stringify(appState.trips)) return;
  
  prevTripsRef.current = appState.trips;
  saveTripsToWorker(appState.username, appState.trips);
}, [appState.trips, appState.username, synced]);
    
  // ==========================================================================
  // Username
  // ==========================================================================

  const handleSetUsername = async () => {
  const trimmed = tempUsername.trim();
  if (/^[a-zA-Z0-9_-]{3,30}$/.test(trimmed)) {
    setShowUsernamePrompt(false);
    
    const workerTrips = await loadTripsFromWorker(trimmed);
    
    if (workerTrips) {
      setAppState({
        ...appState,
        username: trimmed,
        trips: workerTrips,
        currentTrip: 0,
      });
      showToast(`С возвращением, @${trimmed}! 🦜`);
    } else {
      const emptyTrip = createEmptyTrip();
      setAppState({
        ...appState,
        username: trimmed,
        trips: [emptyTrip],
        currentTrip: 0,
      });
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
  showConfirm(
    "Удалить день?",
    "Все события этого дня тоже будут удалены.",
    () => {
      const newDays = trip.days.filter((d) => d.id !== id);
      const newEvents = trip.events.filter((e) => e.dayId !== id);
      setAppState({
        ...appState,
        trips: appState.trips.map((t) =>
          t.id === trip.id ? { ...t, days: newDays, events: newEvents } : t
        ),
      });
      showToast("День удалён");
    }
  );
};

const deleteEvent = (id: number) => {
  const ev = trip.events.find(e => e.id === id);
  showConfirm(
    "Удалить событие?",
    `"${ev?.name || 'Событие'}" будет удалено.`,
    () => {
      const newEvents = trip.events.filter((e) => e.id !== id);
      setAppState({
        ...appState,
        trips: appState.trips.map((t) =>
          t.id === trip.id ? { ...t, events: newEvents } : t
        ),
      });
      showToast("Событие удалено");
    }
  );
};
    // При изменении aiInput автоматически скрывать шаблоны
const handleAiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setAiInput(e.target.value);
  if (showTemplates) {
    setShowTemplates(false);
  }
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
  if (!message.trim() || !appState.username) return;

  setAiMessages((prev) => [...prev, { role: "user", content: message }]);
  setAiInput("");
  setIsLoadingAI(true);

  setAiMessages((prev) => [...prev, { role: "bot", content: "..." }]);

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        username: appState.username,
        tripId: trip.id,
      }),
    });

    const data = await res.json();
    const reply = data.reply || "Попугай задумался...";
    const hasSuggestion = data.hasSuggestion || false;

    setAiMessages((prev) =>
      prev.map((m, i) => (i === prev.length - 1 ? { role: "bot", content: reply } : m))
    );

    // Если есть предложение — показываем кнопку "Применить идею"
    if (hasSuggestion) {
      setPendingConfirmation(() => async () => {
        await applySuggestion();
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
    const applySuggestion = async () => {
  if (!appState.username) return;

  setIsLoadingAI(true);
  setAiMessages((prev) => [...prev, { role: "bot", content: "Применяю..." }]);

  try {
    const res = await fetch(`${API_BASE}/api/apply-suggestion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: appState.username,
        tripId: trip.id,
      }),
    });

    const data = await res.json();

    if (data.success && data.trip) {
      // Обновляем стейт
      const newTrips = appState.trips.map(t =>
        t.id === trip.id ? data.trip : t
      );
      setAppState({ ...appState, trips: newTrips });
      
      setAiMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: "Готово! Я добавил это в твой план 🦜" },
      ]);
      showToast("✅ Добавлено в план!");
    } else {
      setAiMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: "Не получилось применить 😢 Попробуй вручную." },
      ]);
    }
  } catch (error) {
    setAiMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "bot", content: "Ошибка соединения 🦜💥" },
    ]);
  } finally {
    setIsLoadingAI(false);
    setPendingConfirmation(null);
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
              <div className="day-header-actions">
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
  --j-deep:   #081910;
  --j-dark:   #0f2318;
  --j-mid:    #1e4230;
  --j-bright: #2d6645;
  --leaf:     #6abf4b;
  --leaf2:    #4a9e2f;
  --sun:      #f5c842;
  --sun2:     #e8920a;
  --blue:     #3ab4f2;
  --pink:     #f06292;
  --text:     #e8f5e2;
  --text2:    rgba(232, 245, 226, 0.65);
  --text3:    rgba(232, 245, 226, 0.35);
  --card:     rgba(255, 255, 255, 0.055);
  --card-h:   rgba(255, 255, 255, 0.09);
  --border:   rgba(106, 191, 75, 0.22);
  --shadow:   0 4px 20px rgba(0, 0, 0, 0.4);
  --shadow-g: 0 4px 16px rgba(106, 191, 75, 0.18);
  --radius:   18px;
  --radius-sm: 12px;
  --nav-w:    280px;
}

body.light-theme {
  --j-deep:   #f0f9ec;
  --j-dark:   #ddf0d4;
  --j-mid:    #c0e2b0;
  --j-bright: #9dce88;
  --leaf:     #3a9e28;
  --leaf2:    #2d7c1e;
  --sun:      #c47800;
  --sun2:     #a36000;
  --text:     #132a0c;
  --text2:    rgba(19, 42, 12, 0.65);
  --text3:    rgba(19, 42, 12, 0.38);
  --card:     rgba(0, 0, 0, 0.04);
  --card-h:   rgba(0, 0, 0, 0.07);
  --border:   rgba(58, 158, 40, 0.28);
  --shadow:   0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-g: 0 4px 14px rgba(58, 158, 40, 0.18);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Nunito', 'Segoe UI', Roboto, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: var(--j-deep);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  transition: background 0.35s, color 0.35s;
  margin: 0;
}

input, button, textarea, select { font-family: inherit; }

h1,h2,h3,.hero-name,.nav-logo-title,.modal-title,.sec-title {
  font-family: -apple-system,BlinkMacSystemFont,'Baloo 2',cursive,sans-serif;
  font-weight: 800; letter-spacing: -0.01em;
}

button,.nav-item,.hero-edit,.idea-card,.ai-chip,.cat-pill,.icon-opt,.curr-btn { user-select:none; cursor:pointer; }
input,textarea,.event-content,.day-info,.ai-msg,.modal,.doc-info,.hero-name { user-select:text; }
.modal,.modal *:not(button):not(.modal-close) { user-select:text; }

/* Universal text colors */
.event-title,.day-name,.nav-trip-name,.hero-name,.idea-title,.doc-name,
.simple-title,.topbar-trip-name,.budget-total-lbl { color:var(--text); }

.event-detail,.day-date,.nav-trip-sub,.topbar-trip-sub,.simple-sub,
.doc-detail,.idea-text { color:var(--text2); }

.nav-badge,.stat-lbl,.form-hint { color:var(--text3); }

.nav-logo-sub { color:var(--leaf)!important; font-weight:600; }

.event-price,.simple-price,.budget-total-val,.stat-val,.budget-amt {
  color:var(--sun);
  font-family:'Baloo 2',cursive;
  font-weight:700;
}

::-webkit-scrollbar { width:4px; height:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(106,191,75,.28); border-radius:3px; }
::-webkit-scrollbar-thumb:hover { background:var(--leaf); }

#app { position:relative; z-index:1; display:flex; min-height:100vh; }

#main {
  flex:1; max-width:1000px; margin:0 auto;
  overflow-y:auto; overflow-x:hidden;
  padding:0 20px 80px; width:100%;
}

@media(min-width:1400px){#main{max-width:1200px;}}
@media(max-width:768px){#main{padding-left:12px;padding-right:12px;}}

#bg {
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background:radial-gradient(ellipse at 20% 10%,#0d2d1a 0%,transparent 60%),
             radial-gradient(ellipse at 80% 80%,#091f12 0%,transparent 55%),
             linear-gradient(170deg,#081910 0%,#0f2318 45%,#152b1e 100%);
}

body.light-theme #bg {
  background:radial-gradient(ellipse at 20% 10%,#d8f0cc 0%,transparent 60%),
             linear-gradient(170deg,#eaf7e2 0%,#d4edc8 100%);
}

@keyframes sway {
  0%,100%{transform:rotate(0deg)scale(1);}
  35%{transform:rotate(2.8deg)scale(1.01);}
  70%{transform:rotate(-1.8deg)scale(.99);}
}
.leaf-bg { animation:sway 8s ease-in-out infinite; transform-origin:bottom center; }

.ff {
  position:absolute; width:3px; height:3px; border-radius:50%;
  background:#78e84a;
  box-shadow:0 0 6px 3px rgba(120,232,74,.6),0 0 12px 6px rgba(120,232,74,.2);
  animation:ffloat 10s ease-in-out infinite; opacity:0;
}
body.light-theme .ff { display:none; }
@keyframes ffloat {
  0%,100%{opacity:0;transform:translate(0,0)scale(.8);}
  15%{opacity:.9;}
  50%{opacity:.6;transform:translate(28px,-42px)scale(1.2);}
  80%{opacity:.15;transform:translate(14px,-60px)scale(.7);}
}

/* Sidenav */
#sidenav {
  position:fixed; right:0; top:0; bottom:0; width:var(--nav-w);
  background:rgba(8,25,16,.97);
  border-left:1px solid var(--border);
  backdrop-filter:blur(24px);
  z-index:200;
  transform:translateX(100%);
  transition:transform 0.3s cubic-bezier(.4,0,.2,1);
  display:flex; flex-direction:column; padding:28px 0 20px;
  box-shadow:-4px 0 24px rgba(0,0,0,.4);
}

body.light-theme #sidenav {
  background:rgba(235,248,228,.97);
  box-shadow:-4px 0 20px rgba(0,0,0,.1);
}

#sidenav.open { transform:translateX(0); }

.nav-logo { padding:0 22px 22px; border-bottom:1px solid rgba(106,191,75,.12); margin-bottom:6px; }

.nav-logo-title {
  font-family:'Baloo 2',cursive; font-size:1.5rem; font-weight:800;
  color:var(--sun); text-shadow:0 2px 10px rgba(245,200,66,.2);
}

.nav-item {
  display:flex; align-items:center; gap:12px; padding:12px 22px;
  cursor:pointer; font-weight:600; font-size:.92rem; color:var(--text2);
  position:relative; transition:background .15s,color .15s;
}
.nav-item:hover { background:rgba(106,191,75,.07); color:var(--text); }
.nav-item.active { color:var(--leaf); background:rgba(106,191,75,.1); }
.nav-item.active::before {
  content:''; position:absolute; left:0; top:6px; bottom:6px;
  width:3px; background:linear-gradient(180deg,var(--leaf),var(--leaf2));
  border-radius:0 3px 3px 0;
}
.nav-icon { font-size:1.1rem; width:24px; text-align:center; }

.nav-badge {
  margin-left:auto; background:rgba(106,191,75,.15); color:var(--leaf);
  font-size:.68rem; font-weight:700; padding:2px 7px; border-radius:50px;
  border:1px solid rgba(106,191,75,.25);
}

.nav-trip-item { border-radius:12px; transition:background .15s; }
.nav-trip-item:hover { background:rgba(106,191,75,.08)!important; }
.nav-trip-item.active-trip { background:rgba(106,191,75,.13)!important; border:1px solid rgba(106,191,75,.2); }

/* Nav toggle */
#nav-toggle {
  position:fixed; right:14px; top:14px; z-index:300;
  width:42px; height:42px; border-radius:14px;
  background:var(--j-dark); border:1px solid var(--border);
  color:var(--leaf);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; font-size:1.1rem;
  transition:background .15s,box-shadow .15s,transform .15s;
  box-shadow:0 2px 8px rgba(0,0,0,.3);
}
body.light-theme #nav-toggle { background:rgba(220,240,210,.95); }
#nav-toggle:hover { background:var(--j-mid); transform:scale(1.05); box-shadow:var(--shadow-g); }

#nav-overlay { position:fixed; inset:0; z-index:190; display:none; }
#nav-overlay.show { display:block; }

/* Topbar */
#topbar {
  display:flex; align-items:center; gap:14px;
  position:sticky; top:0; z-index:100;
  padding:20px 0 12px;
  background:linear-gradient(to bottom,var(--j-deep) 65%,transparent);
}
.topbar-trip { flex:1; }
.topbar-trip-name { font-weight:700; font-size:1rem; color:var(--text); }
.topbar-trip-sub { font-size:.78rem; color:var(--text2); }

/* Trip hero */
#trip-hero {
  margin:14px 0 4px; padding:24px 26px;
  background:linear-gradient(135deg,#12382a 0%,#1c5038 50%,#143020 100%);
  border-radius:24px; border:1px solid rgba(106,191,75,.3);
  box-shadow:0 6px 28px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.05);
  position:relative; overflow:hidden; cursor:pointer;
  transition:box-shadow .2s,transform .2s;
}
body.light-theme #trip-hero {
  background:linear-gradient(135deg,#c8e8b8 0%,#a8d890 50%,#b8e0a0 100%);
  border-color:rgba(58,158,40,.4);
  box-shadow:0 4px 16px rgba(0,0,0,.1),inset 0 1px 0 rgba(255,255,255,.5);
}
#trip-hero:hover { box-shadow:0 10px 40px rgba(0,0,0,.4),0 0 0 1px rgba(106,191,75,.25); transform:translateY(-1px); }
body.light-theme #trip-hero:hover { box-shadow:0 6px 20px rgba(0,0,0,.12),0 0 0 1px rgba(58,158,40,.3); }
#trip-hero::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse at 85% 20%,rgba(106,191,75,.08) 0%,transparent 60%),
             radial-gradient(ellipse at 15% 80%,rgba(74,158,47,.07) 0%,transparent 50%);
  pointer-events:none;
}
.hero-meta { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
.hero-badge {
  display:flex; align-items:center; gap:5px;
  background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.15);
  border-radius:50px; padding:4px 12px; font-size:.78rem; font-weight:600;
  color:rgba(255,255,255,.85); backdrop-filter:blur(4px);
}
body.light-theme .hero-badge { background:rgba(0,0,0,.08); border-color:rgba(0,0,0,.1); color:rgba(20,50,10,.7); }
.hero-name {
  font-family:'Baloo 2',cursive; font-size:1.75rem; font-weight:800;
  color:#fff; margin-bottom:4px; text-shadow:0 2px 10px rgba(0,0,0,.25);
}
body.light-theme .hero-name { color:#0f2a08; text-shadow:none; }
.hero-sub { color:rgba(255,255,255,.55); font-size:.85rem; }
body.light-theme .hero-sub { color:rgba(20,50,10,.55); }
.hero-stats {
  display:flex; gap:28px; flex-wrap:wrap; margin-top:18px; padding-top:16px;
  border-top:1px solid rgba(255,255,255,.09);
}
body.light-theme .hero-stats { border-top-color:rgba(0,0,0,.1); }
.stat-val {
  font-family:'Baloo 2',cursive; font-size:1.4rem; font-weight:800;
  color:var(--sun); text-shadow:0 1px 6px rgba(245,200,66,.2);
}
body.light-theme .stat-val { text-shadow:none; }
.stat-lbl { font-size:.7rem; color:rgba(255,255,255,.45); font-weight:600; text-transform:uppercase; letter-spacing:.5px; }
body.light-theme .stat-lbl { color:rgba(20,50,10,.45); }

.hero-edit {
  position:absolute; top:14px; right:14px;
  background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.16);
  border-radius:10px; padding:5px 12px; font-size:.75rem; font-weight:600;
  color:rgba(255,255,255,.7); cursor:pointer;
  transition:background .15s,color .15s;
}
body.light-theme .hero-edit { background:rgba(0,0,0,.08); border-color:rgba(0,0,0,.1); color:rgba(20,50,10,.65); }
.hero-edit:hover { background:rgba(106,191,75,.22); color:var(--leaf); border-color:rgba(106,191,75,.32); }

/* Sections */
.section { display:none; }
.section.active { display:block; }
.sec-title {
  font-family:'Baloo 2',cursive; font-size:1.15rem; font-weight:800;
  color:var(--leaf); margin:22px 0 14px; display:flex; align-items:center; gap:8px;
}

/* Day cards */
.day-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:var(--radius); margin-bottom:10px; overflow:hidden;
  transition:border-color .2s;
}
.day-card:hover { border-color:rgba(106,191,75,.4); }

.day-header { display:flex; align-items:center; gap:10px; padding:13px 18px; cursor:pointer; }

.day-num {
  width:44px; height:44px; min-width:44px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  font-family:'Baloo 2',cursive; font-size:1.1rem; font-weight:800;
  color:#fff; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,.3);
}

.day-info { flex:1; min-width:0; }
.day-name { font-weight:700; font-size:.95rem; color:var(--text); }
.day-date { font-size:.76rem; color:var(--text2); }
.day-pills { display:flex; gap:5px; flex-wrap:wrap; }
.day-header-actions { display:flex; gap:5px; align-items:center; flex-shrink:0; }

.pill { padding:3px 9px; border-radius:50px; font-size:.70rem; font-weight:700; display:flex; align-items:center; gap:3px; }
.pill-g { background:rgba(106,191,75,.15); color:#8de06a; border:1px solid rgba(106,191,75,.28); }
.pill-b { background:rgba(58,180,242,.15); color:#7dd4f8; border:1px solid rgba(58,180,242,.28); }
.pill-r { background:rgba(240,98,146,.15); color:#f8a5c0; border:1px solid rgba(240,98,146,.28); }
.pill-y { background:rgba(245,200,66,.12); color:var(--sun); border:1px solid rgba(245,200,66,.28); }
body.light-theme .pill-g { color:#1a7810; }
body.light-theme .pill-b { color:#1265a0; }
body.light-theme .pill-r { color:#9c2060; }
body.light-theme .pill-y { color:var(--sun2); }

.day-chevron { color:var(--leaf)!important; font-size:.9rem; transition:transform .3s; flex-shrink:0; }
.day-body { display:block; padding:4px 18px 16px; }

/* Day header action buttons */
.day-header .event-btn {
  width:30px; height:30px; min-width:30px; border-radius:8px;
  background:var(--card); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  font-size:.8rem; color:var(--text2); cursor:pointer; transition:all .15s;
}
.day-header .event-btn:hover { background:var(--card-h); border-color:var(--leaf); color:var(--text); }
.day-header .event-btn.del:hover { background:rgba(229,57,53,.14); border-color:rgba(229,57,53,.3); color:#ef9a9a; }

/* Events */
.event {
  display:flex; align-items:flex-start; gap:10px;
  padding:11px 86px 11px 14px;
  background:var(--card); border-radius:var(--radius-sm);
  border-left:3px solid; margin-bottom:8px;
  position:relative; overflow:hidden; transition:background .15s;
}
.event:hover { background:var(--card-h); }
.event.transport { border-color:var(--blue); }
.event.hotel     { border-color:var(--leaf); }
.event.food      { border-color:var(--sun); }
.event.activity  { border-color:var(--pink); }
.event.document  { border-color:rgba(176,190,197,.6); }
.event.note      { border-color:rgba(255,255,255,.2); }

.event-actions {
  position:absolute; top:0; right:0; bottom:0; width:82px;
  display:flex; overflow:hidden; border-radius:0 var(--radius-sm) var(--radius-sm) 0;
}
.event-btn {
  flex:1; display:flex; align-items:center; justify-content:center;
  background:transparent; border:none; cursor:pointer; font-size:.88rem;
  transition:background .15s;
}
.event-btn:first-child { background:rgba(58,180,242,.08); color:rgba(58,180,242,.8); border-right:1px solid rgba(255,255,255,.05); }
.event-btn:first-child:hover { background:rgba(58,180,242,.2); color:#7dd4f8; }
.event-btn.del { background:rgba(229,57,53,.08); color:rgba(229,57,53,.7); }
.event-btn.del:hover { background:rgba(229,57,53,.2); color:#ef9a9a; }
body.light-theme .event-btn:first-child { background:rgba(58,180,242,.1); }
body.light-theme .event-btn.del { background:rgba(229,57,53,.07); }

.event-icon { font-size:1.25rem; flex-shrink:0; }
.event-content { flex:1; min-width:0; }
.event-title { font-weight:700; font-size:.87rem; color:var(--text); }
.event-detail { font-size:.75rem; color:var(--text2); }
.event-price {
  font-family:'Baloo 2',cursive; font-weight:700; font-size:.88rem;
  color:var(--sun); white-space:nowrap; flex-shrink:0;
}

/* Add buttons */
.btn-add-evt {
  width:100%; margin-top:6px; padding:9px;
  background:transparent; border:1.5px dashed rgba(106,191,75,.2);
  border-radius:10px; color:rgba(106,191,75,.5);
  font-size:.82rem; font-weight:600; cursor:pointer;
  transition:border-color .15s,color .15s,background .15s;
}
.btn-add-evt:hover { border-color:rgba(106,191,75,.45); color:var(--leaf); background:rgba(106,191,75,.04); }

.btn-add-day {
  width:100%; padding:12px; margin-top:8px;
  background:transparent; border:1.5px dashed rgba(106,191,75,.2);
  border-radius:var(--radius); color:rgba(106,191,75,.5);
  font-size:.85rem; font-weight:700; cursor:pointer;
  transition:border-color .15s,color .15s,background .15s;
}
.btn-add-day:hover { border-color:rgba(106,191,75,.45); color:var(--leaf); background:rgba(106,191,75,.04); }

/* Links */
a,.event-link,.doc-link { color:var(--leaf)!important; text-decoration:none; transition:color .15s; }
a:hover,.event-link:hover,.doc-link:hover { color:var(--sun)!important; text-decoration:underline; }

/* Simple cards */
.simple-card {
  background:var(--card); border:1px solid var(--border);
  border-radius:var(--radius); padding:16px 18px; margin-bottom:10px;
  transition:border-color .15s;
}
.simple-card:hover { border-color:rgba(106,191,75,.38); }
.simple-card-header { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
.simple-icon { font-size:1.8rem; flex-shrink:0; }
.simple-title { font-weight:700; font-size:.95rem; color:var(--text); }
.simple-sub { font-size:.78rem; color:var(--text2); }
.simple-price {
  font-family:'Baloo 2',cursive; font-weight:700; font-size:1.05rem;
  color:var(--sun); margin-left:auto; white-space:nowrap;
}

.simple-actions { display:flex; gap:6px; margin-top:10px; }
.sa-btn {
  display:inline-flex; align-items:center; justify-content:center; gap:4px;
  background:var(--card); border:1px solid var(--border);
  border-radius:8px; padding:6px 14px; font-size:.8rem; font-weight:600;
  color:var(--text2); cursor:pointer;
  transition:background .15s,color .15s,border-color .15s;
}
.sa-btn:hover { background:rgba(58,180,242,.12); border-color:rgba(58,180,242,.28); color:#7dd4f8; }
.sa-btn.del:hover { background:rgba(229,57,53,.12); border-color:rgba(229,57,53,.28); color:#ef9a9a; }

/* Ideas grid */
.ideas-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; }
.idea-card {
  background:var(--card); border:1px solid rgba(106,191,75,.18);
  border-radius:var(--radius); padding:16px; cursor:pointer; position:relative;
  transition:border-color .2s,transform .2s,box-shadow .2s;
}
.idea-card:hover { border-color:rgba(106,191,75,.4); transform:translateY(-2px); box-shadow:var(--shadow-g); }
.idea-emoji { font-size:2rem; display:block; margin-bottom:6px; }
.idea-title { font-weight:700; font-size:.88rem; color:var(--text); }
.idea-text { font-size:.76rem; color:var(--text2); margin-top:3px; }
.idea-add {
  border:1.5px dashed rgba(106,191,75,.22)!important;
  display:flex; align-items:center; justify-content:center;
  flex-direction:column; gap:5px; min-height:110px; transition:border-color .2s;
}
.idea-add:hover { border-color:rgba(106,191,75,.45)!important; }
.idea-add-plus { font-size:1.5rem; color:rgba(106,191,75,.5); }
.idea-add-lbl { font-size:.78rem; font-weight:600; color:var(--text3); }

/* Budget */
.budget-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; }
.budget-row { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.budget-lbl { font-size:.82rem; font-weight:600; color:var(--text2); width:110px; flex-shrink:0; }
.budget-bar { flex:1; height:7px; background:rgba(255,255,255,.07); border-radius:50px; overflow:hidden; }
body.light-theme .budget-bar { background:rgba(0,0,0,.07); }
.budget-fill { height:100%; border-radius:50px; transition:width .4s ease; }
.budget-amt {
  font-family:'Baloo 2',cursive; font-size:.88rem; font-weight:700;
  width:90px; text-align:right; color:var(--text); flex-shrink:0;
}
.budget-total {
  display:flex; justify-content:space-between; align-items:baseline;
  padding-top:14px; border-top:1px solid rgba(255,255,255,.07);
}
body.light-theme .budget-total { border-top-color:rgba(0,0,0,.08); }
.budget-total-lbl { font-size:.82rem; font-weight:700; color:var(--text2); }
.budget-total-val {
  font-family:'Baloo 2',cursive; font-size:1.6rem; font-weight:800; color:var(--sun);
}

/* Doc cards */
.doc-card {
  display:flex; align-items:center; gap:14px; padding:14px 16px;
  background:var(--card); border:1px solid var(--border);
  border-radius:var(--radius); margin-bottom:10px; transition:border-color .15s;
}
.doc-card:hover { border-color:rgba(106,191,75,.38); }
.doc-icon { font-size:2rem; flex-shrink:0; }
.doc-info { flex:1; min-width:0; }
.doc-name { font-weight:700; font-size:.9rem; color:var(--text); }
.doc-detail { font-size:.76rem; color:var(--text2); margin-top:2px; }
.doc-actions { display:flex; gap:6px; flex-shrink:0; }

/* Modals */
.modal-overlay {
  position:fixed; inset:0;
  background:rgba(0,0,0,.65); backdrop-filter:blur(8px);
  z-index:500; display:flex; align-items:flex-end; justify-content:center;
}
.modal {
  background:var(--j-dark); border:1px solid var(--border);
  border-radius:24px 24px 0 0; width:100%; max-width:600px; max-height:90vh;
  overflow-y:auto; padding:28px 24px 40px;
  box-shadow:0 -6px 36px rgba(0,0,0,.45),0 0 0 1px rgba(106,191,75,.07);
}
body.light-theme .modal {
  background:#eaf5e2; border-color:rgba(58,158,40,.25);
  box-shadow:0 -6px 28px rgba(0,0,0,.1);
}
.modal-title {
  font-family:'Baloo 2',cursive; font-size:1.25rem; font-weight:800;
  color:var(--sun); margin-bottom:20px;
  display:flex; justify-content:space-between; align-items:center;
}
.modal-close {
  user-select:none; width:30px; height:30px; border-radius:50%;
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1)!important;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; font-size:.95rem; color:var(--text2); transition:all .15s; flex-shrink:0;
}
body.light-theme .modal-close { background:rgba(0,0,0,.06); border-color:rgba(0,0,0,.1)!important; }
.modal-close:hover { background:rgba(229,57,53,.16); border-color:rgba(229,57,53,.3)!important; color:#ef9a9a; }

/* Forms */
.form-group { margin-bottom:16px; }
.form-label {
  display:block; font-size:.78rem; font-weight:700; color:var(--text3);
  margin-bottom:6px; text-transform:uppercase; letter-spacing:.4px;
}
.form-input,.form-select,.form-textarea {
  width:100%; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
  border-radius:12px; padding:10px 14px; font-size:.9rem; color:var(--text);
  outline:none; transition:border-color .15s,box-shadow .15s; color-scheme:dark;
}
body.light-theme .form-input,
body.light-theme .form-select,
body.light-theme .form-textarea {
  background:rgba(0,0,0,.04); border-color:rgba(0,0,0,.12); color:var(--text); color-scheme:light;
}
.form-input:focus,.form-select:focus,.form-textarea:focus {
  border-color:var(--leaf); box-shadow:0 0 0 3px rgba(106,191,75,.12);
}
.form-select option { background:var(--j-dark); color:var(--text); }
body.light-theme .form-select option { background:#eaf5e2; color:var(--text); }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(1); opacity:.6; cursor:pointer; }
body.light-theme input[type="date"]::-webkit-calendar-picker-indicator { filter:none; opacity:.6; }

/* Currency buttons in modal */
.curr-btn { font-weight:600; font-size:.82rem; cursor:pointer; color:var(--text2)!important; transition:all .15s; }
.curr-btn.selected { color:var(--sun)!important; }
body.light-theme .curr-btn { color:var(--text)!important; }

/* Primary / secondary buttons */
.btn-primary {
  width:100%; padding:13px;
  background:linear-gradient(135deg,var(--sun),var(--sun2));
  border:none; border-radius:14px; font-size:.95rem; font-weight:800;
  color:#0e2208; cursor:pointer;
  transition:opacity .15s,box-shadow .15s,transform .1s;
  box-shadow:0 3px 12px rgba(245,200,66,.22);
}
.btn-primary:hover { opacity:.92; box-shadow:0 4px 18px rgba(245,200,66,.35); transform:translateY(-1px); }
.btn-primary:active { transform:translateY(0); opacity:1; }

.btn-secondary {
  width:100%; padding:12px; background:transparent;
  border:1.5px solid var(--border); border-radius:14px;
  font-size:.88rem; font-weight:700; color:var(--text2);
  cursor:pointer; margin-top:8px;
  transition:background .15s,border-color .15s,color .15s;
}
.btn-secondary:hover { background:var(--card-h); border-color:rgba(106,191,75,.35); color:var(--text); }

/* AI Panel */
#ai-panel {
  position:fixed; bottom:90px; right:18px; width:340px;
  background:var(--j-dark); border:1px solid var(--border); border-radius:20px;
  z-index:299; display:flex; flex-direction:column; max-height:70vh;
  box-shadow:0 8px 36px rgba(0,0,0,.4),0 0 0 1px rgba(106,191,75,.06);
}
body.light-theme #ai-panel { background:#e8f5e0; box-shadow:0 6px 24px rgba(0,0,0,.12); }

#ai-msgs { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px; max-height:280px; }
.ai-msg { padding:10px 14px; border-radius:16px; font-size:.85rem; line-height:1.5; max-width:90%; word-break:break-word; }
.ai-msg.bot { background:var(--card); border:1px solid var(--border); color:var(--text)!important; align-self:flex-start; border-bottom-left-radius:4px; }
.ai-msg.user { background:linear-gradient(135deg,var(--j-mid),var(--j-bright)); color:#e8f5e2!important; align-self:flex-end; border-bottom-right-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,.2); }
body.light-theme .ai-msg.user { color:#0a2005!important; }

#ai-title { color:var(--text)!important; }

.ai-confirm { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px; font-size:.84rem; color:var(--text2); }
.ai-confirm-yes { background:linear-gradient(135deg,var(--leaf),var(--leaf2))!important; border:none!important; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:700; color:#0a1e0a!important; cursor:pointer; transition:opacity .15s; }
.ai-confirm-yes:hover { opacity:.88; }
.ai-confirm-no { background:var(--card)!important; border:1px solid var(--border)!important; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:700; color:var(--text2)!important; cursor:pointer; }
.ai-confirm-no:hover { background:var(--card-h)!important; }

.ai-chip { padding:5px 11px; border-radius:50px; background:rgba(106,191,75,.1); border:1px solid rgba(106,191,75,.2); color:var(--text2); font-size:.72rem; font-weight:600; cursor:pointer; transition:background .15s,color .15s; }
.ai-chip:hover { background:rgba(106,191,75,.2); color:var(--text); }

#ai-input-wrap { padding:10px 12px; border-top:1px solid var(--border); display:flex; gap:8px; }
#ai-input { flex:1; background:var(--card); border:1px solid var(--border); border-radius:12px; padding:10px 14px; font-size:.9rem; color:var(--text); outline:none; transition:border-color .15s,box-shadow .15s; }
#ai-input:focus { border-color:var(--leaf); box-shadow:0 0 0 3px rgba(106,191,75,.1); }
#ai-input::placeholder { color:var(--text3); }
#ai-send { width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,var(--leaf),var(--leaf2)); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; color:#0a1e0a; transition:all .15s; flex-shrink:0; box-shadow:0 2px 8px rgba(106,191,75,.25); }
#ai-send:hover { transform:scale(1.07); box-shadow:0 4px 14px rgba(106,191,75,.4); }

#parrot-btn {
  position:fixed; bottom:24px; right:18px; z-index:300;
  width:56px; height:56px; border-radius:50%;
  background:linear-gradient(135deg,#1e5030,#2d7848);
  border:2px solid rgba(106,191,75,.5);
  display:flex; align-items:center; justify-content:center;
  font-size:1.5rem; cursor:pointer;
  box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 0 0 rgba(106,191,75,.4);
  transition:transform .2s,box-shadow .2s;
  animation:parrot-pulse 3.5s ease-in-out infinite;
}
@keyframes parrot-pulse {
  0%,100%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 0 0 rgba(106,191,75,.35);}
  50%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 0 9px rgba(106,191,75,0);}
}
#parrot-btn:hover { animation:none; transform:scale(1.1); box-shadow:0 6px 24px rgba(0,0,0,.4),var(--shadow-g); }

#toast {
  position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
  background:var(--j-dark); border:1px solid var(--leaf); border-radius:12px;
  padding:10px 20px; font-size:.85rem; font-weight:600; color:var(--leaf);
  z-index:600; white-space:nowrap; box-shadow:0 4px 14px rgba(0,0,0,.3);
}
body.light-theme #toast { background:#eaf5e2; box-shadow:0 4px 10px rgba(0,0,0,.1); }

/* DatePicker */
.react-datepicker { font-family:'Nunito',sans-serif!important; background:var(--j-dark)!important; border:1px solid var(--border)!important; border-radius:var(--radius)!important; box-shadow:0 8px 36px rgba(0,0,0,.45)!important; overflow:hidden; }
.react-datepicker__header { background:var(--j-mid)!important; border-bottom:1px solid var(--border)!important; padding:12px 0!important; }
.react-datepicker__current-month { color:var(--text)!important; font-weight:700!important; font-size:1rem!important; margin-bottom:8px!important; }
.react-datepicker__day-name { color:var(--leaf)!important; font-weight:600!important; width:2rem!important; line-height:2rem!important; margin:0!important; }
.react-datepicker__day { color:var(--text)!important; width:2rem!important; line-height:2rem!important; margin:0!important; border-radius:8px!important; transition:all .15s!important; }
.react-datepicker__day:hover { background:var(--j-bright)!important; color:white!important; }
.react-datepicker__day--selected { background:var(--leaf)!important; color:#0a1e0a!important; font-weight:700!important; }
.react-datepicker__day--keyboard-selected { background:var(--j-bright)!important; }
.react-datepicker__day--disabled { color:var(--text3)!important; opacity:.5; }
.react-datepicker__day--disabled:hover { background:transparent!important; }
.react-datepicker__navigation { top:12px!important; }
.react-datepicker__navigation-icon::before { border-color:var(--text2)!important; }
.react-datepicker__navigation:hover .react-datepicker__navigation-icon::before { border-color:var(--leaf)!important; }
.react-datepicker__triangle { display:none!important; }
body.light-theme .react-datepicker { background:#eaf5e2!important; box-shadow:0 6px 24px rgba(0,0,0,.1)!important; }
body.light-theme .react-datepicker__header { background:#c8e8b8!important; }

/* Mobile */
@media(max-width:768px){
  #ai-panel{width:calc(100% - 20px);right:10px;}
  .form-row{grid-template-columns:1fr;}
  .hero-name{font-size:1.4rem!important;}
  .stat-val{font-size:1.1rem!important;}
}

@media(max-width:640px){
  #topbar{padding-right:58px;}
  #nav-toggle{right:10px;top:10px;width:38px;height:38px;border-radius:12px;}
  #trip-hero{padding:18px 16px;}
  .hero-stats{gap:16px;}
  
  .day-header{flex-wrap:nowrap;gap:7px;padding:10px 12px;}
  .day-num{width:36px;height:36px;min-width:36px;font-size:.9rem;border-radius:10px;}
  .day-info{flex:1;min-width:0;}
  .day-name{font-size:.88rem;}
  .day-pills{display:none;}
  
  .day-header .event-btn{width:26px;height:26px;min-width:26px;font-size:.76rem;border-radius:6px;}
  
  .event{padding:10px 12px 44px 12px;flex-wrap:wrap;}
  .event-actions{position:absolute;bottom:0;left:0;right:0;top:auto;width:100%;height:34px;border-radius:0 0 var(--radius-sm) var(--radius-sm);border-top:1px solid rgba(255,255,255,.05);}
  .event-price{width:100%;margin-top:4px;}
  
  .simple-card-header{flex-wrap:wrap;gap:8px;}
  .simple-price{margin-left:0;width:100%;text-align:left;margin-top:2px;}
  
  .modal{padding:18px 14px 30px;}
  .form-row{grid-template-columns:1fr;}
  
  #ai-panel{width:calc(100vw - 20px)!important;max-width:none;left:10px;right:10px;bottom:84px;}
  
  .budget-lbl{width:80px;font-size:.76rem;}
  .budget-amt{width:76px;font-size:.82rem;}
  
  .ideas-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr));}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
  <span style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px" }}>
    Мои путешествия
  </span>
  <button 
    style={{ 
      width: 28, 
      height: 28, 
      borderRadius: 8, 
      background: "linear-gradient(135deg, var(--leaf), var(--leaf2))",
      border: "none",
      fontSize: ".95rem",
      fontWeight: 700,
      color: "#0a1e0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(106,191,75,.3)",
      transition: "opacity 0.15s, transform 0.15s",
      lineHeight: 1,
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = ".85"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
    onClick={() => { 
      setModalTrip({ open: true, isNew: true }); 
      setTripForm({ name: "", icon: "🌴", country: "", route: "", start: "", end: "", people: 2, budget: "", currency: "RUB" }); 
    }}
  >
    +
  </button>
</div>
          {appState.trips.map((t, i) => (
            <div key={t.id} className={`nav-trip-item ${i === appState.currentTrip ? "active-trip" : ""}`} onClick={() => setAppState({ ...appState, currentTrip: i })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, cursor: "pointer" }}>
              <span style={{ fontSize: "1.3rem" }}>{t.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, color: "var(--text)", fontSize: ".88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div><div style={{ fontSize: ".72rem", color: "var(--text3)" }}>{t.country}</div></div>
              {appState.trips.length > 1 && (
                <button
                  style={{ marginLeft: "auto", width: 26, height: 26, borderRadius: 7, background: "transparent", border: "1px solid rgba(229,57,53,.25)", color: "rgba(229,57,53,.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: ".78rem", flexShrink: 0, transition: "all .15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,57,53,.15)"; (e.currentTarget as HTMLButtonElement).style.color = "#ef9a9a"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(229,57,53,.6)"; }}
                  onClick={(e) => { e.stopPropagation(); deleteTrip(t.id); }}
                >🗑️</button>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
  <div style={{ fontSize: ".75rem", color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 700 }}>Настройки</div>
  {/* Dark/Light toggle */}
  <button
    onClick={() => setDarkMode(!darkMode)}
    style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "9px 12px", borderRadius: 12, marginBottom: 10,
      background: "var(--card)", border: "1px solid var(--border)",
      cursor: "pointer", color: "var(--text2)", fontSize: ".84rem", fontWeight: 600,
      transition: "background 0.15s, color 0.15s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--card-h)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--card)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}
  >
    <span style={{ fontSize: "1rem" }}>{darkMode ? "☀️" : "🌙"}</span>
    <span>{darkMode ? "Светлая тема" : "Тёмная тема"}</span>
    <span style={{ marginLeft: "auto", width: 36, height: 20, borderRadius: 10, background: darkMode ? "var(--j-mid)" : "var(--leaf)", display: "inline-flex", alignItems: "center", padding: "0 3px", transition: "background 0.3s", flexShrink: 0 }}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", display: "block", transform: darkMode ? "translateX(0)" : "translateX(16px)", transition: "transform 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
    </span>
  </button>
  <div style={{ fontSize: ".72rem", color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 700 }}>Путешественник</div>
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
    <span style={{ fontWeight: 700, color: "var(--text)" }}>{appState.username || "Гость"}</span>
    {appState.username && (
      <span style={{ fontSize: ".7rem", color: "var(--leaf)" }} title="Синхронизировано с облаком">☁️</span>
    )}
  </div>
  <button 
    style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "7px 14px", borderRadius: 10,
      background: "var(--card)", border: "1px solid var(--border)",
      fontSize: ".8rem", fontWeight: 600, color: "var(--text2)",
      cursor: "pointer", transition: "all 0.15s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--card-h)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--card)"; }}
    onClick={() => { 
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
    🔄 Сменить имя
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
  {showTemplates && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        padding: "8px",
        borderBottom: "1px solid rgba(255,255,255,.07)",
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
      }}
    >
      {["📋 Что не учли?", "💸 Оптимизировать", "🗺️ Что посмотреть?", "🍜 Что попробовать?"].map((t) => (
        <span
          key={t}
          className="ai-chip"
          onClick={() => {
            setAiInput(t);
            setShowTemplates(false);
            sendAIMessage(t);
          }}
        >
          {t}
        </span>
      ))}
    </motion.div>
  )}
</AnimatePresence>
      
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
                <div key={i} className={`ai-msg ${msg.role}`}>
      {/* 👇 Принудительно преобразуем в строку и экранируем HTML */}
      {typeof msg.content === 'string' 
        ? msg.content 
        : JSON.stringify(msg.content)}
    </div>
              ))}
              {pendingConfirmation && (
  <div className="ai-confirm">
    <div>Применить предложение?</div>
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      <button className="ai-confirm-yes" onClick={pendingConfirmation}>
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
  <input
  id="ai-input"
  value={aiInput}
  onChange={handleAiInputChange}
  onKeyDown={(e) => e.key === "Enter" && sendAIMessage(aiInput)}
  placeholder="Спроси попугая..."
  disabled={isLoadingAI}
/>
  {aiInput ? (
    <button id="ai-send" onClick={() => sendAIMessage(aiInput)} disabled={isLoadingAI}>
      ➤
    </button>
  ) : (
    <button
      id="ai-send"
      style={{ background: "linear-gradient(135deg, var(--j-mid), var(--j-bright))" }}
      onClick={() => setShowTemplates(!showTemplates)}
    >
      📋
    </button>
  )}
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={saveEvent}>
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={saveDay}>
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={saveTrip}>
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={saveIdea}>
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
      <AnimatePresence>
  {confirmDelete.open && (
    <motion.div
      className="modal-overlay"
      style={{ alignItems: "center" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setConfirmDelete({ ...confirmDelete, open: false })}
    >
      <motion.div
        className="modal"
        style={{ borderRadius: 24, maxWidth: 400 }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title" style={{ marginBottom: 12 }}>
          <span>{confirmDelete.title}</span>
          <button
            className="modal-close"
            onClick={() => setConfirmDelete({ ...confirmDelete, open: false })}
          >
            ✕
          </button>
        </div>
        <p style={{ color: "var(--text2)", marginBottom: 24 }}>{confirmDelete.message}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn-secondary"
            style={{ marginTop: 0 }}
            onClick={() => setConfirmDelete({ ...confirmDelete, open: false })}
          >
            Отмена
          </button>
          <button
            className="btn-primary"
            style={{ background: "linear-gradient(135deg, #E53935, #B71C1C)" }}
            onClick={() => {
              confirmDelete.onConfirm();
              setConfirmDelete({ ...confirmDelete, open: false });
            }}
          >
            Удалить
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}
