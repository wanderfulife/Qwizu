import { DataMapper, MappedData, MappedRespondent } from '@/utils/dataMapper';
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

    it('should throw error for invalid survey structure', () => {
      const surveyResponses: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1'
        }
      ];

      expect(() => {
        DataMapper.mapData(null as any, surveyResponses);
      }).toThrow('Structure du questionnaire invalide');
    });

    it('should throw error for invalid survey responses', () => {
      const surveyStructure: SurveyStructure = [
        {
          id: 'Q1',
          text: 'What is your role?',
          type: 'singleChoice',
          options: [
            { id: 1, text: 'Developer', next: 'Q2' },
            { id: 2, text: 'Designer', next: 'Q3' }
          ]
        }
      ];

      expect(() => {
        DataMapper.mapData(surveyStructure, null as any);
      }).toThrow('Données de réponse invalide');
    });
  });

  describe('determineFlowType', () => {
    it('should determine MONTANTS flow type correctly', () => {
      const response = { Q1: '1' };
      expect(DataMapper.determineFlowType(response)).toBe('MONTANTS');
    });

    it('should determine DESCENDANTS flow type correctly', () => {
      const response = { Q1: '2' };
      expect(DataMapper.determineFlowType(response)).toBe('DESCENDANTS');
    });

    it('should determine ACCOMPAGNATEURS flow type correctly', () => {
      expect(DataMapper.determineFlowType({ Q1: '3' })).toBe('ACCOMPAGNATEURS');
      expect(DataMapper.determineFlowType({ Q1: '4' })).toBe('ACCOMPAGNATEURS');
    });

    it('should return UNKNOWN for invalid Q1 values', () => {
      expect(DataMapper.determineFlowType({ Q1: '5' })).toBe('UNKNOWN');
      expect(DataMapper.determineFlowType({ Q1: null })).toBe('UNKNOWN');
      expect(DataMapper.determineFlowType({})).toBe('UNKNOWN');
    });
  });

  describe('questionAppliesToFlow', () => {
    it('should correctly identify questions for DESCENDANTS flow', () => {
      expect(DataMapper.questionAppliesToFlow('Q1', 'DESCENDANTS')).toBe(true);
      expect(DataMapper.questionAppliesToFlow('Q2_MONTANTS', 'DESCENDANTS')).toBe(false);
      expect(DataMapper.questionAppliesToFlow('Q2_ACCOMPAGNATEURS', 'DESCENDANTS')).toBe(false);
    });

    it('should correctly identify questions for MONTANTS flow', () => {
      expect(DataMapper.questionAppliesToFlow('Q1', 'MONTANTS')).toBe(true);
      expect(DataMapper.questionAppliesToFlow('Q2_MONTANTS', 'MONTANTS')).toBe(true);
      expect(DataMapper.questionAppliesToFlow('Q2_ACCOMPAGNATEURS', 'MONTANTS')).toBe(false);
    });

    it('should correctly identify questions for ACCOMPAGNATEURS flow', () => {
      expect(DataMapper.questionAppliesToFlow('Q1', 'ACCOMPAGNATEURS')).toBe(true);
      expect(DataMapper.questionAppliesToFlow('Q2_ACCOMPAGNATEURS', 'ACCOMPAGNATEURS')).toBe(true);
      expect(DataMapper.questionAppliesToFlow('Q2_MONTANTS', 'ACCOMPAGNATEURS')).toBe(false);
    });
  });

  describe('validateResponse', () => {
    it('should validate freeText responses as valid', () => {
      const question = {
        id: 'Q1',
        text: 'Free text question',
        type: 'freeText'
      };
      
      expect(DataMapper.validateResponse(question, 'Any text is valid')).toBe(true);
      expect(DataMapper.validateResponse(question, '')).toBe(true);
      expect(DataMapper.validateResponse(question, undefined as any)).toBe(true);
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
      expect(DataMapper.validateResponse(question, undefined as any)).toBe(true); // Undefined response is valid
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