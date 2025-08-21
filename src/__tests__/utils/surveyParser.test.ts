import { SurveyParser, SurveyStructure } from '@/utils/surveyParser';

describe('SurveyParser', () => {
  describe('parseSurveyContent', () => {
    it('should parse valid survey content correctly', () => {
      const validContent = `
        export const templateSurveyQuestions = [
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
      `;
      
      const result = SurveyParser.parseSurveyContent(validContent);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'Q1',
        text: 'What is your role?',
        type: 'singleChoice',
        options: [
          { id: 1, text: 'Developer', next: 'Q2' },
          { id: 2, text: 'Designer', next: 'Q3' }
        ]
      });
    });

    it('should throw error for empty content', () => {
      expect(() => {
        SurveyParser.parseSurveyContent('');
      }).toThrow('Le fichier de structure du questionnaire est vide');
    });

    it('should throw error for content without export', () => {
      const invalidContent = `
        const templateSurveyQuestions = [
          { id: 'Q1', text: 'Test', type: 'freeText' }
        ];
      `;
      
      expect(() => {
        SurveyParser.parseSurveyContent(invalidContent);
      }).toThrow('Impossible de trouver la structure du questionnaire dans le fichier');
    });

    it('should throw error for invalid JSON structure', () => {
      const invalidContent = `
        export const templateSurveyQuestions = [
          {
            id: 'Q1',
            text: 'Test',
            type: 'singleChoice',
            options: [  // Missing closing bracket
        ];
      `;
      
      expect(() => {
        SurveyParser.parseSurveyContent(invalidContent);
      }).toThrow('Erreur de syntaxe dans le fichier de structure');
    });
  });

  describe('validateSurveyStructure', () => {
    it('should return no errors for valid structure', () => {
      const validStructure: SurveyStructure = [
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
      
      const errors = SurveyParser.validateSurveyStructure(validStructure);
      
      expect(errors).toHaveLength(0);
    });

    it('should detect duplicate question IDs', () => {
      const invalidStructure: SurveyStructure = [
        {
          id: 'Q1',
          text: 'Question 1',
          type: 'freeText'
        },
        {
          id: 'Q1', // Duplicate ID
          text: 'Question 2',
          type: 'freeText'
        }
      ];
      
      const errors = SurveyParser.validateSurveyStructure(invalidStructure);
      
      expect(errors).toContain('IDs de questions dupliqués trouvés: Q1');
    });

    it('should detect missing required fields', () => {
      // Create an object that's missing the id field
      const invalidStructure = [
        {
          text: 'Question without ID',
          type: 'freeText'
        }
      ] as unknown as SurveyStructure;
      
      const errors = SurveyParser.validateSurveyStructure(invalidStructure);
      
      expect(errors).toContain('Question à l\'index 0 n\'a pas d\'ID');
    });

    it('should validate singleChoice question options', () => {
      // Create an object that's missing the id field in options
      const invalidStructure = [
        {
          id: 'Q1',
          text: 'Question with invalid options',
          type: 'singleChoice',
          options: [
            {
              text: 'Option without ID',
              next: 'Q2'
            }
          ]
        }
      ] as unknown as SurveyStructure;
      
      const errors = SurveyParser.validateSurveyStructure(invalidStructure);
      
      expect(errors).toContain('Option à l\'index 0 de la question "Q1" n\'a pas d\'ID');
    });
  });

  describe('validateResponse', () => {
    it('should validate freeText responses as valid', () => {
      const question = {
        id: 'Q1',
        text: 'Free text question',
        type: 'freeText'
      };
      
      expect(SurveyParser.validateResponse(question, 'Any text is valid')).toBe(true);
      expect(SurveyParser.validateResponse(question, '')).toBe(true);
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
      
      expect(SurveyParser.validateResponse(question, 1)).toBe(true);
      expect(SurveyParser.validateResponse(question, '2')).toBe(true);
      expect(SurveyParser.validateResponse(question, 3)).toBe(false); // Invalid option
      expect(SurveyParser.validateResponse(question, 'invalid')).toBe(false); // Not a number
    });
  });
});