import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { UploadFile as UploadFileIcon, Description as DescriptionIcon } from '@mui/icons-material';
import SurveyFileUpload from './SurveyFileUpload';
import ResponseFileUpload from './ResponseFileUpload';
import { useErrorHandler } from '@/utils/errorHandler';

interface FileUploadContainerProps {
  onFilesUploaded: (surveyContent: string, responseFile: File) => void;
}

const FileUploadContainer: React.FC<FileUploadContainerProps> = ({ onFilesUploaded }) => {
  const [surveyContent, setSurveyContent] = useState<string | null>(null);
  const [responseFile, setResponseFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { handleFileUploadError, showSuccess } = useErrorHandler();

  const handleSurveyFileUpload = (content: string, fileName: string) => {
    setSurveyContent(content);
    showSuccess('Fichier chargé', `Fichier questionnaire chargé: ${fileName}`);
    setError(null);
  };

  const handleResponseFileUpload = (file: File) => {
    setResponseFile(file);
    showSuccess('Fichier chargé', `Fichier réponses chargé: ${file.name}`);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    // We're already showing the error via the notification system in the file upload components
    // So we don't need to duplicate it here
  };

  const handleProcessFiles = () => {
    if (!surveyContent || !responseFile) {
      const errorMsg = 'Veuillez télécharger les deux fichiers';
      setError(errorMsg);
      handleFileUploadError(new Error(errorMsg), 'survey');
      return;
    }

    try {
      onFilesUploaded(surveyContent, responseFile);
    } catch (err) {
      const errorMsg = 'Erreur lors du lancement. Veuillez réessayer.';
      setError(errorMsg);
      handleFileUploadError(err, 'survey');
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%', 
              p: 3, 
              border: '2px dashed',
              borderColor: surveyContent ? 'success.main' : 'divider',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            <SurveyFileUpload 
              onFileUpload={handleSurveyFileUpload} 
              onError={handleError} 
            />
            
            {surveyContent && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="body2" fontWeight={500} color="success.main">
                    surveyQuestions.js chargé
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%', 
              p: 3, 
              border: '2px dashed',
              borderColor: responseFile ? 'success.main' : 'divider',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ResponseFileUpload 
              onFileUpload={handleResponseFileUpload} 
              onError={handleError} 
            />
            
            {responseFile && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="body2" fontWeight={500} color="success.main">
                    {responseFile.name} chargé
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {surveyContent && responseFile && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.8rem'
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Fichiers prêts pour l&apos;analyse !
          </Typography>
          <Typography>
            Les deux fichiers ont été chargés avec succès et sont prêts à être analysés.
          </Typography>
        </Alert>
      )}
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handleProcessFiles}
        disabled={!surveyContent || !responseFile}
        sx={{ 
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: '1.1rem',
          boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
          }
        }}
        startIcon={<UploadFileIcon />}
      >
        Lancer l&apos;analyse
      </Button>
      
      </Box>
  );
};

export default FileUploadContainer;