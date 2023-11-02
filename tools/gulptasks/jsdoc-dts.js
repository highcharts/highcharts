/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const productBundles = [
    'highcharts',
    'highcharts-gantt',
    'highmaps',
    'highstock'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Creates small DTS references to classic DTS.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocESMDTS() {

    const fs = require('fs');
    const fsLib = require('./lib/fs');
    const dtsFiles = fsLib
        .getFilePaths('code', true)
        .filter(file => (
            file.endsWith('.src.d.ts') &&
            !file.endsWith('globals.src.d.ts') &&
            !file.includes('dashboards') &&
            !file.includes('es-modules')
        ));
    const path = require('path');
    const promises = [];

    for (const dtsFile of dtsFiles) {
        const target = path.join(
            'code',
            'es-modules',
            'masters',
            path.relative('code', dtsFile)
        );
        const source = path.relative(
            path.dirname(target),
            dtsFile.substring(0, dtsFile.length - 5)
        );

        promises.push(fs.promises.writeFile(
            target,
            productBundles.some(
                product => dtsFile.endsWith(`${product}.src.d.ts`)
            ) ?
                [
                    `import * as Highcharts from '${fsLib.path(source, true)}';`,
                    'export default Highcharts;',
                    ''
                ].join('\n') :
                [
                    `import '${fsLib.path(source, true)}';`,
                    ''
                ].join('\n')
        ));
    }

    return Promise.all(promises);

}

/**
 * Add TypeScript declarations to the code folder using tree.json and
 * tree-namespace.json.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocDTS() {

    const gulpLib = require('./lib/gulp');
    const highchartsDeclarationsGenerator = require(
        '@highcharts/highcharts-declarations-generator'
    );

    return new Promise((resolve, reject) => {

        gulpLib
            .requires([], ['jsdoc-namespace', 'jsdoc-options'])
            .then(() => highchartsDeclarationsGenerator.task())
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('jsdoc-dts', gulp.series(jsDocDTS, jsDocESMDTS));
