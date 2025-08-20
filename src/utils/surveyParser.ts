export interface SurveyOption {
  id: number;
  text: string;
  next: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'singleChoice' | 'commune' | 'street' | 'gare' | 'freeText';
  options?: SurveyOption[];
  next?: string;
  image?: string;
  imageAlt?: string;
  freeTextPlaceholder?: string;
}

export type SurveyStructure = SurveyQuestion[];

export class SurveyParser {
  /**
   * Parse the survey structure from JavaScript content
   * @param content The JavaScript file content as string
   * @returns The parsed survey structure
   */
  static parseSurveyContent(content: string): SurveyStructure {
    try {
      // Check if content is empty
      if (!content || content.trim().length === 0) {
        throw new Error('Le fichier de structure du questionnaire est vide');
      }
      
      // Extract the array content from the JavaScript export
      const match = content.match(/export\s+const\s+templateSurveyQuestions\s*=\s*(\[[\s\S]*\])\s*;?/);
      if (!match) {
        throw new Error('Impossible de trouver la structure du questionnaire dans le fichier. Le fichier doit contenir une variable "templateSurveyQuestions" exportée.');
      }
      
      let jsonArray = match[1];
      
      // More careful comment removal to avoid issues with regex
      // First remove multi-line comments
      jsonArray = jsonArray.replace(/\/\*[\s\S]*?\*\//g, '');
      // Then remove single-line comments, but be careful not to remove valid content
      jsonArray = jsonArray.replace(/\/\/.*$/gm, '');
      
      // Clean up extra commas that might cause issues
      jsonArray = jsonArray.replace(/,\s*([}\]])/g, '$1');
      
      // Convert JavaScript object syntax to valid JSON
      // Handle keys without quotes
      jsonArray = jsonArray.replace(/([{,])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
      // Handle single-quoted string values by converting to double quotes
      jsonArray = jsonArray.replace(/:\s*'([^']*)'/g, ':"$1"');
      
      // Parse as JSON
      let surveyStructure: SurveyStructure;
      try {
        surveyStructure = JSON.parse(jsonArray);
      } catch (parseError) {
        throw new Error(`Erreur de syntaxe dans le fichier de structure: ${parseError instanceof Error ? parseError.message : 'Erreur inconnue'}`);
      }
      
      // Validate the structure
      if (!Array.isArray(surveyStructure)) {
        throw new Error('La structure du questionnaire doit être un tableau');
      }
      
      if (surveyStructure.length === 0) {
        throw new Error('La structure du questionnaire est vide');
      }
      
      // Validate each question with detailed error messages
      const validationErrors = this.validateSurveyStructure(surveyStructure);
      if (validationErrors.length > 0) {
        throw new Error(`Erreurs de validation dans la structure du questionnaire:\n${validationErrors.join('\n')}`);
      }
      
      return surveyStructure;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur lors de l'analyse du fichier de structure: ${error.message}`);
      } else {
        throw new Error(`Erreur lors de l'analyse du fichier de structure: Erreur inconnue`);
      }
    }
  }
  
  /**
   * Validate the survey structure and return detailed error messages
   * @param surveyStructure The survey structure to validate
   * @returns Array of validation error messages
   */
  static validateSurveyStructure(surveyStructure: SurveyStructure): string[] {
    const errors: string[] = [];
    
    // Check for duplicate question IDs
    const questionIds = surveyStructure.map(q => q.id);
    const uniqueIds = new Set(questionIds);
    if (questionIds.length !== uniqueIds.size) {
      const duplicates = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
      errors.push(`IDs de questions dupliqués trouvés: ${[...new Set(duplicates)].join(', ')}`);
    }
    
    // Validate each question
    surveyStructure.forEach((question, index) => {
      // Check required fields
      if (!question.id) {
        errors.push(`Question à l'index ${index} n'a pas d'ID`);
      }
      
      if (!question.text) {
        errors.push(`Question "${question.id || `à l'index ${index}`}" n'a pas de texte`);
      }
      
      if (!question.type) {
        errors.push(`Question "${question.id || `à l'index ${index}`}" n'a pas de type`);
      } else if (!['singleChoice', 'commune', 'street', 'gare', 'freeText'].includes(question.type)) {
        errors.push(`Question "${question.id || `à l'index ${index}`}" a un type invalide: ${question.type}`);
      }
      
      // Validate options for singleChoice questions
      if (question.type === 'singleChoice') {
        if (!question.options) {
          errors.push(`Question "${question.id}" de type singleChoice doit avoir un tableau d'options`);
        } else if (!Array.isArray(question.options)) {
          errors.push(`Question "${question.id}" de type singleChoice doit avoir un tableau d'options`);
        } else if (question.options.length === 0) {
          errors.push(`Question "${question.id}" de type singleChoice doit avoir au moins une option`);
        } else {
          // Validate each option
          question.options.forEach((option, optionIndex) => {
            if (option.id === undefined || option.id === null) {
              errors.push(`Option à l'index ${optionIndex} de la question "${question.id}" n'a pas d'ID`);
            } else if (typeof option.id !== 'number') {
              errors.push(`Option "${option.id}" de la question "${question.id}" a un ID qui n'est pas un nombre`);
            }
            
            if (!option.text) {
              errors.push(`Option "${option.id}" de la question "${question.id}" n'a pas de texte`);
            }
            
            if (option.next === undefined || option.next === null) {
              errors.push(`Option "${option.id}" de la question "${question.id}" n'a pas de propriété "next"`);
            }
          });
          
          // Check for duplicate option IDs within the same question
          const optionIds = question.options.map(opt => opt.id);
          const uniqueOptionIds = new Set(optionIds);
          if (optionIds.length !== uniqueOptionIds.size) {
            const duplicates = optionIds.filter((id, idx) => optionIds.indexOf(id) !== idx);
            errors.push(`IDs d'options dupliqués dans la question "${question.id}": ${[...new Set(duplicates)].join(', ')}`);
          }
        }
      }
      
      // Validate that freeTextPlaceholder exists for freeText questions
      if (question.type === 'freeText' && !question.freeTextPlaceholder) {
        // This is a warning, not an error
        console.warn(`Question "${question.id}" de type freeText n'a pas de placeholder`);
      }
    });
    
    return errors;
  }
  
  /**
   * Get a question by its ID
   * @param surveyStructure The survey structure
   * @param questionId The question ID to find
   * @returns The question object or undefined if not found
   */
  static getQuestionById(surveyStructure: SurveyStructure, questionId: string): SurveyQuestion | undefined {
    return surveyStructure.find(question => question.id === questionId);
  }
  
  /**
   * Get all question IDs from the survey structure
   * @param surveyStructure The survey structure
   * @returns Array of question IDs
   */
  static getQuestionIds(surveyStructure: SurveyStructure): string[] {
    return surveyStructure.map(question => question.id);
  }
  
  /**
   * Validate that a response is valid for a given question
   * @param question The question to validate against
   * @param response The response value
   * @returns Boolean indicating if the response is valid
   */
  static validateResponse(question: SurveyQuestion, response: string | number): boolean {
    // For free text questions, any response is valid
    if (question.type === 'freeText' || question.type === 'commune' || question.type === 'street' || question.type === 'gare') {
      return true;
    }
    
    // For single choice questions, validate against options
    if (question.type === 'singleChoice' && question.options) {
      const responseId = typeof response === 'string' ? parseInt(response, 10) : response;
      return !isNaN(responseId) && question.options.some(option => option.id === responseId);
    }
    
    // For other question types, assume valid
    return true;
  }
}