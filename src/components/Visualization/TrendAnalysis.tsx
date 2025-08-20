'use client';

import React, { memo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent
} from '@mui/material';
import EnhancedLineChart from './EnhancedLineChart';

interface TrendAnalysisProps {
  title: string;
  data: { period: string; value: number }[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = memo(({ title, data }) => {
  TrendAnalysis.displayName = 'TrendAnalysis';
  const labels = data.map(d => d.period);
  const values = data.map(d => d.value);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
        
        <Box sx={{ height: 200 }}>
          <EnhancedLineChart 
            title=""
            labels={labels}
            data={values}
            maxItemsToShow={data.length}
          />
        </Box>
      </CardContent>
    </Card>
  );
});

export default TrendAnalysis;