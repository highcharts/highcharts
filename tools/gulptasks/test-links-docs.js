/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/**
 * Checks if docs are pointing to existing samples/docs.
 * @async
 * @return {Promise<void>}
 */
async function checkDocsConsistency() {
    const FS = require('fs');
    const glob = require('glob');
    const LogLib = require('./lib/log');

    // Check links and references to samples
    LogLib.message('Checking links and references to samples/other docs');
    glob.sync(process.cwd() + '/docs/**/*.md').forEach(file => {
        const md = FS.readFileSync(file),
            regex = /(https:\/\/jsfiddle.net\/gh\/get\/library\/pure\/highcharts\/highcharts\/tree\/master\/samples|https:\/\/www.highcharts.com\/samples\/embed)\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)/gu,
            demosRegex = /https:\/\/(www\.)?highcharts.com\/docs\/([a-zA-Z\-]+\/[a-zA-Z\-]+)/gu,
            error404s = [];

        let match;
        while ((match = regex.exec(md))) {
            const sample = match[2].replace(/\/$/u, '');
            try {
                FS.statSync(`samples/${sample}/demo.js`);
            } catch (error) {
                error404s.push({ file, sample });
            }
        }

        while ((match = demosRegex.exec(md))) {
            const sample = match[2].replace(/\/$/u, '');
            try {
                FS.statSync(`docs/${sample}.md`);
            } catch (error) {
                error404s.push({ file, docs: sample });
            }
        }

        if (error404s.length) {
            throw new Error(
                'Rotten links\n' + JSON.stringify(error404s, null, '  ')
            );
        }

    });
}

gulp.task('test-docs', checkDocsConsistency);
