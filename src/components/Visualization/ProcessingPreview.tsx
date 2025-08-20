'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Grid,
  Skeleton
} from '@mui/material';
import { 
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { ProcessedSurveyData } from '@/lib/surveyProcessor';
import { QuestionStatistics } from '@/utils/statistics';
import EnhancedBarChart from './EnhancedBarChart';
import EnhancedPieChart from './EnhancedPieChart';

interface ProcessingPreviewProps {
  processedData: ProcessedSurveyData;
}

const ProcessingPreview: React.FC<ProcessingPreviewProps> = ({ processedData }) => {
  const { statistics } = processedData;
  
  // Get top questions by response count for preview
  const topQuestions = [...statistics.questions]
    .sort((a, b) => b.totalResponses - a.totalResponses)
    .slice(0, 2); // Only show 2 questions in preview

  // Get a representative question for charts
  const representativeQuestion = statistics.questions.length > 0 ? statistics.questions[0] : null;

  if (!representativeQuestion) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" align="center">
          Aucune donnée à afficher
        </Typography>
      </Box>
    );
  }

  // Prepare data for charts
  const chartLabels = representativeQuestion.responseCounts.map(r => r.label || r.value.toString());
  const chartData = representativeQuestion.responseCounts.map(r => r.count);

  return (
    <Box>
      {/* Summary Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <PeopleIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {statistics.totalRespondents}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Répondants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {statistics.questions.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Questions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Sample Visualization */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Aperçu des résultats
          </Typography>
          <Chip 
            label="Échantillon" 
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
              {representativeQuestion.questionText.length > 50 
                ? `${representativeQuestion.questionText.substring(0, 50)}...` 
                : representativeQuestion.questionText}
            </Typography>
            
            <Box sx={{ height: 120 }}>
              {chartLabels.length > 3 ? (
                <EnhancedBarChart 
                  title=""
                  labels={chartLabels}
                  data={chartData}
                  maxItemsToShow={5}
                  showPercentages={false}
                />
              ) : (
                <EnhancedPieChart 
                  title=""
                  labels={chartLabels}
                  data={chartData}
                  maxItemsToShow={5}
                  showPercentages={false}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Key Insights */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Questions principales
        </Typography>
        
        <Box sx={{ 
          maxHeight: 120, 
          overflow: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 3
          }
        }}>
          {topQuestions.map((question: QuestionStatistics) => (
            <Box 
              key={question.questionId} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {question.questionText.length > 30 
                  ? `${question.questionText.substring(0, 30)}...` 
                  : question.questionText}
              </Typography>
              <Chip 
                label={question.totalResponses} 
                size="small"
                variant="outlined"
                sx={{ minWidth: 32 }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Loading skeleton for processing state
export const ProcessingPreviewSkeleton: React.FC = () => {
  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={6}>
          <Skeleton variant="rounded" height={80} />
        </Grid>
        <Grid size={6}>
          <Skeleton variant="rounded" height={80} />
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={150} />
      </Box>
      
      <Box>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
};

export default ProcessingPreview;