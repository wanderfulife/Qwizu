'use client';

import { useState, useEffect } from 'react';
import { ProcessedSurveyData } from '@/lib/surveyProcessor';

interface UseSurveyDataReturn {
  processedData: ProcessedSurveyData | null;
  setProcessedData: (data: ProcessedSurveyData | null) => void;
  surveyContent: string | null;
  setSurveyContent: (content: string | null) => void;
  responseFile: File | null;
  setResponseFile: (file: File | null) => void;
}

export const useSurveyData = (): UseSurveyDataReturn => {
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

  return {
    processedData,
    setProcessedData,
    surveyContent,
    setSurveyContent,
    responseFile,
    setResponseFile,
  };
};