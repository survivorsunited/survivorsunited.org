const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration for different asset types
const assetConfigs = {
  logo: {
    input: './static/img/logo.svg',
    sizes: [64, 128, 256, 512],
    prefix: 'logo'
  },
  favicon: {
    input: './static/img/favicon.svg',
    sizes: [16, 32, 48, 64],
    prefix: 'favicon'
  }
};

// Convert SVG to PNG with specified sizes
async function convertAsset(config) {
  try {
    console.log(`🔄 Converting ${config.prefix}...`);
    
    // Check if input file exists
    if (!fs.existsSync(config.input)) {
      console.log(`⚠️  Input file not found: ${config.input}`);
      return;
    }

    // Read the SVG file
    const svgBuffer = fs.readFileSync(config.input);
    
    // Convert to each size
    for (const size of config.sizes) {
      const outputFile = `./static/img/${config.prefix}-${size}.png`;
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`  ✅ Created ${outputFile} (${size}x${size})`);
    }
    
    console.log(`🎉 ${config.prefix} conversion complete!\n`);
    
  } catch (error) {
    console.error(`❌ Error converting ${config.prefix}:`, error);
  }
}

// Main function to convert all assets
async function convertAllAssets() {
  console.log('🚀 Starting asset conversion...\n');
  
  for (const [assetName, config] of Object.entries(assetConfigs)) {
    await convertAsset(config);
  }
  
  console.log('✨ All assets converted successfully!');
  console.log('\n📁 Generated files:');
  console.log('  Logo: logo-64.png, logo-128.png, logo-256.png, logo-512.png');
  console.log('  Favicon: favicon-16.png, favicon-32.png, favicon-48.png, favicon-64.png');
  console.log('\n💡 Usage:');
  console.log('  - logo-512.png: Perfect for organization avatar');
  console.log('  - favicon-32.png: Standard favicon size');
  console.log('  - favicon-16.png: Small favicon for older browsers');
}

// Run the conversion
convertAllAssets().catch(console.error); 