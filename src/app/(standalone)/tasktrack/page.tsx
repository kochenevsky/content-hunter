'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  Circle,
  Trash2,
  Menu,
} from 'lucide-react';

const API_BASE = 'https://tasktracker.oxion-ezhkov.workers.dev';

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
  predefinedQuestions: { question: string; answer: string }[];
  customQuestions: { question: string; answer: string }[];
  description: string;
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  timeframe: 'weekly' | 'monthly' | 'yearly';
  customFields: { name: string; value: string }[];
  progress: number;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  meeting: '#D4A5D4',
  task: '#A8D5BA',
  rest: '#FFD9B3',
  study: '#B3D9FF',
};

const PRIORITY_COLORS = ['#E8C4E8', '#D4A5D4', '#B86BA8', '#8B4789', '#5C2666'];

const debounce = (fn: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

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
  const navMenuRef = useRef<HTMLDivElement>(null);

  const saveToApi = useCallback(
    debounce(async (data: any, endpoint: string) => {
      try {
        await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Save error:', error);
      }
    }, 800),
    []
  );

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
      endTime: new Date(new Date(`${date}T${startTime}`).getTime() + 30 * 60000).toTimeString().slice(0, 5),
      date,
      tags: [],
      archived: false,
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    saveToApi(newEvent, '/calendar');
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(calendarEvents.map(e => (e.id === id ? { ...e, ...updates } : e)));
    saveToApi({ ...calendarEvents.find(e => e.id === id), ...updates }, '/calendar');
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
    setProjects(projects.map(p => (p.id === id ? { ...p, name } : p)));
    saveToApi({ id, name }, '/projects');
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
    setTasks(tasks.map(t => (t.id === id ? { ...t, ...updates } : t)));
    saveToApi({ ...tasks.find(t => t.id === id), ...updates }, '/tasks');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    saveToApi({ id, deleted: true }, '/tasks');
  };

  const addSubtask = (taskId: string) => {
    setTasks(
      tasks.map(t =>
        t.id === taskId
          ? { ...t, subtasks: [...t.subtasks, { id: Date.now().toString(), title: 'New Subtask', completed: false }] }
          : t
      )
    );
    const task = tasks.find(t => t.id === taskId);
    if (task) saveToApi(task, '/tasks');
  };

  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setTasks(
      tasks.map(t =>
        t.id === taskId ? { ...t, subtasks: t.subtasks.map(s => (s.id === subtaskId ? { ...s, ...updates } : s)) } : t
      )
    );
    const task = tasks.find(t => t.id === taskId);
    if (task) saveToApi(task, '/tasks');
  };

  const addIdea = () => {
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: 'New Idea',
      tags: [],
      predefinedQuestions: [{ question: 'Problem', answer: '' }],
      customQuestions: [],
      description: '',
      createdAt: new Date().toISOString(),
    };
    setIdeas([...ideas, newIdea]);
    saveToApi(newIdea, '/ideas');
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(ideas.map(i => (i.id === id ? { ...i, ...updates } : i)));
    saveToApi({ ...ideas.find(i => i.id === id), ...updates }, '/ideas');
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
      customFields: [],
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    setGoals([...goals, newGoal]);
    saveToApi(newGoal, '/goals');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(g => (g.id === id ? { ...g, ...updates } : g)));
    saveToApi({ ...goals.find(g => g.id === id), ...updates }, '/goals');
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
    return [
      new Date(monday.getTime() - 86400000),
      new Date(monday),
      new Date(monday.getTime() + 86400000),
    ];
  };

  const renderCalendar = () => {
    const weekDates = getWeekDates(currentDate);
    const now = new Date();
    const currentDateStr = formatDate(now);
    const isPastEvent = (date: string, endTime: string) => {
      return date < currentDateStr || (date === currentDateStr && endTime < formatTime(now));
    };

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

        {calendarView === 'week' && (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {weekDates.map(date => {
                const dateStr = formatDate(date);
                const dayEvents = calendarEvents.filter(e => e.date === dateStr);
                const isToday = dateStr === currentDateStr;
                return (
                  <div
                    key={dateStr}
                    style={{
                      border: `1px solid ${isToday ? '#dbeafe' : '#e5e5e5'}`,
                      borderRadius: '4px',
                      padding: '8px',
                      backgroundColor: isToday ? '#f0f9ff' : 'white',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#737373', marginBottom: '8px' }}>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '256px', overflowY: 'auto' }}>
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          style={{
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            backgroundColor: isPastEvent(event.date, event.endTime) ? '#d3d3d3' : TYPE_COLORS[event.type],
                            color: '#2c2c2c',
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                          <div style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                          <div style={{ color: '#404040' }}>{event.startTime}</div>
                        </div>
                      ))}
                      <button
                        onClick={() => addCalendarEvent(dateStr, formatTime(new Date()), 'task')}
                        style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          color: '#737373',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          width: '100%',
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
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
            <div style={{ fontSize: '12px', color: '#737373' }}>
              {selectedEvent.startTime} - {selectedEvent.endTime}
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
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                            {task.tags.map(tag => (
                              <span key={tag} style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '4px', backgroundColor: '#dbeafe', color: '#1e40af' }}>
                                {tag}
                              </span>
                            ))}
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
                          onClick={() => deleteTask(task.id)}
                          style={{ color: '#a3a3a3', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
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
            <h3 style={{ fontWeight: '600', color: '#525252', marginBottom: '8px' }}>Completed</h3>
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
                style={{ width: '100%', fontSize: '14px', color: '#404040', backgroundColor: '#fafafa', padding: '8px', borderRadius: '4px', border: '1px solid #e5e5e5', marginBottom: '8px', resize: 'none', height: '80px', outline: 'none' }}
                placeholder="Idea description..."
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {idea.predefinedQuestions.map((q, i) => (
                  <div key={`pq-${i}`}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#737373' }}>{q.question}</label>
                    <textarea
                      value={q.answer}
                      onChange={e => {
                        const updated = [...idea.predefinedQuestions];
                        updated[i].answer = e.target.value;
                        updateIdea(idea.id, { predefinedQuestions: updated });
                      }}
                      style={{ width: '100%', fontSize: '12px', backgroundColor: '#fafafa', padding: '8px', borderRadius: '4px', border: '1px solid #e5e5e5', resize: 'none', height: '48px', marginTop: '4px', outline: 'none' }}
                      placeholder="Answer..."
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {idea.tags.map(tag => (
                  <span key={tag} style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#b45309' }}>
                    {tag}
                  </span>
                ))}
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

              <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#737373' }}>Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={e => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                  style={{ width: '100%', marginTop: '4px' }}
                />
                <div style={{ fontSize: '12px', color: '#a3a3a3', marginTop: '4px' }}>{goal.progress}%</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {goal.customFields.map((field, i) => (
                  <div key={i}>
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#737373' }}>{field.name}</label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={e => {
                        const updated = [...goal.customFields];
                        updated[i].value = e.target.value;
                        updateGoal(goal.id, { customFields: updated });
                      }}
                      style={{ width: '100%', fontSize: '12px', backgroundColor: '#fafafa', padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e5e5', marginTop: '4px', outline: 'none' }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  updateGoal(goal.id, {
                    customFields: [...goal.customFields, { name: 'New Field', value: '' }],
                  })
                }
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
                onMouseEnter={(e) => !currentSection === section && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => !currentSection === section && (e.currentTarget.style.backgroundColor = 'transparent')}
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
