/**
 * Verify that all API zips for the current version are available on the server.
 *
 * Usage: node tools/verify-api-zips
 */

/* eslint-disable no-console */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read version from package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    throw new Error('Error: package.json not found.');
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

if (!version) {
    throw new Error('Error: Version not found in package.json.');
}

// Define products to check
const products = [
    'Highcharts',
    'Highcharts-Stock',
    'Highcharts-Maps',
    'Highcharts-Gantt'
];

// Helper function to check if a URL exists
function checkUrlExists(url) {
    return new Promise(resolve => {
        https
            .get(url, res => {
                resolve(res.statusCode === 200);
            })
            .on('error', () => {
                resolve(false);
            });
    });
}

// Verify API zips
async function verifyApiZips() {
    const baseUrl = 'https://api.highcharts.com/zips';
    const missingFiles = [];

    for (const product of products) {
        const url = `${baseUrl}/${product}-${version}-API.zip`;
        const exists = await checkUrlExists(url);

        if (exists) {
            console.log(`✅ Found: ${url}`);
        } else {
            console.error(`❌ Missing: ${url}`);
            missingFiles.push(url);
        }
    }

    if (missingFiles.length > 0) {
        throw new Error('Some API zip files are missing.');
    } else {
        console.log('\nAll API zip files are available.');
    }
}

// Run the script
verifyApiZips();
