const fs = require('fs');
const path = 'd:\\TrustDesk\\trustdesk-web\\src\\pages\\Landing.tsx';
let content = fs.readFileSync(path, 'utf8');

const startMarker = '/* ---- Responsive CSS injected once ---- */\nconst landingStyles = `\n';
const endMarker = '`;\n';
const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
  const cssStartIndex = startIndex + startMarker.length;
  const cssEndIndex = content.indexOf(endMarker, cssStartIndex);
  const cssContent = content.substring(cssStartIndex, cssEndIndex);
  fs.writeFileSync('d:\\TrustDesk\\trustdesk-web\\src\\pages\\Landing.css', cssContent);

  content = content.substring(0, startIndex) + "import './Landing.css';\n" + content.substring(cssEndIndex + endMarker.length);
}

content = content.replace(/\s*<style>\{landingStyles\}<\/style>\n/, '\n');
content = content.replace("{ label: 'Pricing', action: () => {} }", "{ label: 'Pricing', action: () => navigate('/pricing') }");
content = content.replace("{ label: 'Docs', action: () => {} }", "{ label: 'Docs', action: () => navigate('/docs') }");

fs.writeFileSync(path, content);
console.log('Landing.tsx CSS extracted and routes updated.');
