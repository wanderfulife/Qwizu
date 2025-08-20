'use client';

import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Analytics as AnalyticsIcon, 
  Upload as UploadIcon, 
  BarChart as BarChartIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSurveyData } from '@/contexts/SurveyDataContext';

const Header: React.FC = () => {
  const router = useRouter();
  const { processedData } = useSurveyData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear processed data
    // In a real app, you would also clear authentication tokens
    handleMenuClose();
    router.push('/');
  };

  const menuId = 'primary-account-menu';
  const mobileMenuId = 'primary-mobile-menu';
  const notificationId = 'notifications-menu';

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
        mb: 2,
        borderBottom: '1px solid',
        borderBottomColor: 'divider'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 72 }}>
        {/* Left section - Logo and navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          
          <Box 
            onClick={handleLogoClick}
            sx={{ 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              mr: { xs: 2, md: 4 }
            }}
          >
            <AnalyticsIcon sx={{ mr: 1.5, color: 'primary.main' }} />
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
          
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              startIcon={<UploadIcon />}
              onClick={() => router.push('/')}
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Upload
            </Button>
            <Button
              startIcon={<BarChartIcon />}
              onClick={() => router.push('/results')}
              disabled={!processedData}
              sx={{ 
                color: processedData ? 'text.primary' : 'text.disabled',
                fontWeight: 500,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: processedData ? 'action.hover' : 'transparent'
                }
              }}
            >
              Analytics
            </Button>
          </Box>
        </Box>
        
        {/* Right section - User actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="large"
            aria-label="notifications"
            color="inherit"
            onClick={handleNotificationOpen}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Tooltip title="Account settings">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'primary.main',
                  fontWeight: 600
                }}
              >
                U
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      
      {/* Mobile menu */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMobileMenuClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <MenuItem onClick={() => { router.push('/'); handleMobileMenuClose(); }}>
          <UploadIcon sx={{ mr: 1 }} />
          Upload
        </MenuItem>
        <MenuItem 
          onClick={() => { router.push('/results'); handleMobileMenuClose(); }}
          disabled={!processedData}
        >
          <BarChartIcon sx={{ mr: 1 }} />
          Analytics
        </MenuItem>
      </Menu>
      
      {/* Notification menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={notificationId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
      >
        <MenuItem>
          <Typography variant="subtitle2" fontWeight={600}>
            Notifications
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="body2">
            Your analysis is ready for review
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">
            New features available
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2">
            System maintenance scheduled
          </Typography>
        </MenuItem>
      </Menu>
      
      {/* User menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <Avatar sx={{ width: 32, height: 32, mr: 1.5, fontSize: '0.875rem' }}>U</Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              User Name
            </Typography>
            <Typography variant="caption" color="text.secondary">
              user@example.com
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <AccountCircle sx={{ mr: 1.5 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 1.5 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <HelpIcon sx={{ mr: 1.5 }} />
          Help
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;