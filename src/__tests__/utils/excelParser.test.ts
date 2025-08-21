import { ExcelParser, SurveyResponses } from '@/utils/excelParser';
import * as xlsx from 'xlsx';

// Mock the xlsx library
jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

describe('ExcelParser', () => {
  describe('parseExcelFile', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });

    it('should parse valid Excel file correctly', async () => {
      const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Mock the xlsx functions
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {}
        }
      };
      
      const mockJsonData: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1',
          Q2: 'Developer'
        }
      ];
      
      (xlsx.read as jest.Mock).mockReturnValue(mockWorkbook);
      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockJsonData);
      
      const result = await ExcelParser.parseExcelFile(mockFile);
      
      expect(result).toEqual(mockJsonData);
      expect(xlsx.read).toHaveBeenCalled();
      expect(xlsx.utils.sheet_to_json).toHaveBeenCalled();
    });

    it('should reject when file has no sheets', async () => {
      const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Mock the xlsx functions
      const mockWorkbook = {
        SheetNames: []
      };
      
      (xlsx.read as jest.Mock).mockReturnValue(mockWorkbook);
      
      await expect(ExcelParser.parseExcelFile(mockFile)).rejects.toThrow('Le fichier Excel ne contient aucune feuille de calcul');
    });

    it('should reject when worksheet is empty', async () => {
      const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Mock the xlsx functions
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: null
        }
      };
      
      (xlsx.read as jest.Mock).mockReturnValue(mockWorkbook);
      
      await expect(ExcelParser.parseExcelFile(mockFile)).rejects.toThrow('La feuille de calcul "Sheet1" est vide ou corrompue');
    });

    it('should reject when file is not valid Excel', async () => {
      const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      (xlsx.read as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid file format');
      });
      
      await expect(ExcelParser.parseExcelFile(mockFile)).rejects.toThrow('Erreur lors de l\'analyse du fichier Excel');
    });
  });

  describe('validateExcelData', () => {
    it('should return true for valid data', () => {
      const validData: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1'
        }
      ];
      
      expect(ExcelParser.validateExcelData(validData)).toBe(true);
    });

    it('should return false for empty data', () => {
      expect(ExcelParser.validateExcelData([])).toBe(false);
    });

    it('should return false for missing required columns', () => {
      const invalidData: SurveyResponses = [
        {
          Q1: '1' // Missing required columns
        }
      ];
      
      expect(ExcelParser.validateExcelData(invalidData)).toBe(false);
    });
  });

  describe('getExcelValidationErrors', () => {
    it('should return no errors for valid data', () => {
      const validData: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1'
        }
      ];
      
      const errors = ExcelParser.getExcelValidationErrors(validData);
      
      expect(errors).toHaveLength(0);
    });

    it('should detect missing required columns', () => {
      const invalidData: SurveyResponses = [
        {
          Q1: '1' // Missing required columns
        }
      ];
      
      const errors = ExcelParser.getExcelValidationErrors(invalidData);
      
      expect(errors).toContain('Colonnes manquantes dans le fichier Excel: ID_questionnaire, ENQUETEUR, DATE');
    });

    it('should detect duplicate ID_questionnaire values', () => {
      const invalidData: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1'
        },
        {
          ID_questionnaire: 'RESP001', // Duplicate ID
          ENQUETEUR: 'Jane Doe',
          DATE: '2023-01-02',
          Q2: '2'
        }
      ];
      
      const errors = ExcelParser.getExcelValidationErrors(invalidData);
      
      expect(errors).toContain('Des doublons ont été trouvés dans la colonne ID_questionnaire. 1 ID(s) dupliqué(s) trouvé(s): RESP001');
    });
  });

  describe('getQuestionColumns', () => {
    it('should return question columns excluding metadata', () => {
      const data: SurveyResponses = [
        {
          ID_questionnaire: 'RESP001',
          ENQUETEUR: 'John Doe',
          DATE: '2023-01-01',
          Q1: '1',
          Q2_MONTANTS: '2',
          Q3_ACCOMPAGNATEURS: '3'
        }
      ];
      
      const questionColumns = ExcelParser.getQuestionColumns(data);
      
      expect(questionColumns).toEqual(['Q1', 'Q2_MONTANTS', 'Q3_ACCOMPAGNATEURS']);
    });

    it('should return empty array for empty data', () => {
      const questionColumns = ExcelParser.getQuestionColumns([]);
      
      expect(questionColumns).toEqual([]);
    });
  });
});