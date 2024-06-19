// generateHTML.js
const fs = require('fs');
const markdownIt = require('markdown-it')();

// Function to read markdown file and generate HTML
const generateHTML = (inputFile, outputFile) => {
  const markdownContent = fs.readFileSync(inputFile, 'utf-8');
  const htmlContent = markdownIt.render(markdownContent);

  fs.writeFileSync(outputFile, htmlContent);
};

// Define paths relative to the project root
const PROJECT_ROOT = process.env.PROJECT_ROOT || '.';
const LEGAL_DOCS_FOLDER = `${PROJECT_ROOT}/docs/legal`;
const REACT_BUILD_FOLDER = `${PROJECT_ROOT}/build`;

// Generate HTML for Terms of Service
generateHTML(`${LEGAL_DOCS_FOLDER}/ToS.md`, `${REACT_BUILD_FOLDER}/terms-of-service.html`);

// Generate HTML for Privacy Policy
generateHTML(`${LEGAL_DOCS_FOLDER}/PrivacyPolicy.md`, `${REACT_BUILD_FOLDER}/privacy-policy.html`);
