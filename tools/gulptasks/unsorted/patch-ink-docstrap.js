/* eslint no-console: 0 */
const gulp = require('gulp'),
    path = require('path');
/**
 * Temporary code patch ink-docstrap to resolve a vulnerabilitiy in taffydb.
 * Note: remove if no longer needed (after ink-docstrap is updated or not used).
 *
 * @return {Promise<Array<*>>}
 *         Promises to keep
 */
function patchInkDocstrap() {
    const { readFile, writeFile } = require('fs/promises');

    const promises = [],
        pathPartToNodeModules = [__dirname, '..', '..', '..', 'node_modules'];

    // Update taffydb to @jsdoc/salty in outdated devDependencies
    const publishPath = path.join(
        ...pathPartToNodeModules, 'ink-docstrap', 'template', 'publish.js'
    );
    promises.push(readFile(publishPath).then(content => writeFile(
        publishPath,
        content.toString().replace(
            'require(\'taffydb\')',
            'require(\'@jsdoc/salty\')'
        )
    )));

    return Promise.all(promises);
}
gulp.task('patch-ink-docstrap', patchInkDocstrap);
