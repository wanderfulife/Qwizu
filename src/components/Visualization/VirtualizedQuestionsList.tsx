'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  LinearProgress,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { QuestionStatistics, ResponseCount } from '@/utils/statistics';

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
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeightsRef = useRef<Record<string, number>>({});

  // Calculate dynamic item heights based on content
  const getItemHeight = useCallback((question: QuestionStatistics): number => {
    // Check if we've already calculated this item's height
    if (itemHeightsRef.current[question.questionId]) {
      return itemHeightsRef.current[question.questionId];
    }
    
    // Base height for question text and metadata
    const baseHeight = 150;
    
    // Height for each response item (approximately 50px each)
    const responseItemsHeight = question.responseCounts.length * 50;
    
    // Add some padding
    const padding = 50;
    
    // Return total height, with a minimum of 200px and maximum of 800px
    const height = Math.min(Math.max(baseHeight + responseItemsHeight + padding, 200), 800);
    itemHeightsRef.current[question.questionId] = height;
    return height;
  }, []);

  // Calculate cumulative heights for all items
  const cumulativeHeights = useCallback(() => {
    if (!questions || questions.length === 0) {
      return [0];
    }
    
    const cumulative = [0];
    for (let i = 0; i < questions.length; i++) {
      cumulative.push(cumulative[cumulative.length - 1] + getItemHeight(questions[i]));
    }
    return cumulative;
  }, [questions, getItemHeight]);

  // Get visible range based on scroll position
  const getVisibleRange = useCallback(() => {
    const cumHeights = cumulativeHeights();
    
    // Handle empty questions case
    if (!questions || questions.length === 0 || cumHeights.length <= 1) {
      return { start: 0, end: 0, offset: 0 };
    }

    // Find the first visible item
    let start = 0;
    for (let i = 0; i < cumHeights.length - 1; i++) {
      if (cumHeights[i] <= scrollTop) {
        start = i;
      } else {
        break;
      }
    }

    // Find the last visible item
    let end = start;
    const visibleAreaEnd = scrollTop + windowHeight + 300; // Add buffer
    for (let i = start; i < cumHeights.length - 1; i++) {
      if (cumHeights[i] <= visibleAreaEnd) {
        end = i;
      } else {
        break;
      }
    }

    // Make sure we don't go out of bounds
    end = Math.min(end, questions.length - 1);
    start = Math.max(0, start);

    // Calculate offset
    const offset = cumHeights[start];

    return { start, end, offset };
  }, [scrollTop, windowHeight, questions, cumulativeHeights]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Reset item heights when questions change
  useEffect(() => {
    itemHeightsRef.current = {};
  }, [questions]);

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

  const visibleRange = getVisibleRange();
  const cumHeights = cumulativeHeights();
  const totalHeight = cumHeights[cumHeights.length - 1];
  const visibleQuestions = questions.slice(visibleRange.start, visibleRange.end + 1);

  return (
    <Box 
      ref={containerRef}
      onScroll={handleScroll}
      sx={{ 
        height: windowHeight,
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      <Box sx={{ height: totalHeight, position: 'relative' }}>
        <Box 
          sx={{ 
            position: 'absolute',
            top: visibleRange.offset,
            width: '100%'
          }}
        >
          {visibleQuestions.map((question: QuestionStatistics) => {
            const itemHeight = getItemHeight(question);
            
            return (
              <Card 
                key={question.questionId} 
                sx={{ 
                  height: itemHeight - 20, 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: 3
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    {question.questionText}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="h6" gutterBottom>
                          Réponses
                        </Typography>
                        <Typography variant="body1">
                          {question.totalResponses} réponses sur {totalRespondents} répondants
                        </Typography>
                        <Typography variant="body2">
                          Taux de réponse: {Math.round((question.totalResponses / totalRespondents) * 100)}%
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                        <Typography variant="h6" gutterBottom>
                          Non-réponses
                        </Typography>
                        <Typography variant="body1">
                          {question.skippedResponses} répondants n{`'`}ont pas répondu
                        </Typography>
                        <Typography variant="body2">
                          Taux de non-réponse: {Math.round((question.skippedResponses / totalRespondents) * 100)}%
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Distribution des réponses
                  </Typography>
                  
                  <List>
                    {question.responseCounts.map((response: ResponseCount) => (
                      <ListItem key={response.value.toString()} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <ListItemText 
                            primary={response.label || response.value.toString()} 
                            secondary={`${response.count} réponses`}
                            sx={{ flex: 1 }}
                          />
                          <Chip 
                            label={`${response.percentage}%`} 
                            color={response.percentage > 30 ? 'primary' : response.percentage > 15 ? 'secondary' : 'default'}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={response.percentage} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            mb: 2,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: response.percentage > 30 ? 'primary.main' : response.percentage > 15 ? 'secondary.main' : 'default.main'
                            }
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default VirtualizedQuestionsList;