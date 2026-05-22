import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { numberToSpanish, numberToArmPhonetic, numberToArm } from './numberTranslator';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Play, 
  HelpCircle, 
  Type, 
  Volume2, 
  ArrowRight, 
  Calculator, 
  Sparkles, 
  Bookmark, 
  BookOpen,
  Keyboard,
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface AttemptLog {
  guess: number;
  spanish: string;
  relation: 'too-high' | 'too-low' | 'correct';
}

export default function ExerciseBuilder() {
  const [activeGame, setActiveGame] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [gameHighScores, setGameHighScores] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
  });

  // Load scores
  useEffect(() => {
    const savedScores = localStorage.getItem('es_numbers_games_highscores');
    if (savedScores) {
      try {
        setGameHighScores(JSON.parse(savedScores));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveHighScore = (gameId: number, currentScore: number) => {
    const nextScores = { ...gameHighScores };
    if (currentScore > (nextScores[gameId] || 0)) {
      nextScores[gameId] = currentScore;
      setGameHighScores(nextScores);
      localStorage.setItem('es_numbers_games_highscores', JSON.stringify(nextScores));
      // Trigger global highScore refresh in App.tsx
      const totalCombined = (Object.values(nextScores) as number[]).reduce((a, b) => a + b, 0);
      localStorage.setItem('es_past_tenses_highscore', totalCombined.toString());
      window.dispatchEvent(new Event('storage'));
    }
  };

  // State for GAME 1: Constructor / Builder
  const [g1Target, setG1Target] = useState<number>(121);
  const [g1PickedWords, setG1PickedWords] = useState<string[]>([]);
  const [g1ShuffledPool, setG1ShuffledPool] = useState<string[]>([]);
  const [g1IsChecked, setG1IsChecked] = useState<boolean>(false);
  const [g1IsCorrect, setG1IsCorrect] = useState<boolean>(false);

  // State for GAME 2: Adivina el Número (Secret guesser)
  const [g2Range, setG2Range] = useState<100 | 1000 | 3000>(100);
  const [g2Secret, setG2Secret] = useState<number>(42);
  const [g2InputValue, setG2InputValue] = useState<string>('');
  const [g2Attempts, setG2Attempts] = useState<AttemptLog[]>([]);
  const [g2Success, setG2Success] = useState<boolean>(false);

  // State for GAME 3: Written to Digits (Multiple Choice)
  const [g3Target, setG3Target] = useState<number>(55);
  const [g3Options, setG3Options] = useState<number[]>([]);
  const [g3Selected, setG3Selected] = useState<number | null>(null);
  const [g3IsChecked, setG3IsChecked] = useState<boolean>(false);

  // State for GAME 4: Digits to Written (Type-in with phonetic view)
  const [g4Target, setG4Target] = useState<number>(15);
  const [g4TypedInput, setG4TypedInput] = useState<string>('');
  const [g4IsChecked, setG4IsChecked] = useState<boolean>(false);
  const [g4IsCorrect, setG4IsCorrect] = useState<boolean>(false);

  // State for GAME 5: Calculations (Mental math)
  const [g5MathProblem, setG5MathProblem] = useState<{
    text: string;
    spanishQuestion: string;
    answer: number;
    options: number[];
  }>({ text: '', spanishQuestion: '', answer: 0, options: [] });
  const [g5Selected, setG5Selected] = useState<number | null>(null);
  const [g5IsChecked, setG5IsChecked] = useState<boolean>(false);

  // State for GAME 6: Audio Dictation Match
  const [g6Target, setG6Target] = useState<number>(333);
  const [g6Options, setG6Options] = useState<number[]>([]);
  const [g6Selected, setG6Selected] = useState<number | null>(null);
  const [g6IsChecked, setG6IsChecked] = useState<boolean>(false);

  // Initializers for games
  useEffect(() => {
    initGame1();
    initGame2(100);
    initGame3();
    initGame4();
    initGame5();
    initGame6();
  }, []);

  // --- GAME 1: CONSTRUCTOR ---
  const initGame1 = () => {
    const randomNum = Math.floor(Math.random() * 999) + 1; // ranges 1-1000 for good constructions
    setG1Target(randomNum);
    const correctSpanish = numberToSpanish(randomNum);
    const correctWords = correctSpanish.split(/\s+/);
    
    // Add 2-3 random letters or numeric words as distractors
    const distractors = ['tres', 'cien', 'mil', 'cincuenta', 'veintiuno'];
    const distractorPool = distractors.filter(w => !correctWords.includes(w));
    const finalPool = [...correctWords, ...distractorPool.slice(0, 3)];

    // Shuffling finalPool
    for (let i = finalPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalPool[i], finalPool[j]] = [finalPool[j], finalPool[i]];
    }

    setG1ShuffledPool(finalPool);
    setG1PickedWords([]);
    setG1IsChecked(false);
    setG1IsCorrect(false);
  };

  const handleG1AddWord = (word: string) => {
    if (g1IsChecked) return;
    setG1PickedWords([...g1PickedWords, word]);
    // remove one occurrence from pool
    const idx = g1ShuffledPool.indexOf(word);
    if (idx > -1) {
      const copy = [...g1ShuffledPool];
      copy.splice(idx, 1);
      setG1ShuffledPool(copy);
    }
  };

  const handleG1RemoveWord = (word: string) => {
    if (g1IsChecked) return;
    const idx = g1PickedWords.indexOf(word);
    if (idx > -1) {
      const copy = [...g1PickedWords];
      copy.splice(idx, 1);
      setG1PickedWords(copy);
      setG1ShuffledPool([...g1ShuffledPool, word]);
    }
  };

  const checkGame1 = () => {
    const builtString = g1PickedWords.join(' ').trim().toLowerCase();
    const correctString = numberToSpanish(g1Target).toLowerCase();
    const isOk = builtString === correctString;

    setG1IsCorrect(isOk);
    setG1IsChecked(true);

    if (isOk) {
      const nextScore = score + 10;
      setScore(nextScore);
      saveHighScore(1, nextScore);
    } else {
      setScore(0); // Break streak
    }
  };

  // --- GAME 2: SECRET GUESSER ---
  const initGame2 = (range: 100 | 1000 | 3000) => {
    setG2Range(range);
    const randomSecret = Math.floor(Math.random() * range) + 1;
    setG2Secret(randomSecret);
    setG2InputValue('');
    setG2Attempts([]);
    setG2Success(false);
  };

  const submitGame2Guess = () => {
    const guessVal = parseInt(g2InputValue, 10);
    if (isNaN(guessVal) || guessVal < 1 || guessVal > g2Range) {
      alert(`Խնդրում ենք մուտքագրել թիվ 1-ից մինչև ${g2Range}`);
      return;
    }

    // Check relation
    let relation: 'too-high' | 'too-low' | 'correct' = 'correct';
    if (guessVal > g2Secret) relation = 'too-high';
    else if (guessVal < g2Secret) relation = 'too-low';

    const log: AttemptLog = {
      guess: guessVal,
      spanish: numberToSpanish(guessVal),
      relation
    };

    const newAttempts = [log, ...g2Attempts];
    setG2Attempts(newAttempts);
    setG2InputValue('');

    if (relation === 'correct') {
      setG2Success(true);
      const points = g2Range === 100 ? 20 : g2Range === 1000 ? 50 : 100;
      const nextScore = score + points;
      setScore(nextScore);
      saveHighScore(2, nextScore);
    }
  };

  // --- GAME 3: WRITTEN TO DIGITS ---
  const initGame3 = () => {
    const target = Math.floor(Math.random() * 1999) + 1;
    setG3Target(target);

    // Generate options containing similar digits or randoms
    const option1 = target;
    const option2 = target + (Math.random() > 0.5 ? 10 : -10);
    const option3 = target + (Math.random() > 0.5 ? 100 : -100);
    const option4 = Math.floor(Math.random() * 1999) + 1;

    // Filter valid positive inputs and remove duplicates
    const uniqueOptions = Array.from(new Set([option1, option2, option3, option4]))
      .filter(x => x > 0 && x <= 2500)
      .slice(0, 4);

    while (uniqueOptions.length < 4) {
      const extra = Math.floor(Math.random() * 1999) + 1;
      if (!uniqueOptions.includes(extra)) {
        uniqueOptions.push(extra);
      }
    }

    // Shuffle options
    for (let i = uniqueOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueOptions[i], uniqueOptions[j]] = [uniqueOptions[j], uniqueOptions[i]];
    }

    setG3Options(uniqueOptions);
    setG3Selected(null);
    setG3IsChecked(false);
  };

  const checkGame3 = () => {
    if (g3Selected === null) return;
    setG3IsChecked(true);

    if (g3Selected === g3Target) {
      const nextScore = score + 10;
      setScore(nextScore);
      saveHighScore(3, nextScore);
    } else {
      setScore(0);
    }
  };

  // --- GAME 4: DIGITS TO WRITTEN ---
  const initGame4 = () => {
    const target = Math.floor(Math.random() * 499) + 1; // 1-500 is good for high-precision typing
    setG4Target(target);
    setG4TypedInput('');
    setG4IsChecked(false);
    setG4IsCorrect(false);
  };

  const checkGame4 = () => {
    const userAnswerClean = g4TypedInput.trim().toLowerCase().replace(/\s+/g, ' ');
    const correctAnswerClean = numberToSpanish(g4Target).toLowerCase();

    const isOk = userAnswerClean === correctAnswerClean;
    setG4IsCorrect(isOk);
    setG4IsChecked(true);

    if (isOk) {
      const nextScore = score + 15;
      setScore(nextScore);
      saveHighScore(4, nextScore);
    } else {
      setScore(0);
    }
  };

  const insertSpecialChar = (char: string) => {
    setG4TypedInput(g4TypedInput + char);
  };

  // --- GAME 5: MENTAL MATHEMATICS ---
  const initGame5 = () => {
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];

    let num1 = 0;
    let num2 = 0;
    let answer = 0;
    let questionText = '';

    if (op === '+') {
      num1 = Math.floor(Math.random() * 900) + 100; // 100-1000
      num2 = Math.floor(Math.random() * 400) + 50;  // 50-450
      answer = num1 + num2;
      questionText = `${numberToSpanish(num1)} + ${numberToSpanish(num2)}`;
    } else if (op === '-') {
      num1 = Math.floor(Math.random() * 1500) + 500; // 500-2000
      num2 = Math.floor(Math.random() * num1) + 1;   // smaller than num1
      answer = num1 - num2;
      questionText = `${numberToSpanish(num1)} - ${numberToSpanish(num2)}`;
    } else {
      num1 = Math.floor(Math.random() * 15) + 3; // 3-18
      num2 = Math.floor(Math.random() * 50) + 10; // 10-60
      answer = num1 * num2;
      questionText = `${numberToSpanish(num1)} * ${numberToSpanish(num2)}`;
    }

    // Generate incorrect ones
    const dist1 = answer + 10;
    const dist2 = Math.abs(answer - 5);
    const dist3 = answer * 2;
    const dist4 = Math.floor(Math.random() * 1000) + 50;

    const finalOptions = Array.from(new Set([answer, dist1, dist2, dist3, dist4]))
      .filter(x => x > 0 && x <= 3000)
      .slice(0, 4);

    while (finalOptions.length < 4) {
      finalOptions.push(Math.floor(Math.random() * 1999) + 1);
    }

    // Shuffle math options
    for (let i = finalOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
    }

    setG5MathProblem({
      text: `${num1} ${op} ${num2} = ?`,
      spanishQuestion: questionText,
      answer,
      options: finalOptions
    });
    setG5Selected(null);
    setG5IsChecked(false);
  };

  const checkGame5 = () => {
    if (g5Selected === null) return;
    setG5IsChecked(true);

    if (g5Selected === g5MathProblem.answer) {
      const nextScore = score + 20;
      setScore(nextScore);
      saveHighScore(5, nextScore);
    } else {
      setScore(0);
    }
  };

  // --- GAME 6: AUDIO DICTATION MATCH ---
  const initGame6 = () => {
    const target = Math.floor(Math.random() * 2500) + 1;
    setG6Target(target);

    const matchOpts = [
      target,
      target + (Math.random() > 0.5 ? 20 : -20),
      target + (Math.random() > 0.5 ? 400 : -400),
      Math.floor(Math.random() * 2500) + 1
    ];

    const uniqueOptions = Array.from(new Set(matchOpts))
      .filter(x => x > 0 && x <= 3000)
      .slice(0, 4);

    while (uniqueOptions.length < 4) {
      uniqueOptions.push(Math.floor(Math.random() * 2500) + 1);
    }

    // Shuffle options
    for (let i = uniqueOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueOptions[i], uniqueOptions[j]] = [uniqueOptions[j], uniqueOptions[i]];
    }

    setG6Options(uniqueOptions);
    setG6Selected(null);
    setG6IsChecked(false);
  };

  const playSpanishAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Ձեր սարքը չի աջակցում SpeechSynthesis հնչյունավորումը։');
    }
  };

  const checkGame6 = () => {
    if (g6Selected === null) return;
    setG6IsChecked(true);

    if (g6Selected === g6Target) {
      const nextScore = score + 15;
      setScore(nextScore);
      saveHighScore(6, nextScore);
    } else {
      setScore(0);
    }
  };

  // Nav categories array
  const gamesList = [
    { id: 1, title: '🧩 Կոնստրուկտոր', desc: 'Կառուցեք թիվը իսպաներեն բառերից ճիշտ հերթականությամբ', icon: Compass },
    { id: 2, title: '🕵️‍♂️ Գուշակիր թիվը', desc: 'Գուշակեք թիվը՝ օգտագործելով «shատ մեծ / շատ փոքր» հուշող բառերը', icon: RotateCcw },
    { id: 3, title: '📝 Կարդա և Ընտրի', desc: 'Միացրեք իսպաներեն տեքստը իր թվային արժեքին', icon: BookOpen },
    { id: 4, title: '✍️ Գրիր Իսպաներեն', desc: 'Գրեք թվի տեքստը իսպաներեն՝ պահպանելով ճիշտ շեշտերը', icon: Type },
    { id: 5, title: '🧮 Թվաբանություն', desc: 'Կատարեք մաթեմատիկական գործողություններ իսպաներեն բառերով', icon: Calculator },
    { id: 6, title: '🔊 Լսողական Թեստ', desc: 'Լսեք իսպաներեն ձայնը և ընտրեք համապատասխան թիվը', icon: Volume2 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="six-games-container">
      {/* Side Quick Menu / Game Selector */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider font-display">
              🎮 Ընտրեք Խաղը
            </h4>
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-800 px-2.5 py-1 rounded-lg border border-yellow-250 text-xs font-bold shadow-3xs">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span>{(Object.values(gameHighScores) as number[]).reduce((a, b) => a + b, 0)} Pts</span>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Game Nav Buttons */}
          <div className="space-y-2">
            {gamesList.map((g) => {
              const IconComp = g.icon;
              const isSelected = activeGame === g.id;
              const hScore = gameHighScores[g.id] || 0;

              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setActiveGame(g.id);
                    setScore(0); // reset streak when switching
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-900 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-350 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-indigo-505/20 text-indigo-300' : 'bg-white border border-slate-200 text-indigo-900'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-1">
                      <p className="font-extrabold text-xs md:text-sm truncate leading-snug">{g.title}</p>
                      {hScore > 0 && (
                        <span className={`text-4xs font-mono font-bold px-1 rounded-sm ${
                          isSelected ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          🏆{hScore}
                        </span>
                      )}
                    </div>
                    <p className={`text-5xs leading-normal mt-1 truncate ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {g.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Score Multiplier Info */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center space-y-2">
          <p className="text-3xs text-indigo-400 font-mono font-bold uppercase tracking-widest">Ընթացիկ սերիա (Streak)</p>
          <p className="text-3xl font-mono font-black text-indigo-950">{score / 10}🔥</p>
          <p className="text-4xs text-slate-500 font-sans">
            Անընդմեջ ճիշտ պատասխանները կառուցում են ձեր արագությունը և բարձրացնում ռեկորդը: Սխալվելու դեպքում սերիան զրոյանում է:
          </p>
        </div>
      </div>

      {/* Main Game Playing Screen Area */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Top light bar accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-500" />

          {/* Active game workspace switcher */}
          <div>
            {/* GAME 1: CONSTRUCTOR WORKSPACE */}
            {activeGame === 1 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <span className="text-3xs uppercase tracking-widest font-mono font-black text-indigo-400">ԽՏԱՑՎԱԾ ԽԱՂ 1</span>
                  <h3 className="text-2xl font-black text-slate-900">🧩 Իսպաներեն Թվերի Կոնստրուկտոր</h3>
                  <p className="text-xs text-slate-505 mt-1">
                    Միացրեք առաջարկված բառերը այնպիսի հաջորդականությամբ, որը ճշգրիտ կերպով կկազմի տրված թիվը:
                  </p>
                </div>

                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <span className="text-4xs text-slate-400 font-mono uppercase tracking-widest">ԿԱՌՈՒՑՎՈՂ ԹԻՎԸ</span>
                  <p className="text-5xl font-mono font-black text-indigo-950 tracking-tight">{g1Target}</p>
                  <p className="text-2xs text-indigo-600 font-bold font-sans">🇦🇲 Հայերեն՝ {numberToArm(g1Target)}</p>
                </div>

                {/* Built Words Sequence Box */}
                <div className="space-y-2">
                  <span className="text-4xs uppercase tracking-wider text-slate-400 font-bold font-mono">ՁԵՐ ԸՆՏՐԱԾ ԲԱՌԵՐԸ՝</span>
                  <div className="min-h-16 p-4 bg-indigo-50/40 rounded-2xl border border-dashed border-indigo-200 flex flex-wrap gap-2 items-center justify-center">
                    {g1PickedWords.length === 0 ? (
                      <span className="text-xs text-indigo-400 font-medium italic">Զամբյուղը դատարկ է, սեղմեք ստորև գտնվող բառերի վրա...</span>
                    ) : (
                      g1PickedWords.map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleG1RemoveWord(word)}
                          className="bg-indigo-900 text-white font-mono font-bold text-xs px-3.5 py-2 rounded-xl shadow-3xs cursor-pointer border-b-2 border-indigo-700 active:translate-y-0.5 hover:bg-slate-800 flex items-center gap-1.5"
                        >
                          <span>{word}</span>
                          <span className="text-3xs text-red-300">×</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Shuffled pool of options */}
                <div className="space-y-2">
                  <span className="text-4xs uppercase tracking-wider text-slate-400 font-bold font-mono">ԲԱՌԱՅԻՆ ՏԱՐՐԵՐԸ (ՍԵՂՄԵՔ՝ ՄԻԱՑՆԵԼՈՒ ՀԱՄԱՐ)՝</span>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap gap-2 justify-center">
                    {g1ShuffledPool.length === 0 && g1PickedWords.length > 0 ? (
                      <span className="text-xs text-slate-400 italic font-mono">Բոլոր բառերը զամբյուղում են:</span>
                    ) : (
                      g1ShuffledPool.map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleG1AddWord(word)}
                          disabled={g1IsChecked}
                          className="bg-white border border-slate-2.5 hover:border-indigo-400 active:scale-95 px-4 py-2 text-xs font-mono font-bold rounded-xl shadow-2xs text-slate-800 hover:text-indigo-900 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Feedback Box */}
                {g1IsChecked && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl flex items-start gap-4 ${
                      g1IsCorrect ? 'bg-emerald-50 text-emerald-950 border border-emerald-250' : 'bg-red-50 text-red-950 border border-red-250'
                    }`}
                  >
                    {g1IsCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-extrabold text-sm">{g1IsCorrect ? '🎉 Կեցցե՛ք, անթերի է:' : '❌ Սխալ կռահում:'}</p>
                      <p className="text-xs font-medium font-mono mt-1">
                        Ճիշտ ձևն էր՝ <b>{numberToSpanish(g1Target)}</b>
                      </p>
                      <p className="text-5xs uppercase tracking-widest font-mono text-slate-400 mt-1">
                        Արտասանություն [ {numberToArmPhonetic(g1Target)} ]
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Control buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  {!g1IsChecked ? (
                    <button
                      onClick={checkGame1}
                      disabled={g1PickedWords.length === 0}
                      className="px-6 py-3.5 bg-indigo-900 hover:bg-slate-800 disabled:opacity-50 active:scale-95 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      🧪 Ստուգել
                    </button>
                  ) : (
                    <button
                      onClick={initGame1}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Հաջորդ թիվը</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* GAME 2: ADIVINA EL NÚMERO WORKSPACE */}
            {activeGame === 2 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <span className="text-3xs uppercase tracking-widest font-mono font-black text-indigo-400">ԽՏԱՑՎԱԾ ԽԱՂ 2</span>
                  <h3 className="text-2xl font-black text-slate-900">🕵️‍♂️ Գուշակիր Գաղտնի Թիվը (1-3000)</h3>
                  <p className="text-xs text-slate-505 mt-1">
                    Համակարգիչը պահել է մի գաղտնի թիվ: Գուշակեք այն, և յուրաքանչյուր փորձից հետո ստացեք ակնթարթային իսպաներեն թարգմանությունն ու բարձր/ցածր հուշումները:
                  </p>
                </div>

                {/* Difficulty selector */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-650 font-sans">Միջակայք՝</span>
                  <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1">
                    {[100, 1000, 3000].map((r) => (
                      <button
                        key={r}
                        onClick={() => initGame2(r as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black transition-all ${
                          g2Range === r
                            ? 'bg-indigo-900 text-white shadow-3xs'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        1 - {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secret placeholder visual */}
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative overflow-hidden">
                  <span className="text-4xs text-slate-400 font-mono uppercase tracking-widest">ԳԱՂՏՆԻ ԹԻՎ</span>
                  <p className="text-5xl font-mono font-black text-indigo-950">
                    {g2Success ? g2Secret : '???'}
                  </p>
                  <p className="text-4xs text-slate-400 italic">
                    Փորձերի քանակը՝ {g2Attempts.length}
                  </p>
                </div>

                {/* Guess input form */}
                {!g2Success ? (
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3 max-w-md mx-auto">
                    <input
                      type="number"
                      min="1"
                      max={g2Range}
                      value={g2InputValue}
                      onChange={(e) => setG2InputValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') submitGame2Guess(); }}
                      className="w-full bg-white text-slate-900 font-mono font-bold text-base rounded-xl px-4 py-2.5 border border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:outline-hidden transition-all text-center"
                      placeholder={`Մուտքագրեք (1-${g2Range})`}
                    />
                    <button
                      onClick={submitGame2Guess}
                      className="px-5 py-3 bg-indigo-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex-shrink-0"
                    >
                      Գուշակել
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-250 text-emerald-950 text-center max-w-md mx-auto space-y-1 shadow-3xs">
                    <span className="font-extrabold text-sm block">🎉 Շնորհավորո՛ւմ ենք, դուք գտաք գաղտնի թիվը:</span>
                    <span className="font-mono text-xs block font-bold text-emerald-800">
                      {g2Secret} = {numberToSpanish(g2Secret)}
                    </span>
                    <span className="font-sans text-xs italic text-slate-500 block">
                      Հայատառ արտասանություն [ {numberToArmPhonetic(g2Secret)} ]
                    </span>
                    <button
                      onClick={() => initGame2(g2Range)}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase rounded-lg transition-all cursor-pointer"
                    >
                      Խաղալ նորից
                    </button>
                  </div>
                )}

                {/* Attempts timeline logs list */}
                {g2Attempts.length > 0 && (
                  <div className="space-y-2 max-w-md mx-auto">
                    <span className="text-4xs uppercase tracking-widest text-slate-400 font-mono font-bold">ՓՈՐՁԵՐԻ ՊԱՏՄՈՒԹՅՈՒՆ</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {g2Attempts.map((att, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                            att.relation === 'correct'
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-900'
                              : att.relation === 'too-high'
                              ? 'bg-amber-50 border-amber-250 text-amber-900'
                              : 'bg-indigo-50 border-indigo-250 text-indigo-900'
                          }`}
                        >
                          <div>
                            <span className="font-mono font-extrabold text-sm">{att.guess}</span>
                            <span className="font-mono block text-3xs text-slate-500">{att.spanish}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-sans font-bold text-xs">
                            {att.relation === 'too-high' ? (
                              <>
                                <ArrowUp className="w-3.5 h-3.5 text-amber-600" />
                                <span>Շատ Մեծ է (Muy Alto!)</span>
                              </>
                            ) : att.relation === 'too-low' ? (
                              <>
                                <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Շատ Փոքր է (Muy Bajo!)</span>
                              </>
                            ) : (
                              <span>Ճիշտ է!</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GAME 3: WRITTEN TO DIGITS MATCH WORKSPACE */}
            {activeGame === 3 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <span className="text-3xs uppercase tracking-widest font-mono font-black text-indigo-400">ԽՏԱՑՎԱԾ ԽԱՂ 3</span>
                  <h3 className="text-2xl font-black text-slate-900">📝 Կարդա և Ընտրիր ճիշտ թիվը</h3>
                  <p className="text-xs text-slate-505 mt-1">
                    Կարդացեք իսպաներենով գրված թիվը և ընտրեք համապատասխան թվային տարբերակը առաջարկվածներից։
                  </p>
                </div>

                {/* Math Spanish representation board */}
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 px-4">
                  <span className="text-4xs text-slate-400 font-mono uppercase tracking-widest">ԻՍՊԱՆԵՐԵՆ ԳՐԵԼԱՁԵՎԸ</span>
                  <p className="text-xl md:text-3xl font-mono font-extrabold text-indigo-950 leading-relaxed tracking-tight max-w-xl mx-auto block break-words">
                    {numberToSpanish(g3Target)}
                  </p>
                  <p className="text-xs font-sans text-emerald-600 font-medium">
                    🇦🇲 Արտասանություն [ {numberToArmPhonetic(g3Target)} ]
                  </p>
                </div>

                {/* Multiple choice grid options */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {g3Options.map((opt, idx) => {
                    const isSelected = g3Selected === opt;
                    const isCorrect = opt === g3Target;
                    let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400';

                    if (g3IsChecked) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md';
                      } else if (isSelected) {
                        optionStyle = 'bg-red-500 border-red-600 text-white shadow-md';
                      } else {
                        optionStyle = 'bg-slate-100 border-slate-200 text-slate-300';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-indigo-900 border-indigo-700 text-white shadow-md';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => { if (!g3IsChecked) setG3Selected(opt); }}
                        disabled={g3IsChecked}
                        className={`p-4 rounded-2xl border font-mono font-bold text-lg text-center transition-all active:scale-98 cursor-pointer ${optionStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Info Feedback explanation card */}
                {g3IsChecked && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl flex items-start gap-3 max-w-md mx-auto text-xs ${
                      g3Selected === g3Target 
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-250' 
                        : 'bg-red-50 text-red-950 border border-red-250'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold inline-block text-sm">
                        {g3Selected === g3Target ? '🎉 ՃԻՇՏ Է՛:' : '❌ ՍԽԱԼ Է՛:'}
                      </span>
                      <p className="font-medium mt-1">
                        <b>{numberToSpanish(g3Target)}</b> նշանակում է <b>{g3Target}</b>:
                      </p>
                      <p className="font-sans text-2xs uppercase tracking-wider text-slate-400 mt-1">
                        Հայերեն թարգմանություն՝ {numberToArm(g3Target)}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Footer submit controllers */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  {!g3IsChecked ? (
                    <button
                      onClick={checkGame3}
                      disabled={g3Selected === null}
                      className="px-6 py-3.5 bg-indigo-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      🧪 Ստուգել
                    </button>
                  ) : (
                    <button
                      onClick={initGame3}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Հաջորդ հարցը</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* GAME 4: DIGITS TO WRITTEN (WRITING RECALL) */}
            {activeGame === 4 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <span className="text-3xs uppercase tracking-widest font-mono font-black text-indigo-400">ԽՏԱՑՎԱԾ ԽԱՂ 4</span>
                  <h3 className="text-2xl font-black text-slate-900">✍️ Գրիր Իսպաներեն թիվը</h3>
                  <p className="text-xs text-slate-505 mt-1">
                    Մուտքագրեք տրված թվի իսպաներեն տեքստային թարգմանությունը: Ուշադրություն դարձրեք շեշտերին!
                  </p>
                </div>

                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <span className="text-4xs text-slate-400 font-mono uppercase tracking-widest">ԹԱՐԳՄԱՆԻՐ ԹԻՎԸ</span>
                  <p className="text-5xl font-mono font-black text-indigo-950 tracking-tight">{g4Target}</p>
                  <p className="text-xs text-indigo-600 font-semibold font-sans">🇦🇲 ({numberToArm(g4Target)})</p>
                </div>

                {/* Accent shortcut helper panel */}
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-2xs font-bold text-slate-500 font-sans flex items-center gap-1">
                    <Keyboard className="w-4 h-4 text-indigo-500" />
                    <span>Իսպանական հատուկ տառեր՝</span>
                  </span>
                  <div className="flex gap-1.5">
                    {['é', 'í', 'ó', 'ú', 'ñ'].map((c) => (
                      <button
                        key={c}
                        onClick={() => insertSpecialChar(c)}
                        disabled={g4IsChecked}
                        className="bg-white hover:bg-slate-100 border border-slate-300 font-mono font-bold text-sm px-3.5 py-1.5 rounded-lg text-slate-800 shadow-3xs cursor-pointer active:scale-95"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text entry field */}
                <div className="max-w-md mx-auto space-y-2">
                  <input
                    type="text"
                    value={g4TypedInput}
                    onChange={(e) => setG4TypedInput(e.target.value)}
                    disabled={g4IsChecked}
                    className="w-full bg-white text-slate-900 font-mono font-bold text-lg rounded-xl px-4 py-3 border border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 focus:outline-hidden transition-all text-center placeholder-slate-300"
                    placeholder="Օրինակ՝ veintitrés"
                  />
                  <div className="flex justify-between text-4xs font-mono font-bold text-slate-400 uppercase tracking-widest px-1">
                    <span>Լեզու՝ ES</span>
                    <span>Չունի մեծատառի նշանակություն</span>
                  </div>
                </div>

                {/* Correct/Incorrect alert banner */}
                {g4IsChecked && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl flex items-start gap-4 max-w-md mx-auto text-xs ${
                      g4IsCorrect ? 'bg-emerald-50 text-emerald-950 border border-emerald-250' : 'bg-red-50 text-red-950 border border-red-250'
                    }`}
                  >
                    {g4IsCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-extrabold text-sm">{g4IsCorrect ? '🎉 ՀՐԱՇԱԼԻ Է, ճիշտ է:' : '❌ ՍԽԱԼ Է:'}</p>
                      <div className="space-y-1 mt-1 font-mono">
                        <p>Ձեր պատասխանը՝ <b>«{g4TypedInput || 'դատարկ'}»</b></p>
                        <p className="text-emerald-700">Ճիշտ արտահայտությունը՝ <b>«{numberToSpanish(g4Target)}»</b></p>
                        <p className="text-slate-400 text-3xs italic">Արտասանություն՝ [ {numberToArmPhonetic(g4Target)} ]</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submiter controllers */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  {!g4IsChecked ? (
                    <button
                      onClick={checkGame4}
                      disabled={!g4TypedInput.trim()}
                      className="px-6 py-3.5 bg-indigo-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      🧪 Ստուգել
                    </button>
                  ) : (
                    <button
                      onClick={initGame4}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Հաջորդ թիվը</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* GAME 5: MENTAL MATH WORDS CHALLENGE */}
            {activeGame === 5 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <span className="text-3xs uppercase tracking-widest font-mono font-black text-indigo-400">ԽՏԱՑՎԱԾ ԽԱՂ 5</span>
                  <h3 className="text-2xl font-black text-slate-900">🧮 Թվաբանական Խնդիրներ</h3>
                  <p className="text-xs text-slate-505 mt-1">
                    Լուծեք մաթեմատիկական հավասարումը, որտեղ թվերը գրված են բացառապես իսպաներեն բառերով:
                  </p>
                </div>

                {/* Calculations question board */}
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 px-4">
                  <span className="text-4xs text-slate-400 font-mono uppercase tracking-widest">ԹՎԱԲԱՆԱԿԱՆ ԳՈՐԾՈՂՈՒԹՅՈՒՆ</span>
                  <p className="text-lg md:text-xl font-mono font-extrabold text-indigo-950 max-w-xl mx-auto block break-words leading-relaxed">
                    {g5MathProblem.spanishQuestion}
                  </p>
                  <div className="inline-block bg-white border border-slate-200 px-3 py-1 rounded-lg text-3xs font-mono font-bold text-slate-500">
                    💡 Մաթեմատիկորեն՝ {g5MathProblem.text}
                  </div>
                </div>

                {/* Multiple choice grid */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto animate-fadeIn">
                  {g5MathProblem.options.map((opt, idx) => {
                    const isSelected = g5Selected === opt;
                    const isCorrect = opt === g5MathProblem.answer;
                    let statStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400';

                    if (g5IsChecked) {
                      if (isCorrect) {
                        statStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md';
                      } else if (isSelected) {
                        statStyle = 'bg-red-500 border-red-600 text-white shadow-md';
                      } else {
                        statStyle = 'bg-slate-100 border-slate-200 text-slate-300';
                      }
                    } else if (isSelected) {
                      statStyle = 'bg-indigo-900 border-indigo-700 text-white shadow-md';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => { if (!g5IsChecked) setG5Selected(opt); }}
                        disabled={g5IsChecked}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-98 ${statStyle}`}
                      >
                        <span className="font-mono font-bold text-sm md:text-base">{opt}</span>
                        <span className={`text-5xs font-mono font-bold block ${isSelected || (g5IsChecked && isCorrect) ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {numberToSpanish(opt)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Result banner explanation */}
                {g5IsChecked && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl flex items-start gap-4 max-w-md mx-auto text-xs ${
                      g5Selected === g5MathProblem.answer 
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-250' 
                        : 'bg-red-50 text-red-950 border border-red-250'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-sm block">
                        {g5Selected === g5MathProblem.answer ? '🎉 ՃԻՇՏ ՊԱՏԱՍԽԱՆ:' : '❌ ՍԽԱԼ ՊԱՏԱՍԽԱՆ:'}
                      </span>
                      <p className="mt-1">
                        Հավասարման լուծումն է՝ <b>{g5MathProblem.answer}</b>: <br />
                        Իսպաներեն թարգմանությունն է՝ <b>«{numberToSpanish(g5MathProblem.answer)}»</b>:
                      </p>
                      <p className="text-4xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                        Արտասանություն՝ [ {numberToArmPhonetic(g5MathProblem.answer)} ]
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Controllers */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  {!g5IsChecked ? (
                    <button
                      onClick={checkGame5}
                      disabled={g5Selected === null}
                      className="px-6 py-3.5 bg-indigo-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      🧪 Ստուգել
                    </button>
                  ) : (
                    <button
                      onClick={initGame5}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Հաջորդ հարցը</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* GAME 6: AUDIO LISTENING MATCH */}
            {activeGame === 6 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <span className="text-3xs uppercase tracking-widest font-mono font-black text-indigo-400">ԽՏԱՑՎԱԾ ԽԱՂ 6</span>
                  <h3 className="text-2xl font-black text-slate-900">🔊 Լսողական Թեստ</h3>
                  <p className="text-xs text-slate-505 mt-1">
                    Սեղմեք նվագարկման կոճակը, լսեք իսպաներենով արտասանվող թիվը և ընտրեք ճիշտ տարբերակը:
                  </p>
                </div>

                {/* Listen button container */}
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 flex flex-col items-center justify-center-905">
                  <span className="text-4xs text-slate-400 font-mono uppercase tracking-widest">ԼՍԵՔ ԱՈՒԴԻՈՆ</span>
                  <button
                    onClick={() => playSpanishAudio(numberToSpanish(g6Target))}
                    className="w-16 h-16 rounded-full bg-indigo-900 hover:bg-indigo-800 active:scale-95 text-white flex items-center justify-center cursor-pointer shadow-md border-b-4 border-indigo-700 hover:border-indigo-600/30 transition-all group"
                  >
                    <Volume2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-xs text-indigo-900 font-extrabold max-w-sm mx-auto">
                    Սեղմեք նախ բարձրախոսին՝ ձայնը լսելու համար:
                  </p>
                  
                  {/* Phonetic Fallback Guide Info for Sandbox Environments */}
                  <div className="max-w-xs mx-auto p-2 bg-slate-200/50 rounded-lg text-slate-500 text-4xs leading-normal">
                    💡 <b>Շշուկ-հուշում․</b> Եթե ձեր բրաուզերը չունի ձայնային սինթեզ, ապա արտասանությունը հայերեն տառերով կյանքի կկոչվի այսպես՝ <span className="font-bold underline text-slate-700 font-sans">[ {numberToArmPhonetic(g6Target)} ]</span>
                  </div>
                </div>

                {/* Grid Multiple Choice Options */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {g6Options.map((opt, idx) => {
                    const isSelected = g6Selected === opt;
                    const isCorrect = opt === g6Target;
                    let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400';

                    if (g6IsChecked) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md';
                      } else if (isSelected) {
                        optionStyle = 'bg-red-500 border-red-600 text-white shadow-md';
                      } else {
                        optionStyle = 'bg-slate-100 border-slate-200 text-slate-300';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-indigo-900 border-indigo-700 text-white shadow-md';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => { if (!g6IsChecked) setG6Selected(opt); }}
                        disabled={g6IsChecked}
                        className={`p-4 rounded-2xl border font-mono font-bold text-lg text-center transition-all active:scale-98 cursor-pointer ${optionStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {g6IsChecked && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl flex items-start gap-4 max-w-md mx-auto text-xs ${
                      g6Selected === g6Target 
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-250' 
                        : 'bg-red-50 text-red-950 border border-red-250'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-sm block">
                        {g6Selected === g6Target ? '🎉 ՄԱՔՈՒՐ ԼՍՈՂՈՒԹՅՈՒՆ, ճիշտ է:' : '❌ ՍԽԱԼ ՊԱՏԱՍԽԱՆ:'}
                      </span>
                      <p className="mt-1 text-slate-700 font-mono">
                        Արտասանված թիվը՝ <b>{g6Target}</b> = <b>{numberToSpanish(g6Target)}</b> <br />
                        <span className="text-slate-400 text-3xs italic">({numberToArmPhonetic(g6Target)})</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Control Footer check buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  {!g6IsChecked ? (
                    <button
                      onClick={checkGame6}
                      disabled={g6Selected === null}
                      className="px-6 py-3.5 bg-indigo-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      🧪 Ստուգել
                    </button>
                  ) : (
                    <button
                      onClick={initGame6}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Հաջորդ ձայնը</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
