import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import { CATEGORIES, QUESTIONS, Question, Category } from './data/questions';
import { AmbientBackground } from './components/AmbientBackground';
import { KineticWheel } from './components/KineticWheel';
import { RevealCard } from './components/RevealCard';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedQuestion, setRevealedQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');

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
      
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <header className="relative z-20 flex items-center justify-between p-4 md:p-6 md:px-12 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Topic Finder</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-12">
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-[-2vh] md:mt-[-8vh]">
          <KineticWheel 
            isSpinning={isSpinning} 
            onSpinComplete={handleSpinComplete} 
            activeCategory={activeCategory}
            history={history}
            setHistory={setHistory}
          />
          
          <div className="mt-4 md:mt-12 h-8">
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

        <div className="w-full pb-8 pt-2 md:pt-12 flex flex-col items-center gap-4 md:gap-6">
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3 w-full max-w-3xl">
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
