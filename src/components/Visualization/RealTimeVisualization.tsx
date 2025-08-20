'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  LinearProgress,
  Alert,
  CircularProgress
} from '@mui/material';
import { ProcessedSurveyData } from '@/lib/surveyProcessor';
import ProcessingPreview, { ProcessingPreviewSkeleton } from './ProcessingPreview';

interface RealTimeVisualizationProps {
  processedData: ProcessedSurveyData | null;
  isProcessing: boolean;
}

const RealTimeVisualization: React.FC<RealTimeVisualizationProps> = ({ 
  processedData, 
  isProcessing 
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('En attente de données...');

  // Simulate progress when processing
  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      setStatus('Traitement des données...');
      
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          const diff = Math.random() * 20;
          return Math.min(oldProgress + diff, 100);
        });
      }, 300);
      
      return () => {
        clearInterval(timer);
      };
    } else {
      setProgress(100);
      setStatus('Données traitées');
    }
  }, [isProcessing]);

  if (isProcessing) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress 
              size={60} 
              thickness={4} 
              sx={{ mb: 2, color: 'primary.main' }}
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Traitement en cours
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, width: '80%', mx: 'auto' }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ flex: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {status}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <ProcessingPreviewSkeleton />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!processedData) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Alert severity="info">
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Aucune donnée à visualiser
            </Typography>
            <Typography>
              Chargez des fichiers de questionnaire et de réponses pour voir les visualisations.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Aperçu des résultats
        </Typography>
        <Chip 
          label="Données à jour" 
          color="success" 
          variant="outlined" 
          size="small"
        />
      </Box>
      
      <ProcessingPreview processedData={processedData} />
    </Box>
  );
};

export default RealTimeVisualization;