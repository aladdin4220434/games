'use client';
import { useState, use } from 'react';
import Link from 'next/link';

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const gameUrl = `${baseUrl}/game/${id}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(gameUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `✨ Can you pass my SoulLink quiz? I dare you to try. ${gameUrl}`;

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center relative overflow-hidden px-6">
      {/* Ambient */}
      <div className="fixed top-1/3 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle, #e8698a, transparent)' }} />
      <div className="fixed bottom-1/3 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15 animate-float-delayed"
        style={{ background: 'radial-gradient(circle, #9d4edd, transparent)' }} />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center glow-rose"
          style={{ background: 'linear-gradient(135deg, rgba(232,105,138,0.2), rgba(157,78,221,0.2))', border: '1px solid rgba(232,105,138,0.3)' }}>
          <span className="text-4xl">✦</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl gradient-text mb-4">
          Your Soul Profile is ready
        </h1>
        <p className="text-white/50 mb-10 leading-relaxed">
          Share this link with someone special and see how well they really know you.
          Every answer reveals something about your connection.
        </p>

        {/* Link card */}
        <div className="glass-card p-6 mb-6 glow-rose">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Your unique game link</p>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-white/60 text-sm flex-1 text-left truncate font-mono">{gameUrl}</span>
            <button onClick={copyLink}
              className="btn-primary px-4 py-2 rounded-lg text-sm whitespace-nowrap flex-shrink-0">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share options */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
            className="glass-card py-4 flex flex-col items-center gap-2 hover:border-green-500/30 transition-all group">
            <span className="text-2xl">💬</span>
            <span className="text-white/50 text-xs group-hover:text-white/70">WhatsApp</span>
          </a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
            className="glass-card py-4 flex flex-col items-center gap-2 hover:border-sky-500/30 transition-all group">
            <span className="text-2xl">𝕏</span>
            <span className="text-white/50 text-xs group-hover:text-white/70">Twitter / X</span>
          </a>
          <a href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer"
            className="glass-card py-4 flex flex-col items-center gap-2 hover:border-pink-500/30 transition-all group">
            <span className="text-2xl">📸</span>
            <span className="text-white/50 text-xs group-hover:text-white/70">Instagram</span>
          </a>
        </div>

        {/* Game ID */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }} />
          <span className="text-white/30 text-xs font-mono">GAME ID: {id}</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }} />
        </div>

        <Link href="/">
          <button className="btn-ghost px-8 py-3 rounded-full text-sm">
            ← Back to home
          </button>
        </Link>
      </div>
    </div>
  );
}
