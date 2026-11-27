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
 * Synchronize release package metadata before versioning.
 * @param {object} json JSON object to update.
 * @param {string} productName The product name.
 * @return {object} Updated JSON object.
 */
function updateReleaseJSON(json, productName) {
    if (productName === 'Highcharts') {
        // The UMD submodules in `modules/*.js` read the shared namespace from
        // `window._Highcharts`, which only the UMD bundle assigns. Declaring an
        // ESM entry point makes bundlers resolve the bare specifier to the pure
        // ESM bundle, while subpath imports keep loading UMD, leaving the
        // namespace unassigned (#25072). Until subpath resolution follows the
        // same bundle, the release package must not advertise one.
        delete json.module;

        json.types = (
            json.main ?
                json.main.replace(/\.js$/u, '.d.ts') :
                'highcharts.d.ts'
        );

        if (json.dependencies) {
            delete json.dependencies.jspdf;
            delete json.dependencies['svg2pdf.js'];
        }

        json.peerDependencies = Object.assign({}, json.peerDependencies, {
            jspdf: '^4.1.0',
            'svg2pdf.js': '^2.7.0'
        });

        json.peerDependenciesMeta = Object.assign(
            {},
            json.peerDependenciesMeta,
            {
                jspdf: { optional: true },
                'svg2pdf.js': { optional: true }
            }
        );
    }

    return json;
}

/**
 * Assemble Core over the preserved release metadata.
 * @param {object} options Staging options.
 * @param {string} options.sourceRoot Source checkout containing code and css.
 * @param {string} options.destination Cleaned directory with release metadata.
 * @param {string} options.version Validated release version.
 * @return {object} Versioned package manifest.
 */
function stageCorePackage({ sourceRoot, destination, version }) {
    const folders = [
        [join(sourceRoot, 'code'), destination],
        [join(sourceRoot, 'css'), join(destination, 'css')]
    ];
    const filesToIgnore = ['.DS_Store', 'package.json', '.js.map'];
    const pathsToIgnore = ['dashboards', 'grid', 'es5'];
    const files = folders.flatMap(([from, to]) => getFilesInFolder(from, true)
        .filter(path => (
            (
                path.startsWith('es-modules/masters') ||
                !path.startsWith('es-modules') ||
                !path.endsWith('.d.ts')
            ) &&
            !pathsToIgnore.some(pattern => path.startsWith(pattern)) &&
            !filesToIgnore.some(pattern => path.endsWith(pattern))
        ))
        .map(file => [join(from, file), join(to, file)]));
    files.push([join(sourceRoot, 'SECURITY.md'), join(destination, 'SECURITY.md')]);

    for (const [from, to] of files) {
        fs.copySync(from, to);
    }

    let pkg;
    for (const file of ['bower.json', 'package.json']) {
        const manifest = join(destination, file);
        const json = updateReleaseJSON(JSON.parse(fs.readFileSync(manifest)), 'Highcharts');
        json.version = version;
        fs.writeFileSync(manifest, JSON.stringify(json, null, '  '));
        pkg = json;
    }
    return pkg;
}

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

module.exports = {
    releaseRepositoryMetadata,
    stageCorePackage,
    stageGridPackage,
    updateReleaseJSON
};
