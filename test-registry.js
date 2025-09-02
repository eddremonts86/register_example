const fs = require('fs');
const path = require('path');

// Test the registry files
console.log('🧪 Testing Registry Files...\n');

// Check registry.json
const registryPath = path.join(__dirname, 'app-x/public/r/registry.json');
const componentPath = path.join(__dirname, 'app-x/public/r/interactive-table.json');

try {
  // Test registry.json
  const registryContent = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  console.log('✅ registry.json is valid JSON');
  console.log('📋 Registry contains:', Object.keys(registryContent));
  console.log('🔧 Schema:', registryContent.$schema);

  // Test component JSON
  const componentContent = JSON.parse(fs.readFileSync(componentPath, 'utf8'));
  console.log('\n✅ interactive-table.json is valid JSON');
  console.log('📄 Component name:', componentContent.name);
  console.log('📝 Component type:', componentContent.type);
  console.log('📦 Files count:', componentContent.files.length);

  console.log('\n🎉 Registry files are valid and ready for distribution!');

} catch (error) {
  console.error('❌ Error testing registry:', error.message);
}
