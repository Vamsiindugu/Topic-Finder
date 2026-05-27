import { FC, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Target, Zap, Heart, HelpCircle, ArrowLeftRight, X, RotateCcw } from 'lucide-react';
import { Question } from '../data/questions';

interface RevealCardProps {
  question: Question | null;
  onClose: () => void;
}

export const RevealCard: FC<RevealCardProps> = ({ question, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [onClose]);

  if (!question) return null;

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(element => !element.hasAttribute('disabled'));

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.96, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
        transition={prefersReducedMotion ? { duration: 0.01 } : { type: 'spring', damping: 26, stiffness: 320 }}
        className="relative w-full max-w-lg max-h-[min(85dvh,680px)] flex flex-col bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-text"
        aria-describedby="question-category"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-indigo-500/40 blur-xl" />

        <div className="flex items-center justify-between mb-6 md:mb-8 shrink-0">
          <div id="question-category" className="flex items-center gap-2">
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
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="min-h-12 min-w-12 p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
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
            type="button"
            onClick={onClose}
            className="min-h-12 px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-full transition-all flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            <RotateCcw className="w-4 h-4" /> Next Spin
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
