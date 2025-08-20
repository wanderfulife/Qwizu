#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to update timestamp in master documentation
function updateTimestamp() {
  try {
    const masterPath = path.join(process.cwd(), 'MASTER_DOCUMENTATION.md');
    let masterContent = fs.readFileSync(masterPath, 'utf8');
    
    // Update timestamp
    const timestamp = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
      'Fonctionnalités', 'Technologies utilisées', 
      'Installation', 'Développement', 'Utilisation'
    ]);
    
    // Read current README
    const readmePath = path.join(process.cwd(), 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update the README with selected content from master
    let updatedContent = readmeContent;
    
    // Update features section
    if (sections['Fonctionnalités']) {
      const featureLines = sections['Fonctionnalités'].split('\n');
      let featureContent = '';
      let collecting = false;
      
      for (const line of featureLines) {
        if (line.includes('###')) {
          collecting = true;
        }
        if (collecting) {
          featureContent += line + '\n';
        }
      }
      
      if (featureContent) {
        updatedContent = updatedContent.replace(
          /## Fonctionnalités\n[\s\S]*?## Technologies utilisées/,
          `## Fonctionnalités\n\n${featureContent.trim()}\n\n## Technologies utilisées`
        );
      }
    }
    
    // Update technologies section
    if (sections['Technologies utilisées']) {
      const techLines = sections['Technologies utilisées'].split('\n');
      let techContent = '';
      let collecting = false;
      
      for (const line of techLines) {
        if (line.includes('- [Next.js]') || 
            line.includes('- [React]') || 
            line.includes('- [TypeScript]') || 
            line.includes('- [Material-UI]') || 
            line.includes('- [Chart.js]') ||
            line.includes('- [SheetJS]') ||
            line.includes('- [Tailwind CSS]')) {
          collecting = true;
        }
        if (line.trim() === '' && collecting) {
          break;
        }
        if (collecting) {
          techContent += line + '\n';
        }
      }
      
      if (techContent) {
        updatedContent = updatedContent.replace(
          /## Technologies utilisées\n[\s\S]*?## Gestion des erreurs/,
          `## Technologies utilisées\n\n${techContent.trim()}\n\n## Gestion des erreurs`
        );
      }
    }
    
    // Update installation section
    if (sections['Installation']) {
      const installLines = sections['Installation'].split('\n');
      let installContent = '';
      let collecting = false;
      
      for (const line of installLines) {
        if (line.includes('1. Cloner le repository') || collecting) {
          collecting = true;
          installContent += line + '\n';
        }
        if (line.includes('```') && collecting && installContent.includes('npm install')) {
          installContent += line + '\n';
          break;
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
    if (sections['Développement']) {
      const devLines = sections['Développement'].split('\n');
      let devContent = '';
      let collecting = false;
      
      for (const line of devLines) {
        if (line.includes('Pour lancer l\'application') || collecting) {
          collecting = true;
          devContent += line + '\n';
        }
        if (line.includes('```') && collecting && devContent.includes('npm run dev')) {
          devContent += line + '\n';
          break;
        }
      }
      
      if (devContent) {
        updatedContent = updatedContent.replace(
          /## Développement\n[\s\S]*?\n\n## Structure du projet/,
          `## Développement\n\n${devContent.trim()}\n\n## Structure du projet`
        );
      }
    }
    
    // Update usage section
    if (sections['Utilisation']) {
      const usageLines = sections['Utilisation'].split('\n');
      let usageContent = '';
      let collecting = false;
      
      for (const line of usageLines) {
        if (line.includes('1. Accédez à la page d\'accueil') || collecting) {
          collecting = true;
          usageContent += line + '\n';
        }
        if (line.trim() === '' && collecting && usageContent.split('\n').length > 5) {
          break;
        }
      }
      
      if (usageContent) {
        updatedContent = updatedContent.replace(
          /## Utilisation\n[\s\S]*?\n\n## Contribution/,
          `## Utilisation\n\n${usageContent.trim()}\n\n## Contribution`
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