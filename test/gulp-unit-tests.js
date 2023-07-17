const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');

const gulp = require('gulp');

const { stat } = require('node:fs/promises');

require('../gulpfile.js');


function runGulpTasks(gulpTasks = []) {
    const gulpCallback = gulp.series(gulpTasks);

    return new Promise(resolve => {
        gulpCallback(resolve);
    });
}

describe('dashboards/dist', async () => {
    before(async () => {
        process.env.DASH_RELEASE = '1.2.3';
        await runGulpTasks(['dist-clean']);
    });

    after(async () => {
        delete process.env.DASH_RELEASE;
        // await runGulpTasks(['dist-clean']);
    });

    it('dashboards/dist-examples creates build/dist directory', async () => {
        await runGulpTasks(['dashboards/dist-build']);
        assert.ok(await stat('build/dist'));
    });

    it('dashboards/dist-examples creates build/dist/dashboards/index.html ', async () => {
        await runGulpTasks(['dashboards/dist-examples']);
        assert.ok(await stat('build/dist/dashboards/index.html'));
        assert.ok(await stat('build/dist/dashboards/examples/minimal/index.html'));
    });
});
