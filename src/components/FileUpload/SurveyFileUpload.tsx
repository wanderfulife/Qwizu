import React, { useRef } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { 
  UploadFile as UploadFileIcon, 
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface SurveyFileUploadProps {
  onFileUpload: (content: string, fileName: string) => void;
  onError: (error: string) => void;
}

const SurveyFileUpload: React.FC<SurveyFileUploadProps> = ({ onFileUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.js')) {
      onError('Le fichier doit être un fichier JavaScript (.js)');
      return;
    }

    // Check file size (limit to 1MB)
    if (file.size > 1 * 1024 * 1024) {
      onError('Le fichier est trop volumineux. La taille maximale autorisée est de 1 Mo.');
      return;
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Basic validation of file content
        if (!content || content.trim().length === 0) {
          onError('Le fichier est vide ou corrompu');
          return;
        }
        
        // Check if it contains the expected export
        if (!content.includes('export const templateSurveyQuestions')) {
          onError('Le fichier ne contient pas la structure du questionnaire attendue (templateSurveyQuestions)');
          return;
        }
        
        onFileUpload(content, file.name);
      } catch (error) {
        onError(`Erreur lors de la lecture du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    };
    reader.onerror = () => {
      onError('Erreur lors de la lecture du fichier. Veuillez vérifier que le fichier est accessible.');
    };
    reader.onabort = () => {
      onError('Lecture du fichier interrompue');
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DescriptionIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          Structure du questionnaire
        </Typography>
      </Box>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".js"
        style={{ display: 'none' }}
      />
      
      <Box 
        onClick={handleUploadClick}
        sx={{ 
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: 'background.default',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
          }
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
          Importez votre fichier JavaScript
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Glissez-déposez votre fichier surveyQuestions.js ici
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleUploadClick();
          }}
          startIcon={<UploadFileIcon />}
        >
          Sélectionner un fichier
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
          Format requis: .js (Taille maximale: 1 Mo)
        </Typography>
      </Box>
      
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mt: 2, borderRadius: 2 }}
      >
        <Typography variant="body2">
          <strong>Format attendu:</strong> Le fichier doit contenir une variable exportée nommée 
          &#34;templateSurveyQuestions&#34; qui est un tableau d&#39;objets représentant les questions du questionnaire. 
          Chaque question doit avoir un ID, un texte et un type valide.
        </Typography>
      </Alert>
    </Box>
  );
};

export default SurveyFileUpload;