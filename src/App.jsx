import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- 1. BACKGROUND DECOR (Floating Sushi + Hearts) ---
const FloatingDecor = ({ density = 20 }) => {
  const items = useMemo(() => {
    const choices = ['🍣', '🥢', '🍱', '❤️', '💗', '💞', '✨'];
    const rand = (min, max) => min + Math.random() * (max - min);

    return Array.from({ length: density }).map((_, i) => {
      const size = rand(18, 48);
      const left = rand(0, 100);
      const top = rand(0, 100);
      const duration = rand(8, 16);
      const delay = rand(0, 6);
      const drift = rand(18, 70);
      const spin = rand(-20, 20);
      const emoji = choices[Math.floor(Math.random() * choices.length)];
      return { id: i, size, left, top, duration, delay, drift, spin, emoji };
    });
  }, [density]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {items.map((it) => (
        <motion.div
          key={it.id}
          className="floating-emoji"
          style={{ left: `${it.left}%`, top: `${it.top}%`, fontSize: it.size }}
          initial={{ opacity: 0, y: 10, rotate: it.spin }}
          animate={{
            opacity: [0, 0.85, 0.85, 0],
            y: [0, -it.drift, -it.drift * 1.5],
            x: [0, it.drift * 0.25, -it.drift * 0.15],
            rotate: [it.spin, it.spin + 30, it.spin - 20],
          }}
          transition={{
            duration: it.duration,
            delay: it.delay,
            repeat: Infinity,
            repeatDelay: 0.001,
            ease: 'easeInOut',
          }}
        >
          {it.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// --- 2. SUSHI BACKGROUND (Conveyor Belt ONLY - No Text) ---
const SushiBackground = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mb-6 pointer-events-none opacity-80">
      {/* The Conveyor Belt Background Strip */}
      <div className="absolute inset-0 conveyor-belt h-20 top-1/2 -translate-y-1/2" />
      
      {/* Decorative Chopsticks & Sparkles only */}
      <div className="absolute -top-6 left-6 chopsticks opacity-90" />
      <div className="absolute -bottom-6 right-10 chopsticks chopsticks-right opacity-90" />
      <div className="absolute -top-8 right-20 text-3xl animate-wiggle">✨</div>
      <div className="absolute -bottom-10 left-20 text-3xl animate-wiggle">💞</div>
    </div>
  );
};

// --- 3. ELEGANT TITLE (Typography for Panel) ---
const ElegantTitle = ({ text, delay = 0 }) => (
  <div className="elegant-titleWrap">
    <motion.h1
      className="elegant-title"
      initial={{ opacity: 0, y: 10, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.75, ease: 'easeOut', delay }}
    >
      {text}
    </motion.h1>

    <motion.div
      className="elegant-underline"
      initial={{ scaleX: 0, opacity: 0.7 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: delay + 0.2 }}
      style={{ transformOrigin: 'center' }}
    />
  </div>
);

// --- 4. ENVELOPE INTRO ANIMATION (FIXED) ---
const EnvelopeIntro = ({ onDone, titleText, subText }) => {
  const burst = useMemo(() => {
    const emojis = ['💗', '💞', '❤️', '🍣', '✨'];
    const count = 12;
    const rand = (min, max) => min + Math.random() * (max - min);

    return Array.from({ length: count }).map((_, i) => {
      const angle = rand(-Math.PI, Math.PI); 
      const radius = rand(100, 180);
      return {
        id: i,
        emoji: emojis[i % emojis.length],
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        r: rand(-20, 20),
        delay: rand(0, 0.2),
      };
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="envelope-scene">
      {/* A. The Envelope */}
      <motion.div
        className="envelope"
        initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        <div className="pocket" />
        <motion.div
          className="flap"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 180 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
        />
      </motion.div>

      {/* B. The Card (Slides UP from envelope center) */}
      <motion.div
        className="letterCard"
        initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
        animate={{ opacity: 1, scale: 1, x: '-50%', y: 'calc(-50% - 140px)' }}
        exit={{ opacity: 0, x: '-50%', y: 'calc(-50% - 160px)' }}
        transition={{ duration: 0.8, delay: 1.2, ease: "backOut" }}
      >
        <div className="text-5xl">💌</div>
      </motion.div>

      {/* C. The Burst */}
      <div className="burst-container">
        {burst.map((p) => (
          <motion.div
            key={p.id}
            className="burstItem"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: 1.5, rotate: p.r }}
            transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- 5. MAIN COMPONENT ---
const ValentineSite = () => {
  const [stage, setStage] = useState('loading');
  const [noButtonPos, setNoButtonPos] = useState({});
  const [introDone, setIntroDone] = useState(false);

  const doorDashURL = "https://www.doordash.com";

  useEffect(() => {
    const timer = setTimeout(() => setStage('ask'), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage === 'ask') setIntroDone(false);
  }, [stage]);

  const moveButton = () => {
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 100);
    setNoButtonPos({ position: 'fixed', left: `${x}px`, top: `${y}px`, zIndex: 999 });
  };

  const handleYes = () => {
    setStage('yes');
    const end = Date.now() + 5000;
    const colors = ['#FF0000', '#FF69B4', '#FFB6C1', '#FFFFFF'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleBack = () => {
    setStage('ask');
    setNoButtonPos({});
    setIntroDone(false);
  };

  return (
    <div className={`min-h-screen w-full select-none overflow-hidden ${stage === 'yes' ? 'heart-cursor' : 'sushi-cursor'}`}>
      <FloatingDecor />
      <AnimatePresence mode="wait">

        {/* --- STAGE 1: LOADING --- */}
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-screen bg-[#FFB6C1] relative z-10"
          >
            <div className="text-9xl animate-heartbeat">🍣</div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-white text-2xl font-bold tracking-widest uppercase"
            >
              Rolling something up...
            </motion.h2>
          </motion.div>
        )}

        {/* --- STAGE 2: THE ASK --- */}
        {stage === 'ask' && (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-screen relative z-10 p-4"
          >
            {/* Show envelope animation FIRST, then switch to static content */}
            <AnimatePresence mode="wait">
              {!introDone ? (
                <motion.div
                  key="envelope-intro"
                  className="w-full h-full flex items-center justify-center"
                  exit={{ opacity: 0 }}
                >
                  <EnvelopeIntro
                    onDone={() => setIntroDone(true)}
                    titleText="Will you be my Valentine?"
                    subText="Online version because I couldn't visit 🍣"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="static-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex flex-col items-center"
                >

                  {/* Main Interactive Area */}
                  <div className="relative flex items-center justify-center w-full h-[300px] mb-12">
                    <div className="messagePanel static-panel">
                      <ElegantTitle text="Will you be my Valentine?" delay={0} />
                      <div className="title-sub">Online version because I couldn't visit 🍣</div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col items-center gap-8 mt-4">
                    <a
                      href={doorDashURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-[#D2042D] px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-3 text-lg hover:scale-105 transition-transform"
                    >
                      🍣 Open for a surprise... 
                    </a>

                    <div className="flex gap-10">
                      <button
                        onClick={handleYes}
                        className="bg-[#FFB6C1] hover:bg-white hover:text-[#D2042D] text-white px-12 py-5 rounded-2xl text-3xl font-black shadow-2xl transition-all active:scale-95"
                      >
                        YES
                      </button>

                      <button
                        onMouseEnter={moveButton}
                        style={noButtonPos}
                        className="bg-gray-100 text-gray-400 px-8 py-3 rounded-xl text-xl font-bold opacity-80"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* --- STAGE 3: SUCCESS --- */}
        {stage === 'yes' && (
          <motion.div
            key="yes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#FF1493] to-[#FF69B4] text-white overflow-hidden"
          >
            <button onClick={handleBack} className="back-btn">← Back</button>
            <div className="sparkle-overlay" />
            
            <motion.div
              initial={{ y: 50, rotate: -5 }}
              animate={{ y: 0, rotate: 2 }}
              className="z-10 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-sm border-[12px] border-white"
            >
              <div className="w-72 h-96 bg-gray-200 overflow-hidden relative">
                <img
                  src="/MonishaValentine.png"
                  alt="Us"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=Your+Happy+Photo"; }}
                />
              </div>
              <p style={{ fontFamily: "'Dancing Script', cursive" }} className="text-[#D2042D] text-center mt-6 text-3xl font-bold">
                I love you! ❤️
              </p>
            </motion.div>

            <motion.h2
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="z-10 mt-12 text-4xl font-black text-white drop-shadow-md text-center px-4"
            >
              Enjoy your Sushi! 🍣
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValentineSite;