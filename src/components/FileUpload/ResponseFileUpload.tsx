import React, { useRef } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { 
  UploadFile as UploadFileIcon, 
  CloudUpload as CloudUploadIcon,
  TableChart as TableChartIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface ResponseFileUploadProps {
  onFileUpload: (file: File) => void;
  onError: (error: string) => void;
}

const ResponseFileUpload: React.FC<ResponseFileUploadProps> = ({ onFileUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.xlsx')) {
      onError('Le fichier doit être un fichier Excel (.xlsx)');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('Le fichier est trop volumineux. La taille maximale autorisée est de 10 Mo.');
      return;
    }

    onFileUpload(file);

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