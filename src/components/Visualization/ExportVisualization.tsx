'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import { 
  Download as DownloadIcon
} from '@mui/icons-material';

interface ExportVisualizationProps {
  onExport: (format: string, includeData: boolean) => void;
}

const ExportVisualization: React.FC<ExportVisualizationProps> = ({ onExport }) => {
  const [open, setOpen] = React.useState(false);
  const [format, setFormat] = React.useState('png');
  const [includeData, setIncludeData] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExport = () => {
    onExport(format, includeData);
    handleClose();
  };

  return (
    <Box>
      <Button 
        variant="outlined" 
        startIcon={<DownloadIcon />} 
        onClick={handleClickOpen}
      >
        Exporter
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Exporter la visualisation</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Exportez votre visualisation dans différents formats pour l&apos;intégrer à vos rapports ou présentations.
            </Alert>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Format d&apos;export</InputLabel>
              <Select
                value={format}
                label="Format d'export"
                onChange={(e) => setFormat(e.target.value)}
              >
                <MenuItem value="png">PNG (Image)</MenuItem>
                <MenuItem value="jpeg">JPEG (Image)</MenuItem>
                <MenuItem value="pdf">PDF (Document)</MenuItem>
                <MenuItem value="svg">SVG (Vectoriel)</MenuItem>
                <MenuItem value="csv">CSV (Données)</MenuItem>
                <MenuItem value="xlsx">Excel (Données)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={includeData}
                  onChange={(e) => setIncludeData(e.target.checked)}
                  color="primary"
                />
              }
              label="Inclure les données brutes"
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Les exports d&apos;images incluront uniquement la visualisation actuelle. 
              Les exports de données incluront les valeurs brutes utilisées pour générer les graphiques.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            startIcon={<DownloadIcon />}
          >
            Exporter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExportVisualization;