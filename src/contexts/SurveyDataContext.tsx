'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ProcessedSurveyData } from '@/lib/surveyProcessor';

interface SurveyDataContextType {
  processedData: ProcessedSurveyData | null;
  setProcessedData: (data: ProcessedSurveyData | null) => void;
  surveyContent: string | null;
  setSurveyContent: (content: string | null) => void;
  responseFile: File | null;
  setResponseFile: (file: File | null) => void;
}

const SurveyDataContext = createContext<SurveyDataContextType | undefined>(undefined);

export function SurveyDataProvider({ children }: { children: ReactNode }) {
  const [processedData, setProcessedData] = useState<ProcessedSurveyData | null>(null);
  const [surveyContent, setSurveyContent] = useState<string | null>(null);
  const [responseFile, setResponseFile] = useState<File | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedSurveyContent = localStorage.getItem('surveyContent');
      if (savedSurveyContent) {
        setSurveyContent(savedSurveyContent);
      }
    } catch (err) {
      console.warn('Could not load data from localStorage:', err);
    }
  }, []);

  // Save survey content to localStorage whenever it changes
  useEffect(() => {
    if (surveyContent) {
      try {
        localStorage.setItem('surveyContent', surveyContent);
      } catch (err) {
        console.warn('Could not save survey content to localStorage:', err);
      }
    }
  }, [surveyContent]);

  return (
    <SurveyDataContext.Provider value={{ 
      processedData, 
      setProcessedData,
      surveyContent,
      setSurveyContent,
      responseFile,
      setResponseFile
    }}>
      {children}
    </SurveyDataContext.Provider>
  );
}

export function useSurveyData() {
  const context = useContext(SurveyDataContext);
  if (context === undefined) {
    throw new Error('useSurveyData must be used within a SurveyDataProvider');
  }
  return context;
}