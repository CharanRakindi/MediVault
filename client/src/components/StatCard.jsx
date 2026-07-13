import { cn } from '../utils/cn';
import AnimatedCounter from './AnimatedCounter';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  contextText,
  actionText,
  actionHref,
  trend,
  trendType = 'neutral',
  className,
  index = 0,
}) => {
  const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
  const displayContext = contextText || description;

  const ActionTag = actionHref?.startsWith('/') ? Link : 'a';
  const actionProps = actionHref?.startsWith('/')
    ? { to: actionHref }
    : { href: actionHref };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-premium transition-[border-color,box-shadow] duration-300 hover:border-slate-300/80 hover:shadow-premium-lg',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-400">
            {title}
          </h3>
          {Icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-[#F7F6F3] text-slate-500 transition-colors group-hover:border-slate-200 group-hover:bg-slate-50">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-[26px] font-medium tracking-[-0.03em] text-slate-900">
            {isNumeric ? <AnimatedCounter value={value} /> : value}
          </span>
          {trend && (
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                trendType === 'positive' && 'border-emerald-100 bg-emerald-50 text-emerald-700',
                trendType === 'negative' && 'border-rose-100 bg-rose-50 text-rose-700',
                trendType === 'neutral' && 'border-slate-200 bg-slate-50 text-slate-600'
              )}
            >
              {trend}
            </span>
          )}
        </div>

        {displayContext && (
          <p className="mt-1.5 text-[12.5px] font-normal leading-snug tracking-[-0.01em] text-slate-500">
            {displayContext}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <ActionTag
          {...actionProps}
          className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5 text-[11.5px] font-medium tracking-[-0.01em] text-slate-500 transition-colors hover:text-slate-900"
        >
          <span>{actionText}</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-slate-600" />
        </ActionTag>
      )}
    </motion.div>
  );
};

export default StatCard;
