// setup.js - Run this to create folder structure
const fs = require('fs');
const path = require('path');

const folders = [
  'public/images',
  'src/components',
  'src/context',
  'src/hooks',
  'src/utils',
  'src/styles',
  'src/assets/images',
  'src/assets/icons'
];

console.log('Creating folder structure...');
folders.forEach(folder => {
  const dir = path.join(__dirname, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${folder}`);
  }
});

console.log('Folder structure created successfully!');