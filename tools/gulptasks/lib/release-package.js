/*
 * Copyright (C) Highsoft AS
 */
const assert = require('node:assert/strict');
const fs = require('fs-extra');
const { join } = require('node:path');
const { getFilesInFolder } =
    require('@highcharts/highcharts-assembler/src/build.js');

const releaseRepositoryMetadata = [
    '^[.]git($|/)',
    '^[.]github($|/)',
    '^[.]gitignore$',
    '^[.]npmignore$',
    '^README[.]md$',
    '^LICENSE[.]txt$',
    '^SECURITY[.]md$',
    '^package[.]json$',
    '^bower[.]json$'
];

/**
 * Assemble one Grid package over the preserved release metadata.
 * @param {string} source Built Grid code directory.
 * @param {string} destination Cleaned release or staging directory.
 * @param {string} version Validated release version.
 * @return {object} Versioned package manifest.
 */
function stageGridPackage(source, destination, version) {
    assert(fs.lstatSync(source).isDirectory(), 'Expected built Grid directory');
    const manifest = join(destination, 'package.json');
    assert(fs.lstatSync(manifest).isFile(), 'Expected Grid release manifest');
    const pkg = JSON.parse(fs.readFileSync(manifest, 'utf8'));
    for (const file of getFilesInFolder(source, true)) {
        if (file.endsWith('package.json')) {
            continue;
        }
        const from = join(source, file);
        assert(fs.lstatSync(from).isFile(),
            'Unexpected Grid build file: ' + file);
        assert(!file.split('/').includes('.git') && !file.startsWith('.github/'),
            'Unexpected repository metadata in Grid build: ' + file);
        fs.copySync(from, join(destination, file));
    }
    pkg.version = version;
    fs.writeFileSync(manifest, JSON.stringify(pkg, null, 2));
    return pkg;
}

module.exports = { releaseRepositoryMetadata, stageGridPackage };
