'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Button, 
  Card, 
  CardContent, 
  LinearProgress, 
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SurveyProcessor, ProcessedSurveyData } from '@/lib/surveyProcessor';
import { useSurveyData } from '@/contexts/SurveyDataContext';
import RealTimeVisualization from '@/components/Visualization/RealTimeVisualization';
import { useErrorHandler } from '@/utils/errorHandler';

export default function ProcessingPage() {
  const router = useRouter();
  const { surveyContent, responseFile, setProcessedData } = useSurveyData();
  const { handleProcessingError } = useErrorHandler();
  const hasProcessed = useRef(false); // Ref to track if we've already processed the files
  const [processingStatus, setProcessingStatus] = useState('Initialisation du traitement...');
  const [processingSteps, setProcessingSteps] = useState<Array<{ 
    id: number; 
    title: string; 
    status: 'pending' | 'processing' | 'completed' | 'error' 
  }>>([
    { id: 1, title: 'Lecture du fichier de structure', status: 'pending' },
    { id: 2, title: 'Lecture du fichier de réponses Excel', status: 'pending' },
    { id: 3, title: 'Mapping des réponses aux questions', status: 'pending' },
    { id: 4, title: 'Calcul des statistiques', status: 'pending' },
    { id: 5, title: 'Génération des visualisations', status: 'pending' },
    { id: 6, title: 'Finalisation', status: 'pending' }
  ]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ProcessedSurveyData['validationErrors'] | null>(null);
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedDataState] = useState<ProcessedSurveyData | null>(null);

  useEffect(() => {
    // Only process files once
    if (hasProcessed.current) {
      return;
    }
    
    const processFiles = async () => {
      try {
        // Check if we have the required files
        if (!surveyContent || !responseFile) {
          const errorMsg = 'Fichiers manquants. Veuillez revenir à la page de chargement.';
          throw new Error(errorMsg);
        }
        
        // Mark as processed to prevent re-running
        hasProcessed.current = true;
        
        // Update step 1
        setProcessingStatus('Lecture du fichier de structure du questionnaire...');
        setProcessingSteps(prev => prev.map(step => 
          step.id === 1 ? { ...step, status: 'processing' } : step
        ));
        setProgress(15);
        await new Promise(resolve => setTimeout(resolve, 600));
        setProcessingSteps(prev => prev.map(step => 
          step.id === 1 ? { ...step, status: 'completed' } : step
        ));
        
        // Update step 2
        setProcessingStatus('Lecture du fichier de réponses Excel...');
        setProcessingSteps(prev => prev.map(step => 
          step.id === 2 ? { ...step, status: 'processing' } : step
        ));
        setProgress(30);
        await new Promise(resolve => setTimeout(resolve, 600));
        setProcessingSteps(prev => prev.map(step => 
          step.id === 2 ? { ...step, status: 'completed' } : step
        ));
        
        // Update step 3
        setProcessingStatus('Mapping des réponses aux questions...');
        setProcessingSteps(prev => prev.map(step => 
          step.id === 3 ? { ...step, status: 'processing' } : step
        ));
        setProgress(50);
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcessingSteps(prev => prev.map(step => 
          step.id === 3 ? { ...step, status: 'completed' } : step
        ));
        
        // Update step 4
        setProcessingStatus('Calcul des statistiques...');
        setProcessingSteps(prev => prev.map(step => 
          step.id === 4 ? { ...step, status: 'processing' } : step
        ));
        setProgress(70);
        await new Promise(resolve => setTimeout(resolve, 700));
        setProcessingSteps(prev => prev.map(step => 
          step.id === 4 ? { ...step, status: 'completed' } : step
        ));
        
        // Update step 5
        setProcessingStatus('Génération des visualisations...');
        setProcessingSteps(prev => prev.map(step => 
          step.id === 5 ? { ...step, status: 'processing' } : step
        ));
        setProgress(85);
        await new Promise(resolve => setTimeout(resolve, 600));
        setProcessingSteps(prev => prev.map(step => 
          step.id === 5 ? { ...step, status: 'completed' } : step
        ));
        
        // Update step 6
        setProcessingStatus('Finalisation...');
        setProcessingSteps(prev => prev.map(step => 
          step.id === 6 ? { ...step, status: 'processing' } : step
        ));
        setProgress(95);
        
        // Process the files using the survey processor
        const data = await SurveyProcessor.processSurveyData(surveyContent, responseFile);
        
        // Mark step 6 as completed after processing
        setProcessingSteps(prev => prev.map(step => 
          step.id === 6 ? { ...step, status: 'completed' } : step
        ));
        setProgress(100);
        
        // Small delay to ensure step status update is rendered
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Check for validation errors
        if (data.validationErrors) {
          setValidationErrors(data.validationErrors);
        }
        
        setProcessedData(data);
        setProcessedDataState(data);
        
        setIsComplete(true);
        setProcessingStatus('Traitement terminé avec succès !');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Une erreur inconnue est survenue lors du traitement des fichiers.';
        setError(errorMsg);
        handleProcessingError(err);
        console.error(err);
        // Mark current step as error
        setProcessingSteps(prev => prev.map(step => 
          step.status === 'processing' ? { ...step, status: 'error' } : step
        ));
      }
    };

    processFiles();
    
    // Cleanup function to reset the ref when component unmounts
    return () => {
      hasProcessed.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewResults = () => {
    router.push('/results');
  };

  const handleBackToUpload = () => {
    router.push('/');
  };

  const handleRetry = () => {
    // Reset state and try again
    setError(null);
    setIsComplete(false);
    setProgress(0);
    setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
    setProcessingStatus('Initialisation du traitement...');
  };

  const getStatusIcon = (status: 'pending' | 'processing' | 'completed' | 'error') => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'processing':
        return <CircularProgress size={20} />;
      default:
        return <div style={{ width: 20, height: 20 }} />;
    }
  };

  const getStatusText = (status: 'pending' | 'processing' | 'completed' | 'error') => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'error':
        return 'Erreur';
      case 'processing':
        return 'En cours';
      default:
        return 'En attente';
    }
  };

  // Render validation errors in a user-friendly way
  const renderValidationErrors = () => {
    if (!validationErrors) return null;
    
    const hasErrors = Object.values(validationErrors).some(errors => errors && errors.length > 0);
    if (!hasErrors) return null;
    
    return (
      <Accordion sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />} 
          sx={{ 
            bgcolor: 'warning.light', 
            color: 'warning.contrastText',
            '& .MuiAccordionSummary-content': {
              alignItems: 'center'
            }
          }}
        >
          <WarningIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Détails de validation des données
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: 'background.default' }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Les éléments ci-dessous sont des informations de validation qui n&#39;ont pas empêché le traitement de vos données. 
            Certains peuvent être des données légitimes (comme des réponses vides lorsque les répondants n&#39;ont pas répondu 
            à certaines questions), mais d&#39;autres pourraient indiquer des incohérences à vérifier.
          </Typography>
          
          {validationErrors.surveyStructure && validationErrors.surveyStructure.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
                Structure du questionnaire:
              </Typography>
              <List dense>
                {validationErrors.surveyStructure.map((error, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={error} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {validationErrors.excelData && validationErrors.excelData.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
                Données Excel:
              </Typography>
              <List dense>
                {validationErrors.excelData.map((error, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={error} />
                  </ListItem>
                ))}
              </List>
              
              {validationErrors.excelData.some(e => e.includes('doublons')) && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Conseil:</strong> Vérifiez les ID_questionnaire dans votre fichier Excel et assurez-vous 
                    que chaque répondant a un identifiant unique. Vous pouvez utiliser la fonction de mise en forme 
                    conditionnelle d&#39;Excel pour identifier les doublons.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
          
          {validationErrors.mappedData && validationErrors.mappedData.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
                Mapping des données:
              </Typography>
              <List dense>
                {validationErrors.mappedData.map((error, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={error} />
                  </ListItem>
                ))}
              </List>
              
              {validationErrors.mappedData.some(e => e.includes('réponse(s) invalide(s)')) && (
                <Alert severity="info" sx={{ mt: 1 }}>
                                    <Typography variant="body2">
                    <strong>Conseil:</strong> Les réponses invalides peuvent être dues à des incohérences entre 
                    votre structure de questionnaire et vos données Excel. Vérifiez que : 
                    <ul>
                      <li>Les noms de colonnes dans Excel correspondent exactement aux ID des questions</li>
                      <li>Les réponses aux questions à choix correspondent aux options définies</li>
                      <li>Les répondants n&#39;ont pas de réponses pour des questions qui ne devraient pas s&#39;appliquer à leur parcours</li>
                    </ul>
                    {validationErrors.mappedData.some(e => e.includes('Réponse "" n\'est pas un nombre valide')) && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Note spécifique:</strong> Les réponses vides (&#34;&#34;) dans les questions à choix peuvent 
                        indiquer que certains répondants n&#39;ont pas répondu à certaines questions. Vérifiez si ces 
                        réponses vides sont intentionnelles ou si elles devraient contenir une valeur.
                      </Typography>
                    )}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToUpload}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Retour
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Traitement des Données
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  {error ? (
                    <>
                      <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'error.main' }}>
                        <ErrorIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Alert severity="error" sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Erreur de traitement
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {error}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Vous pouvez corriger le problème et réessayer, ou revenir à la page de chargement pour importer de nouveaux fichiers.
                        </Typography>
                      </Alert>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          onClick={handleRetry}
                          startIcon={<ArrowBackIcon />}
                        >
                          Réessayer
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={handleBackToUpload}
                        >
                          Retour au chargement
                        </Button>
                      </Box>
                    </>
                  ) : isComplete ? (
                    <>
                      <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'success.main' }}>
                        <CheckCircleIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                        Traitement terminé !
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Vos données ont été analysées avec succès
                      </Typography>
                      
                      {/* Validation warning banner removed as requested */}
                      
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleViewResults}
                        endIcon={<BarChartIcon />}
                        size="large"
                      >
                        Voir les résultats
                      </Button>
                      
                      {renderValidationErrors()}
                    </>
                  ) : (
                    <>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                        <CircularProgress 
                          size={80} 
                          thickness={3} 
                          value={progress} 
                          variant="determinate" 
                          sx={{ color: 'primary.light' }}
                        />
                        <CircularProgress 
                          size={80} 
                          thickness={3} 
                          sx={{ 
                            position: 'absolute',
                            color: 'primary.main',
                            animationDuration: '550ms'
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="h6" component="div" color="text.primary">
                            {`${Math.round(progress)}%`}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                        {processingStatus}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Veuillez patienter, cela peut prendre quelques instants...
                      </Typography>
                      
                      <Box sx={{ mt: 4, width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'background.default',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)'
                            }
                          }} 
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, lg: 4 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <AnalyticsIcon />
                      </Avatar>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                        Processus d&apos;analyse
                      </Typography>
                    </Box>
                    
                    <List>
                      {processingSteps.map((step) => (
                        <ListItem key={step.id} sx={{ py: 1.5 }}>
                          <ListItemIcon>
                            {getStatusIcon(step.status)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={step.title} 
                            secondary={getStatusText(step.status) + (step.status === 'processing' ? ' de traitement...' : '')}
                          />
                          <Chip 
                            label={getStatusText(step.status)} 
                            size="small" 
                            color={
                              step.status === 'completed' ? 'success' : 
                              step.status === 'error' ? 'error' : 
                              step.status === 'processing' ? 'primary' : 'default'
                            }
                            variant="outlined"
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Informations sur le traitement
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            <strong>Fichier structure:</strong> surveyQuestions.js
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TableChartIcon sx={{ mr: 1, color: 'secondary.main' }} />
                          <Typography variant="body2">
                            <strong>Fichier données:</strong> {responseFile?.name || 'Lamballe.xlsx'}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <BarChartIcon />
                      </Avatar>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                        Aperçu des visualisations
                      </Typography>
                    </Box>
                    
                    <RealTimeVisualization 
                      processedData={isComplete ? processedData : null} 
                      isProcessing={!isComplete && !error} 
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}