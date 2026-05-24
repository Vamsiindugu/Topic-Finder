import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Heart, HelpCircle, ArrowLeftRight, X, RotateCcw } from 'lucide-react';
import { Question } from '../data/questions';

interface RevealCardProps {
  question: Question | null;
  onClose: () => void;
}

export const RevealCard: React.FC<RevealCardProps> = ({ question, onClose }) => {
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
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-text"
      >
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
