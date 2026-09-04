const {
    accessSync,
    appendFileSync,
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
const githubEnvPath = process.env.GITHUB_ENV;

if (!firefoxPath) {
    throw new Error('FIREFOX_PATH is required.');
}

if (!githubEnvPath) {
    throw new Error('GITHUB_ENV is required.');
}

const resolvedFirefoxPath = resolve(firefoxPath);
if (/[\r\n]/u.test(resolvedFirefoxPath)) {
    throw new Error('FIREFOX_PATH must not contain newline characters.');
}

try {
    if (!statSync(resolvedFirefoxPath).isFile()) {
        throw new Error();
    }
    accessSync(resolvedFirefoxPath, constants.X_OK);
} catch {
    throw new Error('FIREFOX_PATH must point to an executable file.');
}

const distributionPath = join(dirname(resolvedFirefoxPath), 'distribution');

mkdirSync(distributionPath, { recursive: true });
writeFileSync(
    join(distributionPath, 'policies.json'),
    '{ "policies": { "DisableAppUpdate": true } }\n'
);
appendFileSync(githubEnvPath, `FIREFOX_BIN=${resolvedFirefoxPath}\n`);
