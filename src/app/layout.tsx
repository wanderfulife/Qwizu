import React from 'react';
import { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { SurveyDataProvider } from '@/contexts/SurveyDataContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import NotificationContainer from '@/components/Feedback/NotificationContainer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Processeur de Questionnaires',
  description: 'Application pour analyser les données de questionnaires',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <ErrorProvider>
              <SurveyDataProvider>
                <Header />
                <main style={{ minHeight: 'calc(100vh - 140px)' }}>
                  {props.children}
                </main>
                <Footer />
                <NotificationContainer />
              </SurveyDataProvider>
            </ErrorProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
