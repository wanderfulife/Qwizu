'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Grid
} from '@mui/material';
import { ProcessedSurveyData } from '@/lib/surveyProcessor';
import EnhancedBarChart from './EnhancedBarChart';

interface SegmentComparisonProps {
  processedData: ProcessedSurveyData;
}

const SegmentComparison: React.FC<SegmentComparisonProps> = ({ processedData }) => {
  // Get statistics for each flow type
  const montantsStats = processedData.statistics.questions
    .filter(q => q.questionId.includes('_MONTANTS') || q.questionId === 'Q1')
    .slice(0, 5);
    
  const accompagnateursStats = processedData.statistics.questions
    .filter(q => q.questionId.includes('_ACCOMPAGNATEURS') || q.questionId === 'Q1')
    .slice(0, 5);

  // Prepare data for charts
  const getChartData = (questions: { questionText: string; totalResponses: number }[]) => {
    const labels = questions.map(q => q.questionText.substring(0, 30) + (q.questionText.length > 30 ? '...' : ''));
    const data = questions.map(q => q.totalResponses);
    return { labels, data };
  };

  const montantsData = getChartData(montantsStats);
  const accompagnateursData = getChartData(accompagnateursStats);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Comparaison des segments
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'primary.main', fontSize: '0.9rem' }}>
                Preneurs de train
              </Typography>
            </Box>
            <Box sx={{ height: 150 }}>
              <EnhancedBarChart 
                title=""
                labels={montantsData.labels}
                data={montantsData.data}
                maxItemsToShow={5}
              />
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'secondary.main', fontSize: '0.9rem' }}>
                Accompagnateurs
              </Typography>
            </Box>
            <Box sx={{ height: 150 }}>
              <EnhancedBarChart 
                title=""
                labels={accompagnateursData.labels}
                data={accompagnateursData.data}
                maxItemsToShow={5}
                backgroundColors={[
                  'rgba(139, 92, 246, 0.8)',
                  'rgba(167, 139, 250, 0.8)',
                  'rgba(195, 167, 255, 0.8)',
                  'rgba(217, 199, 255, 0.8)',
                  'rgba(238, 230, 255, 0.8)',
                ]}
                borderColors={[
                  'rgba(139, 92, 246, 1)',
                  'rgba(167, 139, 250, 1)',
                  'rgba(195, 167, 255, 1)',
                  'rgba(217, 199, 255, 1)',
                  'rgba(238, 230, 255, 1)',
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SegmentComparison;