'use client';
import { use, useEffect, useState, useRef } from 'react';
import Link from 'next/link';

type ResultData = {
  playerName: string;
  profileName: string;
  compatibilityScore: number;
  personalityMatch: number;
  trustScore: number;
  emotionalAlignment: number;
  finalScore: number;
  matchTitle: string;
  matchDescription: string;
  gameId: string;
};

function AnimatedScore({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const duration = 1500;
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const circumference = 2 * Math.PI * 40;
  const strokeDash = (display / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 score-ring" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dasharray 0.1s' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-white">{display}</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay + 200);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-sm">{label}</span>
        <span className="text-white/80 text-sm font-medium">{value}/100</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color, boxShadow: `0 0 12px ${color}60` }} />
      </div>
    </div>
  );
}

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/result/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setResult(data);
        setLoading(false);
      })
      .catch(() => setError('Failed to load results.'));
  }, [id]);

  const copyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-spin-slow"
            style={{ border: '2px solid rgba(232,105,138,0.2)', borderTop: '2px solid #e8698a' }} />
          <p className="text-white/40 font-display text-xl">Revealing your soul score...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
        <div className="glass-card p-10 text-center max-w-md">
          <div className="text-4xl mb-4">💔</div>
          <p className="text-white/50">{error || 'Result not found'}</p>
        </div>
      </div>
    );
  }

  const finalColor = result.finalScore >= 80 ? '#e8698a' :
    result.finalScore >= 60 ? '#9d4edd' :
    result.finalScore >= 40 ? '#2dd4bf' : '#f4c542';

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden px-4 py-10">
      {/* Ambient */}
      <div className="fixed top-20 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
        style={{ background: `radial-gradient(circle, ${finalColor}, transparent)` }} />
      <div className="fixed bottom-20 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15 animate-float-delayed"
        style={{ background: 'radial-gradient(circle, #9d4edd, transparent)' }} />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm mb-8">
          ← SoulLink
        </Link>

        {/* Main result card */}
        <div ref={cardRef} className="glass-card p-8 md:p-12 mb-6 glow-rose relative overflow-hidden"
          style={{ border: `1px solid ${finalColor}30` }}>
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ background: `radial-gradient(circle at top right, ${finalColor}, transparent)` }} />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: `${finalColor}15`, border: `1px solid ${finalColor}30` }}>
              <span className="text-sm" style={{ color: finalColor }}>SoulLink Result</span>
            </div>
            <p className="text-white/50 text-sm mb-2">
              <span className="text-white/80">{result.playerName}</span> answered {result.profileName}&apos;s quiz
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-white mb-2">{result.matchTitle}</h1>
          </div>

          {/* Big score */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="w-48 h-48 relative">
                <svg className="w-48 h-48 score-ring" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke={finalColor}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(result.finalScore / 100) * (2 * Math.PI * 85)} ${2 * Math.PI * 85}`}
                    style={{ filter: `drop-shadow(0 0 20px ${finalColor})` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-6xl text-white">{result.finalScore}</span>
                  <span className="text-white/40 text-sm">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-10 px-4">
            <p className="text-white/70 leading-relaxed text-lg">{result.matchDescription}</p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { label: 'Romance & Affection', value: result.emotionalAlignment, color: '#e8698a', delay: 0 },
              { label: 'Trust & Loyalty', value: result.trustScore, color: '#9d4edd', delay: 200 },
              { label: 'Compatibility', value: result.compatibilityScore, color: '#2dd4bf', delay: 400 },
              { label: 'Personality Match', value: result.personalityMatch, color: '#f4c542', delay: 600 },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <AnimatedScore value={item.value} color={item.color} delay={item.delay} />
                </div>
                <p className="text-white/50 text-xs">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="space-y-4 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <ScoreBar label="❤️ Romance & Emotional Alignment" value={result.emotionalAlignment} color="#e8698a" delay={0} />
            <ScoreBar label="🔒 Trust Score" value={result.trustScore} color="#9d4edd" delay={200} />
            <ScoreBar label="⚡ Compatibility" value={result.compatibilityScore} color="#2dd4bf" delay={400} />
            <ScoreBar label="✦ Personality Match" value={result.personalityMatch} color="#f4c542" delay={600} />
          </div>

          {/* Watermark */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-white/20 text-xs">Generated by</span>
            <span className="font-display text-white/40 text-sm gradient-text">SoulLink</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={copyLink}
            className="btn-primary py-4 rounded-2xl font-medium text-sm">
            {copied ? '✓ Link Copied!' : '🔗 Share Result'}
          </button>
          <Link href={`/game/${result.gameId}`} className="block">
            <button className="btn-ghost w-full py-4 rounded-2xl text-sm">
              🔄 Play Again
            </button>
          </Link>
        </div>

        {/* Create own profile CTA */}
        <div className="glass-card-rose p-6 text-center">
          <p className="text-white/60 text-sm mb-3">Want to create your own Soul Profile?</p>
          <Link href="/create">
            <button className="btn-primary px-8 py-3 rounded-full text-sm">
              Create My Profile →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
