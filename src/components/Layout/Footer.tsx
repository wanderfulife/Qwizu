'use client';

import React from 'react';
import { Box, Typography, Container, Link, Grid, IconButton } from '@mui/material';
import { 
  GitHub as GitHubIcon, 
  Twitter as TwitterIcon, 
  LinkedIn as LinkedInIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderTopColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                SurveyInsights
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Advanced survey data analysis platform for researchers and businesses.
              Transform raw survey data into actionable insights.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                aria-label="GitHub"
                component={Link}
                href="#"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="Twitter"
                component={Link}
                href="#"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="LinkedIn"
                component={Link}
                href="#"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="Email"
                component={Link}
                href="#"
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Features
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Solutions
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Pricing
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Demo
              </Link>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Documentation
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Tutorials
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Blog
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Support
              </Link>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                About
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Careers
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Contact
              </Link>
              <Link href="#" variant="body2" color="text.secondary" underline="hover">
                Legal
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderTopColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {`Copyright © ${new Date().getFullYear()} SurveyInsights. All rights reserved.`}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;