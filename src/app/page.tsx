'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Paper
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  TableChart as TableChartIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import FileUploadContainer from '@/components/FileUpload/FileUploadContainer';
import { useRouter } from 'next/navigation';
import { useSurveyData } from '@/contexts/SurveyDataContext';

export default function Home() {
  const router = useRouter();
  const { setProcessedData, setSurveyContent, setResponseFile } = useSurveyData();
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesUploaded = (surveyContent: string, responseFile: File) => {
    setIsUploading(true);
    // Clear any previous processed data
    setProcessedData(null);
    // Store the files in context
    setSurveyContent(surveyContent);
    setResponseFile(responseFile);
    
    // Simulate upload process
    setTimeout(() => {
      // Navigate to processing page
      router.push('/processing');
    }, 1500);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: { xs: 2, md: 4 } }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            SurveyInsights
          </Typography>
          
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: 'text.secondary'
            }}
          >
            Transformez vos données de sondage en insights actionnables
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              color: 'text.secondary',
              mb: 4
            }}
          >
            Chargez votre structure de questionnaire et vos réponses pour une analyse complète 
            avec visualisations avancées et rapports détaillés.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 32px rgba(37, 99, 235, 0.1)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <CloudUploadIcon />
                  </Avatar>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    Importez vos fichiers
                  </Typography>
                </Box>
                
                {isUploading ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      Préparation des fichiers pour l&apos;analyse...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Cela peut prendre quelques instants
                    </Typography>
                  </Box>
                ) : (
                  <FileUploadContainer onFilesUploaded={handleFilesUploaded} />
                )}
                
                <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Formats supportés:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">JavaScript (.js)</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TableChartIcon sx={{ mr: 1, color: 'secondary.main' }} />
                        <Typography variant="body2">Excel (.xlsx)</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Features Section */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <AnalyticsIcon />
                  </Avatar>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    Fonctionnalités
                  </Typography>
                </Box>
                
                <List sx={{ mb: 3 }}>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Analyse automatique" 
                      secondary="Traitement intelligent des données de sondage"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Visualisations avancées" 
                      secondary="Graphiques interactifs et tableaux de bord"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Rapports détaillés" 
                      secondary="Génération de rapports personnalisables"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Export flexible" 
                      secondary="Plusieurs formats de sortie disponibles"
                    />
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Avantages
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                        <SpeedIcon sx={{ color: 'primary.main', mb: 0.5 }} />
                        <Typography variant="body2" fontWeight={500}>Rapide</Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                        <SecurityIcon sx={{ color: 'success.main', mb: 0.5 }} />
                        <Typography variant="body2" fontWeight={500}>Sécurisé</Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                        <TrendingUpIcon sx={{ color: 'secondary.main', mb: 0.5 }} />
                        <Typography variant="body2" fontWeight={500}>Précis</Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                        <StorageIcon sx={{ color: 'info.main', mb: 0.5 }} />
                        <Typography variant="body2" fontWeight={500}>Scalable</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/results')}
                  disabled
                  sx={{ mt: 2 }}
                >
                  Voir un exemple
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Stats Section */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  10K+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyses réalisées
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  99.9%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Précision
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  &lt;5s
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Temps de traitement
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)'
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  24/7
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Disponibilité
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
