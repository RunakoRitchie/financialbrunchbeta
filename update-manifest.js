/**
 * Script to update the research articles manifest
 * Run this after adding new articles through Netlify CMS
 */

const fs = require('fs');
const path = require('path');

function updateManifest() {
    const researchDir = path.join(__dirname, 'content', 'research');
    const manifestPath = path.join(researchDir, 'manifest.json');
    
    try {
        // Read all .md files in the research directory
        const files = fs.readdirSync(researchDir)
            .filter(file => file.endsWith('.md'))
            .sort((a, b) => b.localeCompare(a)); // Sort newest first
        
        const manifest = {
            files: files,
            lastUpdated: new Date().toISOString(),
            totalArticles: files.length,
            updateId: Date.now() // Unique ID for each update
        };
        
        // Write the manifest file
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        
        console.log(`✅ Manifest updated with ${files.length} articles:`);
        files.forEach(file => console.log(`   - ${file}`));
        
    } catch (error) {
        console.error('❌ Error updating manifest:', error);
    }
}

// Run the update
updateManifest();

module.exports = { updateManifest };