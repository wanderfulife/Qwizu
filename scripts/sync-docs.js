#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the essential documentation files to maintain
const ESSENTIAL_DOCS = {
  'README.md': {
    title: 'Survey Data Processor',
    sections: ['Fonctionnalités', 'Technologies utilisées', 'Installation', 'Développement', 'Utilisation']
  },
  'MASTER_DOCUMENTATION.md': {
    title: 'SurveyInsights - Complete Documentation',
    sections: ['Project Summary', 'Key Features', 'Technical Architecture', 'Testing Strategy']
  }
};

// Function to extract sections from the master documentation
function extractSectionsFromMaster(masterContent, sectionNames) {
  const sections = {};
  let currentSection = '';
  let collecting = false;
  let collectedContent = '';
  
  const lines = masterContent.split('\n');
  
  for (const line of lines) {
    // Check if this line starts a new section
    if (line.startsWith('## ')) {
      // Save the previous section if we were collecting
      if (collecting && currentSection) {
        sections[currentSection] = collectedContent.trim();
      }
      
      // Extract section name (remove ## and any extra formatting)
      const sectionName = line.replace(/^##+\s*/, '').trim();
      
      // Check if this is a section we want to collect
      collecting = sectionNames.some(name => 
        sectionName.includes(name) || name.includes(sectionName)
      );
      
      currentSection = sectionName;
      collectedContent = collecting ? line + '\n' : '';
    } else if (collecting) {
      // Add line to collected content
      collectedContent += line + '\n';
    }
  }
  
  // Save the last section if we were collecting
  if (collecting && currentSection) {
    sections[currentSection] = collectedContent.trim();
  }
  
  return sections;
}

// Function to update README.md with content from master
function updateREADME(masterContent) {
  try {
    // Extract relevant sections from master
    const sections = extractSectionsFromMaster(masterContent, [
      'Project Summary', 'Key Features', 'Technologies utilisées', 
      'Installation', 'Développement', 'Usage Instructions'
    ]);
    
    // Read current README
    const readmePath = path.join(process.cwd(), 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update the README with selected content from master
    let updatedContent = readmeContent;
    
    // Replace content between specific markers or sections
    if (sections['Key Features']) {
      // Update features section
      updatedContent = updatedContent.replace(
        /## Fonctionnalités\n[\s\S]*?## Technologies utilisées/,
        `## Fonctionnalités\n\n${sections['Key Features'].split('\n').slice(1).join('\n').replace(/^- /gm, '- ')}\n\n## Technologies utilisées`
      );
    }
    
    // Update technologies section
    if (sections['Technical Architecture']) {
      const techLines = sections['Technical Architecture'].split('\n');
      const techContent = techLines.filter(line => 
        line.includes('- Next.js') || 
        line.includes('- React') || 
        line.includes('- TypeScript') || 
        line.includes('- Material-UI') || 
        line.includes('- Chart.js') ||
        line.includes('- SheetJS')
      ).join('\n');
      
      updatedContent = updatedContent.replace(
        /## Technologies utilisées\n[\s\S]*?## Gestion des erreurs/,
        `## Technologies utilisées\n\n${techContent}\n\n## Gestion des erreurs`
      );
    }
    
    // Update installation section
    if (sections['Development Setup']) {
      const installLines = sections['Development Setup'].split('\n');
      let installContent = '';
      let collecting = false;
      
      for (const line of installLines) {
        if (line.includes('Installation')) {
          collecting = true;
          continue;
        }
        if (line.includes('Development') && collecting) {
          break;
        }
        if (collecting && line.trim()) {
          installContent += line + '\n';
        }
      }
      
      if (installContent) {
        updatedContent = updatedContent.replace(
          /## Installation\n[\s\S]*?\n\n## Développement/,
          `## Installation\n\n${installContent.trim()}\n\n## Développement`
        );
      }
    }
    
    // Update development section
    if (sections['Development Setup']) {
      const devLines = sections['Development Setup'].split('\n');
      let devContent = '';
      let collecting = false;
      
      for (const line of devLines) {
        if (line.includes('Development')) {
          collecting = true;
          continue;
        }
        if (line.includes('Usage Instructions') && collecting) {
          break;
        }
        if (collecting && line.trim()) {
          devContent += line + '\n';
        }
      }
      
      if (devContent) {
        updatedContent = updatedContent.replace(
          /## Développement\n[\s\S]*?\n\n## Structure du projet/,
          `## Développement\n\n${devContent.trim()}\n\n## Structure du projet`
        );
      }
    }
    
    // Write updated README
    fs.writeFileSync(readmePath, updatedContent);
    console.log('README.md updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating README.md:', error.message);
    return false;
  }
}

// Function to update timestamp in master documentation
function updateTimestamp() {
  try {
    const masterPath = path.join(process.cwd(), 'MASTER_DOCUMENTATION.md');
    let masterContent = fs.readFileSync(masterPath, 'utf8');
    
    // Update timestamp
    const timestamp = new Date().toString();
    masterContent = masterContent.replace(
      /_Last updated:.*_/,
      `_Last updated: ${timestamp}_`
    );
    
    fs.writeFileSync(masterPath, masterContent);
    console.log('Timestamp updated in MASTER_DOCUMENTATION.md');
    return masterContent;
  } catch (error) {
    console.error('Error updating timestamp:', error.message);
    return null;
  }
}

// Main function to synchronize documentation
function syncDocumentation() {
  try {
    console.log('Synchronizing documentation files...');
    
    // Update timestamp in master documentation
    const masterContent = updateTimestamp();
    if (!masterContent) {
      throw new Error('Failed to update timestamp');
    }
    
    // Update README.md with content from master
    const readmeSuccess = updateREADME(masterContent);
    if (!readmeSuccess) {
      throw new Error('Failed to update README.md');
    }
    
    console.log('Documentation synchronization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error synchronizing documentation:', error.message);
    return false;
  }
}

// Run the synchronization if this script is called directly
if (require.main === module) {
  const success = syncDocumentation();
  process.exit(success ? 0 : 1);
}

module.exports = { syncDocumentation };