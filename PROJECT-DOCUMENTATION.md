# Survey Data Processor - Complete Documentation

## Project Summary

The Survey Data Processor is a React Next.js web application designed to analyze survey data by processing two key files:
1. A survey structure file defining questions and possible responses
2. An Excel file containing collected responses from participants

The application parses both files, maps responses to corresponding questions, and displays aggregated results in an interactive, user-friendly format.

## Key Features

### File Processing
- Upload and parse survey structure files (JavaScript format)
- Upload and parse Excel response files (.xlsx format)
- Validate file formats and content
- Handle parsing errors gracefully

### Data Analysis
- Map responses to questions using question IDs
- Process conditional question flows
- Aggregate response data by question
- Calculate response percentages and statistics
- Identify response patterns and trends

### Data Visualization
- Interactive charts for response distributions (bar charts, pie charts)
- Detailed tables for individual responses with sorting and filtering
- Summary dashboard with key statistics
- Cross-tabulation views for analyzing relationships between questions
- Responsive design for all device sizes

### User Experience
- Intuitive file upload interface
- Progress indicators during processing
- Clear error messages and validation
- Export options for processed data
- Responsive design for desktop and mobile devices

## Technical Architecture

### Frontend Framework
- Next.js 13+ with App Router
- React 18+ with TypeScript
- Tailwind CSS for styling
- Material UI components

### Key Libraries
- xlsx: Excel file parsing
- chart.js: Data visualization
- react-chartjs-2: React wrapper for Chart.js

### Project Structure
```
survey-processor/
├── components/
│   ├── FileUpload/
│   ├── Visualization/
│   ├── Layout/
│   └── Feedback/
├── pages/
│   ├── index.tsx (Upload)
│   ├── process.tsx (Processing)
│   └── results.tsx (Results)
├── utils/
│   ├── excelParser.ts
│   ├── dataMapper.ts
│   ├── statistics.ts
│   └── errorHandler.ts
└── lib/
    └── surveyProcessor.ts
```

## Data Flow

1. **File Upload**: Users upload survey structure and Excel response files
2. **Parsing**: Application parses both files and extracts data
3. **Mapping**: Responses are mapped to questions using question IDs
4. **Processing**: Data is aggregated and statistics are calculated
5. **Visualization**: Results are displayed through interactive charts and tables

## File Structure Specifications

### Survey Structure File (surveyQuestions.js)
The survey structure file exports a templateSurveyQuestions array containing question objects with the following properties:

```javascript
{
  id: string,           // Unique question identifier (e.g., "Q1", "Q2_MONTANTS")
  text: string,         // Question text displayed to respondents
  type: string,         // Question type: 'singleChoice', 'commune', 'street', 'gare', 'freeText'
  options?: Array<{     // Available options for singleChoice questions
    id: number,         // Option identifier
    text: string,       // Option text
    next: string        // Next question ID or "end"
  }>,
  next?: string,        // Next question ID or "end" (for non-singleChoice questions)
  image?: string,       // Optional image path
  imageAlt?: string,    // Optional image description
  freeTextPlaceholder?: string  // Placeholder for freeText questions
}
```

### Excel Response File (Lamballe.xlsx)
The Excel file contains a single sheet with the following column structure:

1. **Metadata Columns**:
   - ID_questionnaire: Unique respondent identifier
   - ENQUETEUR: Surveyor name
   - DATE: Survey date
   - JOUR: Day of week
   - HEURE_DEBUT: Start time
   - HEURE_FIN: End time

2. **Question Response Columns**:
   - Columns named after question IDs (Q1, Q2_MONTANTS, Q2_AUTRE_MONTANTS, etc.)
   - Special columns with suffixes for detailed responses:
     - _CODE_INSEE: INSEE code for commune questions
     - _COMMUNE_LIBRE: Free text commune names

3. **Row Structure**:
   - Each row represents a single respondent
   - Values in question columns represent selected options or free text responses

## Data Processing Logic

### Question Flow Handling
The survey has conditional flows based on responses:

1. **Q1 Response Determines Flow**:
   - Q1=1: "Je vais prendre le train" → Follow MONTANTS flow
   - Q1=2: "Je viens de descendre du train" → End survey (not interviewed)
   - Q1=3 or Q1=4: Accompaniers/Autres → Follow ACCOMPAGNATEURS flow

2. **Flow Navigation**:
   - Use the `next` property in question definitions to determine the next question
   - Handle branching based on specific response options

### Response Mapping
1. **Single Choice Questions**:
   - Map numeric responses to option texts
   - Validate responses against available options

2. **Special Question Types**:
   - commune: Handle _CODE_INSEE and _COMMUNE_LIBRE columns
   - street, gare: Free text responses
   - freeText: Open-ended responses

## Implementation Approach

The project will be implemented in phases:
1. Project setup and file upload components
2. Excel parsing and data extraction
3. Data mapping and processing
4. Visualization and results display
5. UI/UX implementation
6. Error handling and validation
7. Testing and documentation

## Data Structures

### Survey Structure
```typescript
interface SurveyQuestion {
  id: string;
  text: string;
  type: 'singleChoice' | 'commune' | 'street' | 'gare' | 'freeText';
  options?: Array<{
    id: number;
    text: string;
    next: string;
  }>;
  next?: string;
  image?: string;
  imageAlt?: string;
  freeTextPlaceholder?: string;
}

type SurveyStructure = SurveyQuestion[];
```

### Response Data
```typescript
interface SurveyResponse {
  // Metadata
  ID_questionnaire: string;
  ENQUETEUR: string;
  DATE: string;
  JOUR: string;
  HEURE_DEBUT: string;
  HEURE_FIN: string;
  
  // Question responses (dynamic keys based on question IDs)
  [questionId: string]: string | number;
  
  // Special columns for detailed responses
  [questionId: string + '_CODE_INSEE']?: string;
  [questionId: string + '_COMMUNE_LIBRE']?: string;
}

type SurveyResponses = SurveyResponse[];
```

### Processed Data
```typescript
interface ProcessedQuestionData {
  questionId: string;
  questionText: string;
  type: string;
  responseCounts: Record<string, number>; // Option ID -> Count
  responsePercentages: Record<string, number>; // Option ID -> Percentage
  totalResponses: number;
  skippedResponses: number;
}

interface ProcessedData {
  questions: Record<string, ProcessedQuestionData>;
  respondentFlow: Record<string, number>; // Flow type -> Count
  completionRate: number;
}
```

## User Interface Components

### 1. File Upload Page
- Dual file upload components
- File validation feedback
- Upload progress indicators

### 2. Processing Page
- Data parsing progress
- Flow validation status
- Error reporting

### 3. Results Dashboard
- Summary statistics cards
- Question-by-question analysis
- Cross-tabulation views
- Free text response analysis
- Export functionality

## Error Handling

### File Processing Errors
- Invalid file formats
- Missing required columns
- Malformed survey structure
- Inconsistent data types

### Data Mapping Errors
- Unrecognized question IDs
- Invalid response values
- Flow navigation issues
- Missing required responses

### Recovery Strategies
- Graceful degradation for non-critical errors
- User-friendly error messages
- Partial data processing where possible
- Export of error logs

## Performance Considerations

### Data Size Handling
- Efficient parsing of large Excel files
- Streaming processing for large datasets
- Memory optimization for data structures
- Pagination for large result sets

### Optimization Techniques
- Caching of parsed data
- Lazy loading of visualizations
- Web Workers for heavy processing
- Virtual scrolling for large tables

## Security Considerations

### File Handling
- Client-side processing only (no server upload)
- File size limitations
- MIME type validation
- Sanitization of file contents

### Data Privacy
- No data storage on server
- Client-side only processing
- Clear data on page refresh
- No tracking or analytics

## Testing Strategy

### Unit Tests
- File parsing functions
- Data mapping logic
- Statistics calculations
- Flow processing

### Integration Tests
- End-to-end file processing
- UI component interactions
- Data visualization rendering
- Error handling scenarios

### Sample Data Testing
- Provided Lamballe.xlsx file
- Various response patterns
- Edge cases and error conditions
- Different flow paths

## Dependencies

### Core Libraries
- xlsx: Excel file parsing
- chart.js: Data visualization
- react-chartjs-2: React wrapper for Chart.js

### UI Framework
- Next.js: React framework
- React: UI library
- TypeScript: Type safety
- Tailwind CSS: Styling

### UI Components
- @mui/material: Material UI components
- @emotion/react: CSS-in-JS
- @emotion/styled: Styled components

## Deployment Considerations

### Browser Compatibility
- Modern browsers supporting ES6+
- File API support
- Canvas for chart rendering
- Web Workers for processing

### Performance Targets
- Load time under 3 seconds
- Processing time under 10 seconds for 1000 responses
- Memory usage under 100MB for 5000 responses
- Responsive UI during processing

## Expected Outcomes

- A fully functional web application for survey data analysis
- Interactive visualizations of survey results
- Detailed statistics and response patterns
- Export capabilities for processed data
- Responsive design that works on all devices
- Comprehensive documentation for users and developers

## Target Users

- Survey researchers and analysts
- Market research professionals
- Academic researchers
- Business analysts
- Anyone who needs to analyze survey data efficiently