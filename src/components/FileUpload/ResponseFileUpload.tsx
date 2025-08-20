import React, { useRef } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { 
  UploadFile as UploadFileIcon, 
  CloudUpload as CloudUploadIcon,
  TableChart as TableChartIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useErrorHandler } from '@/utils/errorHandler';

interface ResponseFileUploadProps {
  onFileUpload: (file: File) => void;
  onError: (error: string) => void;
}

const ResponseFileUpload: React.FC<ResponseFileUploadProps> = ({ onFileUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileUploadError } = useErrorHandler();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file type
      if (!file.name.endsWith('.xlsx')) {
        const errorMsg = 'Le fichier doit être un fichier Excel (.xlsx)';
        onError(errorMsg);
        handleFileUploadError(new Error(errorMsg), 'response');
        return;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        const errorMsg = 'Le fichier est trop volumineux. La taille maximale autorisée est de 10 Mo.';
        onError(errorMsg);
        handleFileUploadError(new Error(errorMsg), 'response');
        return;
      }

      // Additional validation for Excel files
      try {
        // Basic check for Excel file signature (this is a simplified check)
        // In a real application, we might use a library like xlsx to validate the file
        if (file.size < 512) {
          const errorMsg = 'Le fichier Excel semble corrompu ou incomplet.';
          onError(errorMsg);
          handleFileUploadError(new Error(errorMsg), 'response');
          return;
        }
      } catch (validationError) {
        const errorMsg = `Erreur lors de la validation du fichier Excel: ${(validationError as Error).message}`;
        onError(errorMsg);
        handleFileUploadError(validationError, 'response');
        return;
      }

      onFileUpload(file);
    } catch (error) {
      const errorMsg = `Erreur inattendue lors du traitement du fichier Excel: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
      onError(errorMsg);
      handleFileUploadError(error, 'response');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    try {
      fileInputRef.current?.click();
    } catch (error) {
      const errorMsg = 'Impossible d\'ouvrir la boîte de dialogue de sélection de fichiers';
      onError(errorMsg);
      handleFileUploadError(error, 'response');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TableChartIcon sx={{ color: 'secondary.main', mr: 1 }} />
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          Réponses au questionnaire
        </Typography>
      </Box>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx"
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
            borderColor: 'secondary.main',
            backgroundColor: 'action.hover',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
          }
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
          Importez votre fichier Excel
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Glissez-déposez votre fichier de réponses (.xlsx) ici
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
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
          Format requis: .xlsx (Taille maximale: 10 Mo)
        </Typography>
      </Box>
      
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mt: 2, borderRadius: 2 }}
      >
        <Typography variant="body2">
          <strong>Format attendu:</strong> Le fichier Excel doit contenir les colonnes obligatoires suivantes : 
          ID_questionnaire, ENQUETEUR, DATE. Les autres colonnes doivent correspondre aux identifiants 
          des questions du questionnaire.
        </Typography>
      </Alert>
    </Box>
  );
};

export default ResponseFileUpload;