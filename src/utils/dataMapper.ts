import { SurveyStructure, SurveyQuestion } from './surveyParser';
import { SurveyResponses, SurveyResponse } from './excelParser';

export interface MappedResponse {
  questionId: string;
  questionText: string;
  responseType: string;
  responseValue: string | number;
  responseLabel?: string;
  isValid: boolean;
  validationError?: string;
}

export interface MappedRespondent {
  id: string;
  responses: MappedResponse[];
  flowType: 'MONTANTS' | 'ACCOMPAGNATEURS' | 'DESCENDANTS' | 'UNKNOWN';
  validationErrors?: string[];
}

export type MappedData = MappedRespondent[];

export class DataMapper {
  /**
   * Map survey responses to survey questions
   * @param surveyStructure The survey structure
   * @param surveyResponses The survey responses
   * @returns Mapped data with responses linked to questions
   */
  static mapData(surveyStructure: SurveyStructure, surveyResponses: SurveyResponses): MappedData {
    if (!surveyStructure || !Array.isArray(surveyStructure)) {
      throw new Error('Structure du questionnaire invalide');
    }
    
    if (!surveyResponses || !Array.isArray(surveyResponses)) {
      throw new Error('Données de réponse invalide');
    }
    
    return surveyResponses.map((response, index) => {
      const respondentId = response.ID_questionnaire || `Respondent_${index + 1}`;
      const flowType = this.determineFlowType(response);
      const responses = this.mapRespondentResponses(surveyStructure, response);
      
      return {
        id: respondentId,
        responses,
        flowType
      };
    });
  }
  
  /**
   * Get validation errors for the mapped data
   * @param mappedData The mapped data to validate
   * @returns Array of validation error messages
   */
  static getDataValidationErrors(mappedData: MappedData): string[] {
    const errors: string[] = [];
    
    if (!mappedData || !Array.isArray(mappedData)) {
      errors.push('Données mappées invalides');
      return errors;
    }
    
    if (mappedData.length === 0) {
      errors.push('Aucune donnée de réponse trouvée');
      return errors;
    }
    
    // Check for respondents with no responses
    const respondentsWithNoResponses = mappedData.filter(r => r.responses.length === 0);
    if (respondentsWithNoResponses.length > 0) {
      errors.push(`${respondentsWithNoResponses.length} répondant(s) n'ont aucune réponse valide`);
    }
    
    // Check for respondents with invalid flow types
    const respondentsWithUnknownFlow = mappedData.filter(r => r.flowType === 'UNKNOWN');
    if (respondentsWithUnknownFlow.length > 0) {
      errors.push(`${respondentsWithUnknownFlow.length} répondant(s) ont un type de flux inconnu (Q1 invalide)`);
    }
    
    // Check for invalid responses
    let invalidResponseCount = 0;
    const invalidResponseDetails: { [key: string]: number } = {};
    const questionErrorDetails: { [key: string]: number } = {};
    
    mappedData.forEach(respondent => {
      const invalidResponses = respondent.responses.filter(r => !r.isValid);
      invalidResponseCount += invalidResponses.length;
      
      // Collect details about types of invalid responses
      invalidResponses.forEach(response => {
        const errorType = response.validationError || 'Réponse invalide';
        invalidResponseDetails[errorType] = (invalidResponseDetails[errorType] || 0) + 1;
        
        // Track which questions have the most errors
        questionErrorDetails[response.questionId] = (questionErrorDetails[response.questionId] || 0) + 1;
      });
    });
    
    if (invalidResponseCount > 0) {
      errors.push(`${invalidResponseCount} réponse(s) invalide(s) trouvée(s) dans les données`);
      
      // Add all validation errors, sorted by frequency
      const sortedErrors = Object.entries(invalidResponseDetails)
        .sort((a, b) => b[1] - a[1]);
      
      sortedErrors.forEach(([error, count]) => {
        errors.push(`- ${count} réponse(s): ${error}`);
      });
      
      // Add all questions with errors, sorted by error count
      const sortedQuestions = Object.entries(questionErrorDetails)
        .sort((a, b) => b[1] - a[1]);
      
      if (sortedQuestions.length > 0) {
        errors.push(`Questions avec le plus d'erreurs:`);
        sortedQuestions.forEach(([questionId, count]) => {
          errors.push(`- ${questionId}: ${count} erreur(s)`);
        });
      }
    }
    
    return errors;
  }
  
  /**
   * Determine the flow type based on Q1 response
   * @param response The respondent's response
   * @returns The flow type
   */
  static determineFlowType(response: SurveyResponse): 'MONTANTS' | 'ACCOMPAGNATEURS' | 'DESCENDANTS' | 'UNKNOWN' {
    const q1Response = response.Q1;
    
    // Handle undefined or null Q1
    if (q1Response === undefined || q1Response === null) {
      return 'UNKNOWN';
    }
    
    // Handle string responses
    if (typeof q1Response === 'string') {
      const parsed = parseInt(q1Response, 10);
      if (isNaN(parsed)) {
        return 'UNKNOWN';
      }
      if (parsed === 1) {
        return 'MONTANTS';
      } else if (parsed === 2) {
        return 'DESCENDANTS';
      } else if (parsed === 3 || parsed === 4) {
        return 'ACCOMPAGNATEURS';
      } else {
        return 'UNKNOWN';
      }
    }
    
    // Handle numeric responses
    if (q1Response === 1) {
      return 'MONTANTS';
    } else if (q1Response === 2) {
      return 'DESCENDANTS';
    } else if (q1Response === 3 || q1Response === 4) {
      return 'ACCOMPAGNATEURS';
    } else {
      return 'UNKNOWN';
    }
  }
  
  /**
   * Map a single respondent's responses to questions
   * @param surveyStructure The survey structure
   * @param response The respondent's responses
   * @returns Array of mapped responses
   */
  static mapRespondentResponses(surveyStructure: SurveyStructure, response: SurveyResponse): MappedResponse[] {
    const flowType = this.determineFlowType(response);
    const mappedResponses: MappedResponse[] = [];
    
    // For each question in the survey structure, find the corresponding response
    surveyStructure.forEach(question => {
      // Skip questions that don't apply to this flow type
      if (!this.questionAppliesToFlow(question.id, flowType)) {
        return;
      }
      
      // Get the response value for this question
      const responseValue = response[question.id];
      
      // Handle undefined responses
      if (responseValue === undefined) {
        // For required questions, we might want to create an invalid response
        // But for now we'll just skip undefined responses
        return;
      }
      
      const mappedResponse: MappedResponse = {
        questionId: question.id,
        questionText: question.text,
        responseType: question.type,
        responseValue,
        isValid: true // We'll validate later
      };
      
      // For single choice questions, add the option label
      if (question.type === 'singleChoice' && question.options) {
        const responseId = typeof responseValue === 'string' ? parseInt(responseValue, 10) : responseValue;
        const option = question.options.find(opt => opt.id === responseId);
        if (option) {
          mappedResponse.responseLabel = option.text;
        }
      }
      
      mappedResponses.push(mappedResponse);
    });
    
    return mappedResponses;
  }
  
  /**
   * Check if a question applies to a specific flow type
   * @param questionId The question ID
   * @param flowType The flow type
   * @returns Boolean indicating if the question applies
   */
  static questionAppliesToFlow(questionId: string, flowType: 'MONTANTS' | 'ACCOMPAGNATEURS' | 'DESCENDANTS' | 'UNKNOWN'): boolean {
    // DESCENDANTS flow only has Q1
    if (flowType === 'DESCENDANTS') {
      return questionId === 'Q1';
    }
    
    // MONTANTS flow has questions with _MONTANTS suffix
    if (flowType === 'MONTANTS') {
      return questionId === 'Q1' || questionId.endsWith('_MONTANTS');
    }
    
    // ACCOMPAGNATEURS flow has questions with _ACCOMPAGNATEURS suffix
    if (flowType === 'ACCOMPAGNATEURS') {
      return questionId === 'Q1' || questionId.endsWith('_ACCOMPAGNATEURS');
    }
    
    // For UNKNOWN flow, include all questions
    return true;
  }
  
  /**
   * Validate mapped responses
   * @param mappedData The mapped data to validate
   * @param surveyStructure The survey structure
   * @returns Validated mapped data
   */
  static validateMappedData(mappedData: MappedData, surveyStructure: SurveyStructure): MappedData {
    return mappedData.map(respondent => {
      const validationErrors: string[] = [];
      
      const validatedResponses = respondent.responses.map(response => {
        const question = surveyStructure.find(q => q.id === response.questionId);
        if (question) {
          const isValid = this.validateResponse(question, response.responseValue);
          if (!isValid) {
            // Add validation error message
            response.validationError = this.getResponseValidationError(question, response.responseValue);
          }
          response.isValid = isValid;
        } else {
          response.isValid = false;
          response.validationError = `Question "${response.questionId}" non trouvée dans la structure`;
        }
        return response;
      });
      
      // Add validation errors for the respondent if needed
      if (validatedResponses.length === 0) {
        validationErrors.push('Aucune réponse valide trouvée pour ce répondant');
      }
      
      // Check if respondent has an invalid flow type
      if (respondent.flowType === 'UNKNOWN') {
        validationErrors.push('Type de flux inconnu (Q1 invalide)');
      }
      
      return {
        ...respondent,
        responses: validatedResponses,
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined
      };
    });
  }
  
  /**
   * Get a detailed validation error message for a response
   * @param question The question
   * @param responseValue The response value
   * @returns Validation error message
   */
  static getResponseValidationError(question: SurveyQuestion, responseValue: string | number): string {
    // For single choice questions with invalid options
    if (question.type === 'singleChoice' && question.options) {
      // Handle empty responses
      if (responseValue === '' || responseValue === undefined || responseValue === null) {
        return 'Réponse vide pour une question à choix (peut être légitime si le répondant n\'a pas répondu)';
      }
      
      const responseId = typeof responseValue === 'string' ? parseInt(responseValue, 10) : responseValue;
      if (isNaN(responseId)) {
        return `Réponse "${responseValue}" n'est pas un nombre valide pour la question à choix`;
      }
      
      const validOptions = question.options.map(opt => opt.id).join(', ');
      return `Option "${responseId}" invalide. Options valides: ${validOptions}`;
    }
    
    // For other question types, return a generic error
    return `Réponse invalide pour la question de type "${question.type}"`;
  }
  
  /**
   * Validate a single response against its question
   * @param question The question
   * @param responseValue The response value
   * @returns Boolean indicating if the response is valid
   */
  static validateResponse(question: SurveyQuestion, responseValue: string | number): boolean {
    // For free text questions, any response is valid (including empty)
    if (question.type === 'freeText' || question.type === 'commune' || question.type === 'street' || question.type === 'gare') {
      return true;
    }
    
    // For single choice questions, empty responses might be valid (no response)
    if (question.type === 'singleChoice' && question.options) {
      // Empty responses are considered valid (respondent didn't answer)
      if (responseValue === '' || responseValue === undefined || responseValue === null) {
        return true;
      }
      
      // For non-empty responses, validate against options
      const responseId = typeof responseValue === 'string' ? parseInt(responseValue, 10) : responseValue;
      return !isNaN(responseId) && question.options.some(option => option.id === responseId);
    }
    
    // For other question types, assume valid
    return true;
  }
}