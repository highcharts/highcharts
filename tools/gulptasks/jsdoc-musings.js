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

                    // Temporary object to check results while building this script
                    const res = {};
                    const parsedTree = JSON.parse(tree);
                    for (const key of Object.keys(parsedTree)) {
                        if (!key.includes('HighchartsProductSeries')) {
                            // To maybe be used in the future
                            const interfaceFileName = key.replace('plotOptions.', '') + 'Options.d.ts';
                            const samples = parsedTree[key].samples;

                            if (samples) {
                                for (const sample of samples) {
                                    const products = sample.products;
                                    const value = sample.value;

                                    // Temporary measure to store the to-be doclets in a results object, for debugging
                                    res[interfaceFileName] = `
                                        @sample ${products && `{${products.join('|')}}` || ''} ${value}\n
                                        @product ${products && products.join(' ') || ''}\n
                                    `;
                                }

                            }

                        }
                    }

                    log.success('Interface declarations propegated with jsDocs');
                });
            }
        );
        resolve();
    });
}

gulp.task('jsdoc-musings', declarationPropegation);
