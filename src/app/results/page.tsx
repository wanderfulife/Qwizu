'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Alert,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Skeleton,
  IconButton,
  Tooltip,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  QuestionAnswer as QuestionAnswerIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSurveyData } from '@/contexts/SurveyDataContext';
import { QuestionStatistics, ResponseCount } from '@/utils/statistics';
import EnhancedDashboard from '@/components/Visualization/EnhancedDashboard';
import DetailedQuestionAnalysis from '@/components/Visualization/DetailedQuestionAnalysis';
import EnhancedBarChart from '@/components/Visualization/EnhancedBarChart';
import EnhancedPieChart from '@/components/Visualization/EnhancedPieChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`results-tabpanel-${index}`}
      aria-labelledby={`results-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `results-tab-${index}`,
    'aria-controls': `results-tabpanel-${index}`,
  };
}

export default function ResultsPage() {
  const router = useRouter();
  const { processedData } = useSurveyData();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [questionsViewMode, setQuestionsViewMode] = useState<'pagination' | 'virtualization'>('pagination');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [chartMaxItems, setChartMaxItems] = useState(10);
  const [showRawData, setShowRawData] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackToUpload = () => {
    router.push('/');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // In a real implementation, this would export the data
    alert('Export functionality would be implemented here');
  };

  // Prepare data for charts
  const getChartData = (question: QuestionStatistics) => {
    const labels = question.responseCounts.map((r: ResponseCount) => r.label || r.value.toString());
    const data = question.responseCounts.map((r: ResponseCount) => r.count);
    return { labels, data };
  };

  // If no processed data, show an error
  if (!processedData) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handleBackToUpload} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Résultats de l&apos;Analyse
            </Typography>
          </Box>
          
          <Alert severity="warning" sx={{ mt: 4 }}>
            Aucune donnée à afficher. Veuillez d&apos;abord charger et traiter les fichiers.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleBackToUpload}
              startIcon={<ArrowBackIcon />}
            >
              Charger des fichiers
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  const { statistics } = processedData;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: { xs: 2, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
            <IconButton onClick={handleBackToUpload} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Tableau de Bord
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyse complète des résultats du questionnaire
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Actualiser">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exporter">
              <IconButton onClick={handleExport}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Partager">
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card 
              sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                color: 'white',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Répondants
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {statistics.totalRespondents}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total participants
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card 
              sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                color: 'white',
                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Complétion
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {statistics.completionRate}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Taux de réponse
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card 
              sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                color: 'white',
                boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Questions
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {statistics.questions.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Analysées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card 
              sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                color: 'white',
                boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Segments
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  3
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Types de répondants
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Navigation Tabs */}
        <AppBar 
          position="static" 
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="results tabs"
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                icon={<DashboardIcon />} 
                label="Résumé" 
                {...a11yProps(0)} 
                sx={{ minHeight: 56 }}
              />
              <Tab 
                icon={<QuestionAnswerIcon />} 
                label="Questions" 
                {...a11yProps(1)} 
                sx={{ minHeight: 56 }}
              />
              <Tab 
                icon={<BarChartIcon />} 
                label="Visualisations" 
                {...a11yProps(2)} 
                sx={{ minHeight: 56 }}
              />
              <Tab 
                icon={<TableChartIcon />} 
                label="Données brutes" 
                {...a11yProps(3)} 
                sx={{ minHeight: 56 }}
              />
            </Tabs>
          </Toolbar>
        </AppBar>
        
        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid size={12} key={item}>
                  <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EnhancedDashboard processedData={processedData} />
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {isLoading ? (
            <Grid container spacing={3}>
              {[1, 2].map((item) => (
                <Grid size={12} key={item}>
                  <Skeleton variant="rounded" height={300} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Analyse détaillée par question
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Questions/page</InputLabel>
                    <Select
                      value={itemsPerPage}
                      label="Questions/page"
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={15}>15</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      onClick={() => setQuestionsViewMode('pagination')}
                      color={questionsViewMode === 'pagination' ? 'primary' : 'default'}
                      size="small"
                    >
                      <ViewListIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => setQuestionsViewMode('virtualization')}
                      color={questionsViewMode === 'virtualization' ? 'primary' : 'default'}
                      size="small"
                    >
                      <ViewModuleIcon />
                    </IconButton>
                  </Box>
                  
                  <Button 
                    startIcon={<FilterIcon />} 
                    variant="outlined" 
                    size="small"
                  >
                    Filtrer
                  </Button>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {statistics.questions.slice(0, 10).map((question: QuestionStatistics) => (
                  <Grid size={{ xs: 12 }} key={question.questionId}>
                    <DetailedQuestionAnalysis 
                      question={question} 
                      totalRespondents={statistics.totalRespondents}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {statistics.questions.length > 10 && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Affichage de 10 questions sur {statistics.questions.length}. 
                    Utilisez les filtres pour explorer davantage.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {isLoading ? (
            <Grid container spacing={3}>
              {[1, 2].map((item) => (
                <Grid size={12} key={item}>
                  <Skeleton variant="rounded" height={400} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Visualisations des données
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Max items/graph</InputLabel>
                    <Select
                      value={chartMaxItems}
                      label="Max items/graph"
                      onChange={(e) => setChartMaxItems(Number(e.target.value))}
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={15}>15</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button 
                    startIcon={<DownloadIcon />} 
                    variant="outlined" 
                    size="small"
                  >
                    Exporter
                  </Button>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {statistics.questions.slice(0, 4).map((question: QuestionStatistics, index: number) => {
                  const chartData = getChartData(question);
                  return (
                    <Grid size={{ xs: 12, md: 6 }} key={question.questionId}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            {question.questionText}
                          </Typography>
                          {index % 2 === 0 ? (
                            <EnhancedBarChart 
                              title=""
                              labels={chartData.labels}
                              data={chartData.data}
                              maxItemsToShow={chartMaxItems}
                            />
                          ) : (
                            <EnhancedPieChart 
                              title=""
                              labels={chartData.labels}
                              data={chartData.data}
                              maxItemsToShow={chartMaxItems}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showRawData}
                  onChange={(e) => setShowRawData(e.target.checked)}
                  color="primary"
                />
              }
              label="Afficher les données brutes"
            />
          </Box>
          
          {showRawData ? (
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '2rem'
                }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Données brutes
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Dans une implémentation complète, ce tableau afficherait les réponses brutes avec des fonctionnalités de tri et de filtrage.
              </Typography>
              <Typography>
                Pour des jeux de données volumineux, cela inclurait la pagination et la virtualisation des lignes.
              </Typography>
            </Alert>
          ) : (
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '2rem'
                }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Données brutes
              </Typography>
              <Typography sx={{ mb: 2 }}>
              Le tableau des réponses brutes sera affiché ici dans la version complète.
            </Typography>
              <Typography>
              Cette section permettra de filtrer et trier les donnÃ©es par rÃ©pondant ou par question.
            </Typography>
            </Alert>
          )}
        </TabPanel>
      </Box>
      
      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="export" 
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)'
        }}
        onClick={handleExport}
      >
        <DownloadIcon />
      </Fab>
    </Container>
  );
}