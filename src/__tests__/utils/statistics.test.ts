import { StatisticsProcessor, ResponseCount } from '@/utils/statistics';
import { MappedData } from '@/utils/dataMapper';
import { SurveyStructure } from '@/utils/surveyParser';

describe('StatisticsProcessor', () => {
  describe('calculateStatistics', () => {
    it('should calculate statistics correctly for valid data', () => {
      const mappedData: MappedData = [
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
            },
            {
              questionId: 'Q2_MONTANTS',
              questionText: 'Experience level?',
              responseType: 'singleChoice',
              responseValue: '2',
              responseLabel: 'Senior',
              isValid: true
            }
          ],
          flowType: 'MONTANTS'
        },
        {
          id: 'RESP002',
          responses: [
            {
              questionId: 'Q1',
              questionText: 'What is your role?',
              responseType: 'singleChoice',
              responseValue: '2',
              responseLabel: 'Designer',
              isValid: true
            }
          ],
          flowType: 'DESCENDANTS'
        }
      ];

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
          text: 'Experience level?',
          type: 'singleChoice',
          options: [
            { id: 1, text: 'Junior', next: 'Q3' },
            { id: 2, text: 'Senior', next: 'Q4' }
          ]
        }
      ];

      const result = StatisticsProcessor.calculateStatistics(mappedData, surveyStructure);

      expect(result.totalRespondents).toBe(2);
      expect(result.flowDistribution).toEqual({
        MONTANTS: 1,
        ACCOMPAGNATEURS: 0,
        DESCENDANTS: 1,
        UNKNOWN: 0
      });
      expect(result.completionRate).toBeGreaterThanOrEqual(0);
      expect(result.questions).toHaveLength(2);
    });

    it('should throw error for invalid mapped data', () => {
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
        StatisticsProcessor.calculateStatistics(null as any, surveyStructure);
      }).toThrow('Données mappées invalides');
    });

    it('should throw error for invalid survey structure', () => {
      const mappedData: MappedData = [
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

      expect(() => {
        StatisticsProcessor.calculateStatistics(mappedData, null as any);
      }).toThrow('Structure du questionnaire invalide');
    });
  });

  describe('calculateFlowDistribution', () => {
    it('should calculate flow distribution correctly', () => {
      const mappedData: MappedData = [
        { id: '1', responses: [], flowType: 'MONTANTS' },
        { id: '2', responses: [], flowType: 'MONTANTS' },
        { id: '3', responses: [], flowType: 'ACCOMPAGNATEURS' },
        { id: '4', responses: [], flowType: 'DESCENDANTS' },
        { id: '5', responses: [], flowType: 'UNKNOWN' }
      ];

      const result = StatisticsProcessor.calculateFlowDistribution(mappedData);

      expect(result).toEqual({
        MONTANTS: 2,
        ACCOMPAGNATEURS: 1,
        DESCENDANTS: 1,
        UNKNOWN: 1
      });
    });
  });

  describe('calculateCompletionRate', () => {
    it('should calculate completion rate correctly', () => {
      const mappedData: MappedData = [
        {
          id: 'RESP001',
          responses: [
            { questionId: 'Q1', questionText: 'Q1', responseType: 'freeText', responseValue: 'Answer1', isValid: true },
            { questionId: 'Q2', questionText: 'Q2', responseType: 'freeText', responseValue: 'Answer2', isValid: true }
          ],
          flowType: 'MONTANTS'
        }
      ];

      const surveyStructure: SurveyStructure = [
        { id: 'Q1', text: 'Q1', type: 'freeText' },
        { id: 'Q2', text: 'Q2', type: 'freeText' },
        { id: 'Q3', text: 'Q3', type: 'freeText' }
      ];

      const result = StatisticsProcessor.calculateCompletionRate(mappedData, surveyStructure);

      // With 2 responses out of 3 possible, should be around 67%
      expect(result).toBeGreaterThanOrEqual(60);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should return 0 for empty data', () => {
      const result = StatisticsProcessor.calculateCompletionRate([], []);
      expect(result).toBe(0);
    });
  });

  describe('calculateResponseCounts', () => {
    it('should calculate response counts correctly', () => {
      const responses = [
        {
          questionId: 'Q1',
          questionText: 'What is your role?',
          responseType: 'singleChoice',
          responseValue: '1',
          responseLabel: 'Developer',
          isValid: true
        },
        {
          questionId: 'Q1',
          questionText: 'What is your role?',
          responseType: 'singleChoice',
          responseValue: '1',
          responseLabel: 'Developer',
          isValid: true
        },
        {
          questionId: 'Q1',
          questionText: 'What is your role?',
          responseType: 'singleChoice',
          responseValue: '2',
          responseLabel: 'Designer',
          isValid: true
        }
      ];

      const question = {
        id: 'Q1',
        text: 'What is your role?',
        type: 'singleChoice',
        options: [
          { id: 1, text: 'Developer', next: 'Q2' },
          { id: 2, text: 'Designer', next: 'Q3' }
        ]
      };

      const result = StatisticsProcessor.calculateResponseCounts(responses, question);

      expect(result).toHaveLength(2);
      
      // Should be sorted by count descending
      expect(result[0]).toEqual({
        value: '1',
        label: 'Developer',
        count: 2,
        percentage: 67
      });
      
      expect(result[1]).toEqual({
        value: '2',
        label: 'Designer',
        count: 1,
        percentage: 33
      });
    });

    it('should handle empty responses', () => {
      const result = StatisticsProcessor.calculateResponseCounts([], {
        id: 'Q1',
        text: 'Test',
        type: 'freeText'
      });

      expect(result).toHaveLength(0);
    });
  });
});