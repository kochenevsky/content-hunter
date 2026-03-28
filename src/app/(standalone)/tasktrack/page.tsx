"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────
interface Agent {
  id: string;
  name: string;
  prompt: string;
}

type Theme = "orange" | "blue" | "green" | "black";
type InputMode = "push" | "auto";
type Screen = "main" | "menu" | "settings" | "edit-agent";

const WORKER_URL = "https://tasktracker.oxion-ezhkov.workers.dev";

const THEMES: Record<Theme, { primary: string; glow: string; bg: string; particle: string }> = {
  orange: { primary: "#FF6B2B", glow: "rgba(255,107,43,0.4)", bg: "rgba(255,107,43,0.08)", particle: "#FF8C55" },
  blue:   { primary: "#2B8EFF", glow: "rgba(43,142,255,0.4)", bg: "rgba(43,142,255,0.08)", particle: "#55AAFF" },
  green:  { primary: "#2BFF8E", glow: "rgba(43,255,142,0.4)", bg: "rgba(43,255,142,0.08)", particle: "#55FFAA" },
  black:  { primary: "#E0E0E0", glow: "rgba(224,224,224,0.3)", bg: "rgba(255,255,255,0.05)", particle: "#FFFFFF" },
};

const TOPICS = [
  { id: "tasks", label: "Задачи" },
  { id: "ideas", label: "Идеи" },
  { id: "plannerki", label: "Планёрки" },
  { id: "psychologist", label: "Психолог" },
  { id: "tgtron", label: "TGtron" },
  { id: "content_hunter", label: "Content Hunter" },
  { id: "study", label: "Учёба" },
  { id: "unknown", label: "Общий" },
];

// ─── Particle system ──────────────────────────────────────────────
function ParticleCanvas({ theme, listening }: { theme: Theme; listening: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; life: number; maxLife: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const color = THEMES[theme].particle;

    const spawn = () => {
      if (particlesRef.current.length > 60) return;
      const life = 120 + Math.random() * 180;
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * (listening ? 1.5 : 0.6),
        vy: -(0.4 + Math.random() * (listening ? 1.2 : 0.5)),
        size: 1.5 + Math.random() * (listening ? 4 : 2),
        opacity: 0,
        life,
        maxLife: life,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < (listening ? 0.4 : 0.15)) spawn();

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.3 ? progress / 0.3 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.min(255, Math.max(0, Math.floor(p.opacity * 180))).toString(16).padStart(2, "0");
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grad.addColorStop(0, color + Math.min(255, Math.max(0, Math.floor(p.opacity * 60))).toString(16).padStart(2, "0"));
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme, listening]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

// ─── Main App ─────────────────────────────────────────────────────
export default function TaskTrackPage() {
  const [theme, setTheme] = useState<Theme>("orange");
  const [inputMode, setInputMode] = useState<InputMode>("push");
  const [screen, setScreen] = useState<Screen>("main");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("unknown");
  const [editAgent, setEditAgent] = useState<Partial<Agent>>({});
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [lastUserText, setLastUserText] = useState("");
  const [statusText, setStatusText] = useState("Нажми чтобы говорить");
  const [autoSilenceTimer, setAutoSilenceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [generatingPrompt, setGeneratingPrompt] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = THEMES[theme];

  // Telegram WebApp userId
  const getUserId = () => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      return String((window as any).Telegram.WebApp.initDataUnsafe.user.id);
    }
    return "default";
  };

  // Load agents
  useEffect(() => {
    fetch(`${WORKER_URL}/voice-agents`)
      .then(r => r.json())
      .then((data: Agent[]) => {
        setAgents(data);
        if (data.length > 0) setSelectedAgent(data[0]);
      })
      .catch(() => {});
  }, []);

  // Telegram WebApp init
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.ready();
      (window as any).Telegram.WebApp.expand();
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (!mediaRecorderRef.current) return;
    if (silenceRef.current) clearTimeout(silenceRef.current);

    mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setListening(false);
    setProcessing(true);
    setStatusText("Обрабатываю...");
  }, []);

  const sendAudio = useCallback(async (chunks: Blob[]) => {
    if (!chunks.length || !selectedAgent) {
      setProcessing(false);
      setStatusText(inputMode === "push" ? "Нажми чтобы говорить" : "Слушаю автоматически");
      return;
    }

    const blob = new Blob(chunks, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, "voice.webm");
    formData.append("userId", getUserId());
    formData.append("agentId", selectedAgent.id);
    formData.append("topic", selectedTopic);

    try {
      const res = await fetch(`${WORKER_URL}/voice-chat`, { method: "POST", body: formData });
      const data = await res.json();

      if (data.userText) setLastUserText(data.userText);
      if (data.assistantText) {
        setLastResponse(data.assistantText);
        speakText(data.assistantText);
      }
    } catch (e) {
      setStatusText("Ошибка. Попробуй ещё.");
    } finally {
      setProcessing(false);
      setStatusText(inputMode === "push" ? "Нажми чтобы говорить" : "Слушаю автоматически");
    }
  }, [selectedAgent, selectedTopic, inputMode]);

  const speakText = (text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ru-RU";
    utt.rate = 1.05;
    utt.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find(v => v.lang.startsWith("ru"));
    if (ruVoice) utt.voice = ruVoice;
    speechRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const startListening = useCallback(async () => {
    if (processing) return;
    window.speechSynthesis.cancel();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      // Auto-mode silence detection
      if (inputMode === "auto") {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
        source.connect(analyserRef.current);

        const checkSilence = () => {
          if (!analyserRef.current || !listening) return;
          const data = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b) / data.length;

          if (avg < 8) {
            if (!silenceRef.current) {
              silenceRef.current = setTimeout(() => {
                stopListening();
              }, 1500);
            }
          } else {
            if (silenceRef.current) {
              clearTimeout(silenceRef.current);
              silenceRef.current = null;
            }
          }
          requestAnimationFrame(checkSilence);
        };
        requestAnimationFrame(checkSilence);
      }

      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => sendAudio(chunksRef.current);

      mr.start(100);
      setListening(true);
      setStatusText(inputMode === "push" ? "Говори..." : "Слушаю... (пауза = отправить)");
    } catch {
      setStatusText("Нет доступа к микрофону");
    }
  }, [processing, inputMode, listening, stopListening, sendAudio]);

  const handleButtonDown = () => { if (inputMode === "push") startListening(); };
  const handleButtonUp = () => { if (inputMode === "push" && listening) stopListening(); };
  const handleButtonClick = () => { if (inputMode === "auto") { if (listening) stopListening(); else startListening(); } };

  const generatePrompt = async () => {
    if (!editAgent.name) return;
    setGeneratingPrompt(true);
    try {
      const res = await fetch(`${WORKER_URL}/voice-generate-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editAgent.name }),
      });
      const data = await res.json();
      if (data.prompt) setEditAgent(prev => ({ ...prev, prompt: data.prompt }));
    } finally {
      setGeneratingPrompt(false);
    }
  };

  const saveAgent = async () => {
    if (!editAgent.name || !editAgent.prompt) return;
    const res = await fetch(`${WORKER_URL}/voice-agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editAgent),
    });
    const saved = await res.json();
    setAgents(prev => {
      const idx = prev.findIndex(a => a.id === saved.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n; }
      return [...prev, saved];
    });
    if (!selectedAgent) setSelectedAgent(saved);
    setScreen("settings");
    setEditAgent({});
  };

  const deleteAgent = async (id: string) => {
    await fetch(`${WORKER_URL}/voice-agents`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAgents(prev => prev.filter(a => a.id !== id));
    if (selectedAgent?.id === id) setSelectedAgent(agents[0] || null);
  };

  const isActive = listening || processing;

  return (
    <div style={{
      position: "fixed", inset: 0, overflow: "hidden",
      background: "radial-gradient(ellipse at 50% 100%, " + t.bg + " 0%, #080808 60%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      color: "#fff",
      userSelect: "none",
    }}>
      <ParticleCanvas theme={theme} listening={listening} />

      {/* Glass overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1,
        background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />

      {/* ─── Main Screen ─── */}
      {screen === "main" && (
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>

          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              {selectedAgent?.name || "Агент"}
            </div>
            <button
              onClick={() => setScreen("menu")}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}
            >☰</button>
          </div>

          {/* Center area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>

            {/* Status */}
            <div style={{
              fontSize: 15, color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.02em",
              transition: "all 0.3s",
            }}>
              {statusText}
            </div>

            {/* Main button */}
            <div style={{ position: "relative" }}>
              {/* Outer glow ring */}
              <div style={{
                position: "absolute", inset: -20,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)`,
                opacity: isActive ? 1 : 0.3,
                transition: "opacity 0.4s",
                animation: isActive ? "pulse 1.5s ease-in-out infinite" : "none",
              }} />

              {/* Button */}
              <button
                onMouseDown={handleButtonDown}
                onMouseUp={handleButtonUp}
                onTouchStart={e => { e.preventDefault(); handleButtonDown(); }}
                onTouchEnd={e => { e.preventDefault(); handleButtonUp(); }}
                onClick={handleButtonClick}
                style={{
                  width: 120, height: 120, borderRadius: "50%",
                  border: `2px solid ${isActive ? t.primary : "rgba(255,255,255,0.15)"}`,
                  cursor: "pointer",
                  background: isActive
                    ? `radial-gradient(circle at 35% 35%, ${t.primary}22, ${t.primary}08)`
                    : "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                  backdropFilter: "blur(40px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 42,
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  boxShadow: isActive ? `0 0 40px ${t.glow}, 0 0 80px ${t.glow}44` : "0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                {processing ? "⟳" : listening ? "🎙" : "🎤"}
              </button>
            </div>

            {/* Mode indicator */}
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {inputMode === "push" ? "удержи" : "авто-пауза"}
            </div>
          </div>

          {/* Bottom - last messages */}
          <div style={{ padding: "0 24px 40px" }}>
            {lastUserText && (
              <div style={{
                marginBottom: 12, fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                textAlign: "right",
                fontStyle: "italic",
              }}>
                {lastUserText}
              </div>
            )}
            {lastResponse && (
              <div style={{
                padding: "16px 20px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 15, lineHeight: 1.6,
                color: "rgba(255,255,255,0.9)",
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.3)`,
              }}>
                {lastResponse}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Menu Screen ─── */}
      {screen === "menu" && (
        <div style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            margin: 16, marginTop: 60,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(40px)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}>

            {/* Agents */}
            <div style={{ padding: "16px 16px 8px", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Агент
            </div>
            {agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => { setSelectedAgent(agent); setScreen("main"); }}
                style={{
                  padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  background: selectedAgent?.id === agent.id ? t.bg : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: selectedAgent?.id === agent.id ? t.primary + "33" : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}>
                  {agent.name[0]}
                </div>
                <span style={{ fontSize: 15, color: selectedAgent?.id === agent.id ? t.primary : "rgba(255,255,255,0.8)" }}>
                  {agent.name}
                </span>
                {selectedAgent?.id === agent.id && <span style={{ marginLeft: "auto", color: t.primary, fontSize: 18 }}>✓</span>}
              </div>
            ))}

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

            {/* Topic */}
            <div style={{ padding: "16px 16px 8px", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Контекст топика
            </div>
            <div style={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TOPICS.map(tp => (
                <div
                  key={tp.id}
                  onClick={() => setSelectedTopic(tp.id)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13,
                    background: selectedTopic === tp.id ? t.primary + "33" : "rgba(255,255,255,0.07)",
                    border: `1px solid ${selectedTopic === tp.id ? t.primary + "88" : "transparent"}`,
                    color: selectedTopic === tp.id ? t.primary : "rgba(255,255,255,0.6)",
                    transition: "all 0.2s",
                  }}
                >
                  {tp.label}
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

            {/* Input mode */}
            <div style={{ padding: "16px 16px 8px", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Режим ввода
            </div>
            <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
              {(["push", "auto"] as InputMode[]).map(mode => (
                <div
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                    background: inputMode === mode ? t.primary + "22" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${inputMode === mode ? t.primary + "66" : "transparent"}`,
                    fontSize: 13,
                    color: inputMode === mode ? t.primary : "rgba(255,255,255,0.6)",
                    transition: "all 0.2s",
                  }}
                >
                  {mode === "push" ? "Удержи" : "Авто-пауза"}
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

            {/* Theme */}
            <div style={{ padding: "16px 16px 8px", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Тема
            </div>
            <div style={{ display: "flex", gap: 12, padding: "0 16px 16px" }}>
              {(Object.keys(THEMES) as Theme[]).map(th => (
                <div
                  key={th}
                  onClick={() => setTheme(th)}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
                    background: THEMES[th].primary,
                    border: theme === th ? `3px solid white` : "3px solid transparent",
                    transition: "border 0.2s",
                    boxShadow: `0 0 12px ${THEMES[th].glow}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Settings & Back buttons */}
          <div style={{ display: "flex", gap: 12, padding: "0 16px" }}>
            <button
              onClick={() => setScreen("settings")}
              style={{
                flex: 1, padding: "14px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
                color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer",
              }}
            >
              Настройки агентов
            </button>
            <button
              onClick={() => setScreen("main")}
              style={{
                flex: 1, padding: "14px", borderRadius: 16, border: `1px solid ${t.primary}44`,
                background: t.primary + "22", backdropFilter: "blur(20px)",
                color: t.primary, fontSize: 14, cursor: "pointer",
              }}
            >
              Назад
            </button>
          </div>
        </div>
      )}

      {/* ─── Settings Screen ─── */}
      {screen === "settings" && (
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, marginBottom: 24 }}>
            <button
              onClick={() => setScreen("menu")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 24, cursor: "pointer", padding: 0 }}
            >
              ←
            </button>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Агенты</div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {agents.map(agent => (
              <div
                key={agent.id}
                style={{
                  padding: "16px 20px",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{agent.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {agent.prompt}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { setEditAgent(agent); setScreen("edit-agent"); }}
                    style={{
                      width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.08)", color: "white", fontSize: 14, cursor: "pointer",
                    }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    style={{
                      width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,80,80,0.2)",
                      background: "rgba(255,80,80,0.08)", color: "#FF5555", fontSize: 16, cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setEditAgent({}); setScreen("edit-agent"); }}
            style={{
              marginTop: 16, padding: "16px", borderRadius: 18,
              border: `1px solid ${t.primary}44`,
              background: t.primary + "22", backdropFilter: "blur(20px)",
              color: t.primary, fontSize: 15, cursor: "pointer", fontWeight: 500,
            }}
          >
            + Добавить агента
          </button>
        </div>
      )}

      {/* ─── Edit Agent Screen ─── */}
      {screen === "edit-agent" && (
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, marginBottom: 24 }}>
            <button
              onClick={() => setScreen("settings")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 24, cursor: "pointer", padding: 0 }}
            >
              ←
            </button>
            <div style={{ fontSize: 18, fontWeight: 500 }}>
              {editAgent.id ? "Редактировать" : "Новый агент"}
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Name input */}
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Имя агента
              </div>
              <input
                value={editAgent.name || ""}
                onChange={e => setEditAgent(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Например: Продажник"
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 16,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 15,
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Generate prompt button */}
            <button
              onClick={generatePrompt}
              disabled={!editAgent.name || generatingPrompt}
              style={{
                padding: "12px 20px", borderRadius: 14,
                border: `1px solid ${t.primary}44`,
                background: editAgent.name ? t.primary + "22" : "rgba(255,255,255,0.04)",
                color: editAgent.name ? t.primary : "rgba(255,255,255,0.2)",
                fontSize: 14, cursor: editAgent.name ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              {generatingPrompt ? "Генерирую..." : "✨ Сгенерировать поведение автоматически"}
            </button>

            {/* Prompt textarea */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Поведение (промпт)
              </div>
              <textarea
                value={editAgent.prompt || ""}
                onChange={e => setEditAgent(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Опиши как должен вести себя агент..."
                style={{
                  flex: 1, minHeight: 160, padding: "14px 16px", borderRadius: 16,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 14, lineHeight: 1.6,
                  outline: "none", resize: "none", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            onClick={saveAgent}
            disabled={!editAgent.name || !editAgent.prompt}
            style={{
              marginTop: 16, padding: "16px", borderRadius: 18,
              border: "none",
              background: editAgent.name && editAgent.prompt
                ? `linear-gradient(135deg, ${t.primary}, ${t.primary}aa)`
                : "rgba(255,255,255,0.08)",
              color: editAgent.name && editAgent.prompt ? "white" : "rgba(255,255,255,0.3)",
              fontSize: 16, cursor: editAgent.name && editAgent.prompt ? "pointer" : "default",
              fontWeight: 600,
              boxShadow: editAgent.name && editAgent.prompt ? `0 4px 20px ${t.glow}` : "none",
              transition: "all 0.3s",
            }}
          >
            Сохранить
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        * { -webkit-tap-highlight-color: transparent; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
