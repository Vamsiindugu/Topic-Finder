import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, animate, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Heart, Share2, RotateCcw, X, Target, Zap, MessageCircle, HelpCircle, ArrowLeftRight } from 'lucide-react';

import { CATEGORIES, QUESTIONS, Question, Category } from './data';

// --- COMPONENTS ---

// 1. Cinematic Background Spotlight (Optimized to bypass React state updates on mouse move)
const AmbientBackground = React.memo(() => {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  
  // Apply a smooth spring to the motion values directly
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Direct mutation of motion values (does not trigger React re-render)
      mouseX.set(e.clientX - 400);
      mouseY.set(e.clientY - 400);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-[#09090b]" /> {/* Deep charcoal base */}
      
      {/* Dynamic Cursor Spotlight */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(0,0,0,0) 70%)',
          x: smoothX,
          y: smoothY,
          left: 0,
          top: 0
        }}
      />
      
      {/* Static Ambiance */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
});

// 2. The Abstract Wheel Interface
interface KineticWheelProps {
  isSpinning: boolean;
  onSpinComplete: (result: { status: 'started' } | { status: 'finished', question: Question }) => void;
  activeCategory: Category | 'All';
  history: string[];
}

const KineticWheel: React.FC<KineticWheelProps> = ({ isSpinning, onSpinComplete, activeCategory, history }) => {
  const rotation = useMotionValue(0);

  // Physical flapper sync: Uses the wheel's exact rotation to simulate pegs hitting the pointer
  const pointerRotate = useTransform(rotation, (val) => {
    const slice = (val % 30 + 30) % 30; // Each slice is 30 degrees
    // As a peg approaches (22 to 30 deg), it pushes the flapper left
    if (slice >= 22 && slice < 30) {
        return ((slice - 22) / 8) * -22;
    } 
    // After the peg passes (0 to 4 deg), it springs back to center
    else if (slice >= 0 && slice < 4) {
        return -22 + (slice / 4) * 22;
    }
    return 0; // Resting in the middle of a slice
  });

  const pointerY = useTransform(rotation, (val) => {
    const slice = (val % 30 + 30) % 30;
    if (slice >= 22 && slice < 30) {
        return ((slice - 22) / 8) * -4; // Lift slightly as it bends
    } else if (slice >= 0 && slice < 4) {
        return -4 + (slice / 4) * 4; // Drop back
    }
    return 0;
  });

  const triggerSpin = async () => {
    if (isSpinning) return;
    
    // Filter questions
    const available = QUESTIONS.filter(q => 
      (activeCategory === 'All' || q.category === activeCategory) && 
      !history.includes(q.id)
    );
    
    // Fallback if all used
    const pool = available.length > 0 ? available : QUESTIONS.filter(q => activeCategory === 'All' || q.category === activeCategory);
    if (pool.length === 0) return; // Should not happen with 'All' fallback

    const selectedQuestion = pool[Math.floor(Math.random() * pool.length)];
    
    // Physics Simulation Constants
    const minSpins = 6;
    const maxSpins = 9;
    const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    
    // Use the current accumulated rotation instead of a reset state
    const currentRot = rotation.get();
    const baseRotation = currentRot - (currentRot % 360);
    const randomSliceIndex = Math.floor(Math.random() * 12);
    
    // Add new spins on top of the current accumulated rotation
    const targetRotation = baseRotation + 360 + (360 * randomSpins) + (randomSliceIndex * 30) + 15;
    
    onSpinComplete({ status: 'started' });

    // Custom physical easing curve (momentum + heavy friction)
    animate(rotation, targetRotation, {
      duration: 4.5,
      ease: [0.2, 0.9, 0.1, 1], // Custom cubic-bezier for believable inertia
      onComplete: () => {
        onSpinComplete({ status: 'finished', question: selectedQuestion });
      }
    });
  };

  // Memoize the static 12 slices so they don't rebuild on every render
  const wheelSegments = useMemo(() => (
    [...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className="absolute inset-0"
        style={{ transform: `rotate(${i * 30}deg)` }}
      >
        {/* Divider Line */}
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-white/10 via-transparent to-white/10 -translate-x-1/2" />
        
        {/* Slice Number (positioned in the middle of the slice wedge) */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start pt-[12%]" style={{ transform: 'rotate(15deg)' }}>
          <span className="text-[10px] md:text-xs font-mono font-medium text-zinc-500 tracking-wider select-none">
            {(i + 1).toString().padStart(2, '0')}
          </span>
        </div>
        
        {/* Outer Rim Ticks */}
        <div className="absolute top-0 left-1/2 w-[2px] h-[8px] bg-indigo-500/40 -translate-x-1/2" />
      </div>
    ))
  ), []);

  return (
    <div className="relative w-[85vw] max-w-[320px] aspect-square md:max-w-[400px] flex items-center justify-center z-10 touch-none mx-auto">
      {/* Pointer Marker */}
      <div className="absolute top-[-10px] md:top-[-20px] z-20 flex flex-col items-center">
        <motion.div 
          style={{ 
            rotate: pointerRotate,
            y: pointerY,
            originY: 0,   // Pivot from the flat top
            originX: 0.5,
          }}
          animate={{ 
            filter: isSpinning ? 'drop-shadow(0 0 16px rgba(99,102,241,0.9))' : 'drop-shadow(0 0 8px rgba(99,102,241,0.3))',
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-transparent border-t-indigo-400"
        />
      </div>

      {/* Outer Glow */}
      <motion.div 
        animate={{ scale: isSpinning ? 1.05 : 1, opacity: isSpinning ? 0.8 : 0.3 }}
        className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"
      />

      {/* The Rotary Ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border-[1px] border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] overflow-hidden bg-[#09090b]"
        style={{ rotate: rotation }}
      >
        {/* Deep base gradient */}
        <div className="absolute inset-0" style={{ background: 'conic-gradient(from 180deg at 50% 50%, #121214 0deg, #18181b 180deg, #121214 360deg)' }} />

        {/* Core energy glow radiating from the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15)_15%,transparent_50%)] pointer-events-none" />

        {/* Alternating Slices */}
        <div className="absolute inset-0" style={{ background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.02) 0deg 30deg, transparent 30deg 60deg)' }} />

        {/* Inner concentric details to add premium complexity */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[15%] rounded-full border border-indigo-500/20 border-dashed pointer-events-none" 
        />
        <div className="absolute inset-[30%] rounded-full border border-white/5 pointer-events-none" />

        {/* Segment Details: Lines and Numbers */}
        {wheelSegments}

        {/* Highlight accent ring */}
        <div className="absolute inset-2 rounded-full border border-indigo-500/20 pointer-events-none" />
      </motion.div>

      {/* Core Spin Trigger (The tactile button) */}
      <motion.button
        onClick={triggerSpin}
        disabled={isSpinning}
        whileHover={!isSpinning ? { scale: 1.05 } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
        className="relative z-30 w-[40%] h-[40%] max-w-[160px] max-h-[160px] rounded-full flex flex-col items-center justify-center cursor-pointer group disabled:cursor-default"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-[inset_0_2px_20px_rgba(255,255,255,0.05),_0_15px_35px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-indigo-500/50 transition-colors duration-500" />
        
        {/* Inner tactile depression */}
        <div className="absolute inset-3 sm:inset-4 rounded-full bg-[#050505] shadow-[inset_0_5px_20px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
            
            {/* Ambient breathing core */}
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.25)_0%,transparent_70%)]"
            />

            {isSpinning ? (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-[25%] h-[25%] min-w-[24px] min-h-[24px] md:w-10 md:h-10 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full z-10"
              />
            ) : (
              <span className="text-zinc-200 font-bold tracking-[0.25em] text-xs sm:text-sm md:text-base group-hover:text-white transition-colors z-10 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                SPIN
              </span>
            )}
        </div>
      </motion.button>
    </div>
  );
};

// 3. Cinematic Card Reveal
interface RevealCardProps {
  question: Question | null;
  onClose: () => void;
}

const RevealCard: React.FC<RevealCardProps> = ({ question, onClose }) => {
  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-[#121214] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-text"
      >
        {/* Card Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-indigo-500/40 blur-xl" />

        <div className="flex items-center justify-between mb-6 md:mb-8 shrink-0">
          <div className="flex items-center gap-2">
            {question.category === 'Deep' && <Target className="w-4 h-4 text-rose-400" />}
            {question.category === 'Funny' && <Zap className="w-4 h-4 text-amber-400" />}
            {question.category === 'Close People' && <Heart className="w-4 h-4 text-pink-400" />}
            {question.category === 'What If' && <HelpCircle className="w-4 h-4 text-cyan-400" />}
            {question.category === 'Would You Rather' && <ArrowLeftRight className="w-4 h-4 text-emerald-400" />}
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              {question.category}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            aria-label="Close question"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 
          id="question-text" 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-tight mb-8 md:mb-12 tracking-tight overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {question.text}
        </h2>

        <div className="flex items-center justify-end border-t border-white/5 pt-4 md:pt-6 mt-auto shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-full transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Next Spin
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


// --- MAIN APP ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedQuestion, setRevealedQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Accessibility Announcement
  const [announcement, setAnnouncement] = useState('');

  // Memoize the callback so it doesn't trigger child re-renders unnecessarily
  const handleSpinComplete = useCallback((result: { status: 'started' } | { status: 'finished', question: Question }) => {
    if (result.status === 'started') {
      setIsSpinning(true);
      setRevealedQuestion(null);
      setAnnouncement('Wheel is spinning...');
    } else if (result.status === 'finished') {
      setIsSpinning(false);
      setRevealedQuestion(result.question);
      setHistory(prev => [...prev, result.question.id]);
      setAnnouncement(`Result: ${result.question.text}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 relative flex flex-col">
      <AmbientBackground />
      
      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-6 md:px-12 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Topic Finder</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        
        {/* Kinetic Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-[-2vh] md:mt-[-8vh]">
          
          {/* Wheel Engine */}
          <KineticWheel 
            isSpinning={isSpinning} 
            onSpinComplete={handleSpinComplete} 
            activeCategory={activeCategory}
            history={history}
          />
          
          {/* Contextual Status */}
          <div className="mt-12 h-8">
            <AnimatePresence mode="wait">
              {isSpinning ? (
                <motion.p 
                  key="spinning"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="text-indigo-400 text-sm font-medium tracking-widest uppercase flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" /> Generating Spark...
                </motion.p>
              ) : (
                <motion.p 
                  key="ready"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-zinc-500 text-sm tracking-wide text-center"
                >
                  Tap the center to reveal a random question.
                  <br/>
                  <span className="opacity-50 text-xs">Based on {QUESTIONS.length} curated questions.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Footer / Category Controls */}
        <div className="w-full pb-8 pt-12 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-3xl">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => !isSpinning && setActiveCategory(category)}
                disabled={isSpinning}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  border backdrop-blur-sm
                  ${activeCategory === category 
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                  }
                  ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Reveal Overlay layer */}
      <AnimatePresence>
        {revealedQuestion && (
          <RevealCard 
            question={revealedQuestion} 
            onClose={() => setRevealedQuestion(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}