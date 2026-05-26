'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PERSONALITY_TRAITS = [
  'Empathetic', 'Adventurous', 'Creative', 'Logical', 'Humorous',
  'Ambitious', 'Calm', 'Passionate', 'Introverted', 'Extroverted',
  'Loyal', 'Independent', 'Sensitive', 'Spontaneous', 'Organized',
];

const FAVORITE_THINGS_OPTIONS = [
  'Coffee', 'Music', 'Travel', 'Cooking', 'Reading', 'Gaming',
  'Fitness', 'Art', 'Movies', 'Hiking', 'Yoga', 'Fashion',
  'Photography', 'Dancing', 'Podcasts',
];

const DEALBREAKERS = [
  'Dishonesty', 'Disrespect', 'No ambition', 'Poor hygiene',
  'Jealousy', 'Controlling behavior', 'Smoking', 'Substance abuse',
  'No sense of humor', 'Emotional unavailability',
];

type FormData = {
  name: string;
  age: string;
  gender: string;
  personalityTraits: string[];
  favoriteThings: string[];
  dislikes: string;
  relationshipPreference: string;
  loveLanguage: string;
  communicationStyle: string;
  dealbreakers: string[];
  customQ1: string;
  customA1: string;
  customQ2: string;
  customA2: string;
};

const STEPS = ['About You', 'Your Personality', 'Love & Values', 'Custom Questions'];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormData>({
    name: '', age: '', gender: '',
    personalityTraits: [], favoriteThings: [],
    dislikes: '',
    relationshipPreference: '', loveLanguage: '', communicationStyle: '',
    dealbreakers: [],
    customQ1: '', customA1: '', customQ2: '', customA2: '',
  });

  const update = (field: keyof FormData, value: string | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleMulti = (field: 'personalityTraits' | 'favoriteThings' | 'dealbreakers', val: string) => {
    const arr = form[field] as string[];
    update(field, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const canNext = () => {
    if (step === 0) return form.name && form.age && form.gender;
    if (step === 1) return form.personalityTraits.length >= 2;
    if (step === 2) return form.relationshipPreference && form.loveLanguage && form.communicationStyle;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const customQuestions = [];
      if (form.customQ1 && form.customA1)
        customQuestions.push({ question: form.customQ1, correctAnswer: form.customA1 });
      if (form.customQ2 && form.customA2)
        customQuestions.push({ question: form.customQ2, correctAnswer: form.customA2 });

      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: parseInt(form.age),
          gender: form.gender,
          personalityTraits: form.personalityTraits,
          favoriteThings: form.favoriteThings,
          dislikes: form.dislikes.split(',').map((d) => d.trim()).filter(Boolean),
          relationshipPreference: form.relationshipPreference,
          loveLanguage: form.loveLanguage,
          communicationStyle: form.communicationStyle,
          dealbreakers: form.dealbreakers,
          customQuestions,
        }),
      });

      if (!res.ok) throw new Error('Failed to create profile');
      const { gameId } = await res.json();
      router.push(`/share/${gameId}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed top-20 right-20 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #9d4edd, transparent)' }} />
      <div className="fixed bottom-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #e8698a, transparent)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-white/40 hover:text-white/70 transition-colors text-sm">
            ← Back
          </Link>
          <div className="font-display text-xl gradient-text">SoulLink</div>
          <div className="text-white/40 text-sm">{step + 1} / {STEPS.length}</div>
        </div>

        {/* Progress */}
        <div className="progress-bar mb-10">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 whitespace-nowrap text-sm px-3 py-1 rounded-full transition-all ${
              i === step ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              i < step ? 'text-white/40' : 'text-white/20'
            }`}>
              {i < step ? '✓' : i === step ? '●' : '○'} {s}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="glass-card p-8">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl gradient-text mb-2">Tell me about yourself</h2>
                <p className="text-white/40 text-sm">This forms the heart of your Soul Profile.</p>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Your name *</label>
                <input className="soul-input" placeholder="What do people call you?" value={form.name}
                  onChange={(e) => update('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Age *</label>
                <input className="soul-input" type="number" placeholder="Your age" min="16" max="99"
                  value={form.age} onChange={(e) => update('age', e.target.value)} />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Gender *</label>
                <select className="soul-input soul-select" value={form.gender}
                  onChange={(e) => update('gender', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="man">Man</option>
                  <option value="woman">Woman</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="other">Prefer to self-describe</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl gradient-text mb-2">Your personality</h2>
                <p className="text-white/40 text-sm">Select at least 2 traits that describe you.</p>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-3">Personality traits *</label>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITY_TRAITS.map((t) => (
                    <button key={t} type="button"
                      className={`tag-chip ${form.personalityTraits.includes(t) ? 'active' : ''}`}
                      onClick={() => toggleMulti('personalityTraits', t)}>
                      {form.personalityTraits.includes(t) ? '✓' : '+'} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-3">Favorite things</label>
                <div className="flex flex-wrap gap-2">
                  {FAVORITE_THINGS_OPTIONS.map((t) => (
                    <button key={t} type="button"
                      className={`tag-chip ${form.favoriteThings.includes(t) ? 'active' : ''}`}
                      onClick={() => toggleMulti('favoriteThings', t)}
                      style={{ borderColor: form.favoriteThings.includes(t) ? 'rgba(232,105,138,0.5)' : undefined,
                               color: form.favoriteThings.includes(t) ? '#f9a8d4' : undefined }}>
                      {form.favoriteThings.includes(t) ? '♥' : '+'} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Things you dislike (comma-separated)</label>
                <input className="soul-input" placeholder="e.g. tardiness, loud chewing, negativity"
                  value={form.dislikes} onChange={(e) => update('dislikes', e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl gradient-text mb-2">Love & values</h2>
                <p className="text-white/40 text-sm">This shapes the heart of your compatibility quiz.</p>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Relationship preference *</label>
                <select className="soul-input soul-select" value={form.relationshipPreference}
                  onChange={(e) => update('relationshipPreference', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="serious">Looking for something serious</option>
                  <option value="casual">Keeping it casual for now</option>
                  <option value="friendship">Building a deep friendship first</option>
                  <option value="open">Open to whatever feels right</option>
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Your love language *</label>
                <select className="soul-input soul-select" value={form.loveLanguage}
                  onChange={(e) => update('loveLanguage', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="physical_touch">Physical touch</option>
                  <option value="words_of_affirmation">Words of affirmation</option>
                  <option value="acts_of_service">Acts of service</option>
                  <option value="quality_time">Quality time</option>
                  <option value="gifts">Gift giving</option>
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Communication style *</label>
                <select className="soul-input soul-select" value={form.communicationStyle}
                  onChange={(e) => update('communicationStyle', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="direct">Direct & honest</option>
                  <option value="gentle">Gentle & diplomatic</option>
                  <option value="humor">Through humor & lightness</option>
                  <option value="written">Better in writing</option>
                  <option value="space">Need space to process first</option>
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-3">Dealbreakers</label>
                <div className="flex flex-wrap gap-2">
                  {DEALBREAKERS.map((d) => (
                    <button key={d} type="button"
                      className={`tag-chip ${form.dealbreakers.includes(d) ? 'active' : ''}`}
                      style={{ borderColor: form.dealbreakers.includes(d) ? 'rgba(239,68,68,0.5)' : undefined,
                               color: form.dealbreakers.includes(d) ? '#fca5a5' : undefined,
                               background: form.dealbreakers.includes(d) ? 'rgba(239,68,68,0.1)' : undefined }}
                      onClick={() => toggleMulti('dealbreakers', d)}>
                      {form.dealbreakers.includes(d) ? '✗' : '+'} {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl gradient-text mb-2">Your secret questions</h2>
                <p className="text-white/40 text-sm">
                  Optional: add personal questions only someone who truly knows you could answer.
                  These will appear in the quiz with bonus weight.
                </p>
              </div>
              <div className="space-y-4 p-4 rounded-xl" style={{ background: 'rgba(232,105,138,0.05)', border: '1px solid rgba(232,105,138,0.15)' }}>
                <p className="text-white/50 text-xs uppercase tracking-widest">Question 1</p>
                <input className="soul-input" placeholder="e.g. What's my biggest fear?" value={form.customQ1}
                  onChange={(e) => update('customQ1', e.target.value)} />
                <input className="soul-input" placeholder="The correct answer..." value={form.customA1}
                  onChange={(e) => update('customA1', e.target.value)} />
              </div>
              <div className="space-y-4 p-4 rounded-xl" style={{ background: 'rgba(157,78,221,0.05)', border: '1px solid rgba(157,78,221,0.15)' }}>
                <p className="text-white/50 text-xs uppercase tracking-widest">Question 2</p>
                <input className="soul-input" placeholder="e.g. What's my dream travel destination?" value={form.customQ2}
                  onChange={(e) => update('customQ2', e.target.value)} />
                <input className="soul-input" placeholder="The correct answer..." value={form.customA2}
                  onChange={(e) => update('customA2', e.target.value)} />
              </div>

              {error && (
                <div className="text-red-400 text-sm p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          {step > 0 && (
            <button className="btn-ghost flex-1 py-4 rounded-2xl font-medium" onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="btn-primary flex-1 py-4 rounded-2xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}>
              Continue →
            </button>
          ) : (
            <button
              className="btn-primary flex-1 py-4 rounded-2xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={loading}
              onClick={handleSubmit}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Creating your Soul Profile...
                </span>
              ) : '✦ Create My Soul Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
