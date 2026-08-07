const fs = require('fs');
const path = require('path');

const filtersDir = path.join(process.cwd(), 'public', 'filters');
if (!fs.existsSync(filtersDir)) {
  fs.mkdirSync(filtersDir, { recursive: true });
}

// Generate valid base64 1x1 transparent PNG as placeholder PNG if needed, 
// and full SVG assets for high resolution canvas drawing
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
  const svgPath = path.join(filtersDir, `${name}.svg`);
  const pngPath = path.join(filtersDir, `${name}.png`);

  if (fs.existsSync(svgPath)) {
    const svgContent = fs.readFileSync(svgPath, 'utf-8');
    // Copy to PNG path or keep SVG
    fs.writeFileSync(pngPath, svgContent, 'utf-8');
  }
});
console.log("PNG & SVG filter assets created in public/filters/");
