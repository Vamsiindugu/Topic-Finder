import { FC, useState, FormEvent, memo } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export const SubmitQuestionSection: FC = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', question: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: 'a98c25de-1969-496e-ae61-580fe57dca93',
          subject: 'New Topic Finder Question Submission',
          name: formData.name || 'Anonymous User',
          email: formData.email || 'no-email@topicfinder.app',
          message: formData.question,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', question: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      // Reset status back to idle after 5 seconds to allow further submissions
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <section className="relative w-full border-t border-white/5 bg-[#09090b]/50 backdrop-blur-3xl overflow-hidden shrink-0 pb-20 pt-24 md:pt-32">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Community
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight mb-4">
            Expand the Universe
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Have a deep, funny, or thought-provoking question? Submit it below to help grow our collection of conversation starters.
          </p>
        </motion.div>

        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 p-6 md:p-8 bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4),_inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-300 ml-1">
              First Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              disabled={status === 'submitting'}
              placeholder="Jane Doe"
              className="w-full min-h-[44px] bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="question" className="text-sm font-medium text-zinc-300 ml-1">
              Your Question <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="question"
              required
              value={formData.question}
              onChange={(e) => setFormData(p => ({ ...p, question: e.target.value }))}
              disabled={status === 'submitting'}
              placeholder="Share a deep, funny, weird, or thoughtful question..."
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-y min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <motion.button
              type="submit"
              whileHover={status === 'idle' && formData.question.trim() ? { scale: 1.01 } : {}}
              whileTap={status === 'idle' && formData.question.trim() ? { scale: 0.98 } : {}}
              disabled={status === 'submitting' || !formData.question.trim()}
              className={`
                group relative w-full min-h-[48px] sm:min-h-[56px] flex items-center justify-center gap-2 
                rounded-xl font-medium text-sm sm:text-base transition-all duration-300 overflow-hidden
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300
                ${status === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : status === 'error'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white border border-indigo-400/50 shadow-[0_4px_14px_rgba(99,102,241,0.2)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.3)] disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-500 disabled:border-zinc-800 disabled:shadow-none'
                }
              `}
            >
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                    <span>Submit Question</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.div>
                )}
                {status === 'submitting' && (
                  <motion.div key="submitting" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                    <span className="text-zinc-400">Transmitting...</span>
                  </motion.div>
                )}
                {status === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Question Received!</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Failed to send. Try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
});