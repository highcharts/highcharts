import { describe, it, before, after } from 'node:test';
import { ok } from 'node:assert';

import { stat } from 'node:fs/promises';

import { exec } from '../libs/process.js';

describe('dashboards/dist', async () => {
    before(async () => {
        process.env.DASH_RELEASE = '1.2.3';
        await exec('npx gulp dist-clean');
    });

    after(async () => {
        delete process.env.DASH_RELEASE;
        // await exec('npx gulp dist-clean');
    });

    await it.skip('dashboards/dist-examples creates build/dist directory', async () => {
        await exec('npx gulp dashboards/dist-build');

        ok(await stat('build/dist'));
    });

    await it('dashboards/dist-examples creates build/dist/dashboards/index.html ', async () => {
        await exec('npx gulp dashboards/dist-examples');

        ok(await stat('build/dist/dashboards/index.html'));
        ok(await stat('build/dist/dashboards/examples/minimal/index.html'));
    });
});
