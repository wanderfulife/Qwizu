import * as XLSX from 'xlsx';

export interface SurveyResponse {
  // Metadata fields
  ID_questionnaire?: string;
  ENQUETEUR?: string;
  DATE?: string;
  JOUR?: string;
  HEURE_DEBUT?: string;
  HEURE_FIN?: string;
  
  // Dynamic question response fields
  [key: string]: string | number | undefined;
}

export type SurveyResponses = SurveyResponse[];

export class ExcelParser {
  /**
   * Parse an Excel file and extract survey responses
   * @param file The Excel file to parse
   * @returns Promise resolving to an array of survey responses
   */
  static async parseExcelFile(file: File): Promise<SurveyResponses> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Check if workbook has sheets
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            reject(new Error('Le fichier Excel ne contient aucune feuille de calcul. Veuillez vérifier que votre fichier Excel contient des données.'));
            return;
          }
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          if (!worksheet) {
            reject(new Error('La feuille de calcul "' + firstSheetName + '" est vide ou corrompue. Veuillez vérifier votre fichier Excel.'));
            return;
          }
          
          // Convert to JSON
          const jsonData: SurveyResponses = XLSX.utils.sheet_to_json(worksheet);
          
          // Validate data structure
          if (!Array.isArray(jsonData)) {
            reject(new Error('Les données du fichier Excel ne sont pas dans un format valide. Veuillez vérifier la structure de votre fichier.'));
            return;
          }
          
          resolve(jsonData);
        } catch (error) {
          if (error instanceof Error) {
            // Provide more specific error messages based on the error type
            if (error.message.includes('magic number') || error.message.includes('File format')) {
              reject(new Error("Le fichier sélectionné n'est pas un fichier Excel valide (.xlsx). Veuillez vous assurer que vous avez sélectionné un fichier Excel au format .xlsx."));
            } else if (error.message.includes('password')) {
              reject(new Error('Le fichier Excel est protégé par un mot de passe. Veuillez fournir un fichier Excel non protégé.'));
            } else {
              reject(new Error("Erreur lors de l'analyse du fichier Excel: " + error.message + ". Veuillez vérifier que votre fichier Excel est valide et non corrompu."));
            }
          } else {
            reject(new Error("Erreur inconnue lors de l'analyse du fichier Excel. Veuillez réessayer avec un autre fichier."));
          }
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier. Veuillez vérifier que le fichier est accessible et non corrompu.'));
      };
      
      reader.onabort = () => {
        reject(new Error('Lecture du fichier interrompue. Veuillez réessayer de charger le fichier.'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  /**
   * Validate that the Excel data contains the required columns
   * @param data The parsed Excel data
   * @returns Boolean indicating if the data is valid
   */
  static validateExcelData(data: SurveyResponses): boolean {
    if (!data || data.length === 0) {
      return false;
    }
    
    // Check for required metadata columns
    const requiredColumns = ['ID_questionnaire', 'ENQUETEUR', 'DATE'];
    const firstRow = data[0];
    
    // Check if first row is an object
    if (typeof firstRow !== 'object' || firstRow === null) {
      return false;
    }
    
    return requiredColumns.every(column => column in firstRow);
  }
  
  /**
   * Get validation errors for Excel data
   * @param data The parsed Excel data
   * @returns Array of validation error messages
   */
  static getExcelValidationErrors(data: SurveyResponses): string[] {
    const errors: string[] = [];
    
    if (!data) {
      errors.push('Aucune donnée trouvée dans le fichier Excel');
      return errors;
    }
    
    if (!Array.isArray(data)) {
      errors.push('Les données du fichier Excel ne sont pas dans un format valide');
      return errors;
    }
    
    if (data.length === 0) {
      errors.push('Le fichier Excel est vide');
      return errors;
    }
    
    const firstRow = data[0];
    
    if (typeof firstRow !== 'object' || firstRow === null) {
      errors.push("La première ligne du fichier Excel n'est pas dans un format valide");
      return errors;
    }
    
    // Check for required metadata columns
    const requiredColumns = ['ID_questionnaire', 'ENQUETEUR', 'DATE'];
    const missingColumns = requiredColumns.filter(column => !(column in firstRow));
    
    if (missingColumns.length > 0) {
      errors.push('Colonnes manquantes dans le fichier Excel: ' + missingColumns.join(', '));
    }
    
    // Check for data consistency
    const emptyRows = data.filter(row => 
      typeof row === 'object' && row !== null && Object.keys(row).length === 0
    ).length;
    
    if (emptyRows > 0) {
      errors.push(emptyRows + ' ligne(s) vide(s) trouvée(s) dans le fichier Excel');
    }
    
    // Check for duplicate ID_questionnaire values
    const ids = data.map(row => row.ID_questionnaire).filter(id => id !== undefined);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      const uniqueDuplicates = [...new Set(duplicates)];
      errors.push("Des doublons ont été trouvés dans la colonne ID_questionnaire. " + uniqueDuplicates.length + " ID(s) dupliqué(s) trouvé(s): " + uniqueDuplicates.slice(0, 5).join(", ") + (uniqueDuplicates.length > 5 ? "..." : ""));
    }
    
    return errors;
  }
  
  /**
   * Get the list of question columns from the Excel data
   * @param data The parsed Excel data
   * @returns Array of question column names
   */
  static getQuestionColumns(data: SurveyResponses): string[] {
    if (!data || data.length === 0) {
      return [];
    }
    
    const firstRow = data[0];
    
    // Check if first row is an object
    if (typeof firstRow !== 'object' || firstRow === null) {
      return [];
    }
    
    const allColumns = Object.keys(firstRow);
    
    // Filter out metadata columns to get question columns
    const metadataColumns = ['ID_questionnaire', 'ENQUETEUR', 'DATE', 'JOUR', 'HEURE_DEBUT', 'HEURE_FIN'];
    return allColumns.filter(column => !metadataColumns.includes(column));
  }
}