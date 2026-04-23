'use client';

import 'tailwindcss/tailwind.css'; // Добавьте эту строку

import React from 'react';
import { Bot, Zap, BarChart3, Rocket, MessageSquare, CheckCircle, ArrowRight, ShieldCheck, ZapIcon } from 'lucide-react';

const ZeroBotLanding = () => {
  const scrollToCTA = () => {
    window.location.href = "https://t.me/m/N0r_C6tjMTJi";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span>ZeroBot</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button 
            onClick={scrollToCTA}
            className="px-5 py-2 bg-white text-slate-950 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <ZapIcon className="w-3 h-3" />
            <span>AI-Powered Bot Infrastructure</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Build any Telegram Bot <br />with one AI Prompt.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop coding boilerplate. ZeroBot handles the idea, the structure, the logic, and the deployment. 
            From prompt to production in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToCTA}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              Build Your Bot Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={scrollToCTA}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Book Demo
            </button>
          </div>
          
          {/* Dashboard Preview Mockup */}
          <div className="mt-20 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="ml-4 text-xs text-slate-500 font-mono">zerobot.io/dashboard/fitness-coach-bot</div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Active Users", value: "1,284", icon: <MessageSquare /> },
                  { label: "Messages Processed", value: "48.2k", icon: <Zap /> },
                  { label: "Uptime", value: "99.99%", icon: <ShieldCheck /> }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                    <div className="text-indigo-400 mb-2">{stat.icon}</div>
                    <div className="text-slate-400 text-xs mb-1">{stat.label}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies / Ideas */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">If you can prompt it, ZeroBot can build it.</h2>
            <p className="text-slate-400">Battle-tested bot architectures for every use case.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fitness & Nutrition Coach",
                desc: "Automatically logs calories, suggests workouts based on mood, and sends reminders.",
                prompt: "Create a bot that tracks my protein and suggests HIIT workouts if I haven't moved in 4 hours."
              },
              {
                title: "AI Support Agent",
                desc: "Connects to your Notion or website to answer customer queries 24/7 with human-like precision.",
                prompt: "Build a support bot for my e-commerce store that uses our FAQ doc to handle refunds."
              },
              {
                title: "Crypto Whale Alerts",
                desc: "Monitors blockchain transactions and alerts a group when high-value swaps occur.",
                prompt: "Alert my group whenever a wallet moves more than 10 BTC from cold storage."
              }
            ].map((card, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-indigo-500/50 transition-all">
                <div className="text-indigo-400 font-mono text-xs mb-4">CASE STUDY 0{i+1}</div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{card.desc}</p>
                <div className="bg-slate-900 p-4 rounded-lg border border-white/5 italic text-sm text-slate-500">
                  \"{card.prompt}\"
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow - Улучшенная версия без нестабильного изображения */}
      <section id="workflow" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold mb-6">From Idea to Live in 4 Steps.</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "The Prompt", desc: "Describe the bot logic in plain English. No coding skills required." },
                  { step: "02", title: "AI Mapping", desc: "Our engine maps out the structure, state management, and API integrations." },
                  { step: "03", title: "Automated Deploy", desc: "ZeroBot spins up a secure server and connects it to the Telegram API." },
                  { step: "04", title: "Dashboard Control", desc: "Monitor analytics, correct AI behavior, and scale with one click." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <div className="relative p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl">
                    <div className="bg-slate-800 rounded-[22px] p-8 shadow-2xl text-center">
                        <div className="text-6xl mb-4">⚡</div>
                        <div className="text-xl font-bold mb-2">AI Workflow Engine</div>
                        <div className="text-slate-400 text-sm">Processing your prompt → Deploying infrastructure</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 italic">\"The only platform that actually makes 'AI-Built' mean something.\"</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Alex Rivet", role: "SaaS Founder", quote: "I built a fully functional customer lead-gen bot in 5 minutes. Deployment was seamless." },
              { name: "Sarah Chen", role: "Product Manager", quote: "The dashboard analytics are a game changer. I can see exactly where users drop off." },
              { name: "Marcio D.", role: "Indie Hacker", quote: "ZeroBot saved me weeks of Node.js boilerplate. Highly recommended." }
            ].map((rev, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-950/50 border border-white/5">
                <p className="text-slate-300 mb-6 font-medium leading-relaxed">\"{rev.quote}\"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800"></div>
                  <div>
                    <div className="font-bold text-sm">{rev.name}</div>
                    <div className="text-slate-500 text-xs">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Simple Pricing. No Hidden Costs.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col text-left">
              <div className="mb-6">
                <div className="text-slate-400 text-sm font-bold mb-2">FREE</div>
                <div className="text-4xl font-bold">$0<span className="text-lg text-slate-500 font-medium">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500" /> 1 Managed Bot</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500" /> Standard AI Engine</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500" /> Community Support</li>
              </ul>
              <button onClick={scrollToCTA} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">Get Started</button>
            </div>
            {/* Pro */}
            <div className="p-8 rounded-2xl bg-indigo-600/10 border-2 border-indigo-500 flex flex-col text-left relative overflow-hidden scale-105 shadow-2xl shadow-indigo-500/10">
              <div className="absolute top-4 right-4 bg-indigo-500 text-[10px] px-2 py-0.5 rounded-full font-bold">MOST POPULAR</div>
              <div className="mb-6">
                <div className="text-indigo-400 text-sm font-bold mb-2">PRO</div>
                <div className="text-4xl font-bold">$29<span className="text-lg text-slate-500 font-medium">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-100"><CheckCircle className="w-4 h-4 text-indigo-400" /> 10 Managed Bots</li>
                <li className="flex items-center gap-2 text-sm text-slate-100"><CheckCircle className="w-4 h-4 text-indigo-400" /> Advanced Logic Engine</li>
                <li className="flex items-center gap-2 text-sm text-slate-100"><CheckCircle className="w-4 h-4 text-indigo-400" /> Full Dashboard & API</li>
                <li className="flex items-center gap-2 text-sm text-slate-100"><CheckCircle className="w-4 h-4 text-indigo-400" /> Priority Support</li>
              </ul>
              <button onClick={scrollToCTA} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all">Start Pro Trial</button>
            </div>
            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col text-left">
              <div className="mb-6">
                <div className="text-slate-400 text-sm font-bold mb-2">ENTERPRISE</div>
                <div className="text-4xl font-bold">Custom</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Bots</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500" /> Custom Integrations</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500" /> White-label Analytics</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-green-500" /> Dedicated Account Mgr</li>
              </ul>
              <button onClick={scrollToCTA} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA Final */}
      <footer className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Ready to deploy your next AI employee?</h2>
            <button 
                onClick={scrollToCTA}
                className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl"
            >
                Start Building for Free
            </button>
            <div className="mt-12 text-slate-500 text-sm">
                &copy; 2026 ZeroBot. Built by AI, for the next generation of automation.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ZeroBotLanding;
