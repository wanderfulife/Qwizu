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
- Material UI components

### Key Libraries
- xlsx: Excel file parsing
- chart.js: Data visualization
- react-chartjs-2: React wrapper for Chart.js

### Project Structure
```
survey-processor/
├── app/
│   ├── layout.tsx    # Root layout with context provider
│   ├── page.tsx      # Home page (file upload)
│   ├── processing/   # Processing page
│   └── results/      # Results page
├── components/
│   ├── FileUpload/   # File upload components
│   ├── Visualization/ # Data visualization components
│   ├── Layout/       # Layout components (Header, Footer)
│   └── Feedback/     # Feedback components
├── contexts/
│   └── SurveyDataContext.tsx # Application state management
├── lib/
│   └── surveyProcessor.ts    # Main processing logic
├── utils/
│   ├── excelParser.ts        # Excel file parsing
│   ├── surveyParser.ts       # Survey structure parsing
│   ├── dataMapper.ts         # Data mapping logic
│   └── statistics.ts         # Statistical calculations
└── theme.ts          # Material UI theme configuration
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

### Implemented Optimizations

#### 1. Data Pagination for Large Datasets
- Created `PaginatedQuestionsList` component
- Added pagination controls to the "Questions" tab in the results view
- Users can select the number of questions to display per page (3, 5, 10, or 15)

Benefits:
- Reduces DOM complexity by only rendering a subset of questions at a time
- Improves initial render time and memory usage
- Provides smooth navigation between pages
- Maintains scroll position when changing pages

#### 2. Virtualization for Long Lists
- Created `VirtualizedQuestionsList` component
- Implemented a custom virtualization solution using React hooks and refs
- Added toggle between pagination and virtualization views in the "Questions" tab

Benefits:
- Only renders visible items in the viewport plus a small buffer
- Dramatically improves performance for lists with hundreds or thousands of items
- Maintains smooth scrolling experience
- Reduces memory consumption and improves responsiveness

#### 3. Chart Rendering Optimizations
- Created `OptimizedBarChart` component
- Created `OptimizedPieChart` component
- Added data grouping for datasets with more than a specified number of items
- Implemented configurable maximum items to display per chart

Benefits:
- Prevents browser performance issues with charts containing many data points
- Groups less significant data into an "Others" category for clarity
- Maintains chart readability and performance
- Allows users to configure the level of detail shown

#### 4. Additional Optimizations
- Lazy Loading: Implemented lazy loading for tab content to reduce initial bundle size
- Memoization: Used React's `useMemo` hook in chart components to prevent unnecessary recalculations
- Efficient Data Structures: Used appropriate data structures for fast lookups and iterations

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
- Material UI: UI components

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

## Implementation Status

The application is fully implemented with real data processing capabilities:

### State Management
- Created `SurveyDataContext` to manage application state across pages
- Added context provider to the root layout
- Implemented proper file passing between pages using React Context

### Data Flow Implementation
- Home page stores files in the context when uploaded
- Processing page retrieves files from context and processes them using the `SurveyProcessor`
- Results page consumes processed data from the context

### Real Data Processing
- Actual file processing using the existing `SurveyProcessor` library
- Removed all dummy data implementations
- Connected UI components to real processed data

### Code Quality Improvements
- Fixed TypeScript errors and improved type safety
- Resolved linting issues
- Improved code organization and maintainability

## Usage Instructions

1. Access the home page to upload files
2. Upload the survey structure file (JavaScript format)
3. Upload the Excel response file
4. Click "Process Files" to begin analysis
5. View results in the dashboard with various visualization options
6. Use pagination or virtualization for large datasets
7. Configure chart display options as needed

## Future Enhancements

1. Implement raw data display in the results page
2. Add export functionality for processed data
3. Enhance error handling and user feedback
4. Implement additional visualization types
5. Add filtering and sorting capabilities for results
6. Implement Web Workers for heavy data processing
7. Add progressive loading for extremely large datasets
8. Implement caching mechanisms for processed data
9. Add dynamic virtualization with accurate item height calculation