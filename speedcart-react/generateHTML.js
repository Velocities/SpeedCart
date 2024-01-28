// generateHTML.js
const fs = require('fs');
const markdownIt = require('markdown-it')();

// Function to read markdown file and generate HTML
const generateHTML = (inputFile, outputFile) => {
  const markdownContent = fs.readFileSync(inputFile, 'utf-8');
  const htmlContent = markdownIt.render(markdownContent);

  fs.writeFileSync(outputFile, htmlContent);
};

// Generate HTML for Terms of Service
generateHTML('../ToS.md', './build/terms-of-service.html');

// Generate HTML for Privacy Policy
generateHTML('../PrivacyPolicy.md', './build/privacy-policy.html');
