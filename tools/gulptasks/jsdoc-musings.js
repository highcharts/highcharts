/**
*      Script for propagating interface declerations with jsdocs
*      made from properties in corresponding "*Defaults"
*
*      Example:
*          Props from "ScatterSeriesDefaults" objects -> JSDocs in "ScatterSeriesOptions" interfaces
*
*      TODO:
*          - Succesfully change the name of this file
*          - Get this file into a pipeline
*          - Snap up interfaces from the tree
*          - Put our new docs into those interfaces
*
*      Questions:
*          - Do we have access to a tree with "*Defaults.js"?
*/
const gulp = require('gulp');

function declarationPropegation() {
    const { exec } = require('child_process');
    const log = require('./lib/log');
    const fs = require('node:fs');
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

                fs.readFile(treePath, 'utf8', (readingError, data) => {
                    if (readingError) {
                        log.failure('Failed to read ' + treeName);
                        return;
                    }

                    // Do stuff

                    log.success('Interface declarations propegated with jsDocs');
                });
            }
        );
        resolve();
    });
}

gulp.task('jsdoc-musings', declarationPropegation);
