'use client';

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { QuestionStatistics } from '@/utils/statistics';
import DetailedQuestionAnalysis from '@/components/Visualization/DetailedQuestionAnalysis';

interface VirtualizedQuestionsListProps {
  questions: QuestionStatistics[];
  totalRespondents: number;
  windowHeight?: number;
}

const VirtualizedQuestionsList: React.FC<VirtualizedQuestionsListProps> = ({ 
  questions, 
  totalRespondents,
  windowHeight = 600
}) => {
  // Handle case where there are no questions
  if (!questions || questions.length === 0) {
    return (
      <Box sx={{ height: windowHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Aucune question à afficher
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: windowHeight, overflowY: 'auto' }}>
      <Grid container spacing={3}>
        {questions.map((question: QuestionStatistics) => (
          <Grid size={{ xs: 12 }} key={question.questionId}>
            <DetailedQuestionAnalysis 
              question={question} 
              totalRespondents={totalRespondents}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VirtualizedQuestionsList;