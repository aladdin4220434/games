'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.002,
      });
    }

    let animId: number;
    let t = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;
      stars.forEach((s) => {
        s.alpha = 0.3 + 0.5 * Math.sin(t * s.speed * 60 + s.x);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden">
      {/* Star canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Ambient orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle, #9d4edd, transparent)' }} />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15 animate-float-delayed"
        style={{ background: 'radial-gradient(circle, #e8698a, transparent)' }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e8698a, #9d4edd)' }}>
            <span className="text-sm">✦</span>
          </div>
          <span className="font-display text-xl tracking-wider gradient-text font-semibold">SoulLink</span>
        </div>
        <Link href="/create">
          <button className="btn-ghost px-5 py-2 rounded-full text-sm font-medium">
            Create Profile →
          </button>
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
          style={{ background: 'rgba(232,105,138,0.1)', border: '1px solid rgba(232,105,138,0.2)' }}>
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-rose-300 text-sm font-medium">Pure soul science. Zero AI.</span>
        </div>

        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-none mb-6 max-w-4xl">
          <span className="gradient-text">How well does</span>
          <br />
          <em className="text-white font-light">someone really</em>
          <br />
          <span className="gradient-text">know you?</span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl max-w-xl mb-12 leading-relaxed font-light">
          Build your Soul Profile. Generate a unique link. Let someone play the quiz.
          Discover your true compatibility — calculated by pure logic, not algorithms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/create">
            <button className="btn-primary px-10 py-4 rounded-full text-base font-medium"
              style={{ minWidth: 220 }}>
              Create My Soul Profile ✦
            </button>
          </Link>
          <p className="text-white/30 text-sm">Free. No signup required.</p>
        </div>

        {/* Score preview cards */}
        <div className="flex gap-4 mt-20 flex-wrap justify-center">
          {[
            { label: 'Compatibility', value: 87, color: '#e8698a' },
            { label: 'Trust Score', value: 94, color: '#9d4edd' },
            { label: 'Emotional Bond', value: 78, color: '#2dd4bf' },
          ].map((item) => (
            <div key={item.label} className="glass-card px-6 py-4 flex items-center gap-4 glow-rose">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 score-ring" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke={item.color}
                    strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray={`${item.value} 100`}
                    style={{ filter: `drop-shadow(0 0 4px ${item.color})` }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white/80">
                  {item.value}
                </span>
              </div>
              <span className="text-white/60 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <h2 className="font-display text-4xl md:text-5xl text-center gradient-text mb-16">
          How SoulLink works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              icon: '🫀',
              title: 'Build Your Soul Profile',
              desc: 'Share your personality, love language, preferences, and what makes you, you. Totally private — only the game link is shared.',
            },
            {
              step: '02',
              icon: '🔗',
              title: 'Share Your Link',
              desc: 'Get a unique URL. Send it to your partner, crush, best friend, or anyone you want to test your connection with.',
            },
            {
              step: '03',
              icon: '✨',
              title: 'Discover Your Score',
              desc: 'They answer 15 carefully crafted questions. The rule-based engine calculates your compatibility across 4 dimensions. Share the result.',
            },
          ].map((item) => (
            <div key={item.step} className="glass-card p-8 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
              <div className="absolute top-4 right-4 font-display text-6xl text-white/5 font-bold">{item.step}</div>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-display text-xl text-white/90 mb-3">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/20 text-sm">
        <p>Made with ♥ — SoulLink uses zero AI. All scoring is rule-based and deterministic.</p>
      </footer>
    </div>
  );
}
