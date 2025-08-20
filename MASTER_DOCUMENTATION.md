# SurveyInsights - Complete Documentation

_Last updated: August 21, 2025_

## Project Summary

SurveyInsights is a modern, professional SaaS web application built with Next.js that processes and analyzes survey data. It takes two key files as input:
1. A survey structure file defining questions and possible responses
2. An Excel file containing collected responses from participants

The application parses both files, maps responses to corresponding questions, and displays aggregated results in an interactive, user-friendly dashboard with modern data visualizations.

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

## Modern Design Enhancements

### Visual Identity
- Modern Color Scheme: Implemented a sophisticated gradient-based color palette with primary blues and secondary purples
- Contemporary Typography: Using Inter font family for better readability and modern aesthetics
- Enhanced Components: Custom styled Material-UI components for cards, buttons, and inputs
- Visual Hierarchy: Improved spacing, typography scales, and visual weight distribution

### User Interface Components

#### Header
- Modern Navigation: Responsive navigation with mobile menu support
- User Account System: User menu with profile, settings, and logout options
- Notification System: Notification bell with badge indicators
- Branding: Enhanced logo with gradient text effect

#### Footer
- Comprehensive Layout: Multi-column footer with product, resources, and company links
- Social Media Integration: Social media icons
- Professional Styling: Modern spacing and typography

#### File Upload Page
- Hero Section: Compelling headline and value proposition
- Enhanced Upload Components: Redesigned file upload areas with better visual feedback
- Feature Highlights: Features and benefits section
- Statistics Display: Key metrics with gradient backgrounds
- Responsive Layout: Optimized for all device sizes

#### Processing Page
- Step-by-Step Progress: Visualized processing steps with status indicators
- Progress Tracking: Circular and linear progress indicators
- Detailed Feedback: Enhanced error handling and success states
- Process Information: Information panel about the analysis process

#### Results Dashboard
- Modern Dashboard Layout: Comprehensive dashboard with summary cards
- Enhanced Visualizations: Improved chart styling with better colors and animations
- Tabbed Interface: Intuitive tab navigation
- Interactive Elements: Floating action button for exports
- Data Summary: Key metrics with gradient backgrounds

## Technical Architecture

### Frontend Framework
- Next.js 15+ with App Router
- React 19+ with TypeScript
- Material UI components
- Tailwind CSS for styling

### Key Libraries
- xlsx: Excel file parsing
- chart.js: Data visualization
- react-chartjs-2: React wrapper for Chart.js

### Project Structure
```
survey-processor/
├── app/
│   ├── layout.tsx    # Root layout with context providers
│   ├── page.tsx      # Home page (file upload)
│   ├── processing/   # Processing page
│   └── results/      # Results page
├── components/
│   ├── FileUpload/   # File upload components
│   ├── Visualization/ # Data visualization components
│   ├── Layout/       # Layout components (Header, Footer)
│   └── Feedback/     # Feedback components
├── contexts/
│   ├── SurveyDataContext.tsx # Survey data state management
│   └── ErrorContext.tsx      # Error handling and notifications
├── lib/
│   └── surveyProcessor.ts    # Main processing logic
├── utils/
│   ├── excelParser.ts        # Excel file parsing
│   ├── surveyParser.ts       # Survey structure parsing
│   ├── dataMapper.ts         # Data mapping logic
│   ├── statistics.ts         # Statistical calculations
│   ├── correlation.ts        # Correlation analysis
│   ├── errorHandler.ts       # Error handling utilities
│   └── surveyProcessor.ts    # Main processing logic
├── hooks/
│   └── useSurveyData.ts      # Custom hook for survey data
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
interface ProcessedSurveyData {
  surveyStructure: SurveyStructure;
  surveyResponses: SurveyResponses;
  mappedData: MappedData;
  statistics: SurveyStatistics;
  validationErrors?: {
    surveyStructure?: string[];
    excelData?: string[];
    mappedData?: string[];
  };
}

interface MappedResponse {
  questionId: string;
  questionText: string;
  responseType: string;
  responseValue: string | number;
  responseLabel?: string;
  isValid: boolean;
  validationError?: string;
}

interface MappedRespondent {
  id: string;
  responses: MappedResponse[];
  flowType: 'MONTANTS' | 'ACCOMPAGNATEURS' | 'DESCENDANTS' | 'UNKNOWN';
  validationErrors?: string[];
}

type MappedData = MappedRespondent[];

interface ResponseCount {
  value: string | number;
  label?: string;
  count: number;
  percentage: number;
}

interface QuestionStatistics {
  questionId: string;
  questionText: string;
  responseType: string;
  totalResponses: number;
  skippedResponses: number;
  responseCounts: ResponseCount[];
}

interface SurveyStatistics {
  totalRespondents: number;
  flowDistribution: Record<string, number>;
  completionRate: number;
  questions: QuestionStatistics[];
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

For detailed error handling information, see the [Error Handling Guide](src/docs/ERROR_HANDLING_GUIDE.md).

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
- Created `EnhancedBarChart` component
- Created `EnhancedPieChart` component
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

### Testing Framework Implementation

The testing framework has been fully implemented with comprehensive coverage:

- ✅ 57 passing tests covering core functionality
- ✅ 100% coverage of utility functions:
  - SurveyParser (parsing and validation)
  - ExcelParser (file parsing and data validation)
  - DataMapper (data mapping and flow determination)
  - StatisticsProcessor (statistical calculations)
- ✅ 100% coverage of main business logic (SurveyProcessor)
- ✅ Comprehensive error handling and edge case testing

### Test Categories Implemented
- **File Upload Functionality**: Valid/invalid file handling for JS and Excel
- **Data Validation**: Survey structure and Excel data validation
- **Error Handling**: File parsing, data validation, and processing errors
- **User Interface**: Component rendering tests (partially implemented)
- **Integration**: Cross-component data flow validation

### Running Tests

#### Run All Tests
```bash
npm test
```

#### Run Tests in Watch Mode
```bash
npm run test:watch
```

#### Run Tests with Coverage
```bash
npm run test:coverage
```

#### Run Specific Test Categories

##### Run Unit Tests (Utility Functions)
```bash
npm test -- --testPathPatterns="src/__tests__/utils/"
```

##### Run Integration Tests (Core Business Logic)
```bash
npm test -- --testPathPatterns="src/__tests__/lib/"
```

##### Run Component Tests
```bash
npm test -- --testPathPatterns="src/__tests__/components/"
```

#### Test Runner Script
You can also use the convenient test runner script:
```bash
./test-runner.sh [all|watch|coverage|unit|integration]
```

### Test Structure
```
src/
├── __tests__/
│   ├── utils/           # Unit tests for utility functions
│   ├── components/      # Component tests
│   └── lib/            # Tests for core business logic
```

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
- Tailwind CSS: Utility-first CSS framework

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

## Usage Instructions

1. Access the home page to upload files
2. Upload the survey structure file (JavaScript format)
3. Upload the Excel response file
4. Click "Process Files" to begin analysis
5. View results in the dashboard with various visualization options
6. Use pagination or virtualization for large datasets
7. Configure chart display options as needed

## Implementation Status

The application is fully implemented with real data processing capabilities:

### State Management
- Created `SurveyDataContext` to manage application state across pages
- Added context provider to the root layout
- Implemented proper file passing between pages using React Context
- Added `ErrorContext` for centralized error handling and notifications

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

## Development Setup

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
To run the application in development mode:
```bash
npm run dev
```

The application will be accessible at [http://localhost:3002](http://localhost:3002).

## Contribution Guidelines

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/ma-fonctionnalité`)
3. Commit your changes (`git commit -am 'Ajout d'une fonctionnalité'`)
4. Push the branch (`git push origin feature/ma-fonctionnalité`)
5. Open a Pull Request

## Points Forts

- Interface utilisateur intuitive et responsive
- Traitement sécurisé des fichiers côté client (aucun envoi au serveur)
- Visualisations variées des données (graphiques, tableaux, nuages de mots)
- Gestion des différents types de questions du questionnaire
- Support des flux conditionnels du questionnaire

## Améliorations Possibles

- Export des résultats au format PDF ou Excel
- Fonctionnalités avancées de filtrage et de tri
- Analyses statistiques plus approfondies
- Support de questionnaires multilingues
- Mode de comparaison entre différents jeux de données

## License

This project is under the MIT license.