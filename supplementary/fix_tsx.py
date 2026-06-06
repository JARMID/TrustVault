import os
import glob

files = glob.glob('d:/TrustDesk/trustvault-web/src/pages/*.tsx')
targets = ['SecurityArchitecture.tsx', 'Network.tsx', 'UseCases.tsx', 'Enterprise.tsx', 'Pricing.tsx']

for file in files:
    if any(file.endswith(t) for t in targets):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace('\">
      <div', '\">\n      <div')
        content = content.replace('</div>
      <CinematicFooter />', '</div>\n      <CinematicFooter />')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
