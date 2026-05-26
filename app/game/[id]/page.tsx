'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type QuestionData = {
  id: string;
  category: string;
  text: string;
  options: string[];
};

const CATEGORY_COLORS: Record<string, string> = {
  romance: '#e8698a',
  trust: '#9d4edd',
  compatibility: '#2dd4bf',
  personality: '#f4c542',
};

const CATEGORY_LABELS: Record<string, string> = {
  romance: '♥ Romance',
  trust: '🔒 Trust',
  compatibility: '⚡ Compatibility',
  personality: '✦ Personality',
};

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [profileName, setProfileName] = useState('');
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [phase, setPhase] = useState<'intro' | 'playing' | 'submitting'>('intro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch(`/api/game/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setProfileName(data.profileName);
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(() => setError('Failed to load the game. Check the link and try again.'));
  }, [id]);

  const handleSelect = (option: string) => {
    if (animating) return;
    setSelected(option);
  };

  const handleNext = async () => {
    if (!selected || animating) return;
    setAnimating(true);

    const newAnswers = [...answers, { questionId: questions[currentQ].id, answer: selected }];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setTimeout(() => {
        setCurrentQ(q => q + 1);
        setSelected(null);
        setAnimating(false);
      }, 350);
    } else {
      // Submit
      setPhase('submitting');
      try {
        const res = await fetch('/api/submit-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: id, playerName, answers: newAnswers }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        router.push(`/result/${data.resultId}`);
      } catch {
        setError('Failed to submit answers. Please try again.');
        setPhase('playing');
        setAnimating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-spin-slow flex items-center justify-center"
            style={{ border: '2px solid rgba(232,105,138,0.2)', borderTop: '2px solid #e8698a' }} />
          <p className="text-white/40 font-display text-xl">Loading your soul quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
        <div className="glass-card p-10 text-center max-w-md">
          <div className="text-4xl mb-4">💔</div>
          <h2 className="font-display text-2xl text-white/80 mb-3">Oops...</h2>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center relative overflow-hidden px-6">
        <div className="fixed top-1/3 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, #e8698a, transparent)' }} />

        <div className="relative z-10 max-w-lg w-full text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{ background: 'rgba(232,105,138,0.1)', border: '1px solid rgba(232,105,138,0.2)' }}>
            <span className="text-rose-300 text-sm">Soul Quiz</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl gradient-text mb-4">
            {profileName} wants to know...
          </h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            {questions.length} questions. 4 categories. One score that reveals everything about your connection.
            Answer honestly — the soul sees through pretense.
          </p>

          {/* Category preview */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
              <div key={cat} className="glass-card px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat], boxShadow: `0 0 6px ${CATEGORY_COLORS[cat]}` }} />
                <span className="text-white/60 text-sm">{label}</span>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-white/50 text-sm mb-2">Your name (shown on results)</label>
            <input className="soul-input text-center" placeholder="Enter your name..."
              value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          </div>

          <button
            className="btn-primary w-full py-4 rounded-2xl text-base font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!playerName.trim()}
            onClick={() => setPhase('playing')}>
            Begin the Quiz ✦
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, rgba(232,105,138,0.3), rgba(157,78,221,0.3))', border: '1px solid rgba(232,105,138,0.4)' }}>
            <span className="text-3xl">✦</span>
          </div>
          <p className="font-display text-2xl gradient-text mb-2">Calculating your soul score...</p>
          <p className="text-white/40 text-sm">Analysing {answers.length} answers across 4 dimensions</p>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const catColor = CATEGORY_COLORS[q.category] || '#e8698a';

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden px-4 py-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${catColor}, transparent)` }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%`,
              background: `linear-gradient(90deg, ${catColor}, ${catColor}aa)` }} />
          </div>
          <span className="text-white/40 text-sm whitespace-nowrap">{currentQ + 1} / {questions.length}</span>
        </div>

        {/* Category badge */}
        <div className="mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: catColor, boxShadow: `0 0 8px ${catColor}` }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: catColor }}>
            {CATEGORY_LABELS[q.category] || q.category}
          </span>
        </div>

        {/* Question card */}
        <div className={`glass-card p-8 mb-6 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
          style={{ border: `1px solid ${catColor}22` }}>
          <h2 className="font-display text-3xl md:text-4xl text-white leading-snug mb-2">
            {q.text}
          </h2>
        </div>

        {/* Options */}
        <div className={`space-y-3 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(opt)}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-200 flex items-center gap-4 group ${
                selected === opt
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
              style={{
                background: selected === opt ? `${catColor}18` : 'rgba(255,255,255,0.03)',
                border: selected === opt ? `1px solid ${catColor}60` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: selected === opt ? `0 0 20px ${catColor}15` : 'none',
              }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium transition-all"
                style={{
                  background: selected === opt ? catColor : 'rgba(255,255,255,0.08)',
                  color: selected === opt ? 'white' : 'rgba(255,255,255,0.4)',
                }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm leading-relaxed">{opt}</span>
            </button>
          ))}
        </div>

        {/* Next button */}
        <div className="mt-8">
          <button
            className="btn-primary w-full py-4 rounded-2xl font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!selected || animating}
            onClick={handleNext}
            style={{ background: selected ? `linear-gradient(135deg, ${catColor}, ${catColor}aa)` : undefined }}>
            {currentQ < questions.length - 1 ? 'Next Question →' : 'Reveal My Score ✦'}
          </button>
        </div>
      </div>
    </div>
  );
}
