import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  backTo?: string;
}

export const ComingSoon = ({
  title = 'Coming Soon',
  subtitle = "We're working on something great. Check back soon!",
  backTo,
}: ComingSoonProps) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="w-20 h-20 rounded-3xl mb-6 mx-auto flex items-center justify-center"
             style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}>
          <ShoppingBag size={36} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl mb-3">{title}</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8 leading-relaxed">
          {subtitle}
        </p>
        <div className="bg-card border border-border rounded-2xl p-5 max-w-xs mx-auto mb-8">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Notify me</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              className="px-4 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: 'var(--gradient-pink)', boxShadow: 'var(--shadow-pink)' }}
              onClick={() => {}}
            >
              Notify
            </button>
          </div>
        </div>
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> Go back
          </button>
        )}
      </motion.div>
    </div>
  );
};
