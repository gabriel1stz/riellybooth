const fs = require('fs');
const path = require('path');

const filtersDir = path.join(process.cwd(), 'public', 'filters');
if (!fs.existsSync(filtersDir)) {
  fs.mkdirSync(filtersDir, { recursive: true });
}

// Convert SVGs to PNG Data URL strings / file contents
// SVG string encoded as data URL works as valid image src in HTMLImageElement
const createFilterSvg = (type) => {
  let svgContent = '';
  if (type === 'pixel-glasses') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120">
      <rect x="10" y="20" width="120" height="70" fill="#000" rx="4"/>
      <rect x="170" y="20" width="120" height="70" fill="#000" rx="4"/>
      <rect x="130" y="45" width="40" height="15" fill="#000"/>
      <rect x="25" y="30" width="25" height="15" fill="#fff"/>
      <rect x="185" y="30" width="25" height="15" fill="#fff"/>
      <rect x="35" y="55" width="20" height="15" fill="#ff007f"/>
      <rect x="195" y="55" width="20" height="15" fill="#ff007f"/>
    </svg>`;
  } else if (type === 'cat-whiskers') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <path d="M 40 40 L 90 10 L 80 80 Z" fill="#18181b"/>
      <path d="M 50 45 L 80 25 L 75 70 Z" fill="#f472b6"/>
      <path d="M 260 40 L 210 10 L 220 80 Z" fill="#18181b"/>
      <path d="M 250 45 L 220 25 L 225 70 Z" fill="#f472b6"/>
      <ellipse cx="150" cy="110" rx="16" ry="12" fill="#f472b6"/>
      <line x1="120" y1="120" x2="20" y2="100" stroke="#18181b" stroke-width="6" stroke-linecap="round"/>
      <line x1="120" y1="130" x2="10" y2="130" stroke="#18181b" stroke-width="6" stroke-linecap="round"/>
      <line x1="120" y1="140" x2="25" y2="160" stroke="#18181b" stroke-width="6" stroke-linecap="round"/>
      <line x1="180" y1="120" x2="280" y2="100" stroke="#18181b" stroke-width="6" stroke-linecap="round"/>
      <line x1="180" y1="130" x2="290" y2="130" stroke="#18181b" stroke-width="6" stroke-linecap="round"/>
      <line x1="180" y1="140" x2="275" y2="160" stroke="#18181b" stroke-width="6" stroke-linecap="round"/>
    </svg>`;
  } else if (type === 'dog-classic') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250">
      <ellipse cx="60" cy="80" rx="35" ry="70" fill="#78350f" transform="rotate(20 60 80)"/>
      <ellipse cx="60" cy="80" rx="20" ry="50" fill="#fbcfe8" transform="rotate(20 60 80)"/>
      <ellipse cx="240" cy="80" rx="35" ry="70" fill="#78350f" transform="rotate(-20 240 80)"/>
      <ellipse cx="240" cy="80" rx="20" ry="50" fill="#fbcfe8" transform="rotate(-20 240 80)"/>
      <ellipse cx="150" cy="150" rx="25" ry="18" fill="#18181b"/>
      <ellipse cx="142" cy="145" rx="6" ry="4" fill="#ffffff"/>
      <path d="M 140 170 Q 150 210 160 170 Z" fill="#ff477e"/>
    </svg>`;
  } else if (type === 'chef-hat') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250">
      <ellipse cx="150" cy="90" rx="90" ry="70" fill="#ffffff" stroke="#e2e8f0" stroke-width="6"/>
      <ellipse cx="90" cy="100" rx="55" ry="50" fill="#ffffff" stroke="#e2e8f0" stroke-width="6"/>
      <ellipse cx="210" cy="100" rx="55" ry="50" fill="#ffffff" stroke="#e2e8f0" stroke-width="6"/>
      <rect x="90" y="150" width="120" height="60" fill="#ffffff" stroke="#cbd5e1" stroke-width="6" rx="6"/>
      <line x1="120" y1="150" x2="120" y2="210" stroke="#f1f5f9" stroke-width="4"/>
      <line x1="150" y1="150" x2="150" y2="210" stroke="#f1f5f9" stroke-width="4"/>
      <line x1="180" y1="150" x2="180" y2="210" stroke="#f1f5f9" stroke-width="4"/>
    </svg>`;
  } else if (type === 'diving-mask') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <rect x="30" y="40" width="240" height="90" fill="#f59e0b" rx="45" stroke="#b45309" stroke-width="6"/>
      <ellipse cx="90" cy="85" rx="45" ry="32" fill="#38bdf8" fill-opacity="0.8" stroke="#ffffff" stroke-width="4"/>
      <ellipse cx="210" cy="85" rx="45" ry="32" fill="#38bdf8" fill-opacity="0.8" stroke="#ffffff" stroke-width="4"/>
      <rect x="250" y="20" width="16" height="120" fill="#ef4444" rx="8"/>
      <ellipse cx="258" cy="20" rx="14" ry="14" fill="#fde047"/>
    </svg>`;
  } else if (type === 'santa-beard') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <path d="M 40 60 L 260 60 L 150 5 Z" fill="#ef4444"/>
      <rect x="30" y="55" width="240" height="25" fill="#ffffff" rx="12"/>
      <circle cx="150" cy="10" r="20" fill="#ffffff"/>
      <path d="M 60 140 C 40 280, 260 280, 240 140 C 200 170, 100 170, 60 140 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="4"/>
    </svg>`;
  } else if (type === 'dog-coquette') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250">
      <ellipse cx="60" cy="80" rx="35" ry="70" fill="#f472b6" transform="rotate(20 60 80)"/>
      <ellipse cx="240" cy="80" rx="35" ry="70" fill="#f472b6" transform="rotate(-20 240 80)"/>
      <ellipse cx="150" cy="150" rx="20" ry="15" fill="#ff007f"/>
      <path d="M 45 45 Q 65 30 85 45 Q 65 60 45 45 Z" fill="#ff5588"/>
      <path d="M 215 45 Q 235 30 255 45 Q 235 60 215 45 Z" fill="#ff5588"/>
    </svg>`;
  } else if (type === 'strawberry-hat') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220">
      <path d="M 50 140 C 30 40, 270 40, 250 140 Z" fill="#ef4444"/>
      <circle cx="100" cy="90" r="4" fill="#fde047"/>
      <circle cx="150" cy="70" r="4" fill="#fde047"/>
      <circle cx="200" cy="90" r="4" fill="#fde047"/>
      <circle cx="120" cy="120" r="4" fill="#fde047"/>
      <circle cx="180" cy="120" r="4" fill="#fde047"/>
      <path d="M 130 40 L 150 10 L 170 40 L 150 30 Z" fill="#22c55e"/>
    </svg>`;
  }
  return svgContent;
};

const filterNames = [
  'pixel-glasses',
  'cat-whiskers',
  'dog-classic',
  'chef-hat',
  'diving-mask',
  'santa-beard',
  'dog-coquette',
  'strawberry-hat'
];

filterNames.forEach((name) => {
  const svg = createFilterSvg(name);
  // Write SVG file
  fs.writeFileSync(path.join(filtersDir, `${name}.svg`), svg, 'utf-8');
  
  // Write SVG as data URI string in .png file for HTMLImageElement src loading
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  fs.writeFileSync(path.join(filtersDir, `${name}.png`), svg, 'utf-8');
});

console.log("All 8 filter image assets saved to public/filters/");
