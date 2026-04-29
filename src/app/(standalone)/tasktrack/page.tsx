'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, CheckCircle2, Circle, Archive, Trash2, Menu, GripVertical } from 'lucide-react';

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
  tags: string[];
  archived: boolean;
}

interface Project {
  id: string;
  name: string;
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
  tags: string[];
  completed: boolean;
  subtasks: Subtask[];
  archived: boolean;
}

interface Idea {
  id: string;
  title: string;
  tags: string[];
  questions: { question: string; answer: string }[];
  description: string;
  createdAt: string;
}

interface GoalField {
  name: string;
  value: string;
}

interface Goal {
  id: string;
  title: string;
  timeframe: 'weekly' | 'monthly' | 'yearly';
  fields: GoalField[];
  progress: number;
  credit: number;
  debit: number;
  reflection: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  meeting: '#D4A5D4',
  task: '#A8D5BA',
  rest: '#FFD9B3',
  study: '#B3D9FF',
};

const PRIORITY_COLORS = ['#E8C4E8', '#D4A5D4', '#B86BA8', '#8B4789', '#5C2666'];

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
  const [draggedEvent, setDraggedEvent] = useState<{ id: string; startDate: string; startTime: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navMenuRef = useRef<HTMLDivElement>(null);

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
        if (projectsRes.ok) setProjects(await projectsRes.json());
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target as Node)) {
        setShowNavMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addCalendarEvent = (date: string, startTime: string, type: 'meeting' | 'task' | 'rest' | 'study') => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: 'New Event',
      type,
      startTime,
      endTime: addMinutes(startTime, 30),
      date,
      tags: [],
      archived: false,
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    saveToApi(newEvent, '/calendar');
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    const updated = calendarEvents.map(e => (e.id === id ? { ...e, ...updates } : e));
    setCalendarEvents(updated);
    const event = updated.find(e => e.id === id);
    if (event) saveToApi(event, '/calendar');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
    saveToApi({ id, deleted: true }, '/calendar');
  };

  const addProject = () => {
    const newProject: Project = { id: Date.now().toString(), name: 'New Project' };
    setProjects([...projects, newProject]);
    saveToApi(newProject, '/projects');
  };

  const updateProject = (id: string, name: string) => {
    const updated = projects.map(p => (p.id === id ? { ...p, name } : p));
    setProjects(updated);
    saveToApi(updated.find(p => p.id === id), '/projects');
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setTasks(tasks.filter(t => t.projectId !== id));
    saveToApi({ id, deleted: true }, '/projects');
  };

  const addTask = (projectId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      projectId,
      title: 'New Task',
      priority: 3,
      tags: [],
      completed: false,
      subtasks: [],
      archived: false,
    };
    setTasks([...tasks, newTask]);
    saveToApi(newTask, '/tasks');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, ...updates } : t));
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) saveToApi(task, '/tasks');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    saveToApi({ id, deleted: true }, '/tasks');
  };

  const archiveTask = (id: string) => {
    updateTask(id, { archived: true });
  };

  const addSubtask = (taskId: string) => {
    updateTask(taskId, {
      subtasks: [...(tasks.find(t => t.id === taskId)?.subtasks || []), { id: Date.now().toString(), title: 'New Subtask', completed: false }],
    });
  };

  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    updateTask(taskId, {
      subtasks: (tasks.find(t => t.id === taskId)?.subtasks || []).map(s => (s.id === subtaskId ? { ...s, ...updates } : s)),
    });
  };

  const addIdea = () => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: 'New Idea',
      tags: [],
      questions: [
        { question: 'Problem', answer: '' },
        { question: 'Solution', answer: '' },
        { question: 'Target Market', answer: '' },
      ],
      description: '',
      createdAt: new Date().toISOString(),
    };
    setIdeas([...ideas, newIdea]);
    saveToApi(newIdea, '/ideas');
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    const updated = ideas.map(i => (i.id === id ? { ...i, ...updates } : i));
    setIdeas(updated);
    const idea = updated.find(i => i.id === id);
    if (idea) saveToApi(idea, '/ideas');
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
    saveToApi({ id, deleted: true }, '/ideas');
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: 'New Goal',
      timeframe: 'weekly',
      fields: [],
      progress: 0,
      credit: 0,
      debit: 0,
      reflection: '',
      createdAt: new Date().toISOString(),
    };
    setGoals([...goals, newGoal]);
    saveToApi(newGoal, '/goals');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map(g => (g.id === id ? { ...g, ...updates } : g));
    setGoals(updated);
    const goal = updated.find(g => g.id === id);
    if (goal) saveToApi(goal, '/goals');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    saveToApi({ id, deleted: true }, '/goals');
  };

  const getWeekDates = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => new Date(monday.getTime() + i * 86400000));
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '18px', color: '#737373' }}>Loading...</div>;

  const renderCalendarDay = () => {
    const dateStr = formatDate(currentDate);
    const dayEvents = calendarEvents.filter(e => e.date === dateStr && !e.archived);
    const now = new Date();
    const currentDateStr = formatDate(now);
    const currentTime = formatTime(now);

    return (
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px' }}>
          {TIME_SLOTS.map(time => {
            const slotEvents = dayEvents.filter(e => e.startTime === time);
            const isPast = dateStr < currentDateStr || (dateStr === currentDateStr && time < currentTime);
            return (
              <React.Fragment key={time}>
                <div style={{ fontSize: '12px', color: '#737373', paddingTop: '8px' }}>{time}</div>
                <div
                  onClick={() => !isPast && addCalendarEvent(dateStr, time, 'task')}
                  style={{
                    minHeight: '40px',
                    border: `1px dashed ${isPast ? '#d4d4d4' : '#a3a3a3'}`,
                    borderRadius: '4px',
                    padding: '4px',
                    backgroundColor: isPast ? '#fafafa' : 'white',
                    cursor: isPast ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                  onMouseEnter={(e) => !isPast && (e.currentTarget.style.backgroundColor = '#f0f9ff')}
                  onMouseLeave={(e) => !isPast && (e.currentTarget.style.backgroundColor = 'white')}
                >
                  {slotEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        backgroundColor: TYPE_COLORS[event.type],
                        color: '#2c2c2c',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
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
    const now = new Date();
    const currentDateStr = formatDate(now);
    const currentTime = formatTime(now);

    return (
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(7, 1fr)`, gap: '8px', minWidth: '1200px' }}>
          <div></div>
          {weekDates.map(date => (
            <div key={formatDate(date)} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#2c2c2c' }}>
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          ))}

          {TIME_SLOTS.map(time => (
            <React.Fragment key={time}>
              <div style={{ fontSize: '12px', color: '#737373', paddingTop: '8px', textAlign: 'right', paddingRight: '8px' }}>{time}</div>
              {weekDates.map(date => {
                const dateStr = formatDate(date);
                const dayEvents = calendarEvents.filter(e => e.date === dateStr && e.startTime === time && !e.archived);
                const isPast = dateStr < currentDateStr || (dateStr === currentDateStr && time < currentTime);
                return (
                  <div
                    key={dateStr}
                    onClick={() => !isPast && addCalendarEvent(dateStr, time, 'task')}
                    style={{
                      minHeight: '40px',
                      border: `1px dashed ${isPast ? '#d4d4d4' : '#a3a3a3'}`,
                      borderRadius: '4px',
                      padding: '4px',
                      backgroundColor: isPast ? '#fafafa' : formatDate(date) === currentDateStr ? '#f0f9ff' : 'white',
                      cursor: isPast ? 'default' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => !isPast && (e.currentTarget.style.backgroundColor = formatDate(date) === currentDateStr ? '#dbeafe' : '#f0f9ff')}
                    onMouseLeave={(e) => !isPast && (e.currentTarget.style.backgroundColor = formatDate(date) === currentDateStr ? '#f0f9ff' : 'white')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedEvent) {
                        updateCalendarEvent(draggedEvent.id, { date: dateStr, startTime: time, endTime: addMinutes(time, 30) });
                        setDraggedEvent(null);
                      }
                    }}
                  >
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={() => setDraggedEvent({ id: event.id, startDate: event.date, startTime: event.startTime })}
                        onDragEnd={() => setDraggedEvent(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        style={{
                          padding: '3px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          backgroundColor: TYPE_COLORS[event.type],
                          color: '#2c2c2c',
                          cursor: 'grab',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
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
    const now = new Date();
    const currentDateStr = formatDate(now);

    return (
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', padding: '8px', color: '#2c2c2c' }}>
              {day}
            </div>
          ))}
          {calendarGrid.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} style={{ minHeight: '100px' }} />;
            const dateStr = formatDate(date);
            const dayEvents = calendarEvents.filter(e => e.date === dateStr && !e.archived);
            const isToday = dateStr === currentDateStr;
            return (
              <div
                key={dateStr}
                style={{
                  minHeight: '100px',
                  border: `1px solid ${isToday ? '#0ea5e9' : '#e5e5e5'}`,
                  borderRadius: '4px',
                  padding: '8px',
                  backgroundColor: isToday ? '#f0f9ff' : 'white',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: isToday ? '#0ea5e9' : '#2c2c2c' }}>{date.getDate()}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        backgroundColor: TYPE_COLORS[event.type],
                        color: '#2c2c2c',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && <div style={{ fontSize: '10px', color: '#737373' }}>+{dayEvents.length - 3}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#2c2c2c' }}>Calendar</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['day', 'week', 'month'] as const).map(view => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: calendarView === view ? TYPE_COLORS.meeting : '#e5e5e5',
                  color: calendarView === view ? 'white' : '#404040',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                }}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            <ChevronLeft size={20} color="#404040" />
          </button>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#404040' }}>{currentDate.toDateString()}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            <ChevronRight size={20} color="#404040" />
          </button>
        </div>

        {calendarView === 'day' && renderCalendarDay()}
        {calendarView === 'week' && renderCalendarWeek()}
        {calendarView === 'month' && renderCalendarMonth()}

        {selectedEvent && (
          <div style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '12px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: '600', color: '#2c2c2c' }}>{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                <X size={16} color="#a3a3a3" />
              </button>
            </div>
            <input
              type="text"
              value={selectedEvent.title}
              onChange={e => updateCalendarEvent(selectedEvent.id, { title: e.target.value })}
              style={{ fontSize: '14px', padding: '6px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none' }}
            />
            <select
              value={selectedEvent.type}
              onChange={e => updateCalendarEvent(selectedEvent.id, { type: e.target.value as any })}
              style={{ fontSize: '12px', padding: '6px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none' }}
            >
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
              <option value="rest">Rest</option>
              <option value="study">Study</option>
            </select>
            <input
              type="time"
              value={selectedEvent.startTime}
              onChange={e => updateCalendarEvent(selectedEvent.id, { startTime: e.target.value, endTime: addMinutes(e.target.value, 30) })}
              style={{ fontSize: '12px', padding: '6px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                min="30"
                step="30"
                value={Math.round((TIME_SLOTS.indexOf(selectedEvent.endTime) - TIME_SLOTS.indexOf(selectedEvent.startTime)) * 15)}
                onChange={e => updateCalendarEvent(selectedEvent.id, { endTime: addMinutes(selectedEvent.startTime, parseInt(e.target.value)) })}
                placeholder="Duration (min)"
                style={{ fontSize: '12px', padding: '6px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none', flex: 1 }}
              />
              <button
                onClick={() => {
                  const newTask: Task = {
                    id: Date.now().toString(),
                    projectId: projects[0]?.id || '',
                    title: selectedEvent.title,
                    priority: 3,
                    tags: selectedEvent.tags,
                    completed: false,
                    subtasks: [],
                    archived: false,
                  };
                  setTasks([...tasks, newTask]);
                  saveToApi(newTask, '/tasks');
                  setSelectedEvent(null);
                }}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  backgroundColor: '#A8D5BA',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                To Tasks
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedEvent.tags.map(tag => (
                <span
                  key={tag}
                  onClick={() => updateCalendarEvent(selectedEvent.id, { tags: selectedEvent.tags.filter(t => t !== tag) })}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    cursor: 'pointer',
                  }}
                >
                  {tag} ✕
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tag"
                onKeyPress={e => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                    const newTag = (e.target as HTMLInputElement).value;
                    updateCalendarEvent(selectedEvent.id, { tags: [...selectedEvent.tags, newTag] });
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  deleteCalendarEvent(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTasks = () => {
    const activeTasks = tasks.filter(t => !t.completed && !t.archived);
    const completedTasks = tasks.filter(t => t.completed);
    const archivedTasks = tasks.filter(t => t.archived);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#2c2c2c' }}>Tasks</h1>
          <button
            onClick={addProject}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: TYPE_COLORS.task,
              color: 'white',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {projects.map(project => (
            <div key={project.id} style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '12px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={project.name}
                  onChange={e => updateProject(project.id, e.target.value)}
                  style={{
                    fontWeight: '600',
                    color: '#2c2c2c',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid transparent',
                    outline: 'none',
                    flex: 1,
                    fontSize: '14px',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#d4d4d4')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
                />
                <button
                  onClick={() => deleteProject(project.id)}
                  style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                {activeTasks
                  .filter(t => t.projectId === project.id)
                  .sort((a, b) => b.priority - a.priority)
                  .map(task => (
                    <div key={task.id} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#fafafa', borderLeft: `4px solid ${PRIORITY_COLORS[task.priority - 1]}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <button
                          onClick={() => updateTask(task.id, { completed: true })}
                          style={{ marginTop: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#525252')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                        >
                          <Circle size={16} />
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <input
                            type="text"
                            value={task.title}
                            onChange={e => updateTask(task.id, { title: e.target.value })}
                            style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#2c2c2c',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderBottom: '1px solid transparent',
                              outline: 'none',
                              width: '100%',
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#d4d4d4')}
                            onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px' }}>
                            <select
                              value={task.priority}
                              onChange={e => updateTask(task.id, { priority: parseInt(e.target.value) })}
                              style={{ padding: '2px 4px', border: '1px solid #e5e5e5', borderRadius: '3px', backgroundColor: '#fafafa', outline: 'none', fontSize: '11px' }}
                            >
                              {[1, 2, 3, 4, 5].map(p => <option key={p} value={p}>P{p}</option>)}
                            </select>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                            {task.tags.map(tag => (
                              <span
                                key={tag}
                                onClick={() => updateTask(task.id, { tags: task.tags.filter(t => t !== tag) })}
                                style={{
                                  padding: '2px 6px',
                                  fontSize: '11px',
                                  borderRadius: '3px',
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af',
                                  cursor: 'pointer',
                                }}
                              >
                                {tag} ✕
                              </span>
                            ))}
                            <input
                              type="text"
                              placeholder="tag"
                              onKeyPress={e => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                  const newTag = (e.target as HTMLInputElement).value;
                                  updateTask(task.id, { tags: [...task.tags, newTag] });
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                              style={{ fontSize: '11px', padding: '2px 4px', border: '1px solid #e5e5e5', borderRadius: '3px', backgroundColor: '#fafafa', outline: 'none', width: '60px' }}
                            />
                          </div>
                          {task.subtasks.length > 0 && (
                            <div style={{ marginTop: '8px', paddingLeft: '8px', borderLeft: '1px solid #d4d4d4', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {task.subtasks.map(subtask => (
                                <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <button
                                    onClick={() => updateSubtask(task.id, subtask.id, { completed: !subtask.completed })}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3' }}
                                  >
                                    {subtask.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                  </button>
                                  <input
                                    type="text"
                                    value={subtask.title}
                                    onChange={e => updateSubtask(task.id, subtask.id, { title: e.target.value })}
                                    style={{
                                      fontSize: '12px',
                                      backgroundColor: 'transparent',
                                      border: 'none',
                                      borderBottom: '1px solid transparent',
                                      outline: 'none',
                                      flex: 1,
                                      color: subtask.completed ? '#a3a3a3' : '#404040',
                                      textDecoration: subtask.completed ? 'line-through' : 'none',
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#d4d4d4')}
                                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => addSubtask(task.id)}
                          style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'color 0.2s', fontSize: '12px' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#525252')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                        >
                          +
                        </button>
                        <button
                          onClick={() => archiveTask(task.id)}
                          style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#525252')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                        >
                          <Archive size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => addTask(project.id)}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  color: '#737373',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.color = '#2c2c2c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#737373';
                }}
              >
                + Add Task
              </button>
            </div>
          ))}
        </div>

        {completedTasks.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
            <h3 style={{ fontWeight: '600', color: '#525252', marginBottom: '8px' }}>Completed ({completedTasks.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {completedTasks.map(task => (
                <div key={task.id} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#f0f0f0', textDecoration: 'line-through', color: '#a3a3a3', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{task.title}</span>
                  <button
                    onClick={() => updateTask(task.id, { completed: false })}
                    style={{ fontSize: '12px', color: '#737373', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Undo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {archivedTasks.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '16px' }}>
            <h3 style={{ fontWeight: '600', color: '#525252', marginBottom: '8px' }}>Archive ({archivedTasks.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {archivedTasks.map(task => (
                <div key={task.id} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#f0f0f0', color: '#737373', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{task.title}</span>
                  <button
                    onClick={() => updateTask(task.id, { archived: false })}
                    style={{ fontSize: '12px', color: '#737373', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderIdeas = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#2c2c2c' }}>Ideas</h1>
          <button
            onClick={addIdea}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: TYPE_COLORS.study,
              color: '#2c2c2c',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ideas.map(idea => (
            <div key={idea.id} style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '12px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={idea.title}
                  onChange={e => updateIdea(idea.id, { title: e.target.value })}
                  style={{
                    fontWeight: '600',
                    color: '#2c2c2c',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid transparent',
                    outline: 'none',
                    flex: 1,
                    fontSize: '14px',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#d4d4d4')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
                />
                <button
                  onClick={() => deleteIdea(idea.id)}
                  style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <textarea
                value={idea.description}
                onChange={e => updateIdea(idea.id, { description: e.target.value })}
                style={{ width: '100%', fontSize: '14px', color: '#404040', backgroundColor: '#fafafa', padding: '8px', borderRadius: '4px', border: '1px solid #e5e5e5', marginBottom: '8px', resize: 'none', height: '60px', outline: 'none' }}
                placeholder="Idea description..."
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                {idea.questions.map((q, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      <input
                        type="text"
                        value={q.question}
                        onChange={e => {
                          const updated = [...idea.questions];
                          updated[i].question = e.target.value;
                          updateIdea(idea.id, { questions: updated });
                        }}
                        style={{ fontSize: '12px', fontWeight: '500', color: '#737373', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid transparent', outline: 'none', flex: 1 }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#d4d4d4')}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
                      />
                      <button
                        onClick={() => updateIdea(idea.id, { questions: idea.questions.filter((_, idx) => idx !== i) })}
                        style={{ padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', fontSize: '12px' }}
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      value={q.answer}
                      onChange={e => {
                        const updated = [...idea.questions];
                        updated[i].answer = e.target.value;
                        updateIdea(idea.id, { questions: updated });
                      }}
                      style={{ width: '100%', fontSize: '12px', backgroundColor: '#fafafa', padding: '6px', borderRadius: '3px', border: '1px solid #e5e5e5', resize: 'none', height: '40px', outline: 'none' }}
                      placeholder="Answer..."
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => updateIdea(idea.id, { questions: [...idea.questions, { question: 'New Question', answer: '' }] })}
                style={{
                  fontSize: '12px',
                  color: '#737373',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  marginBottom: '8px',
                }}
              >
                + Add Question
              </button>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {idea.tags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => updateIdea(idea.id, { tags: idea.tags.filter(t => t !== tag) })}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      cursor: 'pointer',
                    }}
                  >
                    {tag} ✕
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="tag"
                  onKeyPress={e => {
                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                      const newTag = (e.target as HTMLInputElement).value;
                      updateIdea(idea.id, { tags: [...idea.tags, newTag] });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGoals = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#2c2c2c' }}>Goals</h1>
          <button
            onClick={addGoal}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: TYPE_COLORS.rest,
              color: '#2c2c2c',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Plus size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {goals.map(goal => (
            <div key={goal.id} style={{ border: '1px solid #e5e5e5', borderRadius: '4px', padding: '12px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={goal.title}
                  onChange={e => updateGoal(goal.id, { title: e.target.value })}
                  style={{
                    fontWeight: '600',
                    color: '#2c2c2c',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid transparent',
                    outline: 'none',
                    flex: 1,
                    fontSize: '14px',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#d4d4d4')}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
                />
                <button
                  onClick={() => deleteGoal(goal.id)}
                  style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <select
                value={goal.timeframe}
                onChange={e => updateGoal(goal.id, { timeframe: e.target.value as any })}
                style={{ fontSize: '12px', borderRadius: '4px', padding: '4px 8px', backgroundColor: '#fafafa', color: '#404040', marginBottom: '8px', border: '1px solid #e5e5e5', outline: 'none' }}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <div style={{ marginBottom: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '4px' }}>Credit</label>
                  <input
                    type="number"
                    value={goal.credit}
                    onChange={e => updateGoal(goal.id, { credit: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', fontSize: '12px', padding: '6px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '4px' }}>Debit</label>
                  <input
                    type="number"
                    value={goal.debit}
                    onChange={e => updateGoal(goal.id, { debit: parseInt(e.target.value) || 0 })}
                    style={{ width: '100%', fontSize: '12px', padding: '6px 8px', border: '1px solid #e5e5e5', borderRadius: '4px', backgroundColor: '#fafafa', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '4px' }}>Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={e => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div style={{ fontSize: '12px', color: '#a3a3a3', marginTop: '4px' }}>{goal.progress}%</div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#737373', display: 'block', marginBottom: '4px' }}>Weekly Reflection</label>
                <textarea
                  value={goal.reflection}
                  onChange={e => updateGoal(goal.id, { reflection: e.target.value })}
                  style={{ width: '100%', fontSize: '12px', backgroundColor: '#fafafa', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e5e5', resize: 'none', height: '60px', outline: 'none' }}
                  placeholder="Your reflection..."
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {goal.fields.map((field, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      <input
                        type="text"
                        value={field.name}
                        onChange={e => {
                          const updated = [...goal.fields];
                          updated[i].name = e.target.value;
                          updateGoal(goal.id, { fields: updated });
                        }}
                        placeholder="Field name"
                        style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid #e5e5e5', borderRadius: '3px', backgroundColor: '#fafafa', outline: 'none', flex: 1 }}
                      />
                      <button
                        onClick={() => updateGoal(goal.id, { fields: goal.fields.filter((_, idx) => idx !== i) })}
                        style={{ padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', fontSize: '12px' }}
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      onChange={e => {
                        const updated = [...goal.fields];
                        updated[i].value = e.target.value;
                        updateGoal(goal.id, { fields: updated });
                      }}
                      placeholder="Value"
                      style={{ width: '100%', fontSize: '12px', backgroundColor: '#fafafa', padding: '4px 8px', borderRadius: '3px', border: '1px solid #e5e5e5', outline: 'none' }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => updateGoal(goal.id, { fields: [...goal.fields, { name: 'New Field', value: '' }] })}
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#737373',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.color = '#2c2c2c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#737373';
                }}
              >
                + Add Field
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f3f0', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px', color: '#2c2c2c' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {currentSection === 'calendar' && renderCalendar()}
        {currentSection === 'tasks' && renderTasks()}
        {currentSection === 'ideas' && renderIdeas()}
        {currentSection === 'goals' && renderGoals()}
      </div>

      <div ref={navMenuRef} style={{ position: 'fixed', bottom: '24px', right: '24px' }}>
        <button
          onClick={() => setShowNavMenu(!showNavMenu)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: TYPE_COLORS.meeting,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.15)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            e.currentTarget.style.opacity = '1';
          }}
        >
          <Menu size={24} />
        </button>

        {showNavMenu && (
          <div style={{ position: 'absolute', bottom: '80px', right: 0, backgroundColor: 'white', border: '1px solid #e5e5e5', borderRadius: '4px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            {['calendar', 'tasks', 'ideas', 'goals'].map(section => (
              <button
                key={section}
                onClick={() => {
                  setCurrentSection(section as any);
                  setShowNavMenu(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: 'none',
                  backgroundColor: currentSection === section ? TYPE_COLORS[section as keyof typeof TYPE_COLORS] + '33' : 'transparent',
                  color: currentSection === section ? '#2c2c2c' : '#404040',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontWeight: currentSection === section ? '500' : '400',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => currentSection !== section && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => currentSection !== section && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {section}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
