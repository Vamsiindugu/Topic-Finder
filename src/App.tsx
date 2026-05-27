import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import { CATEGORIES, QUESTIONS, Question, Category } from './data/questions';
import { AmbientBackground } from './components/AmbientBackground';
import { KineticWheel } from './components/KineticWheel';
import { RevealCard } from './components/RevealCard';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedQuestion, setRevealedQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');

  const selectNextQuestion = useCallback(() => {
    if (isSpinning) return null;

    const categoryQuestions = QUESTIONS.filter(
      question => activeCategory === 'All' || question.category === activeCategory,
    );

    if (categoryQuestions.length === 0) {
      setAnnouncement('No questions are available for this category.');
      return null;
    }

    const unseenQuestions = categoryQuestions.filter(question => !history.includes(question.id));
    const candidates = unseenQuestions.length > 0 ? unseenQuestions : categoryQuestions;
    const selectedQuestion = candidates[Math.floor(Math.random() * candidates.length)];

    setHistory(unseenQuestions.length > 0 ? [...history, selectedQuestion.id] : [selectedQuestion.id]);
    setRevealedQuestion(null);
    setIsSpinning(true);
    setAnnouncement('Wheel is spinning.');

    return selectedQuestion;
  }, [activeCategory, history, isSpinning]);

  const handleSpinComplete = useCallback((question: Question) => {
    setIsSpinning(false);
    setRevealedQuestion(question);
    setAnnouncement(`Result: ${question.text}`);
  }, []);

  const handleCategoryChange = useCallback((category: Category) => {
    if (isSpinning) return;
    setActiveCategory(category);
    setRevealedQuestion(null);
    setAnnouncement(`${category} category selected.`);
  }, [isSpinning]);

  return (
    <div className="h-dvh min-h-[560px] bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 relative flex flex-col overflow-hidden">
      <AmbientBackground />
      
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <header className="relative z-20 flex items-center justify-between px-4 py-4 md:px-12 md:py-6 w-full max-w-7xl mx-auto shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.14)]">
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Topic Finder</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 md:pb-10">
        <section className="flex-1 flex min-h-0 flex-col items-center justify-center w-full pt-2 md:pt-0">
          <KineticWheel 
            isSpinning={isSpinning} 
            onSpinRequest={selectNextQuestion}
            onSpinComplete={handleSpinComplete} 
          />
          
          <div className="mt-5 md:mt-10 min-h-[3.5rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isSpinning ? (
                <motion.p 
                  key="spinning"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="text-indigo-300 text-sm font-medium tracking-widest uppercase flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" /> Generating Spark...
                </motion.p>
              ) : (
                <motion.p 
                  key="ready"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-zinc-500 text-sm tracking-wide text-center leading-relaxed"
                >
                  Tap the center to reveal a random question.
                  <br/>
                  <span className="text-xs text-zinc-600">{QUESTIONS.length} curated prompts across {CATEGORIES.length - 1} categories.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section aria-label="Question categories" className="w-full pt-2 flex flex-col items-center gap-4 md:gap-6 shrink-0">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-3xl">
            {CATEGORIES.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={isSpinning}
                className={`
                  min-h-11 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  border backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300
                  ${activeCategory === category 
                    ? 'bg-indigo-500/15 border-indigo-400/60 text-indigo-100 shadow-[0_0_18px_rgba(99,102,241,0.22)]'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                  }
                  ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
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
