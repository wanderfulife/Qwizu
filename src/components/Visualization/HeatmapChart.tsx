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
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { QuestionStatistics } from '@/utils/statistics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HeatmapChartProps {
  data: QuestionStatistics[];
  title: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, title }) => {
  // For demonstration purposes, we'll create a correlation matrix
  // In a real implementation, this would be based on actual correlations between responses
  const questions = data.map(q => q.questionText.substring(0, 30) + (q.questionText.length > 30 ? '...' : ''));
  
  // Generate a mock correlation matrix
  const generateCorrelationMatrix = () => {
    const matrix = [];
    for (let i = 0; i < questions.length; i++) {
      const row = [];
      for (let j = 0; j < questions.length; j++) {
        if (i === j) {
          row.push(100); // Perfect correlation with itself
        } else {
          // Generate a random correlation value between -100 and 100
          row.push(Math.floor(Math.random() * 201) - 100);
        }
      }
      matrix.push(row);
    }
    return matrix;
  };
  
  const correlationMatrix = generateCorrelationMatrix();
  
  // Convert matrix to heatmap data
  const heatmapData = [];
  const labelsX = questions;
  const labelsY = questions;
  
  for (let i = 0; i < correlationMatrix.length; i++) {
    for (let j = 0; j < correlationMatrix[i].length; j++) {
      heatmapData.push({
        x: labelsX[j],
        y: labelsY[i],
        v: correlationMatrix[i][j]
      });
    }
  }
  
  // For a real heatmap implementation, we would use a specialized chart library
  // For now, we'll use a bar chart to represent the concept
  
  const chartData: ChartData<'bar'> = {
    labels: labelsX,
    datasets: correlationMatrix.map((row, index) => ({
      label: labelsY[index],
      data: row,
      backgroundColor: row.map(value => {
        if (value > 50) return 'rgba(239, 68, 68, 0.7)'; // Strong positive correlation
        if (value > 0) return 'rgba(251, 191, 36, 0.7)'; // Weak positive correlation
        if (value > -50) return 'rgba(16, 185, 129, 0.7)'; // Weak negative correlation
        return 'rgba(59, 130, 246, 0.7)'; // Strong negative correlation
      }),
      borderColor: row.map(value => {
        if (value > 50) return 'rgba(239, 68, 68, 1)';
        if (value > 0) return 'rgba(251, 191, 36, 1)';
        if (value > -50) return 'rgba(16, 185, 129, 1)';
        return 'rgba(59, 130, 246, 1)';
      }),
      borderWidth: 1,
    }))
  };

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
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
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
    datasets: chartData.datasets.map(dataset => ({ ...dataset }))
  }), [chartData.labels, chartData.datasets]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedOptions = useMemo(() => options, []);

  return (
    <div style={{ height: '200px', position: 'relative' }}>
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