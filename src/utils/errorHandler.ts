import { useError } from '@/contexts/ErrorContext';

// Enhanced error handler with user-friendly messages
export const useErrorHandler = () => {
  const { addNotification } = useError();

  const handleFileUploadError = (error: unknown, fileType: 'survey' | 'response') => {
    console.error('File upload error:', error);
    
    let title = 'Erreur de chargement';
    let message = "Une erreur est survenue lors du chargement du fichier. Veuillez réessayer.";
    
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('trop volumineux')) {
        title = 'Fichier trop volumineux';
        message = error.message;
      } else if (error.message.includes('Format requis') || error.message.includes('doit être un fichier')) {
        title = 'Format de fichier incorrect';
        message = error.message;
      } else if (error.message.includes('fichier est vide') || error.message.includes('corrompu')) {
        title = 'Fichier vide ou corrompu';
        message = error.message;
      } else if (error.message.includes('structure du questionnaire')) {
        title = 'Structure de questionnaire invalide';
        message = error.message;
      } else if (error.message.includes('Excel')) {
        title = 'Erreur de fichier Excel';
        message = error.message;
      } else if (error.message.includes('JavaScript') || error.message.includes('syntaxe')) {
        title = 'Erreur de fichier JavaScript';
        message = error.message;
      } else if (error.message.includes('lecture du fichier')) {
        title = 'Erreur de lecture du fichier';
        message = `${error.message}. Veuillez vérifier que le fichier est accessible et n'est pas utilisé par une autre application.`;
      } else {
        message = error.message;
      }
    }
    
    // Add file type context to the title
    const fileTypeLabel = fileType === 'survey' ? 'questionnaire' : 'réponses';
    title = `${title} (${fileTypeLabel})`;
    
    addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // Persistent error
      action: {
        label: 'Réessayer',
        onClick: () => {
          // For file upload errors, we want to clear the error and allow user to re-upload
          // Instead of reloading the page, we just close the notification
          // The user can then re-upload the file without losing the other one
        }
      }
    });
  };

  const handleProcessingError = (error: unknown) => {
    console.error('Processing error:', error);
    
    let title = 'Erreur de traitement';
    let message = "Une erreur est survenue lors du traitement des données. Veuillez réessayer.";
    
    if (error instanceof Error) {
      // Handle specific processing errors
      if (error.message.includes('Fichiers manquants')) {
        title = 'Fichiers manquants';
        message = "Veuillez retourner à la page de chargement et importer à nouveau vos fichiers.";
      } else if (error.message.includes('structure du questionnaire')) {
        title = 'Erreur dans la structure du questionnaire';
        message = error.message;
      } else if (error.message.includes('fichier Excel')) {
        title = 'Erreur dans le fichier Excel';
        message = error.message;
      } else if (error.message.includes('mapping')) {
        title = 'Erreur de mapping des données';
        message = error.message;
      } else if (error.message.includes('statistiques')) {
        title = 'Erreur lors du calcul des statistiques';
        message = `${error.message}. Certaines visualisations pourraient ne pas être disponibles.`;
      } else {
        message = error.message;
      }
    }
    
    addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // Persistent error
      action: {
        label: 'Retour au chargement',
        onClick: () => window.location.href = '/'
      }
    });
  };

  const handleSystemError = (error: unknown, context: string) => {
    console.error(`System error in ${context}:`, error);
    
    addNotification({
      type: 'error',
      title: 'Erreur système',
      message: `Une erreur système est survenue (${context}). Veuillez réessayer ou contacter le support si le problème persiste.`,
      duration: 0, // Persistent error
      action: {
        label: 'Recharger la page',
        onClick: () => window.location.reload()
      }
    });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: duration || 5000
    });
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: duration || 5000
    });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: duration || 0 // Warnings are often important, so make them persistent by default
    });
  };

  return {
    handleFileUploadError,
    handleProcessingError,
    handleSystemError,
    showInfo,
    showSuccess,
    showWarning
  };
};