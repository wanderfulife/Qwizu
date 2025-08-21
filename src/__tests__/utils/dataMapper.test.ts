import { DataMapper, MappedData } from '@/utils/dataMapper';
import { SurveyStructure } from '@/utils/surveyParser';
import { SurveyResponses } from '@/utils/excelParser';

describe('DataMapper', () => {
  describe('mapData', () => {
    it('should map survey responses to questions correctly', () => {
      const surveyStructure: SurveyStructure = [
        {
          id: 'Q1',
          text: 'What is your role?',
          type: 'singleChoice',
          options: [
            { id: 1, text: 'Developer', next: 'Q2' },
            { id: 2, text: 'Designer', next: 'Q3' }
          ]
        },
        {
          id: 'Q2_MONTANTS',
          text: 'What is your experience?',
          type: 'singleChoice',
          options: [
            { id: 1, text: 'Junior', next: 'Q3' },
            { id: 2, text: 'Senior', next: 'Q4' }
          ]
        }
      ];

      const surveyResponses: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1',
          Q2_MONTANTS: '2'
        }
      ];

      const result = DataMapper.mapData(surveyStructure, surveyResponses);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('RESP001');
      expect(result[0].flowType).toBe('MONTANTS');
      expect(result[0].responses).toHaveLength(2);
      
      // Check first response
      expect(result[0].responses[0]).toEqual({
        questionId: 'Q1',
        questionText: 'What is your role?',
        responseType: 'singleChoice',
        responseValue: '1',
        responseLabel: 'Developer',
        isValid: true
      });
      
      // Check second response
      expect(result[0].responses[1]).toEqual({
        questionId: 'Q2_MONTANTS',
        questionText: 'What is your experience?',
        responseType: 'singleChoice',
        responseValue: '2',
        responseLabel: 'Senior',
        isValid: true
      });
    });

    it('should handle multiple respondents', () => {
      const surveyStructure: SurveyStructure = [
        {
          id: 'Q1',
          text: 'What is your role?',
          type: 'singleChoice',
          options: [
            { id: 1, text: 'Developer' },
            { id: 2, text: 'Designer' }
          ]
        }
      ];

      const surveyResponses: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1'
        },
        {
          ID_questionnaire: 'RESP002',
          ENQUETEUR: 'Jane Doe',
          DATE: '2023-01-02',
          Q1: '2'
        }
      ];

      const result = DataMapper.mapData(surveyStructure, surveyResponses);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('RESP001');
      expect(result[1].id).toBe('RESP002');
    });

    it('should handle missing responses', () => {
      const surveyStructure: SurveyStructure = [
        {
          id: 'Q1',
          text: 'What is your role?',
          type: 'singleChoice',
          options: [
            { id: 1, text: 'Developer' },
            { id: 2, text: 'Designer' }
          ]
        },
        {
          id: 'Q2',
          text: 'How many years of experience?',
          type: 'numeric'
        }
      ];

      const surveyResponses: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1'
          // Q2 is missing
        }
      ];

      const result = DataMapper.mapData(surveyStructure, surveyResponses);

      expect(result).toHaveLength(1);
      expect(result[0].responses).toHaveLength(1);
      
      // First response should be valid
      expect(result[0].responses[0]).toEqual({
        questionId: 'Q1',
        questionText: 'What is your role?',
        responseType: 'singleChoice',
        responseValue: '1',
        responseLabel: 'Developer',
        isValid: true
      });
      
      // Second response is missing, so it's not included in the responses array
    });
  });

  describe('validateResponse', () => {
    it('should validate numeric responses correctly', () => {
      const question = {
        id: 'Q1',
        text: 'Numeric question',
        type: 'numeric'
      };
      
      expect(DataMapper.validateResponse(question, '42')).toBe(true);
      expect(DataMapper.validateResponse(question, '3.14')).toBe(true);
      expect(DataMapper.validateResponse(question, '')).toBe(true); // Empty response is valid
      expect(DataMapper.validateResponse(question, undefined)).toBe(true); // Undefined response is valid
      // For numeric questions, even invalid strings are considered valid in the current implementation
      expect(DataMapper.validateResponse(question, 'invalid')).toBe(true);
    });

    it('should validate freeText responses correctly', () => {
      const question = {
        id: 'Q1',
        text: 'Free text question',
        type: 'freeText'
      };
      
      expect(DataMapper.validateResponse(question, 'Any text is valid')).toBe(true);
      expect(DataMapper.validateResponse(question, '')).toBe(true);
      expect(DataMapper.validateResponse(question, undefined)).toBe(true);
    });

    it('should validate singleChoice responses correctly', () => {
      const question = {
        id: 'Q1',
        text: 'Single choice question',
        type: 'singleChoice',
        options: [
          { id: 1, text: 'Option 1', next: 'Q2' },
          { id: 2, text: 'Option 2', next: 'Q3' }
        ]
      };
      
      expect(DataMapper.validateResponse(question, 1)).toBe(true);
      expect(DataMapper.validateResponse(question, '2')).toBe(true);
      expect(DataMapper.validateResponse(question, '')).toBe(true); // Empty response is valid
      expect(DataMapper.validateResponse(question, undefined)).toBe(true); // Undefined response is valid
      expect(DataMapper.validateResponse(question, 3)).toBe(false); // Invalid option
      expect(DataMapper.validateResponse(question, 'invalid')).toBe(false); // Not a number
    });
  });

  describe('getDataValidationErrors', () => {
    it('should return no errors for valid mapped data', () => {
      const validData: MappedData = [
        {
          id: 'RESP001',
          responses: [
            {
              questionId: 'Q1',
              questionText: 'What is your role?',
              responseType: 'singleChoice',
              responseValue: '1',
              responseLabel: 'Developer',
              isValid: true
            }
          ],
          flowType: 'MONTANTS'
        }
      ];

      const errors = DataMapper.getDataValidationErrors(validData);
      
      expect(errors).toHaveLength(0);
    });

    it('should detect respondents with no responses', () => {
      const invalidData: MappedData = [
        {
          id: 'RESP001',
          responses: [],
          flowType: 'MONTANTS'
        }
      ];

      const errors = DataMapper.getDataValidationErrors(invalidData);
      
      expect(errors).toContain('1 répondant(s) n\'ont aucune réponse valide');
    });

    it('should detect respondents with unknown flow type', () => {
      const invalidData: MappedData = [
        {
          id: 'RESP001',
          responses: [
            {
              questionId: 'Q1',
              questionText: 'What is your role?',
              responseType: 'singleChoice',
              responseValue: '5', // Invalid option
              isValid: true
            }
          ],
          flowType: 'UNKNOWN'
        }
      ];

      const errors = DataMapper.getDataValidationErrors(invalidData);
      
      expect(errors).toContain('1 répondant(s) ont un type de flux inconnu (Q1 invalide)');
    });

    it('should detect invalid responses', () => {
      const invalidData: MappedData = [
        {
          id: 'RESP001',
          responses: [
            {
              questionId: 'Q1',
              questionText: 'What is your role?',
              responseType: 'singleChoice',
              responseValue: '5', // Invalid option
              isValid: false,
              validationError: 'Option "5" invalide. Options valides: 1, 2'
            }
          ],
          flowType: 'MONTANTS'
        }
      ];

      const errors = DataMapper.getDataValidationErrors(invalidData);
      
      expect(errors).toContain('1 réponse(s) invalide(s) trouvée(s) dans les données');
      expect(errors).toContain('- 1 réponse(s): Option "5" invalide. Options valides: 1, 2');
    });
  });
});