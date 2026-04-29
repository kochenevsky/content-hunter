'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, CheckCircle2, Circle, Archive, Trash2, Menu, GripVertical, Target, Lightbulb, CalendarDays, LayoutBoard, ChevronDown } from 'lucide-react';

const API_BASE = 'https://tasktracker.oxion-ezhkov.workers.dev';
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const mins = (i % 2) * 30;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
});

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'task' | 'rest' | 'study';
  startTime: string;
  endTime: string;
  date: string;
  archived: boolean;
}

interface Project {
  id: string;
  name: string;
  order: number;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  priority: number;
  completed: boolean;
  subtasks: Subtask[];
  archived: boolean;
  order?: number;
}

interface Idea {
  id: string;
  title: string;
  tags: string[];
  questions: { question: string; answer: string }[];
  description: string;
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  timeframe: 'weekly' | 'monthly' | 'yearly';
  why: string;
  successCriteria: string;
  obstacles: string;
  actions: string;
  progress: number;
  reflection: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  meeting: '#c9a8d4',
  task: '#8fc4a0',
  rest: '#e8b88a',
  study: '#7aaed4',
};

const TYPE_LABELS: Record<string, string> = {
  meeting: 'Meeting',
  task: 'Task',
  rest: 'Rest',
  study: 'Study',
};

const PRIORITY_LABELS = ['', 'Low', 'Below Avg', 'Normal', 'High', 'Critical'];
const PRIORITY_COLORS = ['', '#b0c4b1', '#a8c0cc', '#c4a8cc', '#d4869a', '#c0392b'];
const PRIORITY_BG = ['', '#f0f4f0', '#eef3f6', '#f5f0f8', '#fdf0f3', '#fdf0ee'];

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const formatTime = (date: Date) => date.toTimeString().slice(0, 5);
const addMinutes = (time: string, mins: number) => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const App = () => {
  const [currentSection, setCurrentSection] = useState<'calendar' | 'tasks' | 'ideas' | 'goals'>('calendar');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventPopupPos, setEventPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<{ id: string; startDate: string; startTime: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ id: string; fromProjectId: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'project' | 'event'; id: string; name: string } | null>(null);
  const [editingNewTaskId, setEditingNewTaskId] = useState<string | null>(null);
  const [editingNewEventId, setEditingNewEventId] = useState<string | null>(null);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);
  const weekScrollRef = useRef<HTMLDivElement>(null);

  const saveToApi = useCallback(async (data: any, endpoint: string) => {
    try {
      await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, tasksRes, projectsRes, ideasRes, goalsRes] = await Promise.all([
          fetch(`${API_BASE}/calendar`),
          fetch(`${API_BASE}/tasks`),
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/ideas`),
          fetch(`${API_BASE}/goals`),
        ]);
        if (eventsRes.ok) setCalendarEvents(await eventsRes.json());
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (projectsRes.ok) {
          const p = await projectsRes.json();
          setProjects(p.map((pr: any, i: number) => ({ ...pr, order: pr.order ?? i })).sort((a: Project, b: Project) => a.order - b.order));
        }
        if (ideasRes.ok) setIdeas(await ideasRes.json());
        if (goalsRes.ok) setGoals(await goalsRes.json());
      } catch (error) {
        console.error('Load error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Scroll to current time on day/week view
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const mins = now.getMinutes();
    const scrollTo = Math.max(0, (hour * 2 + Math.floor(mins / 30) - 2) * 48);
    if (calendarView === 'day' && dayScrollRef.current) {
      setTimeout(() => dayScrollRef.current?.scrollTo({ top: scrollTo, behavior: 'smooth' }), 100);
    }
    if (calendarView === 'week' && weekScrollRef.current) {
      setTimeout(() => weekScrollRef.current?.scrollTo({ top: scrollTo, behavior: 'smooth' }), 100);
    }
  }, [calendarView]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowNavMenu(false);
      }
      // Close event popup on outside click
      const target = e.target as HTMLElement;
      if (!target.closest('[data-event-popup]') && !target.closest('[data-event-chip]')) {
        setSelectedEvent(null);
        setEventPopupPos(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const addCalendarEvent = (date: string, startTime: string, type: 'meeting' | 'task' | 'rest' | 'study') => {
    // Check if slot already has event
    const existing = calendarEvents.find(e => e.date === date && e.startTime === startTime && !e.archived);
    if (existing) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: '',
      type,
      startTime,
      endTime: addMinutes(startTime, 60),
      date,
      archived: false,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    setEditingNewEventId(newEvent.id);
    setSelectedEvent(newEvent);
    saveToApi(newEvent, '/calendar');
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...updates } : e));
      const event = updated.find(e => e.id === id);
      if (event) saveToApi(event, '/calendar');
      return updated;
    });
    if (selectedEvent?.id === id) setSelectedEvent(prev => prev ? { ...prev, ...updates } : prev);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
    setEventPopupPos(null);
    saveToApi({ id, deleted: true }, '/calendar');
  };

  const addProject = () => {
    const newProject: Project = { id: Date.now().toString(), name: 'New Project', order: projects.length };
    setProjects(prev => [...prev, newProject]);
    saveToApi(newProject, '/projects');
  };

  const updateProject = (id: string, name: string) => {
    setProjects(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, name } : p));
      saveToApi(updated.find(p => p.id === id), '/projects');
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    saveToApi({ id, deleted: true }, '/projects');
    setDeleteConfirm(null);
  };

  const addTask = (projectId: string, afterTaskId?: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId && !t.completed && !t.archived);
    let insertIdx = projectTasks.length;
    if (afterTaskId) {
      const idx = projectTasks.findIndex(t => t.id === afterTaskId);
      if (idx !== -1) insertIdx = idx + 1;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      projectId,
      title: '',
      priority: 3,
      completed: false,
      subtasks: [],
      archived: false,
      order: insertIdx,
    };
    setTasks(prev => [...prev, newTask]);
    setEditingNewTaskId(newTask.id);
    saveToApi(newTask, '/tasks');
    return newTask.id;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...updates } : t));
      const task = updated.find(t => t.id === id);
      if (task) saveToApi(task, '/tasks');
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    saveToApi({ id, deleted: true }, '/tasks');
  };

  const addSubtask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newSub: Subtask = { id: Date.now().toString(), title: 'New subtask', completed: false };
    updateTask(taskId, { subtasks: [...task.subtasks, newSub] });
  };

  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { subtasks: task.subtasks.map(s => s.id === subtaskId ? { ...s, ...updates } : s) });
  };

  const addIdea = () => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: 'New Idea',
      tags: [],
      questions: [
        { question: 'What problem does this solve?', answer: '' },
        { question: 'Who is it for?', answer: '' },
        { question: 'How is it different?', answer: '' },
      ],
      description: '',
      createdAt: new Date().toISOString(),
    };
    setIdeas(prev => [...prev, newIdea]);
    setExpandedIdea(newIdea.id);
    saveToApi(newIdea, '/ideas');
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(prev => {
      const updated = prev.map(i => (i.id === id ? { ...i, ...updates } : i));
      const idea = updated.find(i => i.id === id);
      if (idea) saveToApi(idea, '/ideas');
      return updated;
    });
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
    saveToApi({ id, deleted: true }, '/ideas');
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: 'New Goal',
      timeframe: 'weekly',
      why: '',
      successCriteria: '',
      obstacles: '',
      actions: '',
      progress: 0,
      reflection: '',
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
    setExpandedGoal(newGoal.id);
    saveToApi(newGoal, '/goals');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => {
      const updated = prev.map(g => (g.id === id ? { ...g, ...updates } : g));
      const goal = updated.find(g => g.id === id);
      if (goal) saveToApi(goal, '/goals');
      return updated;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    saveToApi({ id, deleted: true }, '/goals');
  };

  const getWeekDates = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      return dd;
    });
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (calendarView === 'day') d.setDate(d.getDate() + dir);
    else if (calendarView === 'week') d.setDate(d.getDate() + dir * 7);
    else if (calendarView === 'month') d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const openEventPopup = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setEventPopupPos({ x: rect.right + 8, y: rect.top });
    setSelectedEvent(event);
  };

  const now = new Date();
  const currentDateStr = formatDate(now);
  const currentTime = formatTime(now);

  const isSlotPast = (dateStr: string, time: string) =>
    dateStr < currentDateStr || (dateStr === currentDateStr && time < currentTime);

  const isEventPast = (event: CalendarEvent) => isSlotPast(event.date, event.startTime);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f7f5f2', fontFamily: "'Georgia', serif", fontSize: '16px', color: '#888', letterSpacing: '0.05em' }}>
      Loading…
    </div>
  );

  // ─── CALENDAR ────────────────────────────────────────────────────────────────

  const renderEventChip = (event: CalendarEvent, compact = false) => {
    const past = isEventPast(event);
    const color = past ? '#c8c4be' : TYPE_COLORS[event.type];
    const textColor = past ? '#999' : '#2c2c2c';
    return (
      <div
        key={event.id}
        data-event-chip
        draggable
        onDragStart={() => setDraggedEvent({ id: event.id, startDate: event.date, startTime: event.startTime })}
        onDragEnd={() => setDraggedEvent(null)}
        onClick={(e) => openEventPopup(event, e)}
        style={{
          padding: compact ? '2px 6px' : '4px 8px',
          borderRadius: '5px',
          fontSize: compact ? '10px' : '11px',
          background: color,
          color: textColor,
          cursor: 'grab',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          borderLeft: `3px solid ${past ? '#aaa' : TYPE_COLORS[event.type]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          fontStyle: past ? 'italic' : 'normal',
          opacity: past ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {event.title || <span style={{ opacity: 0.5 }}>Untitled</span>}
      </div>
    );
  };

  const EventPopup = () => {
    if (!selectedEvent || !eventPopupPos) return null;
    const ev = selectedEvent;
    const durationMins = (() => {
      const [sh, sm] = ev.startTime.split(':').map(Number);
      const [eh, em] = ev.endTime.split(':').map(Number);
      return (eh * 60 + em) - (sh * 60 + sm);
    })();

    const style: React.CSSProperties = {
      position: 'fixed',
      left: Math.min(eventPopupPos.x, window.innerWidth - 300),
      top: Math.min(eventPopupPos.y, window.innerHeight - 320),
      width: '270px',
      background: 'white',
      border: '1px solid #e5e0d8',
      borderRadius: '10px',
      padding: '14px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    };

    return (
      <div data-event-popup style={style}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {ev.date} · {ev.startTime}
          </span>
          <button onClick={() => { setSelectedEvent(null); setEventPopupPos(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: '2px', lineHeight: 1 }}>
            <X size={14} />
          </button>
        </div>
        <input
          autoFocus={editingNewEventId === ev.id}
          type="text"
          value={ev.title}
          placeholder="Event title…"
          onChange={e => updateCalendarEvent(ev.id, { title: e.target.value })}
          onKeyDown={e => { if (e.key === 'Enter') { setSelectedEvent(null); setEventPopupPos(null); setEditingNewEventId(null); } }}
          style={{ fontSize: '14px', fontWeight: '600', color: '#2c2c2c', padding: '6px 8px', border: '1px solid #e5e0d8', borderRadius: '6px', outline: 'none', background: '#faf9f7' }}
        />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['meeting', 'task', 'rest', 'study'] as const).map(t => (
            <button
              key={t}
              onClick={() => updateCalendarEvent(ev.id, { type: t })}
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '20px',
                border: `1.5px solid ${ev.type === t ? TYPE_COLORS[t] : '#e0ddd8'}`,
                background: ev.type === t ? TYPE_COLORS[t] : 'white',
                color: ev.type === t ? '#2c2c2c' : '#888',
                cursor: 'pointer',
                fontWeight: ev.type === t ? '600' : '400',
              }}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="time"
            value={ev.startTime}
            onChange={e => updateCalendarEvent(ev.id, { startTime: e.target.value })}
            style={{ fontSize: '12px', padding: '4px 6px', border: '1px solid #e5e0d8', borderRadius: '6px', outline: 'none', background: '#faf9f7', flex: 1 }}
          />
          <span style={{ color: '#ccc', fontSize: '12px' }}>→</span>
          <select
            value={durationMins}
            onChange={e => updateCalendarEvent(ev.id, { endTime: addMinutes(ev.startTime, parseInt(e.target.value)) })}
            style={{ fontSize: '12px', padding: '4px 6px', border: '1px solid #e5e0d8', borderRadius: '6px', outline: 'none', background: '#faf9f7', flex: 1 }}
          >
            {[15, 30, 45, 60, 90, 120, 180].map(m => (
              <option key={m} value={m}>{m}m</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={() => {
              const newTask: Task = {
                id: Date.now().toString(),
                projectId: projects[0]?.id || '',
                title: ev.title,
                priority: 3,
                completed: false,
                subtasks: [],
                archived: false,
              };
              setTasks(prev => [...prev, newTask]);
              saveToApi(newTask, '/tasks');
              setSelectedEvent(null);
              setEventPopupPos(null);
            }}
            style={{ flex: 1, fontSize: '11px', padding: '5px 8px', background: '#f0f4f0', border: '1px solid #d4e0d4', borderRadius: '6px', cursor: 'pointer', color: '#4a7a5a' }}
          >
            → Add to Tasks
          </button>
          <button
            onClick={() => {
              if (deleteConfirm?.id === ev.id) {
                deleteCalendarEvent(ev.id);
                setDeleteConfirm(null);
              } else {
                setDeleteConfirm({ type: 'event', id: ev.id, name: ev.title || 'this event' });
              }
            }}
            style={{ fontSize: '11px', padding: '5px 10px', background: deleteConfirm?.id === ev.id ? '#fee2e2' : '#faf9f7', border: `1px solid ${deleteConfirm?.id === ev.id ? '#fca5a5' : '#e5e0d8'}`, borderRadius: '6px', cursor: 'pointer', color: deleteConfirm?.id === ev.id ? '#b91c1c' : '#aaa' }}
          >
            {deleteConfirm?.id === ev.id ? 'Confirm delete' : 'Delete'}
          </button>
        </div>
      </div>
    );
  };

  const renderCalendarDay = () => {
    const dateStr = formatDate(currentDate);
    const dayEvents = calendarEvents.filter(e => e.date === dateStr && !e.archived);

    return (
      <div ref={dayScrollRef} style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: '0' }}>
          {TIME_SLOTS.map(time => {
            const slotEvents = dayEvents.filter(e => e.startTime === time);
            const past = isSlotPast(dateStr, time);
            const isCurrentHour = dateStr === currentDateStr && time === currentTime.slice(0, 5).replace(/:\d\d$/, m => `:${Math.floor(parseInt(m.slice(1)) / 30) * 30}`.padStart(3, ':'));
            return (
              <React.Fragment key={time}>
                <div style={{ fontSize: '11px', color: '#bbb', paddingTop: '10px', textAlign: 'right', paddingRight: '10px', fontFamily: "'Georgia', serif" }}>{time}</div>
                <div
                  onClick={() => !past && !slotEvents.length && addCalendarEvent(dateStr, time, 'task')}
                  style={{
                    minHeight: '44px',
                    borderTop: `1px solid ${past ? '#f0ede8' : '#e8e4de'}`,
                    padding: '4px 6px',
                    background: past ? '#faf9f7' : 'transparent',
                    cursor: past || slotEvents.length ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => !past && !slotEvents.length && (e.currentTarget.style.background = '#f5f3f0')}
                  onMouseLeave={(e) => !past && (e.currentTarget.style.background = 'transparent')}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedEvent) {
                      updateCalendarEvent(draggedEvent.id, { date: dateStr, startTime: time, endTime: addMinutes(time, 60) });
                      setDraggedEvent(null);
                    }
                  }}
                >
                  {slotEvents.map(event => renderEventChip(event))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendarWeek = () => {
    const weekDates = getWeekDates(currentDate);

    return (
      <div ref={weekScrollRef} style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `56px repeat(7, 1fr)`, minWidth: '900px' }}>
          <div />
          {weekDates.map(date => {
            const dateStr = formatDate(date);
            const isToday = dateStr === currentDateStr;
            return (
              <div key={dateStr} style={{ textAlign: 'center', fontSize: '11px', fontWeight: isToday ? '700' : '500', padding: '8px 4px', color: isToday ? '#6a5acd' : '#888', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: `2px solid ${isToday ? '#6a5acd' : 'transparent'}` }}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })} {date.getDate()}
              </div>
            );
          })}
          {TIME_SLOTS.map(time => (
            <React.Fragment key={time}>
              <div style={{ fontSize: '11px', color: '#bbb', paddingTop: '10px', textAlign: 'right', paddingRight: '10px', fontFamily: "'Georgia', serif" }}>{time}</div>
              {weekDates.map(date => {
                const dateStr = formatDate(date);
                const slotEvents = calendarEvents.filter(e => e.date === dateStr && e.startTime === time && !e.archived);
                const past = isSlotPast(dateStr, time);
                return (
                  <div
                    key={dateStr}
                    onClick={() => !past && !slotEvents.length && addCalendarEvent(dateStr, time, 'task')}
                    style={{
                      minHeight: '44px',
                      borderTop: '1px solid #f0ede8',
                      borderLeft: '1px solid #f0ede8',
                      padding: '3px 4px',
                      background: past ? '#faf9f7' : dateStr === currentDateStr ? '#faf8ff' : 'transparent',
                      cursor: past || slotEvents.length ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                    onMouseEnter={(e) => !past && !slotEvents.length && (e.currentTarget.style.background = '#f5f3f0')}
                    onMouseLeave={(e) => !past && (e.currentTarget.style.background = dateStr === currentDateStr ? '#faf8ff' : 'transparent')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedEvent) {
                        updateCalendarEvent(draggedEvent.id, { date: dateStr, startTime: time, endTime: addMinutes(time, 60) });
                        setDraggedEvent(null);
                      }
                    }}
                  >
                    {slotEvents.map(event => renderEventChip(event, true))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendarMonth = () => {
    const monthDates = getMonthDates(currentDate);
    const firstDate = monthDates[0];
    const startDay = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
    const calendarGrid = Array(startDay).fill(null).concat(monthDates);

    return (
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', padding: '8px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{day}</div>
          ))}
          {calendarGrid.map((date, i) => {
            if (!date) return <div key={`e-${i}`} style={{ minHeight: '90px' }} />;
            const dateStr = formatDate(date);
            const dayEvents = calendarEvents.filter(e => e.date === dateStr && !e.archived);
            const isToday = dateStr === currentDateStr;
            return (
              <div key={dateStr} style={{ minHeight: '90px', border: `1.5px solid ${isToday ? '#6a5acd' : '#ede9e3'}`, borderRadius: '6px', padding: '6px', background: isToday ? '#faf8ff' : 'white' }}>
                <div style={{ fontSize: '12px', fontWeight: isToday ? '700' : '500', marginBottom: '4px', color: isToday ? '#6a5acd' : '#888' }}>{date.getDate()}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dayEvents.slice(0, 3).map(event => renderEventChip(event, true))}
                  {dayEvents.length > 3 && <div style={{ fontSize: '10px', color: '#bbb' }}>+{dayEvents.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const navLabel = calendarView === 'day'
      ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      : calendarView === 'week'
        ? (() => { const w = getWeekDates(currentDate); return `${w[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${w[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`; })()
        : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ede9e3', gap: '12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['day', 'week', 'month'] as const).map(view => (
              <button key={view} onClick={() => setCalendarView(view)} style={{
                padding: '5px 12px', fontSize: '12px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                background: calendarView === view ? '#2c2c2c' : 'transparent',
                color: calendarView === view ? 'white' : '#888',
                fontWeight: calendarView === view ? '600' : '400',
                textTransform: 'capitalize', letterSpacing: '0.03em', transition: 'all 0.15s',
              }}>{view}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => navigate(-1)} style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px', color: '#888', display: 'flex' }}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#555', minWidth: '160px', textAlign: 'center' }}>{navLabel}</span>
            <button onClick={() => navigate(1)} style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px', color: '#888', display: 'flex' }}><ChevronRight size={16} /></button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #e0ddd8', background: 'white', cursor: 'pointer', color: '#555' }}>Today</button>
        </div>
        {calendarView === 'day' && renderCalendarDay()}
        {calendarView === 'week' && renderCalendarWeek()}
        {calendarView === 'month' && renderCalendarMonth()}
      </div>
    );
  };

  // ─── TASKS (Kanban) ───────────────────────────────────────────────────────────

  const renderTasks = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ede9e3', flexShrink: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2c2c2c', margin: 0, fontFamily: "'Georgia', serif" }}>Tasks</h1>
          <button onClick={addProject} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px', background: '#2c2c2c', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
            <Plus size={14} /> New List
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {projects.map((project) => {
            const activeTasks = tasks.filter(t => t.projectId === project.id && !t.completed && !t.archived).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const completedTasks = tasks.filter(t => t.projectId === project.id && t.completed);
            const [showCompleted, setShowCompleted] = useState(false);

            return (
              <div
                key={project.id}
                draggable
                onDragStart={() => setDraggedProject(project.id)}
                onDragEnd={() => setDraggedProject(null)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedTask) {
                    updateTask(draggedTask.id, { projectId: project.id });
                    setDraggedTask(prev => prev ? { ...prev, fromProjectId: project.id } : prev);
                  }
                }}
                style={{
                  width: '280px',
                  flexShrink: 0,
                  background: 'white',
                  border: '1px solid #ede9e3',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 120px)',
                  opacity: draggedProject === project.id ? 0.5 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {/* Project header */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0ede8', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, cursor: 'grab' }}>
                  <GripVertical size={14} color="#ccc" />
                  <input
                    type="text"
                    value={project.name}
                    onChange={e => updateProject(project.id, e.target.value)}
                    style={{ flex: 1, fontWeight: '700', fontSize: '13px', color: '#2c2c2c', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Georgia', serif" }}
                  />
                  <span style={{ fontSize: '11px', color: '#bbb', background: '#f5f3f0', padding: '2px 7px', borderRadius: '10px' }}>{activeTasks.length}</span>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'project', id: project.id, name: project.name })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', padding: '2px', display: 'flex', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#ddd')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Tasks list */}
                <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                  {activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projects={projects}
                      autoFocus={editingNewTaskId === task.id}
                      onFocusDone={() => setEditingNewTaskId(null)}
                      onUpdate={(updates) => updateTask(task.id, updates)}
                      onDelete={() => deleteTask(task.id)}
                      onArchive={() => updateTask(task.id, { archived: true })}
                      onComplete={() => updateTask(task.id, { completed: true })}
                      onAddSubtask={() => addSubtask(task.id)}
                      onUpdateSubtask={(sid, updates) => updateSubtask(task.id, sid, updates)}
                      onEnterKey={() => addTask(project.id, task.id)}
                      onTabKey={() => addSubtask(task.id)}
                      onDragStart={() => setDraggedTask({ id: task.id, fromProjectId: project.id })}
                      onDragEnd={() => setDraggedTask(null)}
                    />
                  ))}

                  <button
                    onClick={() => addTask(project.id)}
                    style={{ width: '100%', textAlign: 'left', fontSize: '12px', color: '#bbb', padding: '8px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f3f0'; e.currentTarget.style.color = '#888'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#bbb'; }}
                  >
                    <Plus size={13} /> Add task
                  </button>

                  {completedTasks.length > 0 && (
                    <div style={{ marginTop: '8px', borderTop: '1px solid #f0ede8', paddingTop: '8px' }}>
                      <button
                        onClick={() => setShowCompleted(v => !v)}
                        style={{ width: '100%', textAlign: 'left', fontSize: '11px', color: '#bbb', padding: '4px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ChevronDown size={12} style={{ transform: showCompleted ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        Completed ({completedTasks.length})
                      </button>
                      {showCompleted && completedTasks.map(task => (
                        <div key={task.id} style={{ padding: '6px 8px', fontSize: '12px', color: '#bbb', textDecoration: 'line-through', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{task.title}</span>
                          <button onClick={() => updateTask(task.id, { completed: false })} style={{ fontSize: '10px', color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}>Undo</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {/* Archived column */}
          {tasks.filter(t => t.archived).length > 0 && (
            <div style={{ width: '240px', flexShrink: 0 }}>
              <div style={{ fontSize: '12px', color: '#bbb', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>Archived</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tasks.filter(t => t.archived).map(task => (
                  <div key={task.id} style={{ padding: '8px 12px', borderRadius: '6px', background: '#f5f3f0', fontSize: '12px', color: '#bbb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{task.title}</span>
                    <button onClick={() => updateTask(task.id, { archived: false })} style={{ fontSize: '10px', color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}>Restore</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── IDEAS ───────────────────────────────────────────────────────────────────

  const renderIdeas = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ede9e3', flexShrink: 0 }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2c2c2c', margin: 0, fontFamily: "'Georgia', serif" }}>Ideas</h1>
        <button onClick={addIdea} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px', background: '#2c2c2c', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
          <Plus size={14} /> New Idea
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ideas.length === 0 && (
          <div style={{ textAlign: 'center', color: '#ccc', fontSize: '14px', marginTop: '40px' }}>
            <Lightbulb size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No ideas yet. Capture your first one!</p>
          </div>
        )}
        {ideas.map(idea => (
          <div key={idea.id} style={{ border: '1px solid #ede9e3', borderRadius: '10px', background: 'white', overflow: 'hidden' }}>
            <div
              onClick={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)}
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <Lightbulb size={16} color="#d4a82a" />
              <input
                type="text"
                value={idea.title}
                onChange={e => { e.stopPropagation(); updateIdea(idea.id, { title: e.target.value }); }}
                onClick={e => e.stopPropagation()}
                style={{ flex: 1, fontWeight: '600', fontSize: '14px', color: '#2c2c2c', background: 'transparent', border: 'none', outline: 'none' }}
              />
              <span style={{ fontSize: '11px', color: '#bbb' }}>{new Date(idea.createdAt).toLocaleDateString()}</span>
              <ChevronDown size={14} color="#bbb" style={{ transform: expandedIdea === idea.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              <button onClick={(e) => { e.stopPropagation(); deleteIdea(idea.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', padding: '2px', flexShrink: 0, display: 'flex' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ddd')}
              ><Trash2 size={13} /></button>
            </div>
            {expandedIdea === idea.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f5f2ee', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  value={idea.description}
                  onChange={e => updateIdea(idea.id, { description: e.target.value })}
                  placeholder="Describe the idea in more detail…"
                  style={{ width: '100%', fontSize: '13px', color: '#555', background: '#faf9f7', padding: '10px', borderRadius: '6px', border: '1px solid #ede9e3', resize: 'none', height: '70px', outline: 'none', marginTop: '12px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {idea.questions.map((q, i) => (
                    <div key={i} style={{ background: '#faf9f7', borderRadius: '6px', padding: '10px', border: '1px solid #ede9e3' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={q.question}
                          onChange={e => {
                            const updated = [...idea.questions];
                            updated[i].question = e.target.value;
                            updateIdea(idea.id, { questions: updated });
                          }}
                          style={{ flex: 1, fontSize: '11px', fontWeight: '700', color: '#888', background: 'transparent', border: 'none', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <button onClick={() => updateIdea(idea.id, { questions: idea.questions.filter((_, idx) => idx !== i) })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: '12px', padding: '0' }}>✕</button>
                      </div>
                      <textarea
                        value={q.answer}
                        onChange={e => {
                          const updated = [...idea.questions];
                          updated[i].answer = e.target.value;
                          updateIdea(idea.id, { questions: updated });
                        }}
                        placeholder="Your answer…"
                        style={{ width: '100%', fontSize: '13px', color: '#444', background: 'transparent', border: 'none', outline: 'none', resize: 'none', height: '50px', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateIdea(idea.id, { questions: [...idea.questions, { question: 'New question', answer: '' }] })}
                  style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#aaa', background: 'none', border: '1px dashed #ddd', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}
                >
                  + Add question
                </button>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  {idea.tags.map(tag => (
                    <span key={tag} onClick={() => updateIdea(idea.id, { tags: idea.tags.filter(t => t !== tag) })}
                      style={{ padding: '3px 10px', fontSize: '11px', borderRadius: '20px', background: '#fef3c7', color: '#b45309', cursor: 'pointer' }}>
                      {tag} ✕
                    </span>
                  ))}
                  <input type="text" placeholder="+ tag"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                        updateIdea(idea.id, { tags: [...idea.tags, (e.target as HTMLInputElement).value] });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    style={{ fontSize: '11px', color: '#aaa', background: 'none', border: 'none', outline: 'none', width: '60px' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── GOALS ───────────────────────────────────────────────────────────────────

  const timeframeColors: Record<string, string> = { weekly: '#8fc4a0', monthly: '#7aaed4', yearly: '#c9a8d4' };

  const renderGoals = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ede9e3', flexShrink: 0 }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2c2c2c', margin: 0, fontFamily: "'Georgia', serif" }}>Goals</h1>
        <button onClick={addGoal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px', background: '#2c2c2c', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
          <Plus size={14} /> New Goal
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {goals.length === 0 && (
          <div style={{ textAlign: 'center', color: '#ccc', fontSize: '14px', marginTop: '40px' }}>
            <Target size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No goals yet. Set your first one!</p>
          </div>
        )}
        {goals.map(goal => (
          <div key={goal.id} style={{ border: '1px solid #ede9e3', borderRadius: '10px', background: 'white', overflow: 'hidden' }}>
            <div onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <Target size={16} color={timeframeColors[goal.timeframe]} />
              <input
                type="text"
                value={goal.title}
                onChange={e => { e.stopPropagation(); updateGoal(goal.id, { title: e.target.value }); }}
                onClick={e => e.stopPropagation()}
                style={{ flex: 1, fontWeight: '600', fontSize: '14px', color: '#2c2c2c', background: 'transparent', border: 'none', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['weekly', 'monthly', 'yearly'] as const).map(tf => (
                  <button key={tf} onClick={e => { e.stopPropagation(); updateGoal(goal.id, { timeframe: tf }); }}
                    style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: goal.timeframe === tf ? timeframeColors[tf] : '#f0ede8', color: goal.timeframe === tf ? 'white' : '#aaa', fontWeight: goal.timeframe === tf ? '700' : '400', textTransform: 'capitalize' }}>
                    {tf}
                  </button>
                ))}
              </div>
              {/* Progress pill */}
              <div style={{ width: '48px', height: '6px', background: '#f0ede8', borderRadius: '3px', flexShrink: 0, overflow: 'hidden' }}>
                <div style={{ width: `${goal.progress}%`, height: '100%', background: timeframeColors[goal.timeframe], borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#bbb', minWidth: '28px', textAlign: 'right' }}>{goal.progress}%</span>
              <ChevronDown size={14} color="#bbb" style={{ transform: expandedGoal === goal.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              <button onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', padding: '2px', flexShrink: 0, display: 'flex' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ddd')}
              ><Trash2 size={13} /></button>
            </div>
            {expandedGoal === goal.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f5f2ee', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                <GoalField label="Why this goal matters" value={goal.why} placeholder="What motivates you to achieve this?" onChange={v => updateGoal(goal.id, { why: v })} />
                <GoalField label="How will you know you succeeded?" value={goal.successCriteria} placeholder="Define clear, measurable criteria…" onChange={v => updateGoal(goal.id, { successCriteria: v })} />
                <GoalField label="Potential obstacles" value={goal.obstacles} placeholder="What might get in the way?" onChange={v => updateGoal(goal.id, { obstacles: v })} />
                <GoalField label="Actions I'll take" value={goal.actions} placeholder="Concrete next steps…" onChange={v => updateGoal(goal.id, { actions: v })} />
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Progress</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="range" min="0" max="100" value={goal.progress}
                      onChange={e => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                      style={{ flex: 1, accentColor: timeframeColors[goal.timeframe], cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#555', minWidth: '36px' }}>{goal.progress}%</span>
                  </div>
                </div>
                <GoalField label="Reflection" value={goal.reflection} placeholder="What have you learned? What would you do differently?" onChange={v => updateGoal(goal.id, { reflection: v })} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── NAV ─────────────────────────────────────────────────────────────────────

  const NAV_ITEMS = [
    { key: 'calendar', label: 'Calendar', icon: CalendarDays },
    { key: 'tasks', label: 'Tasks', icon: LayoutBoard },
    { key: 'ideas', label: 'Ideas', icon: Lightbulb },
    { key: 'goals', label: 'Goals', icon: Target },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f5f2', fontFamily: "'system-ui', '-apple-system', sans-serif", fontSize: '14px', color: '#2c2c2c', overflow: 'hidden' }}>
      {/* Sidebar nav */}
      <div
        ref={navRef}
        onMouseEnter={() => setShowNavMenu(true)}
        onMouseLeave={() => setShowNavMenu(false)}
        style={{
          width: showNavMenu ? '160px' : '52px',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          background: '#2c2c2c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: '16px 0',
          gap: '4px',
          overflow: 'hidden',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ height: '40px', display: 'flex', alignItems: 'center', paddingLeft: '14px', marginBottom: '12px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '18px', fontFamily: "'Georgia', serif", color: 'white', fontWeight: '700', opacity: showNavMenu ? 1 : 0, transition: 'opacity 0.2s', letterSpacing: '-0.02em' }}>Flow</span>
          {!showNavMenu && <div style={{ width: '24px', height: '24px', background: '#6a5acd', borderRadius: '6px', flexShrink: 0 }} />}
        </div>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const active = currentSection === key;
          return (
            <button
              key={key}
              onClick={() => setCurrentSection(key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: active ? 'white' : 'rgba(255,255,255,0.5)',
                borderLeft: `3px solid ${active ? '#6a5acd' : 'transparent'}`,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              onMouseLeave={(e) => !active && (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: active ? '600' : '400', opacity: showNavMenu ? 1 : 0, transition: 'opacity 0.15s' }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {currentSection === 'calendar' && renderCalendar()}
        {currentSection === 'tasks' && renderTasks()}
        {currentSection === 'ideas' && renderIdeas()}
        {currentSection === 'goals' && renderGoals()}
      </div>

      {/* Event popup */}
      <EventPopup />

      {/* Delete confirmation modal */}
      {deleteConfirm && deleteConfirm.type === 'project' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
          onClick={() => setDeleteConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '320px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: '#2c2c2c', fontFamily: "'Georgia', serif" }}>Delete "{deleteConfirm.name}"?</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#888', lineHeight: '1.5' }}>This will permanently delete the list and all its tasks. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px', border: '1px solid #e0ddd8', background: 'white', cursor: 'pointer', color: '#555' }}>Cancel</button>
              <button onClick={() => deleteProject(deleteConfirm.id)} style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TASK CARD COMPONENT ──────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  projects: Project[];
  autoFocus: boolean;
  onFocusDone: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onArchive: () => void;
  onComplete: () => void;
  onAddSubtask: () => void;
  onUpdateSubtask: (id: string, updates: Partial<Subtask>) => void;
  onEnterKey: () => void;
  onTabKey: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const TaskCard = ({ task, projects, autoFocus, onFocusDone, onUpdate, onDelete, onArchive, onComplete, onAddSubtask, onUpdateSubtask, onEnterKey, onTabKey, onDragStart, onDragEnd }: TaskCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      onFocusDone();
    }
  }, [autoFocus]);

  const priority = task.priority;
  const pColor = PRIORITY_COLORS[priority] || '#ccc';
  const pBg = PRIORITY_BG[priority] || '#f5f5f5';
  const pLabel = PRIORITY_LABELS[priority] || '';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        padding: '10px 10px 10px 8px',
        borderRadius: '8px',
        marginBottom: '4px',
        background: '#faf9f7',
        border: '1px solid #ede9e3',
        borderLeft: `3px solid ${pColor}`,
        cursor: 'grab',
        transition: 'box-shadow 0.15s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <button onClick={onComplete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '1px', marginTop: '2px', flexShrink: 0, display: 'flex', transition: 'color 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#8fc4a0')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}
        >
          <Circle size={15} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            ref={inputRef}
            type="text"
            value={task.title}
            placeholder="Task name…"
            onChange={e => onUpdate({ title: e.target.value })}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); onEnterKey(); }
              if (e.key === 'Tab') { e.preventDefault(); onTabKey(); }
            }}
            style={{ width: '100%', fontSize: '13px', color: '#2c2c2c', background: 'transparent', border: 'none', outline: 'none', fontWeight: '500' }}
          />
          {/* Priority selector */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map(p => (
              <button
                key={p}
                onClick={() => onUpdate({ priority: p })}
                title={PRIORITY_LABELS[p]}
                style={{
                  width: p <= priority ? '14px' : '10px',
                  height: '6px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  background: p <= priority ? PRIORITY_COLORS[p] : '#e8e4de',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              />
            ))}
            <span style={{ fontSize: '10px', color: '#bbb', marginLeft: '4px' }}>{pLabel}</span>
          </div>

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div style={{ marginTop: '8px', paddingLeft: '8px', borderLeft: '1.5px solid #e8e4de', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {task.subtasks.map(sub => (
                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={() => onUpdateSubtask(sub.id, { completed: !sub.completed })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: sub.completed ? '#8fc4a0' : '#ccc', padding: '0', display: 'flex', flexShrink: 0 }}>
                    {sub.completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                  </button>
                  <input
                    type="text"
                    value={sub.title}
                    onChange={e => onUpdateSubtask(sub.id, { title: e.target.value })}
                    style={{ fontSize: '11px', color: sub.completed ? '#ccc' : '#666', background: 'transparent', border: 'none', outline: 'none', flex: 1, textDecoration: sub.completed ? 'line-through' : 'none' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {showActions && (
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
            <button onClick={onAddSubtask} title="Add subtask" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '2px', display: 'flex', fontSize: '11px', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}
            >⤵</button>
            <button onClick={onArchive} title="Archive" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '2px', display: 'flex', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}
            ><Archive size={12} /></button>
            <button onClick={onDelete} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '2px', display: 'flex', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}
            ><Trash2 size={12} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── GOAL FIELD COMPONENT ─────────────────────────────────────────────────────

const GoalField = ({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (v: string) => void }) => (
  <div>
    <label style={{ fontSize: '11px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px', marginTop: '8px' }}>{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', fontSize: '13px', color: '#444', background: '#faf9f7', padding: '10px', borderRadius: '6px', border: '1px solid #ede9e3', resize: 'none', height: '64px', outline: 'none', boxSizing: 'border-box', lineHeight: '1.5' }}
    />
  </div>
);

export default App;
