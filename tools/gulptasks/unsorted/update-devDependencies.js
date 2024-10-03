/* eslint no-console: 0 */
const gulp = require('gulp'),
    path = require('path');
/**
 * Update the updateDevDependencies files to resolve vulnerabilities
 *
 * @return {Promise<Array<*>>}
 *         Promises to keep
 */
function updateDevDependencies() {
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
gulp.task('update-devDependencies', updateDevDependencies);
