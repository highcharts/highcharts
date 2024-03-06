/**
 *      Script building JSDocs for interfaces.
 *      The JSDoclets are buildt from two sources:
 *          - an object-tree representing interfaces generated with the 'hc-gen'-repo
 *          - properties in '*Defaults' files which correspond to a given interface
 *              For instance:
 *                  object-props from "ScatterSeriesDefaults" -> JSDocs in "ScatterSeriesOptions" interfaces
 *
 *      TODO:
 *          - Succesfully change the name of this file
 *          - Get this file into a pipeline
 *          - Read the '*Defaults'-files here
 *          - Put our new docs into those interfaces
 *
 */
const gulp = require('gulp');
const { exec } = require('child_process');
const log = require('./lib/log');
const fs = require('node:fs');

function declarationPropegation() {
    const treeName = 'meta.json';
    const treeFolder = '../hc-integration-gen/dist/meta/';
    const treePath = treeFolder + treeName;

    log.starting('Interface decleration propegation');

    return new Promise(resolve => {
        exec(
            'yarn generate --targets=meta',
            { cwd: treeFolder },
            generationError => {
                if (generationError) {
                    log.failure('Failed to generate ' + treeName);
                    return;
                }

                log.success('Succesfully generated ' + treeName);

                fs.readFile(treePath, 'utf8', (readingError, tree) => {
                    if (readingError) {
                        log.failure('Failed to read ' + treeName);
                        return;
                    }

                    const parsedTree = JSON.parse(tree);

                    for (const key of Object.keys(parsedTree)) {

                        if (!key.includes('HighchartsProductSeries')) {
                            const [interfaceFileName, defaultsFileName] = [
                                key.replace('plotOptions.', '') + 'Options.d.ts',
                                key.replace('plotOptions.', '') + 'Defaults.js'
                            ];
                            const optionsObjDocs = parsedTree[key];
                            const samples = optionsObjDocs.samples;
                            let jsdocStr = (
                                '/**\n' +
                                optionsObjDocs.description
                                    .split('\n')
                                    .map(line => ('* ' + line + '\n'))
                                    .join('')
                            );

                            if (samples) {

                                for (const sample of samples) {
                                    const products = sample.products;
                                    jsdocStr += (
                                        `* @sample ${
                                            (
                                                products && `{${products.join('|')}} ` || ''
                                            ) + sample.value
                                        }\n*         ${sample.name}\n*` +

                                        // Unsure about this, @product is probably
                                        // future field of optionsObjDocs
                                        `${
                                            products && (
                                                '* @product' + products.join(' ')
                                            ) ||
                                            ''
                                        }\n`
                                    );
                                }
                            }

                            jsdocStr += '**/';
                            log.message('\n' + jsdocStr);

                        }
                    }

                    log.success('Interface declarations propegated with jsDocs');
                });
            }
        );
        resolve();
    });
}

gulp.task('jsdoc-hack', declarationPropegation);
