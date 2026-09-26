const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles('./src');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Find key="something" or key={`something`} in the same JSX block or parent
  const matches = [...content.matchAll(/key=["']([^"']+)["']/g)];
  const keys = matches.map(m => m[1]);
  const counts = {};
  keys.forEach(k => {
    counts[k] = (counts[k] || 0) + 1;
  });
  Object.keys(counts).forEach(k => {
    if (counts[k] > 1) {
      console.log(`Duplicate static key "${k}" in ${file} (count: ${counts[k]})`);
    }
  });
});
