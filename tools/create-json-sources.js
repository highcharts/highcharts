/* eslint-env node, es6 */

/**
 * Creates a temporary file with JSON sources for demos.
 * The file is written to `tmp/json-sources.js`.
 */

const fs = require('fs');
const path = require('path');

function createJSONSources() {
    const root = path.join(__dirname, '..');
    const aliases = require(path.join(root, 'samples/data/json-sources/index.json'));

    const JSONSources = {};
    const tmpDir = path.join(root, 'tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    aliases.forEach(alias => {
        const data = fs.readFileSync(
            path.join(
                root,
                'samples/data/json-sources',
                alias.filename
            ),
            'utf8'
        );
        JSONSources[alias.url] = alias.filename.endsWith('csv') ?
            data :
            JSON.parse(data);
    });

    fs.writeFileSync(
        path.join(tmpDir, 'json-sources.js'),
        `window.JSONSources = ${JSON.stringify(JSONSources, null, '  ')};`
    );
}

if (require.main === module) {
    createJSONSources();
}

module.exports = createJSONSources;
