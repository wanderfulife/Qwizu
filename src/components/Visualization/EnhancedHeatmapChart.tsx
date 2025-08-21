'use client';

import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Info as InfoIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { QuestionStatistics } from '@/utils/statistics';
import { useSurveyData } from '@/contexts/SurveyDataContext';
import { calculateCorrelationMatrix, formatCorrelationData } from '@/utils/correlation';

interface EnhancedHeatmapChartProps {
  data: QuestionStatistics[];
  title: string;
}

interface HeatmapDataItem {
  x: string;
  y: string;
  v: number;
}

const EnhancedHeatmapChart: React.FC<EnhancedHeatmapChartProps> = ({ data, title }) => {
  const { processedData } = useSurveyData();
  const [zoomLevel, setZoomLevel] = React.useState(1);
  
  // Calculate actual correlation matrix from the data
  const { heatmapData } = useMemo(() => {
    if (!processedData || !processedData.mappedData || data.length === 0) {
      // Return empty data if no processed data
      return { heatmapData: [] as HeatmapDataItem[] };
    }
    
    try {
      // Calculate correlation matrix using real data
      const correlationMatrix = calculateCorrelationMatrix(processedData.mappedData, data);
      const formattedData = formatCorrelationData(correlationMatrix, data);
      
      return {
        heatmapData: formattedData.data as HeatmapDataItem[]
      };
    } catch (error) {
      console.error('Error calculating correlation matrix:', error);
      // Return empty data if error occurs
      return { heatmapData: [] as HeatmapDataItem[] };
    }
  }, [processedData, data]);
  
  // Transform data for nivo heatmap
  const nivoData = useMemo(() => {
    if (heatmapData.length === 0) return [];
    
    // Group data by y-axis values
    const groupedData: Record<string, Record<string, number>> = {};
    
    heatmapData.forEach((item) => {
      if (!groupedData[item.y]) {
        groupedData[item.y] = {};
      }
      groupedData[item.y][item.x] = item.v;
    });
    
    // Convert to nivo format
    return Object.keys(groupedData).map(yKey => ({
      id: yKey,
      data: Object.keys(groupedData[yKey]).map(xKey => ({
        x: xKey,
        y: groupedData[yKey][xKey]
      }))
    }));
  }, [heatmapData]);
  
  // Get min and max values for color scaling
  const valueRange = useMemo(() => {
    if (heatmapData.length === 0) return { min: -100, max: 100 };
    
    const values = heatmapData.map((item) => item.v);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [heatmapData]);
  
  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  if (nivoData.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Données insuffisantes pour calculer la matrice de corrélation.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minWidth: 0, pr: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, flexShrink: 0, lineHeight: 1.2 }}>
              {title}
            </Typography>
            <Tooltip 
              title="Cette matrice montre les corrélations entre différentes questions. Les valeurs proches de 100% indiquent une forte corrélation positive, tandis que les valeurs proches de -100% indiquent une forte corrélation négative."
              arrow
              placement="top"
            >
              <InfoIcon sx={{ fontSize: '1rem', color: 'text.secondary', flexShrink: 0 }} />
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={handleZoomOut}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleZoomIn}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '300px'
        }}>
          <Box sx={{ 
            height: `${450 * zoomLevel}px`, 
            width: '100%',
            position: 'relative',
            flexGrow: 1,
            minHeight: 0
          }}>
          <ResponsiveHeatMap
            data={nivoData}
            margin={{ top: 140, right: 160, bottom: 140, left: 240 }}
            valueFormat={value => `${value}%`}
            axisTop={{
              tickSize: 8,
              tickPadding: 12,
              tickRotation: -45,
              legend: '',
              legendOffset: 40
            }}
            axisRight={undefined}
            axisBottom={undefined}
            axisLeft={{
              tickSize: 8,
              tickPadding: 12,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: -140
            }}
            colors={{
              type: 'diverging',
              scheme: 'red_yellow_green',
              minValue: valueRange.min,
              maxValue: valueRange.max
            }}
            emptyColor="#EEEEEE"
            legends={[
              {
                anchor: 'bottom-right',
                translateX: 100,
                translateY: -50,
                length: 200,
                thickness: 15,
                direction: 'column',
                title: 'Corrélation (%)'
              }
            ]}
            hoverTarget="cell"
            borderWidth={2}
            borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            enableGridX={false}
            enableGridY={false}
            animate={true}
            isInteractive={true}
            tooltip={({ cell }) => (
              <Box sx={{ 
                backgroundColor: 'white', 
                padding: '12px 16px', 
                borderRadius: '4px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxWidth: '300px',
                wordBreak: 'break-word'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {cell.serieId} - {cell.data.x}
                </Typography>
                <Typography variant="body2">
                  Corrélation: <strong>{cell.formattedValue}</strong>
                </Typography>
              </Box>
            )}
          />
        </Box>
        </Box>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#ef4444', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation positive forte</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#fbbf24', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation positive modérée</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#10b981', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation négative modérée</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#3b82f6', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation négative forte</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedHeatmapChart;