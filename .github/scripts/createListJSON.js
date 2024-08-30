const process = require('node:process');
const {
    readFileSync,
    writeFileSync
} = require('node:fs');

try {
    const [_1, _2, inFile, outFile] = process.argv;
    const body = readFileSync(inFile, 'utf-8');

    const json = JSON.stringify({
        date: (new Date()).toLocaleDateString('no-NO'),
        body
    });

    writeFileSync(outFile, json);
} catch {
    console.error('Usage: node createListJSON.js <path/to/file.html> <path/to/file.json>');

    process.exit(1);
}
