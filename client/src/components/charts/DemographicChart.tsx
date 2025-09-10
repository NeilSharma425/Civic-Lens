import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DemographicChartProps {
  data: Record<string, {
    positive: number;
    neutral: number;
    negative: number;
  }>;
}

export default function DemographicChart({ data }: DemographicChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(data);
    const positiveData = labels.map(label => data[label]?.positive || 0);
    const neutralData = labels.map(label => data[label]?.neutral || 0);
    const negativeData = labels.map(label => data[label]?.negative || 0);

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Positive',
            data: positiveData,
            backgroundColor: 'hsl(160 84% 39%)'
          },
          {
            label: 'Neutral',
            data: neutralData,
            backgroundColor: 'hsl(38 92% 50%)'
          },
          {
            label: 'Negative',
            data: negativeData,
            backgroundColor: 'hsl(0 84% 60%)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: { display: false }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 100
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} data-testid="demographic-chart" />;
}
