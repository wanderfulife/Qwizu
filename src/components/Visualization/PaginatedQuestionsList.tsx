'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Pagination, 
  PaginationItem,
  Stack,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { QuestionStatistics, ResponseCount } from '@/utils/statistics';

interface PaginatedQuestionsListProps {
  questions: QuestionStatistics[];
  totalRespondents: number;
  itemsPerPage?: number;
}

const PaginatedQuestionsList: React.FC<PaginatedQuestionsListProps> = ({ 
  questions, 
  totalRespondents,
  itemsPerPage = 5 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination values
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <Stack spacing={3}>
        {currentQuestions.map((question: QuestionStatistics) => (
          <Card key={question.questionId} sx={{ height: '100%' }}>
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
      </Stack>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem 
                {...item} 
                sx={{ 
                  '&.Mui-selected': { 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    fontWeight: 600
                  } 
                }} 
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default PaginatedQuestionsList;