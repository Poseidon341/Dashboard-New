import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(...registerables, ChartDataLabels);

export interface TimeSeriesDataGroup {
  dec25: (number | null)[];
  jun26: (number | null)[];
  jul26: (number | null)[];
  aug26: (number | null)[];
}

interface TrendTimeSeriesChartProps {
  id: string;
  title: string;
  themeColor: string;
  iconClass?: string;
  data: TimeSeriesDataGroup;
  selectedDay: number;
}

export const formatUangWithUnit = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return '';
  const abs = Math.abs(val);
  if (abs >= 1_000_000_000_000) {
    return (val / 1_000_000_000_000).toFixed(2).replace('.', ',') + ' T';
  }
  if (abs >= 1_000_000_000) {
    return (val / 1_000_000_000).toFixed(2).replace('.', ',') + ' M';
  }
  if (abs >= 1_000_000) {
    return (val / 1_000_000).toFixed(2).replace('.', ',') + ' Jt';
  }
  return val.toLocaleString('id-ID');
};

export const TrendTimeSeriesChart: React.FC<TrendTimeSeriesChartProps> = ({
  id,
  title,
  themeColor,
  iconClass = 'fa-solid fa-chart-line',
  data,
  selectedDay,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const existingChart = ChartJS.getChart(canvasRef.current);
    if (existingChart) {
      existingChart.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = Array.from({ length: 31 }, (_, i) => String(i + 1));

    // Determine active point index for Aug-26
    let activeIdx = selectedDay - 1;
    if (activeIdx < 0 || activeIdx >= 31 || data.aug26[activeIdx] === null) {
      // Find the last non-null index
      for (let i = data.aug26.length - 1; i >= 0; i--) {
        if (data.aug26[i] !== null && data.aug26[i] !== undefined) {
          activeIdx = i;
          break;
        }
      }
    }
    if (activeIdx < 0) activeIdx = 0;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Dec-25',
            data: data.dec25,
            borderColor: '#64748b',
            borderDash: [4, 4],
            borderWidth: 1.6,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.15,
            spanGaps: true,
            datalabels: { display: false },
          },
          {
            label: 'Jun 26',
            data: data.jun26,
            borderColor: '#38bdf8',
            borderWidth: 2.0,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.15,
            spanGaps: true,
            datalabels: { display: false },
          },
          {
            label: 'Jul 26',
            data: data.jul26,
            borderColor: '#16a34a',
            borderWidth: 2.0,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.15,
            spanGaps: true,
            datalabels: { display: false },
          },
          {
            label: 'Agu 26',
            data: data.aug26,
            borderColor: themeColor,
            backgroundColor: `${themeColor}10`,
            fill: {
              target: 'origin',
              above: `${themeColor}08`,
            },
            borderWidth: 2.8,
            pointRadius: (context) => {
              const val = context.dataset.data[context.dataIndex];
              if (val === null || val === undefined) return 0;
              return context.dataIndex === activeIdx ? 6 : 2.5;
            },
            pointHoverRadius: 7,
            pointBackgroundColor: (context) =>
              context.dataIndex === activeIdx ? themeColor : '#ffffff',
            pointBorderColor: themeColor,
            pointBorderWidth: (context) =>
              context.dataIndex === activeIdx ? 2.5 : 1.8,
            tension: 0.15,
            spanGaps: false,
            datalabels: {
              display: (context) =>
                context.dataIndex === activeIdx &&
                context.dataset.data[context.dataIndex] !== null &&
                context.dataset.data[context.dataIndex] !== undefined,
              align: 'top',
              anchor: 'end',
              offset: 8,
              color: themeColor,
              backgroundColor: '#ffffff',
              borderColor: themeColor,
              borderWidth: 1.5,
              borderRadius: 4,
              padding: { top: 2, bottom: 2, left: 6, right: 6 },
              font: { weight: 'bold', size: 11 },
              formatter: (value, context) => `Tgl ${context.dataIndex + 1}: Rp ${formatUangWithUnit(value)}`,
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        layout: {
          padding: {
            top: 25,
            right: 15,
            left: 5,
            bottom: 5,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 18,
              font: { size: 10.5, weight: 'bold' },
              color: '#334155',
              padding: 12,
              usePointStyle: false,
            },
          },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: Rp ${formatUangWithUnit(item.raw as number)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              callback: function (val, index) {
                const day = index + 1;
                // Show odd days (1, 3, 5, 7, ... 31) plus the active day
                if (day === activeIdx + 1 || day % 2 === 1 || day === 31) {
                  return day;
                }
                return '';
              },
              color: (ctx) => (ctx.index === activeIdx ? themeColor : '#64748b'),
              font: (ctx) => ({
                size: 10,
                weight: ctx.index === activeIdx ? ('bold' as const) : ('normal' as const),
              }),
            },
          },
          y: {
            display: true,
            grace: '8%',
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 9.5, weight: 'bold' },
              color: '#64748b',
              callback: (val) => formatUangWithUnit(val as number),
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, selectedDay, themeColor]);

  return (
    <div id={`chart-card-${id}`} className="chart-card">
      <h3 style={{ color: themeColor }}>
        <i className={iconClass} style={{ color: themeColor }}></i>
        <span>{title}</span>
      </h3>
      <div className="chart-container">
        <canvas ref={canvasRef} id={`canvas-${id}`}></canvas>
      </div>
    </div>
  );
};
