'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import { 
  Info as InfoIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { QuestionStatistics } from '@/utils/statistics';
import { useSurveyData } from '@/contexts/SurveyDataContext';
import { calculateCorrelationMatrix } from '@/utils/correlation';

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
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showFullPage, setShowFullPage] = React.useState(false);
  const [tooltipData, setTooltipData] = useState<{ 
    visible: boolean; 
    content: React.ReactNode; 
    position: { x: number; y: number } 
  } | null>(null);
  const [pinnedTooltip, setPinnedTooltip] = useState<{ 
    content: React.ReactNode; 
    position: { x: number; y: number } 
  } | null>(null);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate actual correlation matrix from the data
  const { heatmapData, fullLabels } = useMemo(() => {
    if (!processedData || !processedData.mappedData || data.length === 0) {
      // Return empty data if no processed data
      return { heatmapData: [] as HeatmapDataItem[], fullLabels: [] };
    }
    
    try {
      // Calculate correlation matrix using real data
      const correlationMatrix = calculateCorrelationMatrix(processedData.mappedData, data);
      
      // Create full labels without truncation
      const fullLabels = data.map(q => q.questionText);
      
      // Format data for triangular display (upper triangle only)
      const heatmapData: HeatmapDataItem[] = [];
      const labels = data.map((q) => {
        // Create abbreviated labels for better readability
        if (q.questionText.length > 35) {
          // Extract key phrases or first part of the question
          const parts = q.questionText.split(/[.!?]/);
          if (parts.length > 1) {
            return parts[0].length > 35 ? `${parts[0].substring(0, 32)}...` : parts[0];
          }
          // For questions with separators, try to find key parts
          const separators = [' - ', ' : ', ' ; ', ' | '];
          for (const sep of separators) {
            if (q.questionText.includes(sep)) {
              const firstPart = q.questionText.split(sep)[0];
              return firstPart.length > 35 ? `${firstPart.substring(0, 32)}...` : firstPart;
            }
          }
          return `${q.questionText.substring(0, 32)}...`;
        }
        return q.questionText;
      });
      
      for (let i = 0; i < correlationMatrix.length; i++) {
        for (let j = i; j < correlationMatrix.length; j++) { // Only upper triangle
          heatmapData.push({
            x: labels[j],
            y: labels[i],
            v: correlationMatrix[i][j]
          });
        }
      }
      
      return {
        heatmapData,
        fullLabels
      };
    } catch (error) {
      console.error('Error calculating correlation matrix:', error);
      // Return empty data if error occurs
      return { heatmapData: [] as HeatmapDataItem[], fullLabels: [] };
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
  
  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  // Handle fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement && fullscreenContainerRef.current) {
      fullscreenContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Handle full page view
  const handleFullPageView = () => {
    setShowFullPage(true);
  };
  
  // Close full page view
  const closeFullPageView = () => {
    setShowFullPage(false);
  };
  
  // Handle tooltip positioning
  const handleTooltip = (cell: unknown, event: React.MouseEvent) => {
    if (!chartContainerRef.current) return;
    
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Smart positioning to avoid covering adjacent cells
    const tooltipX = x > rect.width / 2 ? x - 250 : x + 20;
    const tooltipY = y > rect.height / 2 ? y - 100 : y + 20;
    
    // Type guard for cell object
    if (typeof cell !== 'object' || cell === null || !('data' in cell) || !('serieId' in cell)) {
      return;
    }
    
    const typedCell = cell as { data: { x: string; y: number }; serieId: string };
    
    // Get full question texts
    const xIndex = fullLabels.findIndex(label => 
      typedCell.data.x.includes(label.substring(0, Math.min(32, label.length)))
    );
    const yIndex = fullLabels.findIndex(label => 
      typedCell.serieId.includes(label.substring(0, Math.min(32, label.length)))
    );
    
    const xLabel = xIndex !== -1 ? fullLabels[xIndex] : typedCell.data.x;
    const yLabel = yIndex !== -1 ? fullLabels[yIndex] : typedCell.serieId;
    
    setTooltipData({
      visible: true,
      content: (
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          padding: '16px', 
          borderRadius: '8px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          maxWidth: '350px',
          wordBreak: 'break-word',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(229, 231, 235, 0.8)'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
            {yLabel}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
            vs {xLabel}
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151' }}>
            Corrélation: <strong style={{ 
              color: typedCell.data.y > 0.5 ? '#2E86AB' : 
                     typedCell.data.y > 0 ? '#7FB3D3' : 
                     typedCell.data.y < -0.5 ? '#E74C3C' : 
                     typedCell.data.y < 0 ? '#F1948A' : '#F7F9FC'
            }}>{typedCell.data.y.toFixed(3)}</strong>
          </Typography>
        </Box>
      ),
      position: { x: tooltipX, y: tooltipY }
    });
  };
  
  // Pin tooltip on click
  const handleCellClick = (cell: unknown, event: React.MouseEvent) => {
    if (!chartContainerRef.current) return;
    
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Position pinned tooltip
    const tooltipX = Math.min(x + 20, rect.width - 250);
    const tooltipY = Math.min(y + 20, rect.height - 150);
    
    // Type guard for cell object
    if (typeof cell !== 'object' || cell === null || !('data' in cell) || !('serieId' in cell)) {
      return;
    }
    
    const typedCell = cell as { data: { x: string; y: number }; serieId: string };
    
    // Get full question texts
    const xIndex = fullLabels.findIndex(label => 
      typedCell.data.x.includes(label.substring(0, Math.min(32, label.length)))
    );
    const yIndex = fullLabels.findIndex(label => 
      typedCell.serieId.includes(label.substring(0, Math.min(32, label.length)))
    );
    
    const xLabel = xIndex !== -1 ? fullLabels[xIndex] : typedCell.data.x;
    const yLabel = yIndex !== -1 ? fullLabels[yIndex] : typedCell.serieId;
    
    setPinnedTooltip({
      content: (
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          padding: '16px', 
          borderRadius: '8px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          maxWidth: '350px',
          wordBreak: 'break-word',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          cursor: 'pointer'
        }}
        onClick={(event) => event.stopPropagation()}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
            {yLabel}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
            vs {xLabel}
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151' }}>
            Corrélation: <strong style={{ 
              color: typedCell.data.y > 0.5 ? '#2E86AB' : 
                     typedCell.data.y > 0 ? '#7FB3D3' : 
                     typedCell.data.y < -0.5 ? '#E74C3C' : 
                     typedCell.data.y < 0 ? '#F1948A' : '#F7F9FC'
            }}>{typedCell.data.y.toFixed(3)}</strong>
          </Typography>
        </Box>
      ),
      position: { x: tooltipX, y: tooltipY }
    });
  };
  
  // Close pinned tooltip
  const closePinnedTooltip = () => {
    setPinnedTooltip(null);
  };
  
  // Hide tooltip when mouse leaves chart area
  const hideTooltip = () => {
    setTooltipData(null);
  };
  
  // Handle mouse move for highlighting
  const handleMouseMove = () => {
    // This could be extended to highlight rows/columns
  };
  
  // Handle escape key for full page view
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFullPage) {
        closeFullPageView();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showFullPage]);
  
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
  
  // Full page view
  if (showFullPage) {
    return (
      <Box 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2, 
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Box>
            <IconButton onClick={handleZoomOut} sx={{ mr: 1 }}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleZoomIn} sx={{ mr: 1 }}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={closeFullPageView}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box 
          ref={chartContainerRef}
          sx={{ 
            flexGrow: 1,
            position: 'relative',
            minHeight: 0
          }}
          onMouseLeave={hideTooltip}
          onMouseMove={handleMouseMove}
          onClick={closePinnedTooltip}
        >
          <ResponsiveHeatMap
            data={nivoData}
            margin={{ top: 150, right: 80, bottom: 30, left: 150 }}
            valueFormat={value => value.toFixed(2)}
            axisTop={{
              tickSize: 8,
              tickPadding: 10,
              tickRotation: -45,
              legend: '',
              legendOffset: 40
            }}
            axisRight={undefined}
            axisBottom={null}
            axisLeft={{
              tickSize: 8,
              tickPadding: 10,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: -70
            }}
            colors={{
              type: 'diverging',
              scheme: 'red_blue',
              minValue: -1,
              maxValue: 1
            }}
            emptyColor="rgba(255, 255, 255, 0.95)"
            legends={[
              {
                anchor: 'bottom-right',
                translateX: 70,
                translateY: -130,
                length: 280,
                thickness: 22,
                direction: 'column',
                title: 'Corrélation',
                titleOffset: 15
              }
            ]}
            hoverTarget="cell"
            borderWidth={1}
            borderColor="rgba(229, 231, 235, 0.8)"
            enableGridX={true}
            enableGridY={true}
            animate={true}
            isInteractive={true}
            onMouseEnter={handleTooltip}
            onClick={handleCellClick}
            tooltip={() => null}
          />
          
          {tooltipData && tooltipData.visible && (
            <Box 
              sx={{ 
                position: 'absolute',
                left: `${tooltipData.position.x}px`,
                top: `${tooltipData.position.y}px`,
                zIndex: 1000,
                pointerEvents: 'none'
              }}
            >
              {tooltipData.content}
            </Box>
          )}
          
          {pinnedTooltip && (
            <Box 
              sx={{ 
                position: 'absolute',
                left: `${pinnedTooltip.position.x}px`,
                top: `${pinnedTooltip.position.y}px`,
                zIndex: 1001
              }}
              onClick={closePinnedTooltip}
            >
              {pinnedTooltip.content}
            </Box>
          )}
        </Box>
      </Box>
    );
  }
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative',
        minHeight: '800px'
      }}
    >
      <CardContent 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          p: isFullscreen ? 1 : 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minWidth: 0, pr: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, flexShrink: 0, lineHeight: 1.2 }}>
              {title}
            </Typography>
            <Tooltip 
              title="Cette matrice montre les corrélations entre différentes questions. Les valeurs proches de 1 indiquent une forte corrélation positive, tandis que les valeurs proches de -1 indiquent une forte corrélation négative."
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
            <IconButton size="small" onClick={handleFullscreen}>
              <FullscreenIcon fontSize="small" />
            </IconButton>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleFullPageView}
              sx={{ 
                ml: 1, 
                fontSize: '0.75rem',
                minWidth: 'auto',
                px: 1
              }}
            >
              Vue complète
            </Button>
          </Box>
        </Box>
        
        <Box 
          ref={fullscreenContainerRef}
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '300px',
            position: 'relative'
          }}
          onClick={closePinnedTooltip}
        >
          <Box 
            ref={chartContainerRef}
            sx={{ 
              height: isFullscreen ? '90vh' : `${Math.max(800, data.length * 40) * zoomLevel}px`, 
              width: '100%',
              position: 'relative',
              flexGrow: 1,
              minHeight: '600px',
              minWidth: '1000px',
              boxSizing: 'border-box'
            }}
            onMouseLeave={hideTooltip}
            onMouseMove={handleMouseMove}
          >
            <ResponsiveHeatMap
              data={nivoData}
              margin={{ top: 150, right: 80, bottom: 30, left: 150 }}
              valueFormat={value => value.toFixed(2)}
              axisTop={{
                tickSize: 8,
                tickPadding: 10,
                tickRotation: -45,
                legend: '',
                legendOffset: 40
              }}
              axisRight={undefined}
              axisBottom={null}
              axisLeft={{
                tickSize: 8,
                tickPadding: 10,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: -70
              }}
              colors={{
                type: 'diverging',
                scheme: 'red_blue',
                minValue: -1,
                maxValue: 1
              }}
              emptyColor="rgba(255, 255, 255, 0.95)"
              legends={[
                {
                  anchor: 'bottom-right',
                  translateX: 70,
                  translateY: -130,
                  length: 280,
                  thickness: 22,
                  direction: 'column',
                  title: 'Corrélation',
                  titleOffset: 15
                }
              ]}
              hoverTarget="cell"
              borderWidth={1}
              borderColor="rgba(229, 231, 235, 0.8)"
              enableGridX={true}
              enableGridY={true}
              animate={true}
              isInteractive={true}
              onMouseEnter={handleTooltip}
              onClick={handleCellClick}
              tooltip={() => null}
            />
            
            {tooltipData && tooltipData.visible && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  left: `${tooltipData.position.x}px`,
                  top: `${tooltipData.position.y}px`,
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}
              >
                {tooltipData.content}
              </Box>
            )}
            
            {pinnedTooltip && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  left: `${pinnedTooltip.position.x}px`,
                  top: `${pinnedTooltip.position.y}px`,
                  zIndex: 1001
                }}
                onClick={closePinnedTooltip}
              >
                {pinnedTooltip.content}
              </Box>
            )}
          </Box>
        </Box>
        
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 1, sm: 2 }, 
          flexWrap: 'wrap',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#e74c3c', flexShrink: 0, borderRadius: '2px' }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation négative forte</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#f1948a', flexShrink: 0, borderRadius: '2px' }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation négative modérée</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#f7f9fc', flexShrink: 0, borderRadius: '2px' }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation neutre</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#7fb3d3', flexShrink: 0, borderRadius: '2px' }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation positive modérée</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#2e86ab', flexShrink: 0, borderRadius: '2px' }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Corrélation positive forte</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedHeatmapChart;