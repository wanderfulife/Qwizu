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
      const surveyStructure = SurveyParser.parseSurveyContent(surveyContent);
      
      // Step 2: Validate survey structure in detail
      const structureValidationErrors = SurveyParser.validateSurveyStructure(surveyStructure);
      if (structureValidationErrors.length > 0) {
        validationErrors.surveyStructure = structureValidationErrors;
      }
      
      // Step 3: Parse Excel responses
      const surveyResponses = await ExcelParser.parseExcelFile(responseFile);
      
      // Step 4: Validate Excel data with detailed errors
      const excelValidationErrors = ExcelParser.getExcelValidationErrors(surveyResponses);
      if (excelValidationErrors.length > 0) {
        validationErrors.excelData = excelValidationErrors;
      }
      
      // Step 5: Map responses to questions
      let mappedData = DataMapper.mapData(surveyStructure, surveyResponses);
      
      // Step 6: Validate mapped data
      mappedData = DataMapper.validateMappedData(mappedData, surveyStructure);
      
      // Step 7: Get data validation errors
      const dataValidationErrors = DataMapper.getDataValidationErrors(mappedData);
      if (dataValidationErrors.length > 0) {
        validationErrors.mappedData = dataValidationErrors;
      }
      
      // Step 8: Calculate statistics
      const statistics = StatisticsProcessor.calculateStatistics(mappedData, surveyStructure);
      
      return {
        surveyStructure,
        surveyResponses,
        mappedData,
        statistics,
        validationErrors: Object.keys(validationErrors).length > 0 ? validationErrors : undefined
      };
    } catch (error) {
      throw new Error(`Erreur lors du traitement des données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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