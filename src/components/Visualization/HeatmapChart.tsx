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
import { QuestionStatistics } from '@/utils/statistics';
import { useSurveyData } from '@/contexts/SurveyDataContext';
import { calculateCorrelationMatrix } from '@/utils/correlation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HeatmapChartProps {
  data: QuestionStatistics[];
  title: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, title }) => {
  const { processedData } = useSurveyData();
  
  // Calculate actual correlation matrix from the data
  const { correlationMatrix, labels } = useMemo(() => {
    if (!processedData || !processedData.mappedData || data.length === 0) {
      // Return empty data if no processed data
      return { correlationMatrix: [], labels: [] };
    }
    
    try {
      // Calculate correlation matrix using real data
      const matrix = calculateCorrelationMatrix(processedData.mappedData, data);
      const questions = data.map(q => 
        q.questionText.substring(0, 30) + (q.questionText.length > 30 ? '...' : '')
      );
      
      return { correlationMatrix: matrix, labels: questions };
    } catch (error) {
      console.error('Error calculating correlation matrix:', error);
      // Return empty data if error occurs
      return { correlationMatrix: [], labels: [] };
    }
  }, [processedData, data]);
  
  // Convert correlation matrix to chart data
  const chartData: ChartData<'bar'> = useMemo(() => {
    if (correlationMatrix.length === 0 || labels.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: labels,
      datasets: correlationMatrix.map((row, index) => ({
        label: labels[index],
        data: row.map(value => Math.round(value * 100)), // Convert to percentage for display
        backgroundColor: row.map(value => {
          // Color based on correlation strength and direction
          if (value > 0.5) return 'rgba(239, 68, 68, 0.7)'; // Strong positive correlation
          if (value > 0) return 'rgba(251, 191, 36, 0.7)'; // Weak positive correlation
          if (value > -0.5) return 'rgba(16, 185, 129, 0.7)'; // Weak negative correlation
          return 'rgba(59, 130, 246, 0.7)'; // Strong negative correlation
        }),
        borderColor: row.map(value => {
          if (value > 0.5) return 'rgba(239, 68, 68, 1)';
          if (value > 0) return 'rgba(251, 191, 36, 1)';
          if (value > -0.5) return 'rgba(16, 185, 129, 1)';
          return 'rgba(59, 130, 246, 1)';
        }),
        borderWidth: 1,
      }))
    };
  }, [correlationMatrix, labels]);

  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderSkipped: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
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
          label: function(context: TooltipItem<'bar'>) {
            const label = context.dataset.label || '';
            const value = context.parsed.x;
            return `${label}: ${value}%`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: false,
        min: -100,
        max: 100,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
          callback: function(value: number | string) {
            return Number(value).toString() + '%';
          }
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
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
    datasets: chartData.datasets?.map(dataset => ({ ...dataset })) || []
  }), [chartData.labels, chartData.datasets]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedOptions = useMemo(() => options, []);

  return (
    <div style={{ height: '400px', position: 'relative' }}>
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

export default HeatmapChart;