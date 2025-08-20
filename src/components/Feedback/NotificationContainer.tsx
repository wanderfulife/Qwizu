'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { 
  Alert, 
  Snackbar, 
  AlertTitle, 
  Box, 
  Button, 
  Collapse, 
  IconButton,
  Typography
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { AppNotification } from '@/contexts/ErrorContext';
import { useError } from '@/contexts/ErrorContext';

interface NotificationItemProps {
  notification: AppNotification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification } = useError();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(true);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Remove from context after animation completes
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  }, [notification.id, removeNotification]);

  // Auto-close notification after duration (unless persistent)
  useEffect(() => {
    if (notification.duration !== 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration || 6000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.duration, handleClose]);

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      handleClose();
    }
  };

  return (
    <Collapse in={open} timeout={300}>
      <Alert
        severity={notification.type}
        sx={{ 
          width: '100%', 
          mb: 1,
          borderRadius: 2,
          boxShadow: 3,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <AlertTitle sx={{ fontWeight: 600 }}>
              {notification.title}
            </AlertTitle>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {notification.message}
            </Typography>
            {notification.action && (
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleAction}
                sx={{ mt: 1 }}
              >
                {notification.action.label}
              </Button>
            )}
          </Box>
          {notification.message.length > 100 && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ alignSelf: 'flex-start' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>
        {notification.message.length > 100 && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Typography variant="body2" sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
              {notification.message}
            </Typography>
          </Collapse>
        )}
      </Alert>
    </Collapse>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications } = useError();

  return (
    <Snackbar
      open={notifications.length > 0}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ 
        top: 80,
        right: 24,
        maxWidth: 400,
        '& .MuiSnackbarContent-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          padding: 0,
          minWidth: 'auto'
        }
      }}
    >
      <Box>
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </Box>
    </Snackbar>
  );
};

export default NotificationContainer;