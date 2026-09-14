const {
    accessSync,
    constants,
    mkdirSync,
    statSync,
    writeFileSync
} = require('node:fs');
const {
    dirname,
    join,
    resolve
} = require('node:path');

const firefoxPath = process.env.FIREFOX_PATH;

if (!firefoxPath) {
    console.error('FIREFOX_PATH is required.');
    process.exit(1);
}

const resolvedFirefoxPath = resolve(firefoxPath);

try {
    if (!statSync(resolvedFirefoxPath).isFile()) {
        throw new Error();
    }
    accessSync(resolvedFirefoxPath, constants.X_OK);
} catch {
    console.error('FIREFOX_PATH must point to an executable file.');
    process.exit(1);
}

const distributionPath = join(dirname(resolvedFirefoxPath), 'distribution');

mkdirSync(distributionPath, { recursive: true });
writeFileSync(
    join(distributionPath, 'policies.json'),
    '{ "policies": { "DisableAppUpdate": true } }\n'
);
