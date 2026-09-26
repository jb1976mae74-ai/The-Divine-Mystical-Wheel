const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const match = content.match(/const PREDICTIVE_INVOCATIONS[\s\S]*?};\n/);
if (match) {
  // Use a hacky eval just to load the object to check
  const code = match[0].replace('const PREDICTIVE_INVOCATIONS: Record<string, string[]> =', 'module.exports =');
  fs.writeFileSync('temp.js', code);
  const obj = require('./temp.js');
  let hasDupes = false;
  for (let key in obj) {
    const list = obj[key];
    if (list.length !== new Set(list).size) {
      console.log(`Duplicate in ${key}:`, list);
      hasDupes = true;
    }
  }
  if (!hasDupes) console.log("No duplicates in PREDICTIVE_INVOCATIONS.");
} else {
  console.log("Not found.");
}
