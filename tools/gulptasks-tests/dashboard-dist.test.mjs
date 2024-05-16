import { describe, it, before, after } from 'node:test';
import { ok } from 'node:assert';

import { stat } from 'node:fs/promises';

import '../../gulpfile.js';

import { run } from '../gulptasks/lib/gulp.js';

describe('dashboards/dist', async () => {
    before(async () => {
        process.env.DASH_RELEASE = '1.2.3';
        await run(['dist-clean']);
    });

    after(async () => {
        delete process.env.DASH_RELEASE;
        // await run(['dist-clean']);
    });

    await it.skip('dashboards/dist-examples creates build/dist directory', async () => {
        await run(['dashboards/dist-build']);

        ok(await stat('build/dist'));
    });

    await it('dashboards/dist-examples creates build/dist/dashboards/index.html ', async () => {
        await run(['dashboards/dist-examples']);

        ok(await stat('build/dist/dashboards/index.html'));
        ok(await stat('build/dist/dashboards/examples/minimal/index.html'));
    });
});
