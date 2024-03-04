/**
*      Intetion is to propagate declerations with jsdocs
*      documenting properties in corresponding "*Defaults"
*
*      Example:
*          Props from "ScatterSeriesDefaults" objects -> JSDocs in "ScatterSeriesOptions" interfaces
*
*      TODO:
*          - Get this file into a pipeline
*          - Generate a big tree with Christer repo
*          - Snap up interfaces from the tree
*          - Put our new docs into those interfaces
*
*      Questions:
*          - Does this tree also have "*Defaults"-files?
*          - Should I branch Christer-repo then:
*              ~ then export tree-function(s) needed,
*              ~ then import here?
*/
const gulp = require('gulp');

function declarationPropegation() {
    const { exec } = require('child_process');
    const log = require('./lib/log');
    const fs = require('node:fs');
    const treeFolder = '../hc-integration-gen/dist/meta/';
    const treePath = treeFolder + 'meta.json';

    log.starting('Decleration propegation');

    return new Promise(resolve => {
        exec(
            'yarn generate --targets=meta',
            { cwd: '../hc-integration-gen/dist/meta/' },
            generationError => {
                if (generationError) {
                    log.failure('Failed to generate ' + treePath);
                    return;
                }

                log.success('Succesfully generated \'meta.json\'');

                fs.readFile(treePath, 'utf8', (readingError, data) => {
                    if (readingError) {
                        log.failure('Failed to read ' + treePath);
                        return;
                    }

                    // Do stuff

                    log.success('Declarations propegated');
                });
            }
        );
        resolve();
    });
}

gulp.task('jsdoc-musings', declarationPropegation);
