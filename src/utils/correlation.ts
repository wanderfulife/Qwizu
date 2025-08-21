import { MappedData } from './dataMapper';
import { QuestionStatistics } from './statistics';

/**
 * Calculate correlation between two arrays of numerical values
 * @param x First array of values
 * @param y Second array of values
 * @returns Correlation coefficient between -1 and 1
 */
function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) {
    return 0;
  }

  const n = x.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

/**
 * Convert response values to numerical values for correlation calculation
 * @param responses Array of response values
 * @returns Array of numerical values
 */
function convertResponsesToNumerical(responses: (string | number)[]): number[] {
  return responses.map(response => {
    // If it's already a number, return it
    if (typeof response === 'number') {
      return response;
    }

    // Try to parse as number
    const num = parseFloat(response);
    if (!isNaN(num)) {
      return num;
    }

    // For non-numeric values, convert to a hash-based number
    let hash = 0;
    for (let i = 0; i < response.length; i++) {
      hash = ((hash << 5) - hash) + response.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  });
}

/**
 * Calculate correlation matrix for survey data
 * @param mappedData The mapped survey data
 * @param questions The question statistics
 * @returns Correlation matrix as a 2D array
 */
export function calculateCorrelationMatrix(
  mappedData: MappedData,
  questions: QuestionStatistics[]
): number[][] {
  // Get list of question IDs
  const questionIds = questions.map(q => q.questionId);
  
  // Create a matrix to store responses for each question
  const responseMatrix: number[][] = [];
  
  // Initialize matrix with empty arrays
  for (let i = 0; i < questionIds.length; i++) {
    responseMatrix[i] = [];
  }
  
  // Populate response matrix
  mappedData.forEach(respondent => {
    respondent.responses.forEach(response => {
      const questionIndex = questionIds.indexOf(response.questionId);
      if (questionIndex !== -1) {
        responseMatrix[questionIndex].push(response.responseValue as number);
      }
    });
  });
  
  // Convert responses to numerical values
  const numericalMatrix = responseMatrix.map(responses => 
    convertResponsesToNumerical(responses)
  );
  
  // Create correlation matrix
  const correlationMatrix: number[][] = [];
  
  for (let i = 0; i < numericalMatrix.length; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < numericalMatrix.length; j++) {
      if (i === j) {
        // Perfect correlation with itself
        correlationMatrix[i][j] = 1;
      } else if (numericalMatrix[i].length !== numericalMatrix[j].length) {
        // If arrays have different lengths, correlation is 0
        correlationMatrix[i][j] = 0;
      } else {
        // Calculate correlation between the two questions
        correlationMatrix[i][j] = calculateCorrelation(
          numericalMatrix[i],
          numericalMatrix[j]
        );
      }
    }
  }
  
  return correlationMatrix;
}

/**
 * Format correlation matrix for heatmap display
 * @param correlationMatrix The correlation matrix
 * @param questions The question statistics
 * @returns Formatted data for heatmap
 */
export function formatCorrelationData(
  correlationMatrix: number[][],
  questions: QuestionStatistics[]
) {
  const heatmapData = [];
  // Use full question texts without truncation for better display
  const labels = questions.map(q => q.questionText);
  
  for (let i = 0; i < correlationMatrix.length; i++) {
    for (let j = 0; j < correlationMatrix[i].length; j++) {
      // Use raw correlation values (between -1 and 1) instead of percentages
      heatmapData.push({
        x: labels[j],
        y: labels[i],
        v: correlationMatrix[i][j]
      });
    }
  }
  
  return {
    data: heatmapData,
    labelsX: labels,
    labelsY: labels
  };
}