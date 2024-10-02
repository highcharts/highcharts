/* eslint no-console: 0 */
const gulp = require('gulp');
/**
 * Update the updateDevDependencies files to resolve vulnerabilities
 *
 * @return {Promise<Array<*>>}
 *         Promises to keep
 */
function updateDevDependencies() {
    const { readFile, writeFile } = require('fs/promises');
    const promises = [];

    // Update taffydb to @jsdoc/salty in outdated devDependencies
    promises.push(
        readFile(
            './node_modules/ink-docstrap/template/publish.js'
        ).then(content => writeFile(
            './node_modules/ink-docstrap/template/publish.js',
            content.toString().replace(
                'require(\'taffydb\')',
                'require(\'@jsdoc/salty\')'
            )
        ))
    );

    return Promise.all(promises);

}
gulp.task('update-devDependencies', updateDevDependencies);
