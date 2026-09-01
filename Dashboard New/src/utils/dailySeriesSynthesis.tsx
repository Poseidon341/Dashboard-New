import React from 'react';
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

const BENCHMARK_KEYS: ('dec25' | 'jun26' | 'jul26')[] = ['dec25', 'jun26', 'jul26'];

/**
 * The benchmark months (Dec-25, Jun-26, Jul-26) are populated only from real rows found in
 * rawSegmenData - no synthetic curve is fabricated. When a benchmark month has at most one
 * real data point (e.g. a single snapshot date rather than daily data), it is rendered as a
 * flat reference line at that value instead of a fake day-by-day trend. Aug-26 (the active
 * month) is left untouched here - it is already built entirely from real daily rows.
 * Mutates chartData in place.
 */
export function populateBenchmarkSeries(chartData: Record<ProductKey, TimeSeriesDataGroup>): void {
  const productKeys: ProductKey[] = ['tabungan', 'giro', 'deposito', 'dpk'];

  productKeys.forEach((pKey) => {
    BENCHMARK_KEYS.forEach((bKey) => {
      const series = chartData[pKey][bKey];
      const realValues = series.filter((v): v is number => v !== null && v !== undefined);
      if (realValues.length <= 1) {
        const flatValue = realValues.length === 1 ? realValues[0] : null;
        for (let i = 0; i < series.length; i++) {
          series[i] = flatValue;
        }
      }
    });
  });
}
