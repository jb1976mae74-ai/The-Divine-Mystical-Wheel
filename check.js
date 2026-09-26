import fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf8');
const match = content.match(/const PREDICTIVE_INVOCATIONS[\s\S]*?};\n/);
if (match) {
  const code = match[0].replace('const PREDICTIVE_INVOCATIONS: Record<string, string[]> =', 'export default');
  fs.writeFileSync('temp2.js', code);
}
