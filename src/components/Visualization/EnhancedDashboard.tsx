'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Switch,
  FormControlLabel,
  Pagination,
  Alert
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { ProcessedSurveyData } from '@/lib/surveyProcessor';
import { QuestionStatistics } from '@/utils/statistics';
import EnhancedBarChart from './EnhancedBarChart';
import EnhancedPieChart from './EnhancedPieChart';
import HeatmapChart from './EnhancedHeatmapChart';
import ResponseDistributionChart from './ResponseDistributionChart';
import FlowComparisonChart from './FlowComparisonChart';

import DashboardFilters from './DashboardFilters';
import ExportVisualization from './ExportVisualization';

interface EnhancedDashboardProps {
  processedData: ProcessedSurveyData;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ processedData }) => {
  const [selectedFlow, setSelectedFlow] = useState<string>('ALL');
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('ALL');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [chartType, setChartType] = useState<string>('bar');
  const [showPercentages, setShowPercentages] = useState<boolean>(true);
  const [maxItemsToShow, setMaxItemsToShow] = useState<number>(10);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter questions by flow type and question type
  const filteredQuestions = useMemo(() => {
    let questions = processedData.statistics.questions;
    
    // Filter by flow type
    if (selectedFlow !== 'ALL') {
      questions = questions.filter(question => {
        if (selectedFlow === 'MONTANTS') {
          return question.questionId.includes('_MONTANTS') || question.questionId === 'Q1';
        } else if (selectedFlow === 'ACCOMPAGNATEURS') {
          return question.questionId.includes('_ACCOMPAGNATEURS') || question.questionId === 'Q1';
        } else if (selectedFlow === 'DESCENDANTS') {
          return question.questionId === 'Q1';
        }
        return true;
      });
    }
    
    // Filter by question type
    if (selectedQuestionType !== 'ALL') {
      questions = questions.filter(question => question.responseType === selectedQuestionType);
    }
    
    return questions;
  }, [processedData.statistics.questions, selectedFlow, selectedQuestionType]);

  // Use the original flow distribution data
  const flowDistribution = processedData.statistics.flowDistribution;

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  
  // Get questions for current page
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  // Get top questions by response count (from filtered set)
  const topQuestions = useMemo(() => {
    return [...filteredQuestions]
      .sort((a, b) => b.totalResponses - a.totalResponses)
      .slice(0, 6);
  }, [filteredQuestions]);

  const handleFlowChange = (flow: string) => {
    setSelectedFlow(flow);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleQuestionTypeChange = (questionType: string) => {
    setSelectedQuestionType(questionType);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleChartTypeChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value);
  };

  const handleMaxItemsChange = (event: SelectChangeEvent) => {
    setMaxItemsToShow(Number(event.target.value));
  };

  const handleItemsPerPageChange = (event: SelectChangeEvent) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const renderChart = (question: QuestionStatistics) => {
    const labels = question.responseCounts.map(r => r.label || r.value.toString());
    const data = question.responseCounts.map(r => showPercentages ? r.percentage : r.count);
    
    switch (chartType) {
      case 'bar':
        return (
          <EnhancedBarChart 
            title=""
            labels={labels}
            data={data}
            maxItemsToShow={maxItemsToShow}
            showPercentages={showPercentages}
          />
        );
      case 'pie':
        return (
          <EnhancedPieChart 
            title=""
            labels={labels}
            data={data}
            maxItemsToShow={maxItemsToShow}
            showPercentages={showPercentages}
          />
        );
      default:
        return (
          <EnhancedBarChart 
            title=""
            labels={labels}
            data={data}
            maxItemsToShow={maxItemsToShow}
            showPercentages={showPercentages}
          />
        );
    }
  };

  return (
    <Box>
      {/* Dashboard Filters */}
      <DashboardFilters 
        onFlowChange={handleFlowChange}
        onQuestionTypeChange={handleQuestionTypeChange}
        onSegmentChange={handleSegmentChange}
        selectedFlow={selectedFlow}
        selectedQuestionType={selectedQuestionType}
        selectedSegment={selectedSegment}
      />
      
      {/* Chart Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3, 
        flexWrap: 'wrap', 
        gap: 2,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Contrôles de visualisation
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type de graphique</InputLabel>
            <Select
              value={chartType}
              label="Type de graphique"
              onChange={handleChartTypeChange}
            >
              <MenuItem value="bar">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon fontSize="small" /> Barres
                </Box>
              </MenuItem>
              <MenuItem value="pie">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PieChartIcon fontSize="small" /> Camembert
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Max items</InputLabel>
            <Select
              value={maxItemsToShow.toString()}
              label="Max items"
              onChange={handleMaxItemsChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Questions/page</InputLabel>
            <Select
              value={itemsPerPage.toString()}
              label="Questions/page"
              onChange={handleItemsPerPageChange}
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={showPercentages}
                onChange={(e) => setShowPercentages(e.target.checked)}
                color="primary"
              />
            }
            label="Pourcentages"
          />
          
          <ExportVisualization onExport={(format, includeData) => {
            alert(`Exporting in ${format} format. Include data: ${includeData}`);
            // In a real implementation, this would export the current visualization
          }} />
        </Box>
      </Box>
      
      
      {/* Flow Distribution */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Distribution des répondants par segment
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Répartition des répondants selon leur type d&apos;expérience utilisateur
          </Typography>
          <FlowComparisonChart 
            flowData={flowDistribution} 
            totalRespondents={processedData.statistics.totalRespondents}
          />
        </CardContent>
      </Card>
      
      
      {/* Response Distribution Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Questions les plus répondues
              </Typography>
              <ResponseDistributionChart 
                questions={topQuestions} 
                showPercentages={showPercentages}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Full-width Correlation Matrix */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Matrice de corrélation
          </Typography>
          <Box sx={{ minHeight: '700px' }}>
            <HeatmapChart 
              data={filteredQuestions} 
              title="Corrélation entre les réponses"
            />
          </Box>
        </CardContent>
      </Card>
      
      {/* Detailed Question Visualizations */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Visualisations détaillées par question
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredQuestions.length} question(s) trouvée(s)
        </Typography>
      </Box>
      
      {filteredQuestions.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
          Aucune question ne correspond aux filtres sélectionnés.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedQuestions.map((question: QuestionStatistics) => (
              <Grid size={{ xs: 12, md: 6 }} key={question.questionId}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {question.questionText}
                      </Typography>
                      <Chip 
                        label={`${question.totalResponses} réponses`} 
                        size="small"
                        color={question.totalResponses > processedData.statistics.totalRespondents * 0.8 ? 'primary' : 'default'}
                      />
                    </Box>
                    <Box sx={{ minHeight: 200 }}>
                      {renderChart(question)}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default EnhancedDashboard;