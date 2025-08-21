'use client';

import React, { useMemo } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  ChartData,
  TooltipItem
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EnhancedPieChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColors?: string[];
  maxItemsToShow?: number;
  showPercentages?: boolean;
}

const EnhancedPieChart: React.FC<EnhancedPieChartProps> = ({ 
  title, 
  labels, 
  data, 
  backgroundColors,
  maxItemsToShow = 8,
  showPercentages = false
}) => {
  // Optimize data for large datasets
  const optimizedData = useMemo(() => {
    // If we have fewer items than maxItemsToShow, show all
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

  // Modern color palette with gradient effect
  const defaultColors = [
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
  
  const borderColors = [
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

  const colors = backgroundColors || defaultColors;

  const chartData: ChartData<'pie'> = {
    labels: optimizedData.labels,
    datasets: [
      {
        label: title,
        data: optimizedData.data,
        backgroundColor: colors.slice(0, optimizedData.data.length),
        borderColor: borderColors.slice(0, optimizedData.data.length),
        borderWidth: 2,
        hoverOffset: 15,
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
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
        },
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
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            const label = context.label || '';
            const value = context.parsed;
            if (showPercentages) {
              return `${label}: ${value}%`;
            }
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    cutout: '0%',
  };

  // Optimize rendering for performance
  const memoizedChartData = useMemo(() => ({
    labels: chartData.labels,
    datasets: chartData.datasets.map(dataset => ({ ...dataset }))
  }), [chartData.labels, chartData.datasets]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedOptions = useMemo(() => options, []);

  return (
    <div style={{ height: '300px', position: 'relative', padding: '10px 0' }}>
      <Pie 
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

export default EnhancedPieChart;