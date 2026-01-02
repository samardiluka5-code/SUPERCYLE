
import React from 'react';

interface Metric {
  label: string;
  value: number;
}

interface DermalMetricsChartProps {
  current: Metric[];
  baseline?: Metric[];
  isPremium: boolean;
}

export const DermalMetricsChart: React.FC<DermalMetricsChartProps> = ({ current, baseline, isPremium }) => {
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const angleStep = (Math.PI * 2) / current.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getPoints = (metrics: Metric[]) => {
    return metrics
      .map((m, i) => {
        const { x, y } = getCoordinates(i, m.value);
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Polygons (Grid) */}
        {[20, 40, 60, 80, 100].map((tick) => (
          <polygon
            key={tick}
            points={current.map((_, i) => {
              const { x, y } = getCoordinates(i, tick);
              return `${x},${y}`;
            }).join(' ')}
            className="fill-none stroke-slate-100 stroke-[1]"
          />
        ))}

        {/* Axis Lines */}
        {current.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-slate-100 stroke-[1]"
            />
          );
        })}

        {/* Baseline Layer (Premium Only) */}
        {isPremium && baseline && (
          <polygon
            points={getPoints(baseline)}
            className="fill-slate-100/50 stroke-slate-300 stroke-[1.5] stroke-dasharray-[4,2] transition-all duration-1000"
          />
        )}

        {/* Current Layer */}
        <polygon
          points={getPoints(current)}
          className="fill-slate-900/10 stroke-slate-900 stroke-[2] transition-all duration-1000 ease-out"
        />

        {/* Data Points */}
        {current.map((m, i) => {
          const { x, y } = getCoordinates(i, m.value);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-white stroke-slate-900 stroke-[2]"
            />
          );
        })}

        {/* Labels */}
        {current.map((m, i) => {
          const { x, y } = getCoordinates(i, 115);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              className="text-[9px] font-black uppercase tracking-widest fill-slate-400"
            >
              {m.label}
            </text>
          );
        })}
      </svg>
      
      {isPremium && (
        <div className="mt-8 flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-900 rounded-full" />
            <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">Current Scan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-slate-300 border-dashed rounded-full" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Baseline (30d)</span>
          </div>
        </div>
      )}
    </div>
  );
};
