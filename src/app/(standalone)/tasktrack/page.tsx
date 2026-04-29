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

const API_BASE = 'https://api.example.com';

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
  meeting: 'rgb(212, 165, 212)',
  task: 'rgb(168, 213, 186)',
  rest: 'rgb(255, 217, 179)',
  study: 'rgb(179, 217, 255)',
};

const PRIORITY_COLORS = [
  'border-l-4 border-l-[rgb(232,196,232)]',
  'border-l-4 border-l-[rgb(212,165,212)]',
  'border-l-4 border-l-[rgb(184,107,168)]',
  'border-l-4 border-l-[rgb(139,71,137)]',
  'border-l-4 border-l-[rgb(92,38,102)]',
];

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
      <div className="flex flex-col h-full gap-3 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Calendar</h1>
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map(view => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`px-3 py-1 text-sm rounded-sm transition-colors capitalize ${
                  calendarView === view
                    ? 'text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
                style={calendarView === view ? { backgroundColor: TYPE_COLORS.meeting } : undefined}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))} className="p-2 hover:bg-neutral-200 rounded-sm transition">
            <ChevronLeft size={20} className="text-neutral-700" />
          </button>
          <span className="text-sm font-medium text-neutral-700">{currentDate.toDateString()}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))} className="p-2 hover:bg-neutral-200 rounded-sm transition">
            <ChevronRight size={20} className="text-neutral-700" />
          </button>
        </div>

        {calendarView === 'week' && (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-3 gap-2">
              {weekDates.map(date => {
                const dateStr = formatDate(date);
                const dayEvents = calendarEvents.filter(e => e.date === dateStr);
                const isToday = dateStr === currentDateStr;
                return (
                  <div
                    key={dateStr}
                    className={`border rounded-sm p-2 transition-colors ${
                      isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-neutral-200'
                    }`}
                  >
                    <div className="text-xs font-semibold text-neutral-600 mb-2">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className="p-2 rounded-sm text-xs cursor-pointer hover:opacity-80 transition text-neutral-900"
                          style={{
                            backgroundColor: isPastEvent(event.date, event.endTime)
                              ? 'rgb(211, 211, 211)'
                              : TYPE_COLORS[event.type],
                          }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-neutral-700">{event.startTime}</div>
                        </div>
                      ))}
                      <button
                        onClick={() => addCalendarEvent(dateStr, formatTime(new Date()), 'task')}
                        className="mt-2 text-xs text-neutral-600 hover:text-neutral-900 p-1 rounded-sm hover:bg-neutral-100 w-full text-center transition"
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
          <div className="border rounded-sm p-3 bg-white gap-2 flex flex-col border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-neutral-100 rounded-sm transition">
                <X size={16} className="text-neutral-600" />
              </button>
            </div>
            <input
              type="text"
              value={selectedEvent.title}
              onChange={e => updateCalendarEvent(selectedEvent.id, { title: e.target.value })}
              className="text-sm px-2 py-1 border rounded-sm bg-neutral-50 border-neutral-200 focus:outline-none focus:border-neutral-400"
            />
            <div className="text-xs text-neutral-600">
              {selectedEvent.startTime} - {selectedEvent.endTime}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  deleteCalendarEvent(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-sm hover:bg-primary-200 transition"
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
      <div className="flex flex-col h-full gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Tasks</h1>
          <button
            onClick={addProject}
            className="p-2 rounded-sm text-white hover:opacity-90 transition"
            style={{ backgroundColor: TYPE_COLORS.task }}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto space-y-4">
          {projects.map(project => (
            <div key={project.id} className="border rounded-sm p-3 bg-white border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={project.name}
                  onChange={e => updateProject(project.id, e.target.value)}
                  className="font-semibold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-400 outline-none flex-1"
                />
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1 text-neutral-400 hover:text-primary-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-2 mb-2">
                {activeTasks
                  .filter(t => t.projectId === project.id)
                  .sort((a, b) => b.priority - a.priority)
                  .map(task => (
                    <div key={task.id} className={`p-2 rounded-sm bg-neutral-50 ${PRIORITY_COLORS[task.priority - 1]}`}>
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => updateTask(task.id, { completed: true })}
                          className="mt-1 text-neutral-400 hover:text-neutral-700 transition"
                        >
                          <Circle size={16} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={task.title}
                            onChange={e => updateTask(task.id, { title: e.target.value })}
                            className="text-sm font-medium text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-400 outline-none w-full"
                          />
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 text-xs rounded-sm bg-blue-100 text-blue-700">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {task.subtasks.length > 0 && (
                            <div className="mt-2 space-y-1 pl-2 border-l border-neutral-300">
                              {task.subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateSubtask(task.id, subtask.id, { completed: !subtask.completed })}
                                    className="text-neutral-400 hover:text-neutral-700 transition"
                                  >
                                    {subtask.completed ? (
                                      <CheckCircle2 size={14} />
                                    ) : (
                                      <Circle size={14} />
                                    )}
                                  </button>
                                  <input
                                    type="text"
                                    value={subtask.title}
                                    onChange={e => updateSubtask(task.id, subtask.id, { title: e.target.value })}
                                    className={`text-xs bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-400 outline-none flex-1 ${
                                      subtask.completed ? 'line-through text-neutral-500' : 'text-neutral-700'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-neutral-400 hover:text-primary-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => addTask(project.id)}
                className="w-full text-xs text-neutral-600 hover:text-neutral-900 py-1 rounded-sm hover:bg-neutral-100 transition"
              >
                + Add Task
              </button>
            </div>
          ))}
        </div>

        {completedTasks.length > 0 && (
          <div className="border-t border-neutral-200 pt-4">
            <h3 className="font-semibold text-neutral-700 mb-2">Completed</h3>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <div key={task.id} className="p-2 rounded-sm bg-neutral-100 line-through text-neutral-500 text-sm flex items-center justify-between">
                  <span>{task.title}</span>
                  <button
                    onClick={() => updateTask(task.id, { completed: false })}
                    className="text-xs text-neutral-600 hover:text-neutral-900"
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
      <div className="flex flex-col h-full gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Ideas</h1>
          <button
            onClick={addIdea}
            className="p-2 rounded-sm text-neutral-900 hover:opacity-90 transition"
            style={{ backgroundColor: TYPE_COLORS.study }}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto space-y-3">
          {ideas.map(idea => (
            <div key={idea.id} className="border rounded-sm p-3 bg-white border-neutral-200">
              <div className="flex items-start justify-between mb-2">
                <input
                  type="text"
                  value={idea.title}
                  onChange={e => updateIdea(idea.id, { title: e.target.value })}
                  className="font-semibold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-400 outline-none flex-1"
                />
                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="p-1 text-neutral-400 hover:text-primary-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <textarea
                value={idea.description}
                onChange={e => updateIdea(idea.id, { description: e.target.value })}
                className="w-full text-sm text-neutral-700 bg-neutral-50 p-2 rounded-sm border border-neutral-200 mb-2 resize-none h-20 focus:outline-none focus:border-neutral-400"
                placeholder="Idea description..."
              />

              <div className="space-y-2">
                {idea.predefinedQuestions.map((q, i) => (
                  <div key={`pq-${i}`}>
                    <label className="text-xs font-medium text-neutral-600">{q.question}</label>
                    <textarea
                      value={q.answer}
                      onChange={e => {
                        const updated = [...idea.predefinedQuestions];
                        updated[i].answer = e.target.value;
                        updateIdea(idea.id, { predefinedQuestions: updated });
                      }}
                      className="w-full text-xs bg-neutral-50 p-2 rounded-sm border border-neutral-200 resize-none h-12 mt-1 focus:outline-none focus:border-neutral-400"
                      placeholder="Answer..."
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {idea.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-sm bg-amber-100 text-amber-700">
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
      <div className="flex flex-col h-full gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Goals</h1>
          <button
            onClick={addGoal}
            className="p-2 rounded-sm text-neutral-900 hover:opacity-90 transition"
            style={{ backgroundColor: TYPE_COLORS.rest }}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto space-y-3">
          {goals.map(goal => (
            <div key={goal.id} className="border rounded-sm p-3 bg-white border-neutral-200">
              <div className="flex items-start justify-between mb-2">
                <input
                  type="text"
                  value={goal.title}
                  onChange={e => updateGoal(goal.id, { title: e.target.value })}
                  className="font-semibold text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-400 outline-none flex-1"
                />
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-1 text-neutral-400 hover:text-primary-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <select
                value={goal.timeframe}
                onChange={e => updateGoal(goal.id, { timeframe: e.target.value as any })}
                className="text-xs border rounded-sm px-2 py-1 bg-neutral-50 text-neutral-700 mb-2 border-neutral-200 focus:outline-none focus:border-neutral-400"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <div className="mt-2 mb-2">
                <label className="text-xs font-medium text-neutral-600">Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={e => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                  className="w-full mt-1 accent-neutral-600"
                />
                <div className="text-xs text-neutral-500 mt-1">{goal.progress}%</div>
              </div>

              <div className="space-y-2">
                {goal.customFields.map((field, i) => (
                  <div key={i}>
                    <label className="text-xs font-medium text-neutral-600">{field.name}</label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={e => {
                        const updated = [...goal.customFields];
                        updated[i].value = e.target.value;
                        updateGoal(goal.id, { customFields: updated });
                      }}
                      className="w-full text-xs bg-neutral-50 p-2 rounded-sm border border-neutral-200 mt-1 focus:outline-none focus:border-neutral-400"
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
                className="mt-2 text-xs text-neutral-600 hover:text-neutral-900 py-1 rounded-sm hover:bg-neutral-100 transition"
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
    <div className="flex h-screen bg-neutral-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentSection === 'calendar' && renderCalendar()}
        {currentSection === 'tasks' && renderTasks()}
        {currentSection === 'ideas' && renderIdeas()}
        {currentSection === 'goals' && renderGoals()}
      </div>

      <div ref={navMenuRef} className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowNavMenu(!showNavMenu)}
          className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:shadow-xl transition hover:opacity-90"
          style={{ backgroundColor: TYPE_COLORS.meeting }}
        >
          <Menu size={24} />
        </button>

        {showNavMenu && (
          <div className="absolute bottom-20 right-0 bg-white border border-neutral-200 rounded-sm shadow-lg overflow-hidden">
            {['calendar', 'tasks', 'ideas', 'goals'].map(section => (
              <button
                key={section}
                onClick={() => {
                  setCurrentSection(section as any);
                  setShowNavMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 transition capitalize font-medium ${
                  currentSection === section
                    ? 'text-neutral-900'
                    : 'text-neutral-700'
                }`}
                style={currentSection === section ? { backgroundColor: TYPE_COLORS[section as keyof typeof TYPE_COLORS] + '20' } : undefined}
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
