'use client';

import React, { useState, useRef } from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Chip } from '@mui/material';
import { QuestionStatistics, ResponseCount } from '@/utils/statistics';

interface VirtualizedQuestionsListProps {
  questions: QuestionStatistics[];
  totalRespondents: number;
  itemHeight?: number;
  windowHeight?: number;
}

const VirtualizedQuestionsList: React.FC<VirtualizedQuestionsListProps> = ({ 
  questions, 
  totalRespondents,
  itemHeight = 300,
  windowHeight = 600
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate visible items
  const visibleItemsCount = Math.ceil(windowHeight / itemHeight) + 2; // Add buffer
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemsCount, questions.length);
  
  const visibleQuestions = questions.slice(startIndex, endIndex);
  const totalHeight = questions.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

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
            top: offsetY,
            width: '100%'
          }}
        >
          {visibleQuestions.map((question: QuestionStatistics) => (
            <Card 
              key={question.questionId} 
              sx={{ 
                height: itemHeight - 20, 
                mb: 2,
                scrollMargin: scrollTop
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {question.questionText}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {question.totalResponses} réponses sur {totalRespondents} répondants
                </Typography>
                
                <List>
                  {question.responseCounts.map((response: ResponseCount) => (
                    <ListItem key={response.value.toString()}>
                      <ListItemText 
                        primary={response.label || response.value.toString()} 
                        secondary={`${response.count} réponses`} 
                      />
                      <Chip 
                        label={`${response.percentage}%`} 
                        color={response.percentage > 30 ? 'primary' : response.percentage > 15 ? 'secondary' : 'default'}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default VirtualizedQuestionsList;