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
    const { O_RDONLY, O_NOFOLLOW, O_NONBLOCK } = fs.constants;
    const fd = fs.openSync(manifest, O_RDONLY | (O_NOFOLLOW ?? 0) | (O_NONBLOCK ?? 0));
    let pkg, mode;
    try {
        const stat = fs.fstatSync(fd, { bigint: true });
        assert(stat.isFile(), 'Expected Grid release manifest');
        if (!O_NOFOLLOW) {
            const entry = fs.lstatSync(manifest, { bigint: true });
            assert(entry.isFile() && entry.dev === stat.dev && entry.ino === stat.ino,
                'Expected Grid release manifest');
        }
        mode = Number(stat.mode & 0o777n);
        pkg = JSON.parse(fs.readFileSync(fd, 'utf8'));
    } finally {
        fs.closeSync(fd);
    }
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
    const directory = fs.mkdtempSync(join(destination, '.grid-release-'));
    const replacement = join(directory, 'package.json');
    try {
        fs.writeFileSync(replacement, JSON.stringify(pkg, null, 2), { flag: 'wx' });
        fs.chmodSync(replacement, mode);
        fs.renameSync(replacement, manifest);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
    return pkg;
}

module.exports = { releaseRepositoryMetadata, stageGridPackage };
