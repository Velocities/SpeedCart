// generateHTML.js
const fs = require('fs');
const markdownIt = require('markdown-it')();

// Function to read markdown file and generate HTML
const generateHTML = (inputFile, outputFile) => {
  const markdownContent = fs.readFileSync(inputFile, 'utf-8');
  const htmlContent = markdownIt.render(markdownContent);

  fs.writeFileSync(outputFile, htmlContent);
};

// Get environment variable for repository folder
const PROJECT_ROOT = "/var/www/SpeedCart";
const LEGAL_DOCS_FOLDER = '/docs/legal';
const REACT_BUILD_FOLDER = '/speedcart-react/build';
// Generate HTML for Terms of Service
generateHTML(PROJECT_ROOT + LEGAL_DOCS_FOLDER + '/ToS.md', PROJECT_ROOT + REACT_BUILD_FOLDER + '/terms-of-service.html');

// Generate HTML for Privacy Policy
generateHTML(PROJECT_ROOT + LEGAL_DOCS_FOLDER + '/PrivacyPolicy.md', PROJECT_ROOT + REACT_BUILD_FOLDER + '/privacy-policy.html');
