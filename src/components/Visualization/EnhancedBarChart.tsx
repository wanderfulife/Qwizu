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
  TooltipItem,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EnhancedBarChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColors?: string[];
  borderColors?: string[];
  maxItemsToShow?: number;
  showPercentages?: boolean;
}

const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({ 
  title, 
  labels, 
  data,
  backgroundColors,
  borderColors,
  maxItemsToShow = 10,
  showPercentages = false
}) => {
  // Optimize data for large datasets
  const optimizedData = useMemo(() => {
    // If we have more items than maxItemsToShow, we'll group the rest into "Others"
    if (labels.length <= maxItemsToShow) {
      return { labels, data };
    }
    
    // Sort data by value descending to show the most significant items
    const sortedData = labels
      .map((label, index) => ({ label, value: data[index] }))
      .sort((a, b) => b.value - a.value);
    
    // Take the top items
    const topItems = sortedData.slice(0, maxItemsToShow - 1);
    
    // Group the rest into "Others"
    const othersValue = sortedData
      .slice(maxItemsToShow - 1)
      .reduce((sum, item) => sum + item.value, 0);
    
    // Create new labels and data arrays
    const optimizedLabels = [...topItems.map(item => item.label), 'Autres'];
    const optimizedData = [...topItems.map(item => item.value), othersValue];
    
    return { labels: optimizedLabels, data: optimizedData };
  }, [labels, data, maxItemsToShow]);

  // Default colors with gradient effect
  const defaultBackgroundColors = [
    'rgba(37, 99, 235, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(167, 139, 250, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(52, 211, 153, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(251, 191, 36, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(248, 113, 133, 0.8)',
  ];
  
  const defaultBorderColors = [
    'rgba(37, 99, 235, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(167, 139, 250, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(52, 211, 153, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(251, 191, 36, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(248, 113, 133, 1)',
  ];

  const chartData: ChartData<'bar'> = {
    labels: optimizedData.labels,
    datasets: [
      {
        label: title,
        data: optimizedData.data,
        backgroundColor: backgroundColors || defaultBackgroundColors,
        borderColor: borderColors || defaultBorderColors,
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
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 600,
        },
        padding: {
          top: 10,
          bottom: 20,
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
        displayColors: true,
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            const value = context.parsed.y;
            if (showPercentages) {
              return `${context.dataset.label || ''}: ${value}%`;
            }
            return `${context.dataset.label || ''}: ${value}`;
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
          maxRotation: 45,
          minRotation: 45,
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
          callback: function(value: number | string) {
            if (showPercentages) {
              return `${value}%`;
            }
            return value;
          }
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
    <div style={{ height: '100%', position: 'relative' }}>
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

export default EnhancedBarChart;