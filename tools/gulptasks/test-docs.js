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
    LogLib.message('Checking links to samples in *.ts files...');
    glob.sync(process.cwd() + '/ts/**/*.ts').forEach(file => {
        const md = FS.readFileSync(file),
            demoPattern = /(https:\/\/jsfiddle.net\/gh\/get\/library\/pure\/highcharts\/highcharts\/tree\/master\/samples|https:\/\/www.highcharts.com\/samples\/embed)\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)/gu,
            samplePattern = /@sample[ ]*(\{(highcharts|highstock|highmaps|gantt)\})? ([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)/gu,
            error404s = [];

        let match;
        while ((match = demoPattern.exec(md))) {
            const sample = match[2].replace(/\/$/u, '');
            try {
                FS.statSync(`samples/${sample}/demo.js`);
            } catch (error) {
                error404s.push({ file, sample });
            }
        }

        while ((match = samplePattern.exec(md))) {
            const sample = match[3].replace(/\/$/u, '');
            try {
                FS.statSync(`samples/${sample}/demo.js`);
            } catch (error) {
                error404s.push({ file, sample });
            }
        }
        if (error404s.length) {
            throw new Error(
                'Rotten links\n' + JSON.stringify(error404s, null, '  ')
            );
        }

    });
    LogLib.message('Checking links to samples in *.md files...');
    glob.sync(process.cwd() + '/docs/**/*.md').forEach(file => {
        const md = FS.readFileSync(file),
            demoPattern = /(https:\/\/jsfiddle.net\/gh\/get\/library\/pure\/highcharts\/highcharts\/tree\/master\/samples|https:\/\/www.highcharts.com\/samples\/embed)\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)/gu,
            docsPattern = /https:\/\/(www\.)?highcharts.com\/docs\/([a-zA-Z\-]+\/[a-zA-Z\-]+)/gu,
            error404s = [];

        let match;
        while ((match = demoPattern.exec(md))) {
            const sample = match[2].replace(/\/$/u, '');
            try {
                FS.statSync(`samples/${sample}/demo.js`);
            } catch (error) {
                error404s.push({ file, sample });
            }
        }

        while ((match = docsPattern.exec(md))) {
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
