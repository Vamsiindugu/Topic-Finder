import React, { useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Question, Category, QUESTIONS } from '../data/questions';

interface KineticWheelProps {
  isSpinning: boolean;
  onSpinComplete: (result: { status: 'started' } | { status: 'finished', question: Question }) => void;
  activeCategory: Category | 'All';
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

export const KineticWheel: React.FC<KineticWheelProps> = ({ isSpinning, onSpinComplete, activeCategory, history, setHistory }) => {
  const rotation = useMotionValue(0);

  const pointerRotate = useTransform(rotation, (val) => {
    const slice = (val % 30 + 30) % 30;
    if (slice >= 22 && slice < 30) {
        return ((slice - 22) / 8) * -22;
    } 
    else if (slice >= 0 && slice < 4) {
        return -22 + (slice / 4) * 22;
    }
    return 0;
  });

  const pointerY = useTransform(rotation, (val) => {
    const slice = (val % 30 + 30) % 30;
    if (slice >= 22 && slice < 30) {
        return ((slice - 22) / 8) * -4;
    } else if (slice >= 0 && slice < 4) {
        return -4 + (slice / 4) * 4;
    }
    return 0;
  });

  const triggerSpin = async () => {
    if (isSpinning) return;
    
    let pool = QUESTIONS.filter(q => (activeCategory === 'All' || q.category === activeCategory) && !history.includes(q.id));
    if (pool.length === 0) {
      setHistory([]);
      pool = QUESTIONS.filter(q => activeCategory === 'All' || q.category === activeCategory);
    }

    const selectedQuestion = pool[Math.floor(Math.random() * pool.length)];
    const targetRotation = rotation.get() + (360 * 5) + (Math.random() * 360);
    
    onSpinComplete({ status: 'started' });

    animate(rotation, targetRotation, {
      duration: 4,
      ease: [0.2, 0.8, 0.2, 1],
      onComplete: () => onSpinComplete({ status: 'finished', question: selectedQuestion })
    });
  };

  const wheelSegments = useMemo(() => (
    [...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className="absolute inset-0"
        style={{ transform: `rotate(${i * 30}deg)` }}
      >
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-white/10 via-transparent to-white/10 -translate-x-1/2" />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-start pt-[12%]" style={{ transform: 'rotate(15deg)' }}>
          <span className="text-[10px] md:text-xs font-mono font-medium text-zinc-500 tracking-wider select-none">
            {(i + 1).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute top-0 left-1/2 w-[2px] h-[8px] bg-indigo-500/40 -translate-x-1/2" />
      </div>
    ))
  ), []);

  return (
    <div className="relative w-[85vw] max-w-[320px] aspect-square md:max-w-[400px] flex items-center justify-center z-10 touch-none mx-auto">
      <div className="absolute top-[-10px] md:top-[-20px] z-20 flex flex-col items-center">
        <motion.div 
          style={{ 
            rotate: pointerRotate,
            y: pointerY,
            originY: 0,
            originX: 0.5,
          }}
          animate={{ 
            filter: isSpinning ? 'drop-shadow(0 0 16px rgba(99,102,241,0.9))' : 'drop-shadow(0 0 8px rgba(99,102,241,0.3))',
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-transparent border-t-indigo-400"
        />
      </div>

      <motion.div 
        animate={{ scale: isSpinning ? 1.05 : 1, opacity: isSpinning ? 0.8 : 0.3 }}
        className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"
      />

      <motion.div 
        className="absolute inset-0 rounded-full border-[1px] border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] overflow-hidden bg-[#09090b]"
        style={{ rotate: rotation }}
      >
        <div className="absolute inset-0" style={{ background: 'conic-gradient(from 180deg at 50% 50%, #121214 0deg, #18181b 180deg, #121214 360deg)' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15)_15%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0" style={{ background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.02) 0deg 30deg, transparent 30deg 60deg)' }} />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[15%] rounded-full border border-indigo-500/20 border-dashed pointer-events-none" 
        />
        <div className="absolute inset-[30%] rounded-full border border-white/5 pointer-events-none" />
        {wheelSegments}
        <div className="absolute inset-2 rounded-full border border-indigo-500/20 pointer-events-none" />
      </motion.div>

      <motion.button
        onClick={triggerSpin}
        disabled={isSpinning}
        whileHover={!isSpinning ? { scale: 1.05 } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
        className="relative z-30 w-[40%] h-[40%] max-w-[160px] max-h-[160px] rounded-full flex flex-col items-center justify-center cursor-pointer group disabled:cursor-default"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 shadow-[inset_0_2px_20px_rgba(255,255,255,0.05),_0_15px_35px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-indigo-500/50 transition-colors duration-500" />
        <div className="absolute inset-3 sm:inset-4 rounded-full bg-[#050505] shadow-[inset_0_5px_20px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
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
