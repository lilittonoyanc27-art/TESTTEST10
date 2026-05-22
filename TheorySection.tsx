import React, { useState } from 'react';
import { motion } from 'motion/react';
import { numberToSpanish, numberToArmPhonetic, numberToArm } from './numberTranslator';
import { BookOpen, Search, Volume2, Sparkles, Award, Lightbulb, Check, ShieldAlert } from 'lucide-react';

export default function TheorySection() {
  const [explorerVal, setExplorerVal] = useState<number>(125);
  const [activeTab, setActiveTab] = useState<'basics' | 'tens' | 'hundreds' | 'thousands' | 'accents'>('basics');
  const [speakSuccess, setSpeakSuccess] = useState<boolean>(false);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Clear previous speaks
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85; // slightly slower for language learners
      window.speechSynthesis.speak(utterance);
      setSpeakSuccess(true);
      setTimeout(() => setSpeakSuccess(false), 800);
    } else {
      alert('Ձեր բրաուզերը չի աջակցում ձայնային արտասանությունը։');
    }
  };

  const handleExplorerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val >= 1 && val <= 3000) {
        setExplorerVal(val);
      }
    } else {
      setExplorerVal(1);
    }
  };

  return (
    <div className="space-y-8" id="theory-section-container">
      {/* 1. Interactive Explorer Header Box */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="flex items-center gap-3 justify-center">
            <div className="p-2 bg-indigo-500/30 text-indigo-300 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xs font-bold font-mono tracking-widest text-indigo-200 uppercase">
              Ինտերակտիվ թվային լաբորատորիա
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-center tracking-tight font-display">
            📟 Թվերի ակնթարթային թարգմանիչ
          </h2>
          <p className="text-zinc-300 text-center text-xs md:text-sm max-w-xl mx-auto">
            Մուտքագրեք ցանկացած թիվ <b>1-ից մինչև 3000</b> և տեսեք, թե ինչպես է այն գրվում իսպաներեն, ինչպես է արտասանվում (հայատառ տառադարձությամբ) և ինչպես է թարգմանվում հայերեն։
          </p>

          {/* Interactive Input widget */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-2xl max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="number"
                min="1"
                max="3000"
                value={explorerVal || ''}
                onChange={handleExplorerChange}
                className="w-full bg-black/20 focus:bg-black/40 text-white font-mono font-bold text-lg rounded-xl pl-12 pr-4 py-3 placeholder-white/30 border border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 focus:outline-hidden transition-all text-center sm:text-left"
                placeholder="Օրինակ՝ 1542"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setExplorerVal(Math.floor(Math.random() * 3000) + 1)}
                className="w-full sm:w-auto px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                🎲 Պատահական
              </button>
            </div>
          </div>

          {/* Live Translation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Spanish Written Out */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/10 transition-all text-center">
              <div>
                <span className="text-3xs font-mono font-bold text-indigo-300 uppercase tracking-widest block mb-2">
                  🇪🇸 Իսպաներեն գրելաձևը
                </span>
                <p className="text-lg md:text-xl font-mono font-extrabold text-white tracking-tight break-words">
                  {numberToSpanish(explorerVal)}
                </p>
              </div>
              <button
                onClick={() => handleSpeak(numberToSpanish(explorerVal))}
                className={`mt-4 mx-auto px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer ${
                  speakSuccess 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{speakSuccess ? 'Արտասանվում է...' : 'Լսել հնչյունը'}</span>
              </button>
            </div>

            {/* Armenian Phonetics */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/10 transition-all text-center">
              <div>
                <span className="text-3xs font-mono font-bold text-emerald-300 uppercase tracking-widest block mb-2">
                  🇦🇲 Հայատառ արտասանություն
                </span>
                <p className="text-lg md:text-xl font-sans font-extrabold text-emerald-200 tracking-tight break-words">
                  {numberToArmPhonetic(explorerVal)}
                </p>
              </div>
              <p className="text-4xs text-zinc-400 italic mt-4 font-sans leading-snug">
                Կարդացեք հայերեն տառերով՝ իսպանական ճիշտ առոգանությունը ստանալու համար։
              </p>
            </div>

            {/* Armenian Translation */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/10 transition-all text-center">
              <div>
                <span className="text-3xs font-mono font-bold text-amber-300 uppercase tracking-widest block mb-2">
                  🇦🇲 Հայերեն թարգմանություն
                </span>
                <p className="text-lg md:text-xl font-sans font-extrabold text-amber-100 tracking-tight break-words">
                  {numberToArm(explorerVal)}
                </p>
              </div>
              <div className="text-4xs text-amber-200/50 uppercase font-mono tracking-wider mt-4">
                Թիվը՝ {explorerVal}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Rule explanation tabs */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6 font-display flex items-center gap-2">
          <BookOpen className="text-indigo-600 w-6 h-6" />
          <span>📖 Իսպաներենի թվականների կազմության կանոնները</span>
        </h3>

        {/* Navigation for rules */}
        <div className="flex flex-wrap border-b border-slate-200 gap-1 mb-8">
          {[
            { id: 'basics', label: '1 - 29 (Պարզ և Անկանոն)' },
            { id: 'tens', label: '30 - 99 (Տասնավորներ)' },
            { id: 'hundreds', label: '100 - 999 (Հարյուրներ)' },
            { id: 'thousands', label: '1000 - 3000 (Հազարներ)' },
            { id: 'accents', label: '✍️ Շեշտադրման օրենքներ' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs md:text-sm font-bold transition-all relative border-b-2 -mb-px hover:text-indigo-600 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-extrabold'
                  : 'border-transparent text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content with interactive explanation cards */}
        <div className="space-y-6">
          {activeTab === 'basics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl text-indigo-950 text-xs md:text-sm leading-relaxed">
                <b>💡 Կարևորագույն հիմքը:</b> 1-ից 29 թվերը իսպաներենում գրվում են <b>մեկ բառով</b>։ Սա շատ կարևոր է, քանի որ 30-ից սկսած տասնավորներն ու միավորները գրվելու են առանձին բառերով:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-2 text-indigo-700">
                    🔹 1-ից 15 թվերը (Լիովին Յուրահատուկ)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Այս թվերը պետք է անգիր սովորել, քանի որ դրանք չեն ենթարկվում ընդհանուր կանոններին։
                  </p>
                  <table className="w-full text-xs text-slate-700">
                    <tbody>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">11 - once</td><td className="text-slate-400 font-mono">[ոնսե]</td><td className="text-slate-900 font-bold">տասնմեկ</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">12 - doce</td><td className="text-slate-400 font-mono">[դոսե]</td><td className="text-slate-900 font-bold">տասներկու</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">13 - trece</td><td className="text-slate-400 font-mono">[տրեսե]</td><td className="text-slate-900 font-bold">տասներեք</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">14 - catorce</td><td className="text-slate-400 font-mono">[կատորսե]</td><td className="text-slate-900 font-bold">տասնչորս</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">15 - quince</td><td className="text-slate-400 font-mono">[կինսե]</td><td className="text-slate-900 font-bold">տասնհինգ</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-2 text-indigo-700">
                    🔹 16-ից 19 և 21-ից 29 (Մեկ բառով միացում)
                  </h4>
                  <p className="text-xs text-slate-500">
                    16-ից 19 թվերը կազմվում են <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 text-3xs font-mono">dieci + [միավոր]</code> կառույցով։ Վերջանում են մեկ բառով։<br />
                    21-ից 29 թվերը կազմվում են <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 text-3xs font-mono">veinti + [միավոր]</code> կառույցով։ <b>Veinte (20)</b> բառի «e» տառը վերածվում է «i»-ի։
                  </p>
                  <table className="w-full text-xs text-slate-700">
                    <tbody>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">16 - dieciséis</td><td className="text-slate-400 font-mono">[դիեսիսեյս]</td><td className="text-indigo-600 italic">ուշադրություն շեշտին!</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">22 - veintidós</td><td className="text-slate-400 font-mono">[վեյնտիդոս]</td><td className="text-indigo-600 italic">ուշադրություն շեշտին!</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold pr-4">25 - veinticinco</td><td className="text-slate-400 font-mono">[վեյնտիսինկո]</td><td>քսանհինգ</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tens' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl text-indigo-950 text-xs md:text-sm leading-relaxed">
                <b>💡 «y» սկզբունքը (եվ):</b> 31-ից մինչև 99 թվերը կազմվում են <b>3 առանձին բառերով</b>՝ <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-900 font-mono text-3xs">[Տասնավոր] + y + [Միավոր]</code>։<br />
                Օրինակ՝ <b>32 - treinta y dos</b> (երեսուն և երկու)։ <b>y</b> տառը արտասանվում է որպես <b>«ի»</b>։
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-2xl p-5">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4 text-emerald-700">
                    🔸 Տասնավորների հիմնական բառերը
                  </h4>
                  <table className="w-full text-xs text-slate-700">
                    <tbody>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">30 - treinta</td><td className="text-slate-400">[տրեյնտա]</td><td>երեսուն</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">40 - cuarenta</td><td className="text-slate-400">[կուարենտա]</td><td>քառասուն</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">50 - cincuenta</td><td className="text-slate-400">[սինկուենտա]</td><td>հիսուն</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">60 - sesenta</td><td className="text-slate-400">[սեսենտա]</td><td>վաթսուն</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">70 - setenta</td><td className="text-slate-400">[սետենտա]</td><td>յոթանասուն</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">80 - ochenta</td><td className="text-slate-400">[ոչենտա]</td><td>ութսուն</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">90 - noventa</td><td className="text-slate-400">[նովենտա]</td><td>իննսուն</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-2 text-emerald-700">
                    🔸 Կազմության օրինակներ
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ուշադրություն. <b>y</b> շաղկապը օգտագործվում է միայն տասնավորների և միավորների միջև։ Այն երբեք չի օգտագործվում հարյուրավորների և տասնավորների միջև (օր.՝ 135-ը «ciento treinta y cinco» է, ոչ թե «ciento y treinta y cinco»)!
                  </p>
                  <div className="space-y-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs flex justify-between">
                      <span className="font-mono font-bold text-slate-800">32 - treinta y dos</span>
                      <span className="text-slate-500">[տրեյնտա ի դոս]</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs flex justify-between">
                      <span className="font-mono font-bold text-slate-800">55 - cincuenta y cinco</span>
                      <span className="text-slate-500">[սինկուենտա ի սինկո]</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs flex justify-between">
                      <span className="font-mono font-bold text-slate-800">89 - ochenta y nueve</span>
                      <span className="text-slate-500">[ոչենտա ի նուևե]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hundreds' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl text-indigo-950 text-xs md:text-sm leading-relaxed">
                <b>💡 Cien, թե՞ Ciento.</b> Իսպաներենում ճշգրիտ 100 թիվը կոչվում է <b>cien</b>: Բայց եթե դրան հաջորդում է այլ թիվ (թեկուզ 101), այն դառնում է <b>ciento</b>.
                <br />
                Օրինակ՝ 100 = <b>cien</b>, բայց 105 = <b>ciento cinco</b>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-2xl p-5">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4 text-amber-700">
                    🟡 Հարյուրավորների կազմությունը
                  </h4>
                  <p className="text-xs text-slate-500 mb-2">
                    Շատ հարյուրավորներ պարզապես միավորի և «cientos» բառի միացումն են (օր.՝ trescientos): Բայց կան <b>3 կարևոր անկանոն ձևեր</b>!
                  </p>
                  <table className="w-full text-xs text-slate-705">
                    <tbody>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">100 - cien / ciento</td><td>սիեն / սիենտո</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">200 - doscientos</td><td>դոսսիենտոս</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">300 - trescientos</td><td>տրեսսիենտոս</td></tr>
                      <tr className="border-b border-slate-100 py-1.5 text-rose-700 font-bold bg-rose-50/50"><td className="font-mono pr-4">500 - quinientos (Անկանոն!)</td><td>կինիենտոս</td></tr>
                      <tr className="border-b border-slate-100 py-1.5"><td className="font-mono font-bold">600 - seiscientos</td><td>սեյսսիենտոս</td></tr>
                      <tr className="border-b border-slate-100 py-1.5 text-rose-700 font-bold bg-rose-50/50"><td className="font-mono pr-4">700 - setecientos (Անկանոն!)</td><td>սետեսիենտոս (ոչ թե sietecientos)</td></tr>
                      <tr className="border-b border-slate-100 py-1.5 bg-rose-50/50 text-rose-700 font-bold"><td className="font-mono pr-4">900 - novecientos (Անկանոն!)</td><td>նովեսիենտոս (ոչ թե nuevecientos)</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-2 text-amber-700">
                    🟡 Գենդերային համաձայնություն (Իգական ձևեր)
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    Իսպաներենում հարյուրավորներից սկսած թվերը համաձայնում են գոյականի սեռի հետ: Եթե հաջորդում է իգական սեռի գոյական, <b>-ientos</b> վերջավորությունը դառնում է <b>-ientas</b>:<br />
                    • <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono text-3xs">doscientos chicos</code> (երկու հարյուր տղա)<br />
                    • <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono text-3xs">doscientas chicas</code> (երկու հարյուր աղջիկ)
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <p className="text-2xs font-extrabold text-slate-400 uppercase font-mono tracking-widest">Կոմբինացված օրինակ՝</p>
                    <div className="text-xs">
                      <b>541</b> = <b>quinientos cuarenta y uno</b> <br />
                      <span className="text-slate-400 font-mono text-3xs">[կինիենտոս կուարենտա ի ունո]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'thousands' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl text-indigo-950 text-xs md:text-sm leading-relaxed">
                <b>💡 Mil-ի պարզությունը.</b> Իսպաներենում 1000 թիվը կոչվում է պարզապես <b>mil</b>: Հոգնակի ձև չունի թվարկելիս: Օրինակ՝ 2000 = <b>dos mil</b>, 3000 = <b>tres mil</b>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-rose-700">
                    🔴 Մեծ թվերի հավաքում
                  </h4>
                  <p className="text-xs text-slate-500">
                    Որպեսզի հավաքեք 1000-ից մինչև 3000 թվերը, պարզապես տեղադրեք հազարները, ապա հարյուրները, տասնավորները և միավորները՝ առանց որևէ ավելորդ կապերի:
                  </p>
                  <div className="space-y-3 font-sans">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="text-slate-900 font-mono font-bold text-xs">1995</div>
                      <div className="text-indigo-900 font-bold text-sm">mil novecientos noventa y cinco</div>
                      <div className="text-slate-400 text-3xs font-mono">[միլ նովեսիենտոս նովենտա ի սինկո]</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="text-slate-900 font-mono font-bold text-xs">2026</div>
                      <div className="text-indigo-950 font-bold text-sm">dos mil veintiséis</div>
                      <div className="text-slate-400 text-3xs font-mono">[դոս միլ վեյնտիսեյս]</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="text-slate-900 font-mono font-bold text-xs">3000</div>
                      <div className="text-indigo-900 font-bold text-sm">tres mil</div>
                      <div className="text-slate-400 text-3xs font-mono">[տրես միլ]</div>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-rose-700">
                    ⚠️ Կարևոր զգուշացում
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    Անգլերենում հաճախ ասում են "nineteen eighty-five" (19-85) տարեթվերի համար։ Իսպաներենում սա <b>խստիվ արգելված է</b>: Միշտ պետք է ասել ամբողջական թիվը՝ "mil novecientos..." (մեկ հազար իննը հարյուր)։
                  </p>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs flex gap-3 text-amber-900">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-extrabold block">Արգելված է՝</span>
                      <span className="font-mono italic line-through text-slate-400">diecinueve ochenta y cinco (19 85)</span>
                      <span className="font-extrabold block mt-2 text-emerald-800">Ճիշտ տարբերակը՝</span>
                      <span className="font-mono font-bold text-emerald-700">mil novecientos ochenta y cinco</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Added 1000-3000 Detailed Reference Table */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
                  <h4 className="font-extrabold text-sm md:text-base text-slate-900 uppercase tracking-wider">
                    📊 1000 - 3000 Թվերի Հաշվարկման և Կազմության Գործնական Աղյուսակ
                  </h4>
                </div>
                <p className="text-xs text-slate-600">
                  Հասկանալու համար, թե ինչպես են կազմվում 1000-ից մինչև 3000 բոլոր միջնակայքի թվերը, ուսումնասիրեք այս համապարփակ աղյուսակը։ Իսպաներենում թվերը կազմվում են ձախից աջ՝ հերթով միացնելով բաղադրիչները։
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse bg-white rounded-xl shadow-xs overflow-hidden border border-slate-250">
                    <thead>
                      <tr className="bg-indigo-900 text-white font-sans text-xs uppercase tracking-wider">
                        <th className="p-3 text-center w-16">Թիվ</th>
                        <th className="p-3">Իսպաներեն գրելաձևը</th>
                        <th className="p-3">Հայատառ արտասանություն</th>
                        <th className="p-3">Կազմության բանաձև / Բացատրություն</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-slate-705 divide-y divide-slate-100">
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="p-3 font-mono font-extrabold text-slate-900 text-center bg-slate-50">1000</td>
                        <td className="p-3 font-mono font-bold text-rose-700">mil</td>
                        <td className="p-3 text-slate-500">[միլ]</td>
                        <td className="p-3 font-sans font-medium text-slate-600">Հիմնական հազարյակը։ Երբեք մի՛ ասեք «un mil»։ Պարզապես <b>mil</b>։</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="p-3 font-mono font-extrabold text-slate-900 text-center bg-slate-50">1001-1099</td>
                        <td className="p-3 font-mono font-bold text-indigo-900">mil [միավոր/տասնավոր]</td>
                        <td className="p-3 text-slate-500">[միլ ...]</td>
                        <td className="p-3 font-sans text-slate-600">
                          <b>mil + թիվ</b> (առանց "y"-ի)։ <br />
                          Օրինակ՝ <span className="font-mono text-indigo-600">1005 (mil cinco)</span>, <span className="font-mono text-indigo-600">1030 (mil treinta)</span>, <span className="font-mono text-indigo-600">1099 (mil noventa y nueve)</span>։
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="p-3 font-mono font-extrabold text-slate-900 text-center bg-slate-50">1100</td>
                        <td className="p-3 font-mono font-bold text-indigo-900">mil cien</td>
                        <td className="p-3 text-slate-500">[միլ սիեն]</td>
                        <td className="p-3 font-sans text-slate-600">Ուշադիր եղեք. 100-ը դառնում է <b>cien</b>, քանի որ կլոր հարյուրյակ է։</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="p-3 font-mono font-extrabold text-slate-900 text-center bg-slate-50">1101-1999</td>
                        <td className="p-3 font-mono font-bold text-indigo-900">mil ciento [թիվ]</td>
                        <td className="p-3 text-slate-500">[միլ սիենտո ...]</td>
                        <td className="p-3 font-sans text-slate-600">
                          <b>mil + ciento + հաջորդ թվերը</b>։<br />
                          Օրինակ՝ <span className="font-mono text-indigo-600">1150 (mil ciento cincuenta)</span>, <span className="font-mono text-indigo-600">1500 (mil quinientos)</span>, <span className="font-mono text-indigo-600">1821 (mil ochocientos veintiuno)</span>։
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors bg-amber-50/20">
                        <td className="p-3 font-mono font-extrabold text-amber-900 text-center bg-amber-50/30">2000</td>
                        <td className="p-3 font-mono font-bold text-rose-700">dos mil</td>
                        <td className="p-3 text-slate-500">[դոս միլ]</td>
                        <td className="p-3 font-sans font-medium text-slate-600">2 + 1000. <b>Mil</b> բառը չի ստանում հոգնակի վերջավորություն (ոչ թե «dos miles»)։</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="p-3 font-mono font-extrabold text-slate-900 text-center bg-slate-50">2001-2099</td>
                        <td className="p-3 font-mono font-bold text-indigo-900">dos mil [թիվ]</td>
                        <td className="p-3 text-slate-500">[դոս միլ ...]</td>
                        <td className="p-3 font-sans text-slate-600">
                          <b>dos mil + թիվ</b>։<br />
                          Օրինակ՝ <span className="font-mono text-indigo-600">2015 (dos mil quince)</span>, <span className="font-mono text-indigo-600">2026 (dos mil veintiséis)</span>, <span className="font-mono text-indigo-600">2080 (dos mil ochenta)</span>։
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="p-3 font-mono font-extrabold text-slate-900 text-center bg-slate-50">2100-2999</td>
                        <td className="p-3 font-mono font-bold text-indigo-900">dos mil [հարյուրավորներ] [թիվ]</td>
                        <td className="p-3 text-slate-500">[դոս միլ ...]</td>
                        <td className="p-3 font-sans text-slate-600">
                          <b>dos mil + հարյուրավոր + մնացածը</b>։<br />
                          Օրինակ՝ <span className="font-mono text-indigo-600">2200 (dos mil doscientos)</span>, <span className="font-mono text-indigo-600">2545 (dos mil quinientos cuarenta y cinco)</span>, <span className="font-mono text-indigo-600">2999 (dos mil novecientos noventa y nueve)</span>։
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors bg-emerald-50/20">
                        <td className="p-3 font-mono font-extrabold text-emerald-900 text-center bg-emerald-50/30">3000</td>
                        <td className="p-3 font-mono font-bold text-emerald-800">tres mil</td>
                        <td className="p-3 text-slate-500">[տրես միլ]</td>
                        <td className="p-3 font-sans text-slate-600">3 + 1000. Մեր ուսումնական ծրագրի առավելագույն սահմանաչափը։</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-sans space-y-1.5">
                  <span className="font-bold text-sm block">💡 Ինչպե՞ս հաշվել ցանկացած թիվ 1000-ից մինչև 3000.</span>
                  <p className="leading-relaxed">
                    1. Որոշե՛ք հազարյակը (<b>mil</b> կամ <b>dos mil</b>)։ <br />
                    2. Որոշե՛ք հարյուրյակը (<b>ciento / doscientos / quinientos ...</b>)։ <br />
                    3. Ավելացրե՛ք տասնավորը (<b>treinta / cuarenta ...</b>)։ <br />
                    4. Եթե կա միավոր, 31-99 միջև դրե՛ք <b>y</b> շաղկապը, ապա միավորը (<b>y uno / y dos / y tres ...</b>)։ <br />
                    <b>Օրինակ՝ 2753-ը հաշվարկվում է այսպես.</b> <span className="font-bold text-indigo-700">dos mil</span> (2000) + <span className="font-bold text-indigo-700">setecientos</span> (700) + <span className="font-bold text-indigo-700">cincuenta y tres</span> (53) = <span className="font-mono font-bold text-rose-700">dos mil setecientos cincuenta y tres</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accents' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl text-indigo-950 text-xs md:text-sm leading-relaxed">
                <b>✍️ Գրավոր շեշտերը (Tildes):</b> Որոշ միակցված թվեր իսպաներենում ստանում են գրավոր շեշտ (<b>´</b>) վերջին տառի վրա, քանի որ միացման արդյունքում փոխվում է վերջին վանկի արտասանական շեշտադրության կանոնը (իսպաներեն քերականության <i>palabras agudas</i> կանոնով):
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-slate-800">
                  🎯 Թվեր, որոնք ունեն պարտադիր գրավոր շեշտադրություն՝
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-mono font-bold text-indigo-600 text-base">dieciséis (16)</span>
                    <p className="text-xs text-slate-600">Շեշտը ընկնում է «e» տառի վրա: (ոչ թե dieciseis)</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-mono font-bold text-indigo-600 text-base">veintidós (22)</span>
                    <p className="text-xs text-slate-600">Շեշtը ընկնում է «o» տառի վրա: (ոչ թե veintidos)</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-mono font-bold text-indigo-600 text-base">veintitrés (23)</span>
                    <p className="text-xs text-slate-600">Շեշտը ընկնում է «e» տառի վրա: (ոչ թե veintitres)</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-mono font-bold text-indigo-600 text-base">veintiséis (26)</span>
                    <p className="text-xs text-slate-600">Շեշտը ընկնում է «e» տառի վրա: (ոչ թե veintiseis)</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/50 text-emerald-950 text-xs flex gap-2">
                  <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="leading-relaxed">
                    <b>💡 Խաղային հուշում․</b> Մեր գրավոր խաղերում (Օրինակ՝ «Գրիր թիվը իսպաներեն»), ուշադրություն դարձրեք այս շեշտերին։ Ճիշտ շեշտով գրելը կտա ձեզ լրացուցիչ միավորներ և կապահովի անթերի գրագիտություն։
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
