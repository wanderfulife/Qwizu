import { MappedData, MappedResponse } from './dataMapper';
import { SurveyStructure, SurveyQuestion } from './surveyParser';

export interface ResponseCount {
  value: string | number;
  label?: string;
  count: number;
  percentage: number;
}

export interface QuestionStatistics {
  questionId: string;
  questionText: string;
  responseType: string;
  totalResponses: number;
  skippedResponses: number;
  responseCounts: ResponseCount[];
}

export interface SurveyStatistics {
  totalRespondents: number;
  flowDistribution: Record<string, number>;
  completionRate: number;
  questions: QuestionStatistics[];
}

export class StatisticsProcessor {
  /**
   * Calculate statistics from mapped data
   * @param mappedData The mapped survey data
   * @param surveyStructure The survey structure
   * @returns Calculated statistics
   */
  static calculateStatistics(mappedData: MappedData, surveyStructure: SurveyStructure): SurveyStatistics {
    const totalRespondents = mappedData.length;
    
    // Calculate flow distribution
    const flowDistribution = this.calculateFlowDistribution(mappedData);
    
    // Calculate completion rate (simplified)
    const completionRate = this.calculateCompletionRate(mappedData, surveyStructure);
    
    // Calculate question statistics
    const questions = this.calculateQuestionStatistics(mappedData, surveyStructure);
    
    return {
      totalRespondents,
      flowDistribution,
      completionRate,
      questions
    };
  }
  
  /**
   * Calculate the distribution of respondents across different flows
   * @param mappedData The mapped survey data
   * @returns Flow distribution counts
   */
  static calculateFlowDistribution(mappedData: MappedData): Record<string, number> {
    const distribution: Record<string, number> = {
      MONTANTS: 0,
      ACCOMPAGNATEURS: 0,
      DESCENDANTS: 0,
      UNKNOWN: 0
    };
    
    mappedData.forEach(respondent => {
      distribution[respondent.flowType] = (distribution[respondent.flowType] || 0) + 1;
    });
    
    return distribution;
  }
  
  /**
   * Calculate the completion rate (simplified)
   * @param mappedData The mapped survey data
   * @param surveyStructure The survey structure
   * @returns Completion rate as a percentage
   */
  static calculateCompletionRate(mappedData: MappedData, surveyStructure: SurveyStructure): number {
    if (mappedData.length === 0) return 0;
    
    // Simplified calculation: average number of responses per respondent
    const totalResponses = mappedData.reduce((sum, respondent) => sum + respondent.responses.length, 0);
    
    // Dynamically determine max possible responses based on survey structure
    const maxPossibleResponses = this.getMaxPossibleResponses(surveyStructure);
    const averageResponses = totalResponses / mappedData.length;
    
    return Math.min(100, Math.round((averageResponses / maxPossibleResponses) * 100));
  }
  
  /**
   * Get the maximum possible number of responses based on survey structure
   * @param surveyStructure The survey structure
   * @returns Maximum possible responses
   */
  static getMaxPossibleResponses(surveyStructure: SurveyStructure): number {
    // Since respondents follow different flows based on their answers,
    // we calculate the maximum possible responses for each flow type
    const montantsQuestions = surveyStructure.filter(q => 
      q.id === 'Q1' || q.id.endsWith('_MONTANTS')
    ).length;
    
    const accompagnateursQuestions = surveyStructure.filter(q => 
      q.id === 'Q1' || q.id.endsWith('_ACCOMPAGNATEURS')
    ).length;
    
    // Return the maximum of all possible flows
    return Math.max(montantsQuestions, accompagnateursQuestions, 1); // At least 1 to avoid division by zero
  }
  
  /**
   * Calculate statistics for each question
   * @param mappedData The mapped survey data
   * @param surveyStructure The survey structure
   * @returns Array of question statistics
   */
  static calculateQuestionStatistics(mappedData: MappedData, surveyStructure: SurveyStructure): QuestionStatistics[] {
    const questionStats: QuestionStatistics[] = [];
    
    // Get all unique question IDs from the survey structure
    const questionIds = surveyStructure.map(q => q.id);
    
    questionIds.forEach(questionId => {
      const question = surveyStructure.find(q => q.id === questionId);
      if (!question) return;
      
      // Get all responses for this question
      const allResponses: MappedResponse[] = [];
      mappedData.forEach(respondent => {
        const response = respondent.responses.find(r => r.questionId === questionId);
        if (response) {
          allResponses.push(response);
        }
      });
      
      const totalResponses = allResponses.length;
      const skippedResponses = mappedData.length - totalResponses;
      
      // Calculate response counts
      const responseCounts = this.calculateResponseCounts(allResponses, question);
      
      questionStats.push({
        questionId,
        questionText: question.text,
        responseType: question.type,
        totalResponses,
        skippedResponses,
        responseCounts
      });
    });
    
    return questionStats;
  }
  
  /**
   * Calculate response counts for a specific question
   * @param responses The responses for a question
   * @param question The question definition
   * @returns Array of response counts
   */
  static calculateResponseCounts(responses: MappedResponse[], question: SurveyQuestion): ResponseCount[] {
    if (responses.length === 0) {
      return [];
    }
    
    // Count responses by value
    const counts: Record<string, number> = {};
    responses.forEach(response => {
      const key = response.responseValue?.toString() || 'undefined';
      counts[key] = (counts[key] || 0) + 1;
    });
    
    // Convert to ResponseCount array
    const responseCounts: ResponseCount[] = [];
    const total = responses.length;
    
    Object.keys(counts).forEach(key => {
      const count = counts[key];
      const percentage = Math.round((count / total) * 100);
      
      // Try to get label from question options for single choice questions
      let label: string | undefined;
      if (question.type === 'singleChoice' && question.options) {
        const option = question.options.find(opt => opt.id.toString() === key);
        if (option) {
          label = option.text;
        }
      }
      
      responseCounts.push({
        value: key === 'undefined' ? 'Non répondu' : key,
        label,
        count,
        percentage
      });
    });
    
    // Sort by count descending
    return responseCounts.sort((a, b) => b.count - a.count);
  }
  
  /**
   * Get the most common responses for a question
   * @param questionStats The question statistics
   * @param limit The maximum number of responses to return
   * @returns Array of most common responses
   */
  static getMostCommonResponses(questionStats: QuestionStatistics, limit: number = 5): ResponseCount[] {
    return questionStats.responseCounts.slice(0, limit);
  }
  
  /**
   * Get statistics for a specific flow type
   * @param mappedData The mapped survey data
   * @param surveyStructure The survey structure
   * @param flowType The flow type to filter by
   * @returns Statistics for the specified flow type
   */
  static getFlowStatistics(mappedData: MappedData, surveyStructure: SurveyStructure, flowType: string): SurveyStatistics {
    const filteredData = mappedData.filter(respondent => respondent.flowType === flowType);
    return this.calculateStatistics(filteredData, surveyStructure);
  }
}