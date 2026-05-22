import React, { useState, useEffect } from 'react';
import TheorySection from './TheorySection';
import ExerciseBuilder from './ExerciseBuilder';
import {
  BookOpen,
  Gamepad2,
  Trophy,
  Sparkles,
  Award,
  BookOpenText
} from 'lucide-react';

export default function App() {
  const [activeSegment, setActiveSegment] = useState<'theory' | 'game'>('theory');
  const [highScore, setHighScore] = useState<number>(0);

  // Sync highest game score from game updates
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('es_past_tenses_highscore');
      if (saved) {
        setHighScore(parseInt(saved, 10));
      }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    // Poll to keep it fresh in continuous engagement
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800" id="applet-viewport">
      {/* Decorative background grid and geometrics */}
      <div className="absolute top-0 left-0 right-0 h-[360px] bg-indigo-900/5 -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Header Branding Panel (Geometric Balance Style) */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-indigo-500 bg-indigo-900 text-white p-6 md:p-8 rounded-2xl shadow-md" id="applet-header">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 bg-white rotate-45 flex items-center justify-center shadow-xs">
                <span className="text-indigo-900 font-bold -rotate-45 font-display text-sm">ES</span>
              </div>
              <span className="text-xs font-bold font-mono tracking-widest text-indigo-200 uppercase">
                Dominio de los Números • Իսպաներենի թվերը 1-3000
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">
              Los Números en Español (1-3000)
            </h1>
            <p className="text-indigo-100 max-w-2xl text-sm leading-relaxed font-sans">
              Ինտերակտիվ ուսումնական հարթակ և խաղային հանգույց՝ նվիրված իսպաներենի թվերին (1-ից մինչև 3000)։ Սովորեք կանոնները, արտասանությունը հայերեն տառերով և անցեք 6 յուրօրինակ խաղ-մարտահրավերներ։
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex gap-4 items-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg flex items-center gap-3">
              <div className="p-2 bg-indigo-505/20 text-indigo-300 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
              </div>
              <div>
                <span className="text-3xs text-indigo-200 block uppercase font-bold tracking-wider font-sans">Ընդհանուր ռեկորդ</span>
                <span className="font-mono font-bold text-base text-white">{highScore} միավոր</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Navigation Hub (Geometric Balance style) */}
        <nav className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8 bg-white p-2 rounded-2xl shadow-xs border border-slate-200 font-sans" id="nav-hub">
          <button
            id="nav-btn-theory"
            onClick={() => setActiveSegment('theory')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeSegment === 'theory'
                ? 'bg-indigo-900 text-white shadow-md shadow-indigo-200 scale-102 border-b-2 border-indigo-500 font-bold'
                : 'text-slate-600 hover:text-indigo-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span>📖 Տեսական դասագիրք և Թարգմանիչ</span>
          </button>

          <button
            id="nav-btn-game"
            onClick={() => setActiveSegment('game')}
            className={`flex items-center gap-2 py-3 px-5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeSegment === 'game'
                ? 'bg-indigo-900 text-white shadow-md shadow-indigo-200 scale-102 border-b-2 border-indigo-500 font-bold'
                : 'text-slate-600 hover:text-indigo-900 hover:bg-slate-50'
            }`}
          >
            <Gamepad2 className="w-4 h-4 flex-shrink-0" />
            <span>🎮 6 Ինտերակտիվ Խաղախցիկներ</span>
          </button>
        </nav>

        {/* Primary Content Render Sandbox */}
        <main className="min-h-[450px]" id="primary-content-viewport">
          {activeSegment === 'theory' && <TheorySection />}
          {activeSegment === 'game' && <ExerciseBuilder />}
        </main>
      </div>

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-505" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <p>
            <b>© 2026 Los Números en Español.</b> Իսպաներենի թվերի տիրապետում ակադեմիական ճշգրտությամբ։
          </p>
          <div className="flex gap-4 text-3xs font-mono uppercase tracking-widest text-slate-400">
            <span>1 - 3000 (Uno a Tres Mil)</span>
            <span>•</span>
            <span>6 տարբեր խաղեր</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
