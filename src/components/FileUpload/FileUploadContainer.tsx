import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Snackbar,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { UploadFile as UploadFileIcon, Description as DescriptionIcon } from '@mui/icons-material';
import SurveyFileUpload from './SurveyFileUpload';
import ResponseFileUpload from './ResponseFileUpload';

interface FileUploadContainerProps {
  onFilesUploaded: (surveyContent: string, responseFile: File) => void;
}

const FileUploadContainer: React.FC<FileUploadContainerProps> = ({ onFilesUploaded }) => {
  const [surveyContent, setSurveyContent] = useState<string | null>(null);
  const [responseFile, setResponseFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSurveyFileUpload = (content: string, fileName: string) => {
    setSurveyContent(content);
    setSnackbarMessage(`Fichier questionnaire chargé: ${fileName}`);
    setSnackbarOpen(true);
    setError(null);
  };

  const handleResponseFileUpload = (file: File) => {
    setResponseFile(file);
    setSnackbarMessage(`Fichier réponses chargé: ${file.name}`);
    setSnackbarOpen(true);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);
  };

  const handleProcessFiles = () => {
    if (!surveyContent || !responseFile) {
      setError('Veuillez télécharger les deux fichiers');
      return;
    }

    onFilesUploaded(surveyContent, responseFile);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default FileUploadContainer;