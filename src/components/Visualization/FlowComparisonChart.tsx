'use client';

import React, { useMemo } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FlowComparisonChartProps {
  flowData: Record<string, number>;
  totalRespondents: number;
}

const FlowComparisonChart: React.FC<FlowComparisonChartProps> = ({ 
  flowData, 
  totalRespondents 
}) => {
  const labels = ['Preneurs de train', 'Accompagnateurs', 'Descendants'];
  const data = [
    flowData.MONTANTS || 0,
    flowData.ACCOMPAGNATEURS || 0,
    flowData.DESCENDANTS || 0
  ];
  
  const backgroundColors = [
    'rgba(37, 99, 235, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)'
  ];
  
  const borderColors = [
    'rgba(37, 99, 235, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(16, 185, 129, 1)'
  ];

  const chartData: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: 'Nombre de répondants',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
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
          label: function(context: TooltipItem<'bar'>) {
            const value = context.parsed.y;
            const percentage = Math.round((value / totalRespondents) * 100);
            return [`Nombre: ${value}`, `Pourcentage: ${percentage}%`];
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
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
    <div style={{ height: '220px', position: 'relative', padding: '10px 0' }}>
      <Bar 
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

export default FlowComparisonChart;