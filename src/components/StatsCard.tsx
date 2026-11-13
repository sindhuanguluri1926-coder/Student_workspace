import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  variant: 'total' | 'pending' | 'completed' | 'overdue';
  onClick?: () => void;
  isActive?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  onClick,
  isActive = false,
}) => {
  // Styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'total':
        return {
          iconBg: 'bg-indigo-50 text-indigo-600',
          accent: 'border-indigo-100',
          activeRing: 'ring-2 ring-indigo-500 border-indigo-500',
        };
      case 'pending':
        return {
          iconBg: 'bg-amber-50 text-amber-600',
          accent: 'border-amber-100',
          activeRing: 'ring-2 ring-amber-500 border-amber-500',
        };
      case 'completed':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
          accent: 'border-emerald-100',
          activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
        };
      case 'overdue':
        return {
          iconBg: 'bg-rose-50 text-rose-600',
          accent: 'border-rose-100',
          activeRing: 'ring-2 ring-rose-500 border-rose-500',
        };
      default:
        return {
          iconBg: 'bg-slate-50 text-slate-600',
          accent: 'border-slate-100',
          activeRing: 'ring-2 ring-slate-400',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative bg-white rounded-2xl p-5 border transition-all duration-200 select-none ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5'
          : ''
      } ${
        isActive
          ? styles.activeRing
          : 'border-slate-200/90 shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <div className="text-3xl font-extrabold text-slate-900 font-mono-numbers tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
        {subtitle}
      </p>
    </div>
  );
};

export default StatsCard;
