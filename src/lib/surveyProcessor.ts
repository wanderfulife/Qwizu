import { ExcelParser, SurveyResponses } from '@/utils/excelParser';
import { SurveyParser, SurveyStructure } from '@/utils/surveyParser';
import { DataMapper, MappedData } from '@/utils/dataMapper';
import { StatisticsProcessor, SurveyStatistics } from '@/utils/statistics';

export interface ProcessedSurveyData {
  surveyStructure: SurveyStructure;
  surveyResponses: SurveyResponses;
  mappedData: MappedData;
  statistics: SurveyStatistics;
  validationErrors?: {
    surveyStructure?: string[];
    excelData?: string[];
    mappedData?: string[];
  };
}

export class SurveyProcessor {
  /**
   * Process survey data from files
   * @param surveyContent The survey structure file content
   * @param responseFile The response Excel file
   * @returns Promise resolving to processed survey data
   */
  static async processSurveyData(surveyContent: string, responseFile: File): Promise<ProcessedSurveyData> {
    try {
      const validationErrors: {
        surveyStructure?: string[];
        excelData?: string[];
        mappedData?: string[];
      } = {};
      
      // Step 1: Parse survey structure
      let surveyStructure: SurveyStructure;
      try {
        surveyStructure = SurveyParser.parseSurveyContent(surveyContent);
      } catch (error) {
        throw new Error(`Erreur lors de la lecture du fichier de structure du questionnaire: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      
      // Step 2: Validate survey structure in detail
      try {
        const structureValidationErrors = SurveyParser.validateSurveyStructure(surveyStructure);
        if (structureValidationErrors.length > 0) {
          validationErrors.surveyStructure = structureValidationErrors;
        }
      } catch (error) {
        throw new Error(`Erreur lors de la validation de la structure du questionnaire: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      
      // Step 3: Parse Excel responses
      let surveyResponses: SurveyResponses;
      try {
        surveyResponses = await ExcelParser.parseExcelFile(responseFile);
      } catch (error) {
        throw new Error(`Erreur lors de la lecture du fichier Excel: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez vérifier que le fichier est au format Excel (.xlsx) et n'est pas corrompu.`);
      }
      
      // Step 4: Validate Excel data with detailed errors
      try {
        const excelValidationErrors = ExcelParser.getExcelValidationErrors(surveyResponses);
        if (excelValidationErrors.length > 0) {
          validationErrors.excelData = excelValidationErrors;
        }
      } catch (error) {
        throw new Error(`Erreur lors de la validation des données Excel: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      
      // Step 5: Map responses to questions
      let mappedData: MappedData;
      try {
        mappedData = DataMapper.mapData(surveyStructure, surveyResponses);
      } catch (error) {
        throw new Error(`Erreur lors du mapping des réponses aux questions: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Vérifiez que les identifiants des questions dans votre fichier Excel correspondent à ceux de votre structure de questionnaire.`);
      }
      
      // Step 6: Validate mapped data
      try {
        mappedData = DataMapper.validateMappedData(mappedData, surveyStructure);
      } catch (error) {
        throw new Error(`Erreur lors de la validation des données mappées: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      
      // Step 7: Get data validation errors
      try {
        const dataValidationErrors = DataMapper.getDataValidationErrors(mappedData);
        if (dataValidationErrors.length > 0) {
          validationErrors.mappedData = dataValidationErrors;
        }
      } catch (error) {
        throw new Error(`Erreur lors de la validation des erreurs de données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      
      // Step 8: Calculate statistics
      let statistics: SurveyStatistics;
      try {
        statistics = StatisticsProcessor.calculateStatistics(mappedData, surveyStructure);
      } catch (error) {
        throw new Error(`Erreur lors du calcul des statistiques: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Certaines visualisations pourraient ne pas être disponibles.`);
      }
      
      return {
        surveyStructure,
        surveyResponses,
        mappedData,
        statistics,
        validationErrors: Object.keys(validationErrors).length > 0 ? validationErrors : undefined
      };
    } catch (error) {
      // Provide more user-friendly error messages
      let userMessage = 'Une erreur inconnue est survenue lors du traitement des données.';
      
      if (error instanceof Error) {
        if (error.message.includes('Fichiers manquants')) {
          userMessage = 'Les fichiers requis sont manquants. Veuillez revenir à la page de chargement.';
        } else if (error.message.includes('structure du questionnaire')) {
          userMessage = 'Erreur dans la structure du questionnaire. Veuillez vérifier que votre fichier surveyQuestions.js est correct.';
        } else if (error.message.includes('fichier Excel')) {
          userMessage = 'Erreur dans le fichier Excel. Veuillez vérifier que votre fichier de réponses est au bon format.';
        } else if (error.message.includes('mapping')) {
          userMessage = 'Erreur lors du mapping des données. Il peut y avoir une incohérence entre votre structure de questionnaire et vos données.';
        } else {
          userMessage = error.message;
        }
      }
      
      throw new Error(userMessage);
    }
  }
  
  /**
   * Get question statistics by ID
   * @param processedData The processed survey data
   * @param questionId The question ID
   * @returns Question statistics or undefined if not found
   */
  static getQuestionStatistics(processedData: ProcessedSurveyData, questionId: string) {
    return processedData.statistics.questions.find(q => q.questionId === questionId);
  }
  
  /**
   * Get flow-specific statistics
   * @param processedData The processed survey data
   * @param flowType The flow type
   * @returns Statistics for the specified flow type
   */
  static getFlowStatistics(processedData: ProcessedSurveyData, flowType: string) {
    return StatisticsProcessor.getFlowStatistics(
      processedData.mappedData,
      processedData.surveyStructure,
      flowType
    );
  }
  
  /**
   * Get respondent responses by ID
   * @param processedData The processed survey data
   * @param respondentId The respondent ID
   * @returns Respondent data or undefined if not found
   */
  static getRespondentResponses(processedData: ProcessedSurveyData, respondentId: string) {
    return processedData.mappedData.find(r => r.id === respondentId);
  }
}