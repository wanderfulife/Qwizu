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
  FormControlLabel
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { ProcessedSurveyData } from '@/lib/surveyProcessor';
import { QuestionStatistics } from '@/utils/statistics';
import EnhancedBarChart from './EnhancedBarChart';
import EnhancedPieChart from './EnhancedPieChart';
import HeatmapChart from './HeatmapChart';
import ResponseDistributionChart from './ResponseDistributionChart';
import FlowComparisonChart from './FlowComparisonChart';
import SegmentComparison from './SegmentComparison';

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

  // Filter questions by flow type
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

  // Get top questions by response count
  const topQuestions = useMemo(() => {
    return [...filteredQuestions]
      .sort((a, b) => b.totalResponses - a.totalResponses)
      .slice(0, 6);
  }, [filteredQuestions]);

  const handleFlowChange = (flow: string) => {
    setSelectedFlow(flow);
  };

  const handleQuestionTypeChange = (questionType: string) => {
    setSelectedQuestionType(questionType);
  };

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment);
  };

  const handleChartTypeChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value);
  };

  const handleMaxItemsChange = (event: SelectChangeEvent) => {
    setMaxItemsToShow(Number(event.target.value));
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
          <FlowComparisonChart 
            flowData={processedData.statistics.flowDistribution} 
            totalRespondents={processedData.statistics.totalRespondents}
          />
        </CardContent>
      </Card>
      
      {/* Segment Comparison */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <SegmentComparison processedData={processedData} />
        </CardContent>
      </Card>
      
      
      {/* Key Insights */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
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
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Matrice de corrélation (exemple)
              </Typography>
              <HeatmapChart 
                data={processedData.statistics.questions.slice(0, 5)} 
                title="Corrélation entre les réponses"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Detailed Question Visualizations */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Visualisations détaillées par question
      </Typography>
      
      <Grid container spacing={3}>
        {topQuestions.map((question: QuestionStatistics) => (
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
    </Box>
  );
};

export default EnhancedDashboard;