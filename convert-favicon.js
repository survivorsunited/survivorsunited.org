const sharp = require('sharp');
const fs = require('fs');

// Read the SVG favicon file
const svgBuffer = fs.readFileSync('./static/img/favicon.svg');

// Convert SVG to PNG with different favicon sizes
async function convertFavicon() {
  try {
    // Convert to 32x32 PNG (standard favicon size)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile('./static/img/favicon-32.png');
    
    // Convert to 16x16 PNG (small favicon size)
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile('./static/img/favicon-16.png');
    
    // Convert to 48x48 PNG (larger favicon size)
    await sharp(svgBuffer)
      .resize(48, 48)
      .png()
      .toFile('./static/img/favicon-48.png');
    
    // Convert to 64x64 PNG (high-res favicon)
    await sharp(svgBuffer)
      .resize(64, 64)
      .png()
      .toFile('./static/img/favicon-64.png');
    
    // Convert to 128x128 PNG (Apple touch icon size)
    await sharp(svgBuffer)
      .resize(128, 128)
      .png()
      .toFile('./static/img/favicon-128.png');
    
    console.log('✅ Favicon converted to PNG successfully!');
    console.log('📁 Generated favicon files:');
    console.log('  - favicon-16.png (16x16) - Small favicon');
    console.log('  - favicon-32.png (32x32) - Standard favicon');
    console.log('  - favicon-48.png (48x48) - Larger favicon');
    console.log('  - favicon-64.png (64x64) - High-res favicon');
    console.log('  - favicon-128.png (128x128) - Apple touch icon');
    
  } catch (error) {
    console.error('❌ Error converting favicon:', error);
  }
}

convertFavicon(); 