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
  globalTheme: "dark" | "light";
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
const API_ACTION = `${API_BASE}/api/action`;

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

const loadTripsFromWorker = async (username: string): Promise<Trip[] | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/trips/${username}`);
    if (!res.ok) return null;
    const trips = await res.json();
    
    if (!Array.isArray(trips) || trips.length === 0) return null;
    
    const hasData = trips.some(t => t.name || t.days?.length > 0);
    
    return hasData ? trips : null;
  } catch (e) {
    console.error("Failed to load from worker:", e);
    return null;
  }
};

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
    console.log("Action response:", data);
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
    globalTheme: "dark",
  });

  const [showUsernamePrompt, setShowUsernamePrompt] = useState(!appState.username);
  const [tempUsername, setTempUsername] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<(() => void) | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Modals state
  const [modalEvent, setModalEvent] = useState<{ open: boolean; editId: number | null; sectionOverride: string | null }>({ open: false, editId: null, sectionOverride: null });
  const [modalDay, setModalDay] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });
  const [modalTrip, setModalTrip] = useState<{ open: boolean; isNew: boolean }>({ open: false, isNew: false });
  const [modalIdea, setModalIdea] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });
  const [modalDoc, setModalDoc] = useState<{ open: boolean; editId: number | null }>({ open: false, editId: null });

  // Form state
  const [eventForm, setEventForm] = useState({ cat: "activity", icon: "🎢", name: "", desc: "", price: "", duration: "", links: "", dayId: "" });
  const [dayForm, setDayForm] = useState({ name: "", date: "" });
  const [tripForm, setTripForm] = useState({ name: "", icon: "🌴", country: "", route: "", start: "", end: "", people: 2, budget: "", currency: "RUB"});
  const [ideaForm, setIdeaForm] = useState({ icon: "💡", title: "", desc: "" });
  const [docForm, setDocForm] = useState({ icon: "📄", name: "", desc: "", links: "" });

  // Refs
  const mainRef = useRef<HTMLDivElement>(null);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
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

  // =========================================================================
  // Theme Toggle & Application
  // =========================================================================

  const toggleGlobalTheme = () => {
    const newTheme = appState.globalTheme === "dark" ? "light" : "dark";
    setAppState({ ...appState, globalTheme: newTheme });
  };

  useEffect(() => {
    const root = document.documentElement;
    const trip = appState.trips[appState.currentTrip];
    if (!trip) return;

    // Apply global theme (can override per-trip)
    const effectiveTheme = appState.globalTheme;
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(effectiveTheme === "light" ? "light-theme" : "dark-theme");

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

    const c = colorMap[trip.mainColor];
    root.style.setProperty("--leaf", c.leaf);
    root.style.setProperty("--j-mid", c.mid);
    root.style.setProperty("--j-bright", c.bright);
    root.style.setProperty("--border", c.border);
    root.style.setProperty("--sun", c.sun);
    root.style.setProperty("--sun2", c.sun2);
  }, [appState.trips, appState.currentTrip, appState.globalTheme]);

  // =========================================================================
  // Data Loading & Sync
  // =========================================================================

  useEffect(() => {
    const loadData = async () => {
      if (appState.username && isFirstRender.current) {
        isFirstRender.current = false;
        
        const workerTrips = await loadTripsFromWorker(appState.username);
        
        if (workerTrips) {
          setAppState({
            ...appState,
            trips: workerTrips,
            currentTrip: 0,
          });
          showToast(`Синхронизировано с облаком 🦜`);
        } else if (appState.trips.length === 1 && appState.trips[0].name === "") {
          await saveTripsToWorker(appState.username, appState.trips);
        }
      }
    };
    
    loadData();
  }, [appState.username]);

  useEffect(() => {
    const syncData = async () => {
      if (isFirstRender.current) return;
      
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

  // =========================================================================
  // Click Outside Handlers
  // =========================================================================

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

  // Auto-save when clicking empty space (close modals)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // If click is on empty area and modal is open, save and close
      if (modalEvent.open && 
          !target.closest('.modal') && 
          !target.closest('.event-btn') &&
          !target.closest('.event')) {
        closeAllModals();
      }
    };

    if (modalEvent.open || modalDay.open || modalTrip.open || modalIdea.open) {
      document.addEventListener('click', handleGlobalClick);
    }
    
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [modalEvent.open, modalDay.open, modalTrip.open, modalIdea.open]);
    
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

  // =========================================================================
  // Username
  // =========================================================================

  const handleSetUsername = async () => {
    const trimmed = tempUsername.trim();
    if (/^[a-zA-Z0-9_-]{3,30}$/.test(trimmed)) {
      setShowUsernamePrompt(false);
      
      const emptyTrip = createEmptyTrip();
      setAppState({
        ...appState,
        username: trimmed,
        trips: [emptyTrip],
        currentTrip: 0,
      });
      
      const workerTrips = await loadTripsFromWorker(trimmed);
      
      if (workerTrips) {
        setAppState({
          ...appState,
          trips: workerTrips,
        });
        showToast(`С возвращением, @${trimmed}! 🦜`);
      } else {
        await saveTripsToWorker(trimmed, [emptyTrip]);
        showToast(`Привет, @${trimmed}! 🦜`);
      }
    }
  };

  // =========================================================================
  // Helpers
  // =========================================================================

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const closeAllModals = () => {
    setModalEvent({ open: false, editId: null, sectionOverride: null });
    setModalDay({ open: false, editId: null });
    setModalTrip({ open: false, isNew: false });
    setModalIdea({ open: false, editId: null });
    setModalDoc({ open: false, editId: null });
  };

  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

  // =========================================================================
  // Trip CRUD
  // =========================================================================

  const trip = appState.trips[appState.currentTrip];
  if (!trip) {
    return <div>Создай путешествие</div>;
  }

  const sym = CURRENCIES.find((c) => c.code === trip.currency)?.sym || "₽";
  const fmt = (v: number) => (v ? `${sym} ${v.toLocaleString("ru")}` : "");

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
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  // =========================================================================
  // Day CRUD
  // =========================================================================

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

    const newTrip = { ...trip, days: newDays };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));

    setAppState({ ...appState, trips: newTrips });
    setDayForm({ name: "", date: "" });
    closeAllModals();
    showToast(modalDay.editId ? "День обновлён" : "День добавлен");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  const deleteDay = (id: number) => {
    const newDays = trip.days.filter((d) => d.id !== id);
    const newTrip = { ...trip, days: newDays };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));
    setAppState({ ...appState, trips: newTrips });
    showToast("День удален");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  // =========================================================================
  // Event CRUD
  // =========================================================================

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
      links: eventForm.links.split("\n").filter((l) => l.trim()),
    };

    const newEvents = modalEvent.editId
      ? trip.events.map((e) => (e.id === modalEvent.editId ? newEvent : e))
      : [...trip.events, newEvent];

    const newTrip = { ...trip, events: newEvents };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));

    setAppState({ ...appState, trips: newTrips });
    setEventForm({ cat: "activity", icon: "🎢", name: "", desc: "", price: "", duration: "", links: "", dayId: "" });
    closeAllModals();
    showToast(modalEvent.editId ? "Событие обновлено" : "Событие добавлено");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  const deleteEvent = (id: number) => {
    const newEvents = trip.events.filter((e) => e.id !== id);
    const newTrip = { ...trip, events: newEvents };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));
    setAppState({ ...appState, trips: newTrips });
    showToast("Событие удалено");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  // =========================================================================
  // Idea CRUD
  // =========================================================================

  const saveIdea = () => {
    if (!ideaForm.title.trim()) {
      showToast("Введите название идеи");
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

    const newTrip = { ...trip, ideas: newIdeas };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));

    setAppState({ ...appState, trips: newTrips });
    setIdeaForm({ icon: "💡", title: "", desc: "" });
    closeAllModals();
    showToast(modalIdea.editId ? "Идея обновлена" : "Идея добавлена");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  const deleteIdea = (id: number) => {
    const newIdeas = trip.ideas.filter((i) => i.id !== id);
    const newTrip = { ...trip, ideas: newIdeas };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));
    setAppState({ ...appState, trips: newTrips });
    showToast("Идея удалена");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  // =========================================================================
  // Doc CRUD
  // =========================================================================

  const saveDoc = () => {
    if (!docForm.name.trim()) {
      showToast("Введите название документа");
      return;
    }

    const newDoc: Doc = {
      id: modalDoc.editId || generateId(),
      icon: docForm.icon,
      name: docForm.name,
      desc: docForm.desc,
      links: docForm.links.split("\n").filter((l) => l.trim()),
    };

    const newDocs = modalDoc.editId
      ? trip.docs.map((d) => (d.id === modalDoc.editId ? newDoc : d))
      : [...trip.docs, newDoc];

    const newTrip = { ...trip, docs: newDocs };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));

    setAppState({ ...appState, trips: newTrips });
    setDocForm({ icon: "📄", name: "", desc: "", links: "" });
    closeAllModals();
    showToast(modalDoc.editId ? "Документ обновлен" : "Документ добавлен");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  const deleteDoc = (id: number) => {
    const newDocs = trip.docs.filter((d) => d.id !== id);
    const newTrip = { ...trip, docs: newDocs };
    const newTrips = appState.trips.map((t) => (t.id === trip.id ? newTrip : t));
    setAppState({ ...appState, trips: newTrips });
    showToast("Документ удален");
    if (appState.username) {
      saveTripsToWorker(appState.username, newTrips);
    }
  };

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <>
      <style>{`
* { box-sizing: border-box; }

:root {
  --text: #f5f5f5; --text2: #b0b0b0; --text3: #808080;
  --card: #1a1a1a; --card-h: #242424;
  --j-dark: #0f1f16;
  --blue: #3ab4f2; --pink: #f06292;
  --shadow-g: 0 0 20px rgba(106,191,75,.15);
  --radius: 16px; --radius-sm: 12px;
}

body.light-theme {
  --text: #1a1a1a; --text2: #555; --text3: #999;
  --card: #f5f5f5; --card-h: #e8e8e8;
  --j-dark: #f0f8eb;
}

html, body { margin: 0; padding: 0; height: 100%; }
body { font-family: 'Nunito', sans-serif; background: #0d0d0d; color: var(--text); line-height: 1.6; }
body.light-theme { background: #fafafa; }

#bg {
  position: fixed; inset: 0; z-index: -1;
  background: #0d0d0d;
  overflow: hidden;
}

body.light-theme #bg { background: linear-gradient(135deg, #fafafa 0%, #f0f8eb 100%); }

.ff {
  position: absolute; width: 8px; height: 8px; border-radius: 50%;
  background: radial-gradient(circle, rgba(106,191,75,.6), transparent);
  box-shadow: 0 0 20px rgba(106,191,75,.4);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); opacity: 0.3; }
  50% { transform: translate(30px, -30px); opacity: 0.8; }
}

main {
  max-width: 1200px; margin: 0 auto; padding: 20px;
}

@media (max-width: 640px) {
  main { padding: 16px 12px; }
}

/* Header with Theme Toggle */
#header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 28px; padding: 0 8px;
}

.header-left { display: flex; align-items: center; gap: 16px; }
.header-title { font-size: 1.8rem; font-weight: 800; color: var(--leaf); }
.header-subtitle { font-size: 0.85rem; color: var(--text2); margin-top: -4px; }

.theme-toggle {
  width: 48px; height: 48px; border-radius: 12px;
  background: rgba(255,255,255,.08);
  border: 1.5px solid rgba(255,255,255,.12);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 1.3rem;
  transition: all 0.3s;
  color: var(--sun);
}

.theme-toggle:hover {
  background: rgba(255,215,0,.12);
  border-color: rgba(255,215,0,.3);
  transform: scale(1.05);
}

body.light-theme .theme-toggle {
  color: #FFD700;
}

#nav-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 99; opacity: 0;
  pointer-events: none; transition: opacity 0.2s;
}

#nav-overlay.show {
  opacity: 1; pointer-events: all;
}

#sidenav {
  position: fixed; left: 0; top: 0; height: 100vh; width: 240px;
  background: rgba(13,13,13,.95); backdrop-filter: blur(10px);
  border-right: 1px solid rgba(106,191,75,.1);
  padding: 20px 0; z-index: 100;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.3s;
}

#sidenav.open {
  transform: translateX(0);
}

.nav-logo { padding: 0 16px 24px; border-bottom: 1px solid rgba(106,191,75,.15); }
.nav-logo-title { font-size: 1.1rem; font-weight: 800; color: var(--leaf); }
.nav-logo-sub { font-size: 0.7rem; color: var(--text2); margin-top: 2px; }

.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; margin: 6px 12px; border-radius: 12px;
  cursor: pointer; transition: all 0.2s;
  color: var(--text2); font-weight: 600;
}

.nav-item:hover {
  background: rgba(106,191,75,.08); color: var(--text);
}

.nav-item.active {
  background: rgba(106,191,75,.15); color: var(--leaf);
  border-left: 3px solid var(--leaf);
  padding-left: 13px;
}

.nav-icon { font-size: 1.3rem; }
.nav-badge { 
  margin-left: auto; 
  background: var(--leaf); 
  color: #0a1e0a;
  padding: 2px 8px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
}

.trip-pills { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; }

.trip-pill {
  padding: 10px 14px; border-radius: 12px;
  background: rgba(255,255,255,.06); border: 1.5px solid rgba(106,191,75,.15);
  cursor: pointer; font-size: 0.85rem; font-weight: 600;
  color: var(--text2); flex: 1; min-width: 100px;
  text-align: center;
  transition: all 0.2s;
}

.trip-pill:hover, .trip-pill.active {
  background: rgba(106,191,75,.15);
  border-color: rgba(106,191,75,.35);
  color: var(--leaf);
}

.trip-pill-icon { margin-right: 4px; }

.trip-add-btn {
  width: calc(100% - 24px); margin: 12px; padding: 12px;
  background: transparent; border: 1.5px dashed rgba(255,215,0,.25);
  border-radius: 12px; color: rgba(255,215,0,.4);
  font-size: 0.85rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s;
}

.trip-add-btn:hover {
  border-color: rgba(255,215,0,.45);
  color: rgba(255,215,0,.7);
}

@media (max-width: 640px) {
  #sidenav { width: 200px; }
  .nav-logo-title { font-size: 1rem; }
}

#trip-hero {
  background: linear-gradient(135deg, var(--j-mid) 0%, var(--j-bright) 100%);
  border-radius: 20px;
  padding: 32px 28px;
  margin-bottom: 28px;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,.05);
  position: relative; overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}

#trip-hero:hover {
  box-shadow: 0 12px 56px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(106,191,75,.25);
  transform: translateY(-2px);
}

#trip-hero::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 85% 20%, rgba(106,191,75,.08) 0%, transparent 60%),
              radial-gradient(ellipse at 15% 80%, rgba(74,158,47,.07) 0%, transparent 50%);
  pointer-events: none;
}

.hero-meta {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;
}

.hero-badge {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 50px; padding: 4px 12px;
  font-size: .78rem; font-weight: 600;
  color: rgba(255,255,255,.8);
  backdrop-filter: blur(4px);
}

.hero-name {
  font-family: 'Baloo 2', cursive;
  font-size: 2rem; font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
  text-shadow: 0 2px 12px rgba(0,0,0,.3);
}

.hero-sub { color: rgba(255,255,255,.55); font-size: .85rem; }

.hero-stats {
  display: flex; gap: 28px; flex-wrap: wrap;
  margin-top: 20px; padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,.09);
}

.stat-val {
  font-family: 'Baloo 2', cursive;
  font-size: 1.5rem; font-weight: 800;
  color: var(--sun);
  text-shadow: 0 1px 8px rgba(245,200,66,.3);
}

.stat-lbl {
  font-size: .7rem; color: rgba(255,255,255,.45);
  font-weight: 600; text-transform: uppercase; letter-spacing: .5px;
}

.hero-edit {
  position: absolute; top: 16px; right: 16px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 10px; padding: 6px 14px;
  font-size: .75rem; font-weight: 700;
  color: rgba(255,255,255,.75);
  cursor: pointer;
  transition: all 0.15s;
}

.hero-edit:hover {
  background: rgba(106,191,75,.2);
  color: var(--leaf);
  border-color: rgba(106,191,75,.3);
  transform: scale(1.05);
}

.section { display: none; }
.section.active { display: block; }

.sec-title {
  font-family: 'Baloo 2', cursive;
  font-size: 1.2rem; font-weight: 800;
  color: var(--leaf);
  margin: 24px 0 16px;
  display: flex; align-items: center; gap: 8px;
}

.day-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 12px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.day-card:hover { border-color: rgba(106,191,75,.4); }

.day-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; cursor: pointer;
}

.day-num {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Baloo 2', cursive;
  font-size: 1.1rem; font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 3px 12px rgba(0,0,0,.3);
}

.day-info  { flex: 1; min-width: 0; }
.day-name  { font-weight: 700; font-size: .95rem; color: var(--text); }
.day-date  { font-size: .76rem; color: var(--text2); margin-top: 2px; }

.day-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-left: auto; }

.pill {
  padding: 4px 10px; border-radius: 50px;
  font-size: .70rem; font-weight: 700;
  display: flex; align-items: center; gap: 3px;
}

.pill-g { background: rgba(106,191,75,.15); color: #8de06a; border: 1px solid rgba(106,191,75,.28); }
.pill-b { background: rgba(58,180,242,.15); color: #7dd4f8; border: 1px solid rgba(58,180,242,.28); }
.pill-r { background: rgba(240,98,146,.15); color: #f8a5c0; border: 1px solid rgba(240,98,146,.28); }
.pill-y { background: rgba(245,200,66,.12); color: var(--sun); border: 1px solid rgba(245,200,66,.28); }

.day-chevron {
  color: var(--leaf) !important;
  font-size: .9rem;
  transition: transform 0.3s;
  flex-shrink: 0;
}

.day-body { display: block; padding: 6px 18px 16px; }

.day-header .event-btn {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; color: var(--text2);
  transition: all 0.15s;
  flex-shrink: 0;
}

.day-header .event-btn:hover {
  background: var(--j-mid);
  border-color: var(--leaf);
  color: var(--text);
}

.day-header .event-btn.del:hover {
  background: rgba(229, 57, 53, 0.2);
  border-color: rgba(229, 57, 53, 0.4);
  color: #ef9a9a;
}

.event {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px;
  background: var(--card);
  border-radius: var(--radius-sm);
  border-left: 3px solid;
  margin-bottom: 8px;
  position: relative; overflow: hidden;
  transition: background 0.15s;
  cursor: pointer;
}

.event:hover { background: var(--card-h); }

.event.transport { border-color: var(--blue); }
.event.hotel     { border-color: var(--leaf); }
.event.food      { border-color: var(--sun); }
.event.activity  { border-color: var(--pink); }
.event.document  { border-color: rgba(176,190,197,.6); }
.event.note      { border-color: rgba(255,255,255,.2); }

.event-icon    { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }
.event-content { flex: 1; min-width: 0; }
.event-title   { font-weight: 700; font-size: .88rem; }
.event-detail  { font-size: .75rem; color: var(--text2); margin-top: 2px; }
.event-price   {
  font-family: 'Baloo 2', cursive;
  font-weight: 700; font-size: .85rem;
  color: var(--sun);
  margin-top: 4px;
}

.event-actions {
  position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
  display: flex; gap: 6px; flex-shrink: 0;
}

.event-btn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  cursor: pointer;
  font-size: .9rem;
  color: var(--text3);
  transition: all 0.15s;
  flex-shrink: 0;
}

.event-btn:first-child {
  background: rgba(58, 180, 242, 0.12);
  color: rgba(58,180,242,.7);
  border-color: rgba(58,180,242,.2);
}

.event-btn:first-child:hover {
  background: rgba(58, 180, 242, 0.25);
  color: #7dd4f8;
  border-color: rgba(58,180,242,.4);
}

.event-btn.del {
  background: rgba(229, 57, 53, 0.12);
  color: rgba(229,57,53,.65);
  border-color: rgba(229,57,53,.2);
}

.event-btn.del:hover {
  background: rgba(229, 57, 53, 0.25);
  color: #ef9a9a;
  border-color: rgba(229,57,53,.4);
}

.btn-add-evt {
  width: 100%; margin-top: 6px; padding: 10px;
  background: transparent;
  border: 1.5px dashed rgba(106,191,75,.2);
  border-radius: 10px;
  color: rgba(106,191,75,.4);
  font-size: .82rem; font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.btn-add-evt:hover {
  border-color: rgba(106,191,75,.4);
  color: rgba(106,191,75,.65);
}

.btn-add-day {
  width: 100%; padding: 12px; margin-top: 8px;
  background: transparent;
  border: 1.5px dashed rgba(245,200,66,.2);
  border-radius: var(--radius);
  color: rgba(245,200,66,.45);
  font-size: .85rem; font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.btn-add-day:hover {
  border-color: rgba(245,200,66,.4);
  color: rgba(245,200,66,.7);
}

a, .event-link, .doc-link {
  color: var(--leaf) !important;
  text-decoration: none;
  transition: color 0.15s;
}

a:hover, .event-link:hover, .doc-link:hover {
  color: var(--sun) !important;
  text-decoration: underline;
}

.simple-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px; margin-bottom: 12px;
  transition: border-color 0.15s;
}

.simple-card:hover { border-color: rgba(106,191,75,.35); }

.simple-card-header {
  display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;
}

.simple-icon  { font-size: 2rem; flex-shrink: 0; }
.simple-title { font-weight: 700; font-size: .96rem; }
.simple-sub   { font-size: .78rem; color: var(--text2); margin-top: 2px; }
.simple-price {
  font-family: 'Baloo 2', cursive;
  font-weight: 700; font-size: 1.05rem;
  color: var(--sun);
  margin-top: 8px;
}

.simple-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }

.sa-btn {
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px; padding: 6px 14px;
  font-size: .8rem; font-weight: 600;
  color: var(--text2); cursor: pointer;
  transition: all 0.15s;
  flex: 1; min-width: 100px;
}

.sa-btn:hover {
  background: rgba(58,180,242,.15);
  border-color: rgba(58,180,242,.3);
  color: #7dd4f8;
}

.sa-btn.del:hover {
  background: rgba(229,57,53,.15);
  border-color: rgba(229,57,53,.3);
  color: #ef9a9a;
}

.ideas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.idea-card {
  background: var(--card);
  border: 1px solid rgba(106,191,75,.18);
  border-radius: var(--radius);
  padding: 18px; cursor: pointer; position: relative;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.idea-card:hover {
  border-color: rgba(106,191,75,.4);
  transform: translateY(-2px);
  box-shadow: var(--shadow-g);
}

.idea-emoji  { font-size: 2.2rem; display: block; margin-bottom: 8px; }
.idea-title  { font-weight: 700; font-size: .9rem; color: var(--text); }
.idea-text   { font-size: .76rem; color: var(--text2); margin-top: 4px; }

.idea-add {
  border: 1.5px dashed rgba(106,191,75,.22) !important;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 8px; min-height: 140px;
  transition: border-color 0.2s;
}

.idea-add:hover { border-color: rgba(106,191,75,.4) !important; }

.idea-add-plus { font-size: 1.8rem; color: rgba(106,191,75,.35); }
.idea-add-lbl  { font-size: .78rem; font-weight: 600; color: var(--text3); text-align: center; }

.budget-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}

.budget-row {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 14px;
}

.budget-lbl   { font-size: .82rem; font-weight: 600; color: var(--text2); width: 120px; flex-shrink: 0; }
.budget-bar   { flex: 1; height: 8px; background: rgba(255,255,255,.07); border-radius: 50px; overflow: hidden; }
.budget-fill  { height: 100%; border-radius: 50px; transition: width 0.4s ease; }
.budget-amt   {
  font-family: 'Baloo 2', cursive;
  font-size: .85rem; font-weight: 700;
  width: 80px; text-align: right;
  color: var(--sun);
  flex-shrink: 0;
}

.budget-total {
  display: flex; justify-content: space-between; align-items: baseline;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,.07);
}

.budget-total-lbl { font-size: .82rem; font-weight: 700; color: var(--text2); }
.budget-total-val {
  font-family: 'Baloo 2', cursive;
  font-size: 1.8rem; font-weight: 800;
  color: var(--sun);
  text-shadow: 0 1px 8px rgba(245,200,66,.25);
}

.doc-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 12px;
  transition: border-color 0.15s;
}

.doc-card:hover { border-color: rgba(106,191,75,.35); }

.doc-icon   { font-size: 2rem; flex-shrink: 0; }
.doc-info   { flex: 1; min-width: 0; }
.doc-name   { font-weight: 700; font-size: .92rem; }
.doc-detail { font-size: .76rem; color: var(--text2); margin-top: 2px; }
.doc-actions { display: flex; gap: 8px; }

.modal-overlay {
  user-select: text;
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex; align-items: flex-end; justify-content: center;
}

.modal {
  background: #0f2318;
  border: 1px solid rgba(106,191,75,.28);
  border-radius: 24px 24px 0 0;
  width: 100%; max-width: 600px; max-height: 90vh;
  overflow-y: auto;
  padding: 30px 26px 40px;
  box-shadow: 0 -8px 48px rgba(0,0,0,.6), 0 0 0 1px rgba(106,191,75,.08);
}

body.light-theme .modal {
  background: #e8f5e0;
  border-color: rgba(58,158,40,.3);
}

.modal-title {
  font-family: 'Baloo 2', cursive;
  font-size: 1.35rem; font-weight: 800;
  color: var(--sun);
  margin-bottom: 24px;
  display: flex; justify-content: space-between; align-items: center;
}

.modal-close {
  user-select: none;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1) !important;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 1.1rem;
  color: var(--text2);
  transition: all 0.15s;
  line-height: 1;
}

.modal-close:hover {
  background: rgba(229, 57, 53, 0.18);
  border-color: rgba(229, 57, 53, 0.35) !important;
  color: #ef9a9a;
  transform: scale(1.1);
}

.form-group   { margin-bottom: 18px; }
.form-label   {
  display: block; font-size: .78rem; font-weight: 700;
  color: var(--text3); margin-bottom: 8px;
  text-transform: uppercase; letter-spacing: .4px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  background: rgba(255,255,255,.06);
  border: 1.5px solid rgba(255,255,255,.1);
  border-radius: 12px;
  padding: 11px 14px;
  font-size: .9rem; color: var(--text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: 'Nunito', sans-serif;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--leaf);
  box-shadow: 0 0 0 3px rgba(106,191,75,.12);
}

body.light-theme .form-input,
body.light-theme .form-select,
body.light-theme .form-textarea {
  background: rgba(0,0,0,.04);
  border-color: rgba(0,0,0,.12);
  color: var(--text);
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.form-select, .form-input[type="date"] {
  color: var(--text) !important;
  color-scheme: dark;
}

.form-select option {
  background: var(--j-dark);
  color: var(--text);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1); opacity: 0.6; cursor: pointer;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }

.btn-primary {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, var(--sun), var(--sun2));
  border: none; border-radius: 14px;
  font-size: .96rem; font-weight: 800;
  color: #0e2208;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 4px 16px rgba(245,200,66,.3);
}

.btn-primary:hover {
  opacity: 0.92;
  box-shadow: 0 6px 24px rgba(245,200,66,.4);
  transform: translateY(-2px);
}

.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  width: 100%; padding: 12px;
  background: transparent;
  border: 1.5px solid rgba(255,255,255,.13);
  border-radius: 14px;
  font-size: .88rem; font-weight: 700;
  color: var(--text2);
  cursor: pointer; margin-top: 10px;
  transition: all 0.15s;
}

.btn-secondary:hover {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.22);
  color: var(--text);
}

#ai-panel {
  position: fixed; bottom: 90px; right: 18px; width: 340px;
  background: #0d2118;
  border: 1px solid rgba(106,191,75,.28);
  border-radius: 20px;
  z-index: 299;
  display: flex; flex-direction: column;
  max-height: 70vh;
  box-shadow: 0 8px 48px rgba(0,0,0,.55), 0 0 0 1px rgba(106,191,75,.06);
}

#ai-msgs {
  flex: 1; overflow-y: auto;
  padding: 12px;
  display: flex; flex-direction: column; gap: 8px;
  max-height: 280px;
}

.ai-msg {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.85rem; line-height: 1.5;
  max-width: 90%; word-break: break-word;
}

.ai-msg.bot {
  background: rgba(255,255,255,.06);
  border: 1px solid var(--border);
  color: var(--text) !important;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.ai-msg.user {
  background: linear-gradient(135deg, var(--j-mid), var(--j-bright));
  color: #e8f5e2 !important;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,.25);
}

#ai-title { color: var(--text) !important; font-weight: 700; }

.ai-confirm {
  background: rgba(255,255,255,.05);
  border: 1px solid var(--border);
  border-radius: 12px; padding: 12px;
  font-size: .84rem; color: var(--text2);
}

.ai-confirm-yes {
  background: linear-gradient(135deg, var(--leaf), rgba(139,195,74,.8)) !important;
  border: none !important;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: .8rem; font-weight: 700;
  color: #0a1e0a !important;
  cursor: pointer;
  transition: all 0.15s;
}

.ai-confirm-yes:hover { opacity: 0.88; transform: scale(1.05); }

.ai-confirm-no {
  background: rgba(255,255,255,.06) !important;
  border: 1px solid rgba(255,255,255,.12) !important;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: .8rem; font-weight: 700;
  color: var(--text2) !important;
  cursor: pointer;
  transition: all 0.15s;
}

.ai-confirm-no:hover { background: rgba(255,255,255,.1) !important; }

.ai-chip {
  padding: 6px 12px; border-radius: 50px;
  background: rgba(106,191,75,.1);
  border: 1px solid rgba(106,191,75,.2);
  color: rgba(232,245,226,.75);
  font-size: .72rem; font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.ai-chip:hover {
  background: rgba(106,191,75,.2);
  color: var(--text);
  transform: scale(1.05);
}

#ai-input-wrap {
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,.06);
  display: flex; gap: 8px;
}

#ai-input {
  flex: 1;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.9rem; color: var(--text);
  outline: none;
  transition: all 0.15s;
}

#ai-input:focus {
  border-color: var(--leaf);
  box-shadow: 0 0 0 3px rgba(106,191,75,.1);
}

#ai-input::placeholder { color: var(--text3); }

#ai-send {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--leaf), rgba(139,195,74,.8));
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 1.1rem; color: #0a1e0a;
  transition: all 0.15s; flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(106,191,75,.3);
}

#ai-send:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(106,191,75,.45);
}

#parrot-btn {
  position: fixed; bottom: 24px; right: 18px; z-index: 300;
  width: 62px; height: 62px; border-radius: 50%;
  background: linear-gradient(135deg, #1e5030, #2d7848);
  border: 2px solid rgba(106,191,75,.5);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem; cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,.4), 0 0 0 0 rgba(106,191,75,.4);
  transition: all 0.2s;
  animation: parrot-pulse 3.5s ease-in-out infinite;
}

@keyframes parrot-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,.4), 0 0 0 0 rgba(106,191,75,.35); }
  50%       { box-shadow: 0 4px 20px rgba(0,0,0,.4), 0 0 0 10px rgba(106,191,75,.0); }
}

#parrot-btn:hover {
  animation: none;
  transform: scale(1.14);
  box-shadow: 0 6px 28px rgba(0,0,0,.45), var(--shadow-g);
}

#toast {
  position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
  background: #102818;
  border: 1px solid var(--leaf);
  border-radius: 12px;
  padding: 12px 22px;
  font-size: .85rem; font-weight: 700; color: var(--leaf);
  z-index: 600; white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,.4), var(--shadow-g);
}

.react-datepicker {
  font-family: 'Nunito', sans-serif !important;
  background: var(--j-dark) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius) !important;
  box-shadow: 0 8px 40px rgba(0,0,0,.5) !important;
  overflow: hidden;
}

.react-datepicker__header {
  background: var(--j-mid) !important;
  border-bottom: 1px solid var(--border) !important;
  padding: 14px 0 !important;
}

.react-datepicker__current-month {
  color: var(--text) !important; font-weight: 700 !important; font-size: 1rem !important;
  margin-bottom: 10px !important;
}

.react-datepicker__day-name {
  color: var(--leaf) !important; font-weight: 600 !important;
  width: 2.2rem !important; line-height: 2.2rem !important; margin: 0 !important;
}

.react-datepicker__day {
  color: var(--text) !important; width: 2.2rem !important;
  line-height: 2.2rem !important; margin: 0 !important;
  border-radius: 8px !important; transition: all 0.15s !important;
}

.react-datepicker__day:hover {
  background: var(--j-bright) !important; color: white !important;
}

.react-datepicker__day--selected {
  background: var(--leaf) !important; color: #0a1e0a !important; font-weight: 700 !important;
}

.react-datepicker__day--keyboard-selected {
  background: var(--j-bright) !important;
}

.react-datepicker__day--disabled {
  color: var(--text3) !important; opacity: 0.5;
}

.react-datepicker__day--disabled:hover { background: transparent !important; }

.react-datepicker__navigation { top: 14px !important; }
.react-datepicker__navigation-icon::before { border-color: var(--text2) !important; }
.react-datepicker__navigation:hover .react-datepicker__navigation-icon::before { border-color: var(--leaf) !important; }
.react-datepicker__triangle { display: none !important; }

body.light-theme .react-datepicker {
  background: #e8f5e0 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,.12) !important;
}

body.light-theme .react-datepicker__header { background: #c8e8b8 !important; }

@media (max-width: 768px) {
  #ai-panel { width: calc(100% - 20px); right: 10px; }
  .form-row  { grid-template-columns: 1fr; }
  .hero-stats { gap: 16px; }
  .stat-val { font-size: 1.2rem; }
}

@media (max-width: 640px) {
  main { padding: 14px 10px; }
  #header { flex-direction: column; gap: 12px; align-items: flex-start; }
  .header-left { width: 100%; }
  .theme-toggle { align-self: flex-end; }
  
  .day-header   { flex-wrap: wrap; gap: 10px; }
  .day-num      { width: 40px; height: 40px; font-size: .95rem; }
  .day-pills    { margin-left: 0; width: 100%; margin-top: 8px; order: 3; }
  
  .event        { padding: 10px 12px; }
  .event-icon   { font-size: 1.1rem; }
  .event-title  { font-size: .85rem; }
  .event-actions { width: auto; position: static; }
  
  .simple-card-header { flex-wrap: wrap; }
  .simple-price { width: 100%; text-align: left; margin-top: 8px; }
  
  #ai-panel {
    width: calc(100vw - 20px) !important;
    max-width: 100%; left: 10px; right: 10px;
    bottom: 80px;
  }
  
  .modal { padding: 24px 18px 32px; border-radius: 20px 20px 0 0; }
  .modal-title { font-size: 1.1rem; }
  .form-row { grid-template-columns: 1fr; }
  
  .ideas-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .idea-card { padding: 14px; }
  .idea-emoji { font-size: 1.8rem; }
  .idea-title { font-size: .85rem; }
  
  .hero-edit { padding: 5px 10px; font-size: .7rem; }
  .hero-name { font-size: 1.5rem; }
  
  .sec-title { font-size: 1.05rem; margin: 18px 0 12px; }
  
  .pill { padding: 3px 8px; font-size: .65rem; }
  
  .trip-pill { min-width: 80px; padding: 8px 12px; font-size: .8rem; }
  
  .btn-primary, .btn-secondary { padding: 12px; font-size: .85rem; }
  
  .sa-btn { flex: 1; min-width: 70px; padding: 5px 10px; }
  
  .day-header .event-btn { width: 28px; height: 28px; font-size: .8rem; }
  .event-btn { width: 28px; height: 28px; font-size: .8rem; }
  
  .budget-lbl { width: 100px; }
  .budget-amt { width: 70px; }
  
  #parrot-btn { width: 56px; height: 56px; font-size: 1.4rem; }
  
  #toast { padding: 10px 16px; font-size: .8rem; }
}

.icon-opt, .curr-btn {
  padding: 8px 12px; border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  cursor: pointer;
  transition: all 0.15s;
  font-size: .85rem;
}

.icon-opt:hover, .curr-btn:hover {
  background: rgba(255,255,255,.1);
  border-color: rgba(255,255,255,.2);
}

.icon-opt.selected, .curr-btn.selected {
  background: rgba(255,215,0,.12);
  border-color: var(--sun);
  color: var(--sun);
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
            <span>{sec === "days" ? "По дням" : sec === "budget" ? "Бюджет" : sec === "transport" ? "Транспорт" : sec === "hotels" ? "Отели" : sec === "docs" ? "Документы" : "Идеи"}</span>
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
              className="event-btn" 
              style={{ width: "auto", padding: "4px 8px", fontSize: ".75rem" }}
              onClick={() => {
                setTripForm({ name: "", icon: "🌴", country: "", route: "", start: "", end: "", people: 2, budget: "", currency: "RUB" });
                setModalTrip({ open: true, isNew: true });
              }}
            >
              ➕
            </button>
          </div>
          <div className="trip-pills">
            {appState.trips.map((t, i) => (
              <motion.div key={t.id} className={`trip-pill ${appState.currentTrip === i ? "active" : ""}`} onClick={() => setAppState({ ...appState, currentTrip: i })}>
                <span className="trip-pill-icon">{t.icon}</span>
                <span style={{ fontSize: ".75rem" }}>{t.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main ref={mainRef}>
        {/* Header with Theme Toggle */}
        <div id="header">
          <div className="header-left">
            <button 
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "2.5rem" }}
              onClick={() => setAppState({ ...appState, navOpen: !appState.navOpen })}
            >
              ☰
            </button>
            <div>
              <div className="header-title">🦜 Crazy Nina</div>
              <div className="header-subtitle">Твой джунгли-планировщик путешествий</div>
            </div>
          </div>
          <button className="theme-toggle" onClick={toggleGlobalTheme} title="Переключить тему">
            {appState.globalTheme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Hero Section */}
        <div id="trip-hero">
          <div className="hero-meta">
            {trip.country && <div className="hero-badge">📍 {trip.country}</div>}
            {trip.route && <div className="hero-badge">🛣️ {trip.route}</div>}
            {trip.start && trip.end && <div className="hero-badge">📅 {nightsBetween(trip.start, trip.end)} ночей</div>}
            {trip.people && <div className="hero-badge">👥 {trip.people} чел</div>}
          </div>
          <div className="hero-name">{trip.icon} {trip.name}</div>
          {trip.start && trip.end && <div className="hero-sub">{dateStr(trip.start)} — {dateStr(trip.end)}</div>}
          <div className="hero-stats">
            {trip.budget > 0 && (
              <div>
                <div className="stat-val">{fmt(trip.budget)}</div>
                <div className="stat-lbl">Бюджет</div>
              </div>
            )}
            {trip.days.length > 0 && (
              <div>
                <div className="stat-val">{trip.days.length}</div>
                <div className="stat-lbl">Дни</div>
              </div>
            )}
            {trip.events.length > 0 && (
              <div>
                <div className="stat-val">{trip.events.length}</div>
                <div className="stat-lbl">События</div>
              </div>
            )}
          </div>
          <button 
            className="hero-edit"
            onClick={() => {
              setTripForm({ name: trip.name, icon: trip.icon, country: trip.country, route: trip.route, start: trip.start, end: trip.end, people: trip.people, budget: String(trip.budget), currency: trip.currency });
              setModalTrip({ open: true, isNew: false });
            }}
          >
            ⚙️ Настройки
          </button>
        </div>

        {/* Days Section */}
        <div className={`section ${appState.currentSection === "days" ? "active" : ""}`}>
          <div className="sec-title">🗓️ По дням</div>
          {trip.days.map((day, i) => {
            const dayEvents = trip.events.filter((e) => e.dayId === day.id);
            return (
              <div key={day.id} className="day-card">
                <div className="day-header">
                  <div className="day-num" style={{ background: DAY_COLORS[i % DAY_COLORS.length] }}>День {i + 1}</div>
                  <div className="day-info">
                    <div className="day-name">{day.name}</div>
                    {day.date && <div className="day-date">{dateStr(day.date)}</div>}
                  </div>
                  <div className="day-pills">
                    {dayEvents.length > 0 && <span className="pill pill-g">⭐ {dayEvents.length}</span>}
                  </div>
                  <button className="event-btn" onClick={() => { setDayForm({ name: day.name, date: day.date }); setModalDay({ open: true, editId: day.id }); }}>✏️</button>
                  <button className="event-btn del" onClick={() => showConfirm("Удалить день?", `День "${day.name}" будет удален. Это необратимо.`, () => deleteDay(day.id))}>🗑️</button>
                </div>
                <div className="day-body">
                  {dayEvents.map((event) => (
                    <div key={event.id} className={`event ${event.cat}`}>
                      <div className="event-icon">{event.icon}</div>
                      <div className="event-content">
                        <div className="event-title">{event.name}</div>
                        {event.desc && <div className="event-detail">{event.desc}</div>}
                        {event.price > 0 && <div className="event-price">{fmt(event.price)}</div>}
                      </div>
                      <div className="event-actions">
                        <button className="event-btn" onClick={() => { setEventForm({ cat: event.cat, icon: event.icon, name: event.name, desc: event.desc, price: String(event.price), duration: event.duration, links: event.links.join("\n"), dayId: String(event.dayId || "") }); setModalEvent({ open: true, editId: event.id, sectionOverride: null }); }}>✏️</button>
                        <button className="event-btn del" onClick={() => showConfirm("Удалить событие?", `"${event.name}" будет удалено.`, () => deleteEvent(event.id))}>🗑️</button>
                      </div>
                    </div>
                  ))}
                  <button className="btn-add-evt" onClick={() => { setEventForm({ cat: "activity", icon: "🎢", name: "", desc: "", price: "", duration: "", links: "", dayId: String(day.id) }); setModalEvent({ open: true, editId: null, sectionOverride: null }); }}>+ Событие</button>
                </div>
              </div>
            );
          })}
          <button className="btn-add-day" onClick={() => { setDayForm({ name: "", date: "" }); setModalDay({ open: true, editId: null }); }}>+ День путешествия</button>
        </div>

        {/* Budget Section */}
        <div className={`section ${appState.currentSection === "budget" ? "active" : ""}`}>
          <div className="sec-title">💰 Бюджет</div>
          <div className="budget-card">
            {BUDGET_CATS.map((cat) => {
              const spent = trip.events.filter((e) => e.cat === cat.id).reduce((sum, e) => sum + e.price, 0);
              const pct = trip.budget > 0 ? (spent / trip.budget) * 100 : 0;
              return (
                <div key={cat.id} className="budget-row">
                  <div className="budget-lbl">{cat.label}</div>
                  <div className="budget-bar">
                    <div className="budget-fill" style={{ width: Math.min(pct, 100) + "%", background: cat.color }} />
                  </div>
                  <div className="budget-amt">{fmt(spent)}</div>
                </div>
              );
            })}
            <div className="budget-total">
              <div className="budget-total-lbl">Потрачено всего</div>
              <div className="budget-total-val">{fmt(trip.events.reduce((sum, e) => sum + e.price, 0))}</div>
            </div>
          </div>
        </div>

        {/* Transport Section */}
        <div className={`section ${appState.currentSection === "transport" ? "active" : ""}`}>
          <div className="sec-title">✈️ Транспорт</div>
          {trip.events.filter((e) => e.cat === "transport").map((event) => (
            <div key={event.id} className="simple-card">
              <div className="simple-card-header">
                <div className="simple-icon">{event.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="simple-title">{event.name}</div>
                  {event.desc && <div className="simple-sub">{event.desc}</div>}
                  {event.price > 0 && <div className="simple-price">{fmt(event.price)}</div>}
                </div>
              </div>
              {(event.links.length > 0 || event.duration) && (
                <div className="simple-actions">
                  {event.duration && <div style={{ fontSize: ".8rem", color: "var(--text2)" }}>⏱️ {event.duration}</div>}
                  {event.links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="sa-btn">Ссылка {i + 1}</a>
                  ))}
                </div>
              )}
              <div className="simple-actions">
                <button className="sa-btn" onClick={() => { setEventForm({ cat: event.cat, icon: event.icon, name: event.name, desc: event.desc, price: String(event.price), duration: event.duration, links: event.links.join("\n"), dayId: String(event.dayId || "") }); setModalEvent({ open: true, editId: event.id, sectionOverride: "transport" }); }}>✏️ Изменить</button>
                <button className="sa-btn del" onClick={() => showConfirm("Удалить событие?", `"${event.name}" будет удалено.`, () => deleteEvent(event.id))}>🗑️ Удалить</button>
              </div>
            </div>
          ))}
          <button className="btn-add-day" onClick={() => { setEventForm({ cat: "transport", icon: "✈️", name: "", desc: "", price: "", duration: "", links: "", dayId: "" }); setModalEvent({ open: true, editId: null, sectionOverride: "transport" }); }}>+ Добавить транспорт</button>
        </div>

        {/* Hotels Section */}
        <div className={`section ${appState.currentSection === "hotels" ? "active" : ""}`}>
          <div className="sec-title">🏨 Отели</div>
          {trip.events.filter((e) => e.cat === "hotel").map((event) => (
            <div key={event.id} className="simple-card">
              <div className="simple-card-header">
                <div className="simple-icon">{event.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="simple-title">{event.name}</div>
                  {event.desc && <div className="simple-sub">{event.desc}</div>}
                  {event.price > 0 && <div className="simple-price">{fmt(event.price)}</div>}
                </div>
              </div>
              {(event.links.length > 0 || event.duration) && (
                <div className="simple-actions">
                  {event.duration && <div style={{ fontSize: ".8rem", color: "var(--text2)" }}>📅 {event.duration}</div>}
                  {event.links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="sa-btn">Ссылка {i + 1}</a>
                  ))}
                </div>
              )}
              <div className="simple-actions">
                <button className="sa-btn" onClick={() => { setEventForm({ cat: event.cat, icon: event.icon, name: event.name, desc: event.desc, price: String(event.price), duration: event.duration, links: event.links.join("\n"), dayId: String(event.dayId || "") }); setModalEvent({ open: true, editId: event.id, sectionOverride: "hotel" }); }}>✏️ Изменить</button>
                <button className="sa-btn del" onClick={() => showConfirm("Удалить событие?", `"${event.name}" будет удалено.`, () => deleteEvent(event.id))}>🗑️ Удалить</button>
              </div>
            </div>
          ))}
          <button className="btn-add-day" onClick={() => { setEventForm({ cat: "hotel", icon: "🏨", name: "", desc: "", price: "", duration: "", links: "", dayId: "" }); setModalEvent({ open: true, editId: null, sectionOverride: "hotel" }); }}>+ Добавить отель</button>
        </div>

        {/* Docs Section */}
        <div className={`section ${appState.currentSection === "docs" ? "active" : ""}`}>
          <div className="sec-title">📄 Документы</div>
          {trip.docs.map((doc) => (
            <div key={doc.id} className="doc-card">
              <div className="doc-icon">{doc.icon}</div>
              <div className="doc-info">
                <div className="doc-name">{doc.name}</div>
                {doc.desc && <div className="doc-detail">{doc.desc}</div>}
              </div>
              <div className="doc-actions">
                <button className="event-btn" onClick={() => { setDocForm({ icon: doc.icon, name: doc.name, desc: doc.desc, links: doc.links.join("\n") }); setModalDoc({ open: true, editId: doc.id }); }}>✏️</button>
                <button className="event-btn del" onClick={() => showConfirm("Удалить документ?", `"${doc.name}" будет удален.`, () => deleteDoc(doc.id))}>🗑️</button>
              </div>
            </div>
          ))}
          <button className="btn-add-day" onClick={() => { setDocForm({ icon: "📄", name: "", desc: "", links: "" }); setModalDoc({ open: true, editId: null }); }}>+ Добавить документ</button>
        </div>

        {/* Ideas Section */}
        <div className={`section ${appState.currentSection === "ideas" ? "active" : ""}`}>
          <div className="sec-title">💡 Идеи</div>
          <div className="ideas-grid">
            {trip.ideas.map((idea) => (
              <div key={idea.id} className="idea-card" onClick={() => { setIdeaForm({ icon: idea.icon, title: idea.title, desc: idea.desc }); setModalIdea({ open: true, editId: idea.id }); }}>
                <div className="idea-emoji">{idea.icon}</div>
                <div className="idea-title">{idea.title}</div>
                {idea.desc && <div className="idea-text">{idea.desc}</div>}
              </div>
            ))}
            <div className="idea-card idea-add" onClick={() => { setIdeaForm({ icon: "💡", title: "", desc: "" }); setModalIdea({ open: true, editId: null }); }}>
              <div className="idea-add-plus">+</div>
              <div className="idea-add-lbl">Новая идея</div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {modalEvent.open && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllModals}>
            <motion.div className="modal" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-title"><span>{modalEvent.editId ? "Редактировать" : "Новое событие"}</span><button className="modal-close" onClick={closeAllModals}>✕</button></div>
              <div className="form-group"><div className="form-label">Категория</div><select className="form-select" value={eventForm.cat} onChange={(e) => setEventForm({ ...eventForm, cat: e.target.value })}>{CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}</select></div>
              <div className="form-group"><div className="form-label">Иконка</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 120, overflowY: "auto" }}>{ICONS_ALL.map((ic) => (<button key={ic} className={`icon-opt ${eventForm.icon === ic ? "selected" : ""}`} onClick={() => setEventForm({ ...eventForm, icon: ic })} style={{ width: 36, height: 36, borderRadius: 10, background: eventForm.icon === ic ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.06)", border: eventForm.icon === ic ? "1.5px solid var(--sun)" : "1.5px solid transparent" }}>{ic}</button>))}</div></div>
              <div className="form-group"><div className="form-label">Название</div><input className="form-input" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} placeholder="Как называется?" /></div>
              <div className="form-group"><div className="form-label">Описание</div><textarea className="form-textarea" value={eventForm.desc} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} placeholder="Время, детали..." /></div>
              <div className="form-row">
                <div className="form-group"><div className="form-label">Цена</div><input className="form-input" type="number" value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })} placeholder="0" /></div>
                <div className="form-group"><div className="form-label">Длительность</div><input className="form-input" value={eventForm.duration} onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })} placeholder="2 ч" /></div>
              </div>
              <div className="form-group"><div className="form-label">Ссылки</div><textarea className="form-textarea" value={eventForm.links} onChange={(e) => setEventForm({ ...eventForm, links: e.target.value })} placeholder="https://..." /></div>
              {(modalEvent.sectionOverride === "transport" || modalEvent.sectionOverride === "hotel" || modalEvent.sectionOverride === "document" || !modalEvent.sectionOverride) && (
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
              <div className="form-group"><div className="form-label">Дата</div><DatePicker selected={dayForm.date ? new Date(dayForm.date) : null} onChange={(date) => setDayForm({ ...dayForm, date: date ? date.toISOString().split('T')[0] : '' })} dateFormat="dd.MM.yyyy" placeholderText="Выбери дату" className="form-input" /></div>
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
                <div className="form-group"><div className="form-label">Начало</div><DatePicker selected={tripForm.start ? new Date(tripForm.start) : null} onChange={(date) => setTripForm({ ...tripForm, start: date ? date.toISOString().split('T')[0] : '' })} dateFormat="dd.MM.yyyy" placeholderText="Выбери дату" className="form-input" calendarClassName="crazy-calendar" /></div>
                <div className="form-group"><div className="form-label">Конец</div><DatePicker selected={tripForm.end ? new Date(tripForm.end) : null} onChange={(date) => setTripForm({ ...tripForm, end: date ? date.toISOString().split('T')[0] : '' })} dateFormat="dd.MM.yyyy" placeholderText="Выбери дату" className="form-input" minDate={tripForm.start ? new Date(tripForm.start) : undefined} /></div>
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
              <button className="btn-primary" onClick={saveTrip}>💾 Сохранить</button>
              {!modalTrip.isNew && <button className="btn-secondary" style={{ background: "rgba(229,57,53,.1)", borderColor: "rgba(229,57,53,.2)" }} onClick={() => showConfirm("Удалить путешествие?", `"${trip.name}" и все его данные будут удалены. Это необратимо.`, () => { deleteTrip(trip.id); closeAllModals(); })}>🗑️ Удалить путешествие</button>}
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

        {modalDoc.open && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllModals}>
            <motion.div className="modal" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-title"><span>{modalDoc.editId ? "Редактировать документ" : "Новый документ"}</span><button className="modal-close" onClick={closeAllModals}>✕</button></div>
              <div className="form-group"><div className="form-label">Иконка</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 120, overflowY: "auto" }}>
                  {ICONS_ALL.map((ic) => (
                    <button key={ic} className={`icon-opt ${docForm.icon === ic ? "selected" : ""}`} onClick={() => setDocForm({ ...docForm, icon: ic })} style={{ width: 36, height: 36, borderRadius: 10, background: docForm.icon === ic ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.06)", border: docForm.icon === ic ? "1.5px solid var(--sun)" : "1.5px solid transparent" }}>{ic}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><div className="form-label">Название</div><input className="form-input" value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} placeholder="Паспорт, виза..." /></div>
              <div className="form-group"><div className="form-label">Описание</div><textarea className="form-textarea" value={docForm.desc} onChange={(e) => setDocForm({ ...docForm, desc: e.target.value })} placeholder="Информация о документе..." /></div>
              <div className="form-group"><div className="form-label">Ссылки</div><textarea className="form-textarea" value={docForm.links} onChange={(e) => setDocForm({ ...docForm, links: e.target.value })} placeholder="https://..." /></div>
              <button className="btn-primary" onClick={saveDoc}>💾 Сохранить</button>
              <button className="btn-secondary" onClick={closeAllModals}>Отмена</button>
            </motion.div>
          </motion.div>
        )}

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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
