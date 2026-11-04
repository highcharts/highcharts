import { describe, it, before } from 'node:test';
import { ok } from 'node:assert';

import { readFile, stat } from 'node:fs/promises';

import { exec } from '../libs/process.js';

describe('dist --product Dashboards', async () => {
    before(async () => {
        await exec('npx gulp dist-clean');
    });

    await it('dist-examples --product Dashboards creates build/dist/dashboards/index.html ', async () => {
        await exec('npx gulp dist-examples --product Dashboards');

        ok(await stat('build/dist/dashboards/index.html'));
        ok(await stat('build/dist/dashboards/examples/minimal/index.html'));

        const html = await readFile('build/dist/dashboards/index.html', 'utf8');
        ok(html.includes('href="examples/'));
        ok(html.includes('href="examples/minimal/index.html"'));
        ok(html.includes('Basic'));
    });
});
