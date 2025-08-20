'use client';

import React, { useMemo } from 'react';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  ArcElement, 
  Tooltip, 
  Legend,
  ChartData,
  TooltipItem
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { QuestionStatistics } from '@/utils/statistics';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface ResponseDistributionChartProps {
  questions: QuestionStatistics[];
  showPercentages?: boolean;
}

const ResponseDistributionChart: React.FC<ResponseDistributionChartProps> = ({ 
  questions,
  showPercentages = false
}) => {
  const labels = questions.map(q => q.questionText);
  const data = questions.map(q => q.totalResponses);
  
  const backgroundColors = [
    'rgba(37, 99, 235, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(167, 139, 250, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(52, 211, 153, 0.8)',
  ];
  
  const borderColors = [
    'rgba(37, 99, 235, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(167, 139, 250, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(52, 211, 153, 1)',
  ];

  const chartData: ChartData<'polarArea'> = {
    labels,
    datasets: [
      {
        label: 'Nombre de réponses',
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context: TooltipItem<'polarArea'>) {
            const value = context.parsed.r;
            if (showPercentages) {
              return `${context.dataset.label || ''}: ${value}%`;
            }
            return `${context.dataset.label || ''}: ${value}`;
          }
        }
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        ticks: {
          backdropColor: 'rgba(0, 0, 0, 0)',
          font: {
            size: 10,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  // Optimize rendering for performance
  const memoizedChartData = useMemo(() => ({
    labels: chartData.labels,
    datasets: chartData.datasets.map(dataset => ({ ...dataset }))
  }), [chartData.labels, chartData.datasets]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedOptions = useMemo(() => options, []);

  return (
    <div style={{ height: '200px', position: 'relative' }}>
      <PolarArea 
        data={memoizedChartData} 
        options={memoizedOptions}
        plugins={[{
          id: 'resize',
          resize: (chart) => {
            // Optimize chart rendering on resize
            chart.resize(chart.width, chart.height);
          }
        }]}
      />
    </div>
  );
};

export default ResponseDistributionChart;