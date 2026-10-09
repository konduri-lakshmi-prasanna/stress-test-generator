import React from 'react';
import { CategoryMeta, CategoryScore, ThreatLevel } from '../types';
import { ShieldCheck, AlertTriangle, Skull, Flame, Play } from 'lucide-react';

interface CategoryCardProps {
  meta: CategoryMeta;
  score?: CategoryScore;
  isSelected: boolean;
  onSelect: () => void;
  onQuickRun: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  meta,
  score,
  isSelected,
  onSelect,
  onQuickRun
}) => {
  const avgScore = score ? score.avg_score : 80;
  const isVulnerable = avgScore < 70;

  const getThreatBadge = (level: ThreatLevel) => {
    switch (level) {
      case 'UPSIDE_DOWN':
        return {
          bg: 'bg-red-950/80 border-hawkins-crimson text-hawkins-glow shadow-glow-red animate-pulse',
          icon: Skull,
          label: 'UPSIDE DOWN'
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/60 border-rose-500 text-rose-300',
          icon: Flame,
          label: 'CRITICAL'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/50 border-amber-500 text-amber-300',
          icon: AlertTriangle,
          label: 'HIGH THREAT'
        };
      default:
        return {
          bg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
          icon: ShieldCheck,
          label: 'STANDARD'
        };
    }
  };

  const badge = getThreatBadge(meta.threat_level);
  const BadgeIcon = badge.icon;

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-hawkins-card border-hawkins-crimson shadow-glow-red ring-1 ring-hawkins-crimson'
          : 'bg-hawkins-panel hover:bg-hawkins-card border-hawkins-border hover:border-zinc-600'
      }`}
    >
      <div>
        {/* Top Header: Code Name & Threat Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-hawkins-amber uppercase">
            {meta.code_name}
          </span>
          <div className={`flex items-center gap-1 text-[9.5px] font-mono px-2 py-0.5 rounded border ${badge.bg}`}>
            <BadgeIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Category Title */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors mb-1 font-mono">
          {meta.name}
        </h3>

        {/* Core Question */}
        <p className="text-xs text-zinc-300 italic mb-2">
          "{meta.question}"
        </p>

        {/* Short Description */}
        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
          {meta.description}
        </p>
      </div>

      {/* Footer: Resilience Bar & Action */}
      <div className="pt-3 mt-3 border-t border-hawkins-border/80">
        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
          <span className="text-zinc-400">Resilience:</span>
          <span className={`font-bold ${isVulnerable ? 'text-hawkins-amber' : 'text-emerald-400'}`}>
            {Math.round(avgScore)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-hawkins-dark rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-500 ${
              isVulnerable
                ? 'bg-gradient-to-r from-amber-600 to-hawkins-amber'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
            }`}
            style={{ width: `${avgScore}%` }}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickRun();
          }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-semibold rounded bg-hawkins-dark hover:bg-hawkins-crimson hover:text-white text-zinc-300 border border-hawkins-border hover:border-hawkins-crimson transition-all"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>RUN SECTOR STRESS-TEST</span>
        </button>
      </div>
    </div>
  );
};
