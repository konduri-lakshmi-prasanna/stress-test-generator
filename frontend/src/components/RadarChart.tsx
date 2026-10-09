import React from 'react';
import { CategoryScore, CategoryId } from '../types';

interface RadarChartProps {
  categories: Record<string, CategoryScore>;
  onSelectCategory?: (id: CategoryId) => void;
}

export const RadarChart: React.FC<RadarChartProps> = ({ categories, onSelectCategory }) => {
  const categoryKeys: CategoryId[] = [
    'ambiguity',
    'contradiction',
    'false_premise',
    'evidence_gap',
    'misleading_context',
    'fabricated_citations',
    'multi_step_reasoning',
    'paraphrase_consistency',
    'prompt_injection',
    'outdated_information'
  ];

  const size = 460;
  const center = size / 2;
  const radius = 160;
  const totalAxes = categoryKeys.length;

  // Calculate polygon points based on category score (0-100)
  const polygonPoints = categoryKeys.map((key, i) => {
    const scoreObj = categories[key];
    const score = scoreObj ? scoreObj.avg_score : 50;
    const normalized = Math.max(10, Math.min(100, score)) / 100;
    const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const x = center + radius * normalized * Math.cos(angle);
    const y = center + radius * normalized * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Concentric guideline circles
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-hawkins-panel border border-hawkins-border rounded-xl">
      <div className="w-full flex items-center justify-between pb-3 border-b border-hawkins-border/80">
        <div>
          <div className="text-[10px] font-mono text-hawkins-amber font-semibold uppercase tracking-wider">
            RADAR MATRIX // 10 DIMENSIONS OF THREAT
          </div>
          <h2 className="text-sm font-bold font-mono text-zinc-100">
            THE MIND FLAYER VULNERABILITY POLYGON
          </h2>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-hawkins-dark border border-hawkins-border text-zinc-400">
          INNER = HIGH VULNERABILITY
        </span>
      </div>

      <div className="w-full flex justify-center py-4 overflow-x-auto">
        <svg width={size} height={size} className="overflow-visible select-none">
          <defs>
            {/* Glow Filter */}
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E50914" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7928CA" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Background Grid Rings */}
          {rings.map((ringScale, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={radius * ringScale}
              fill="none"
              stroke="#282D3C"
              strokeDasharray={idx === 3 ? "none" : "3,3"}
              strokeWidth="1"
            />
          ))}

          {/* Axis Radial Lines */}
          {categoryKeys.map((_, i) => {
            const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#1F232F"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Data Polygon */}
          <polygon
            points={polygonPoints}
            fill="url(#radar-gradient)"
            stroke="#E50914"
            strokeWidth="2.5"
            filter="url(#radar-glow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Vertex Points & Labels */}
          {categoryKeys.map((key, i) => {
            const scoreObj = categories[key];
            const score = scoreObj ? scoreObj.avg_score : 50;
            const normalized = Math.max(10, Math.min(100, score)) / 100;
            const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
            
            // Point coordinate
            const px = center + radius * normalized * Math.cos(angle);
            const py = center + radius * normalized * Math.sin(angle);

            // Label coordinate (slightly outside radius)
            const labelRadius = radius + 32;
            const lx = center + labelRadius * Math.cos(angle);
            const ly = center + labelRadius * Math.sin(angle);

            const displayName = scoreObj?.name || key.replace('_', ' ');
            const isWeak = score < 70;

            return (
              <g 
                key={key} 
                className="cursor-pointer group"
                onClick={() => onSelectCategory && onSelectCategory(key)}
              >
                {/* Vertex node */}
                <circle
                  cx={px}
                  cy={py}
                  r="4"
                  fill={isWeak ? "#FFB000" : "#22C55E"}
                  stroke="#08090C"
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:r-6"
                />

                {/* Category label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[9.5px] font-mono font-medium transition-colors ${
                    isWeak ? 'fill-hawkins-amber font-bold' : 'fill-zinc-400 group-hover:fill-zinc-200'
                  }`}
                >
                  {displayName} ({Math.round(score)}%)
                </text>
              </g>
            );
          })}

          {/* Center core */}
          <circle cx={center} cy={center} r="3" fill="#E50914" />
        </svg>
      </div>

      <div className="w-full flex items-center justify-around pt-3 border-t border-hawkins-border/80 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Resilient (&ge; 70%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-hawkins-amber">
          <span className="w-2.5 h-2.5 rounded-full bg-hawkins-amber" />
          <span>Vulnerable (&lt; 70%)</span>
        </div>
        <div className="flex items-center gap-1.5 text-hawkins-glow">
          <span className="w-2.5 h-2.5 rounded-full bg-hawkins-crimson animate-pulse" />
          <span>Upside Down Breach</span>
        </div>
      </div>
    </div>
  );
};
