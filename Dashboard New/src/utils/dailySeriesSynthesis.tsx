import React from 'react';
import { SummaryStat } from '../types';
import { TimeSeriesDataGroup } from '../components/TrendTimeSeriesChart';

export type ProductKey = 'tabungan' | 'giro' | 'deposito' | 'dpk';

export const formatUangShort = (num: number): string => {
  if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2).replace('.', ',') + ' T';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace('.', ',') + ' M';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace('.', ',') + ' Jt';
  return num.toLocaleString('id-ID');
};

export const renderDelta = (val: number) => {
  if (Math.abs(val) < 0.01) return <div className="val-delta neutral">-</div>;
  const isPos = val >= 0;
  return (
    <div className={`val-delta ${isPos ? 'up' : 'down'}`}>
      <i className={`fa-solid ${isPos ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
      <span>{formatUangShort(Math.abs(val))}</span>
    </div>
  );
};

export const initSeries = (): TimeSeriesDataGroup => ({
  dec25: Array(31).fill(null),
  jun26: Array(31).fill(null),
  jul26: Array(31).fill(null),
  aug26: Array(31).fill(null),
});

// Banking daily volatility cycles (capturing salary dips/peaks, weekend settlements, and commercial clearing)
export const VOLATILITY_PATTERNS: Record<ProductKey, number[]> = {
  tabungan: [
    -0.014, -0.022, -0.016, -0.005, +0.008, +0.018, +0.012, +0.024, +0.017, +0.026,
    +0.021, +0.015, +0.029, +0.020, +0.012, +0.006, +0.018, +0.011, +0.022, +0.030,
    +0.045, +0.054, +0.048, +0.062, +0.068, +0.056, +0.066, +0.075, +0.082, +0.090, +0.096
  ],
  giro: [
    -0.028, -0.042, -0.030, -0.012, +0.016, +0.036, +0.024, +0.045, +0.032, +0.052,
    +0.040, +0.026, +0.056, +0.038, +0.022, +0.011, +0.034, +0.020, +0.042, +0.060,
    +0.082, +0.100, +0.088, +0.112, +0.125, +0.102, +0.120, +0.138, +0.152, +0.166, +0.178
  ],
  deposito: [
    -0.005, -0.008, -0.004, +0.002, +0.006, +0.010, +0.008, +0.013, +0.010, +0.016,
    +0.014, +0.011, +0.018, +0.014, +0.010, +0.008, +0.013, +0.010, +0.017, +0.020,
    +0.026, +0.031, +0.028, +0.035, +0.038, +0.034, +0.038, +0.043, +0.047, +0.051, +0.055
  ],
  dpk: [
    -0.015, -0.024, -0.018, -0.005, +0.009, +0.020, +0.014, +0.027, +0.020, +0.030,
    +0.024, +0.017, +0.033, +0.023, +0.014, +0.008, +0.020, +0.013, +0.025, +0.034,
    +0.051, +0.062, +0.055, +0.070, +0.078, +0.065, +0.076, +0.086, +0.095, +0.104, +0.112
  ]
};

/**
 * Populates realistic banking curves for the benchmark months (Dec-25, Jun-26, Jul-26)
 * and the active month (Aug-26, rendered strictly up to selectedDay). Mutates chartData in place.
 */
export function populateBenchmarkSeries(
  chartData: Record<ProductKey, TimeSeriesDataGroup>,
  totals: Record<ProductKey, SummaryStat>,
  selectedDay: number
): void {
  const productKeys: ProductKey[] = ['tabungan', 'giro', 'deposito', 'dpk'];
  const targetDayIdx = Math.min(Math.max(selectedDay - 1, 0), 30);

  productKeys.forEach((pKey) => {
    const curVal = totals[pKey].cur;
    const mtdVal = totals[pKey].mtd > 0 ? totals[pKey].mtd : Math.round(curVal * 0.985);
    const ytdVal = totals[pKey].ytd > 0 ? totals[pKey].ytd : Math.round(curVal * 0.935);
    const vol = VOLATILITY_PATTERNS[pKey];

    // Dec-25 (Benchmark full month)
    for (let i = 0; i < 31; i++) {
      const factor = 1.0 + vol[i] * 0.85;
      chartData[pKey].dec25[i] = Math.round(ytdVal * factor);
    }

    // Jun-26 (Benchmark full month)
    const junBase = ytdVal + (mtdVal - ytdVal) * 0.65;
    for (let i = 0; i < 31; i++) {
      const factor = 1.0 + (vol[i] + (i % 3 === 0 ? 0.008 : -0.006)) * 0.9;
      chartData[pKey].jun26[i] = Math.round(junBase * factor);
    }

    // Jul-26 (Benchmark full month)
    for (let i = 0; i < 31; i++) {
      const factor = 1.0 + (vol[i] + (i % 4 === 1 ? 0.010 : -0.005)) * 0.95;
      chartData[pKey].jul26[i] = Math.round(mtdVal * factor);
    }

    // Aug-26 (Active Month): Clear all first
    for (let i = 0; i < 31; i++) {
      chartData[pKey].aug26[i] = null;
    }

    // Render Aug-26 dynamically up to selectedDay (targetDayIdx)
    const startVal = mtdVal > 0 ? mtdVal : Math.round(curVal * 0.98);
    for (let i = 0; i <= targetDayIdx; i++) {
      if (targetDayIdx === 0) {
        chartData[pKey].aug26[0] = curVal;
      } else if (i === targetDayIdx) {
        chartData[pKey].aug26[i] = curVal;
      } else {
        // Dynamic trajectory that accounts for daily ups & downs and perfectly anchors at curVal on targetDayIdx
        const progress = i / targetDayIdx;
        const baseline = startVal + (curVal - startVal) * progress;
        // Relative daily oscillation
        const dailyOscillation = (vol[i] - vol[targetDayIdx] * progress) * 0.65;
        const dailyVal = baseline * (1.0 + dailyOscillation);
        chartData[pKey].aug26[i] = Math.round(dailyVal);
      }
    }
  });
}
