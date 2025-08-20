'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Tabs,
  Tab,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { QuestionStatistics } from '@/utils/statistics';
import EnhancedBarChart from './EnhancedBarChart';
import EnhancedPieChart from './EnhancedPieChart';
import EnhancedLineChart from './EnhancedLineChart';

interface DetailedQuestionAnalysisProps {
  question: QuestionStatistics;
  totalRespondents: number;
}

const DetailedQuestionAnalysis: React.FC<DetailedQuestionAnalysisProps> = ({ 
  question, 
  totalRespondents 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Prepare data for charts
  const labels = question.responseCounts.map(r => r.label || r.value.toString());
  const counts = question.responseCounts.map(r => r.count);
  
  // Find top responses
  const topResponses = [...question.responseCounts]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  // Calculate response rate
  const responseRate = Math.round((question.totalResponses / totalRespondents) * 100);
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {question.questionText}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`${question.totalResponses}/${totalRespondents} réponses`} 
                size="small"
                color={responseRate > 80 ? 'success' : responseRate > 50 ? 'primary' : 'default'}
              />
              <Chip 
                label={`${responseRate}% de taux de réponse`} 
                size="small"
                variant="outlined"
              />
              <Chip 
                label={question.responseType} 
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
        
        <Tabs 
          value={activeTab} 
          onChange={handleChange} 
          aria-label="question analysis tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<BarChartIcon />} 
            label="Barres" 
            sx={{ minHeight: 48 }}
          />
          <Tab 
            icon={<PieChartIcon />} 
            label="Camembert" 
            sx={{ minHeight: 48 }}
          />
          <Tab 
            icon={<LineChartIcon />} 
            label="Ligne" 
            sx={{ minHeight: 48 }}
          />
          <Tab 
            icon={<InsightsIcon />} 
            label="Détails" 
            sx={{ minHeight: 48 }}
          />
        </Tabs>
        
        <Box sx={{ mt: 2, minHeight: 200 }}>
          {activeTab === 0 && (
            <EnhancedBarChart 
              title=""
              labels={labels}
              data={counts}
              maxItemsToShow={10}
            />
          )}
          {activeTab === 1 && (
            <EnhancedPieChart 
              title=""
              labels={labels}
              data={counts}
              maxItemsToShow={8}
            />
          )}
          {activeTab === 2 && (
            <EnhancedLineChart 
              title=""
              labels={labels}
              data={counts}
              maxItemsToShow={10}
            />
          )}
          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon fontSize="small" /> Top réponses
                  </Typography>
                  <List dense>
                    {topResponses.map((response, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'}
                            sx={{ width: 20, height: 20, fontSize: '0.7rem' }}
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={response.label || response.value.toString()} 
                          secondary={`${response.count} réponses (${response.percentage}%)`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Statistiques
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary="Nombre total de réponses" 
                        secondary={question.totalResponses.toString()}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary="Réponses non données" 
                        secondary={question.skippedResponses.toString()}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary="Options de réponse" 
                        secondary={question.responseCounts.length.toString()}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary="Taux de réponse" 
                        secondary={`${responseRate}%`}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DetailedQuestionAnalysis;