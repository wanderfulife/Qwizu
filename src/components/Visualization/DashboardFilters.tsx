'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Clear as ClearIcon
} from '@mui/icons-material';

interface DashboardFiltersProps {
  onFlowChange: (flow: string) => void;
  onQuestionTypeChange: (questionType: string) => void;
  onSegmentChange: (segment: string) => void;
  selectedFlow: string;
  selectedQuestionType: string;
  selectedSegment: string;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({ 
  onFlowChange,
  onQuestionTypeChange,
  onSegmentChange,
  selectedFlow,
  selectedQuestionType,
  selectedSegment
}) => {

  const handleFlowChange = (event: SelectChangeEvent) => {
    onFlowChange(event.target.value);
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent) => {
    onQuestionTypeChange(event.target.value);
  };

  const handleSegmentChange = (event: SelectChangeEvent) => {
    onSegmentChange(event.target.value);
  };

  const clearFilters = () => {
    onFlowChange('ALL');
    onQuestionTypeChange('ALL');
    onSegmentChange('ALL');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFlow !== 'ALL') count++;
    if (selectedQuestionType !== 'ALL') count++;
    if (selectedSegment !== 'ALL') count++;
    return count;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3, 
      flexWrap: 'wrap', 
      gap: 2,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1
    }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Filtres de visualisation
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Segment</InputLabel>
          <Select
            value={selectedFlow}
            label="Segment"
            onChange={handleFlowChange}
          >
            <MenuItem value="ALL">Tous les segments</MenuItem>
            <MenuItem value="MONTANTS">Preneurs de train</MenuItem>
            <MenuItem value="ACCOMPAGNATEURS">Accompagnateurs</MenuItem>
            <MenuItem value="DESCENDANTS">Descendants</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type de question</InputLabel>
          <Select
            value={selectedQuestionType}
            label="Type de question"
            onChange={handleQuestionTypeChange}
          >
            <MenuItem value="ALL">Tous les types</MenuItem>
            <MenuItem value="singleChoice">Choix unique</MenuItem>
            <MenuItem value="freeText">Texte libre</MenuItem>
            <MenuItem value="commune">Commune</MenuItem>
            <MenuItem value="street">Rue</MenuItem>
            <MenuItem value="gare">Gare</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Segment démographique</InputLabel>
          <Select
            value={selectedSegment}
            label="Segment démographique"
            onChange={handleSegmentChange}
          >
            <MenuItem value="ALL">Tous les segments</MenuItem>
            <MenuItem value="age-18-35">18-35 ans</MenuItem>
            <MenuItem value="age-36-55">36-55 ans</MenuItem>
            <MenuItem value="age-55+">55+ ans</MenuItem>
          </Select>
        </FormControl>
        
        <Tooltip title="Effacer les filtres">
          <IconButton 
            onClick={clearFilters}
            color={getActiveFiltersCount() > 0 ? "primary" : "default"}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        
        {getActiveFiltersCount() > 0 && (
          <Chip 
            label={`${getActiveFiltersCount()} filtre(s) actif(s)`} 
            color="primary" 
            variant="outlined" 
            size="small"
          />
        )}
      </Box>
    </Box>
  );
};

export default DashboardFilters;