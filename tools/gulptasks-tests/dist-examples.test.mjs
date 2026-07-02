import { describe, it, before } from 'node:test';
import { ok } from 'node:assert';
import { readFile, stat } from 'node:fs/promises';

import { exec } from '../libs/process.js';

async function expectIndex({ indexPath, heading, link }) {
    ok(await stat(indexPath));

    const html = await readFile(indexPath, 'utf8');

    ok(
        html.includes('href="examples/'),
        `${indexPath} should contain package-local example links`
    );
    ok(
        html.includes(`href="${link}"`),
        `${indexPath} should contain the expected example link ${link}`
    );
    ok(
        html.includes(heading),
        `${indexPath} should contain configured category heading ${heading}`
    );
}

describe('dist-examples package indexes', async () => {
    before(async () => {
        await exec('npx gulp dist-clean');
    });

    await it('creates non-empty Highcharts product example indexes', async () => {
        await exec('npx gulp dist-examples --product Highcharts');

        for (const [product, heading, link] of [
            ['highcharts', 'Line charts', 'examples/line-chart/index.html'],
            ['highstock', 'General', 'examples/stock-tools-gui/index.html'],
            ['highmaps', 'General', 'examples/all-maps/index.html'],
            ['gantt', 'Highcharts Gantt', 'examples/treegrid-columns/index.html']
        ]) {
            await expectIndex({
                indexPath: `build/dist/${product}/index.html`,
                heading,
                link
            });
        }
    });

    await it('creates a non-empty Dashboards example index', async () => {
        await exec('npx gulp dist-clean');
        await exec('npx gulp dist-examples --product Dashboards');

        await expectIndex({
            indexPath: 'build/dist/dashboards/index.html',
            heading: 'Basic',
            link: 'examples/minimal/index.html'
        });
    });

    await it('creates non-empty Grid Lite and Grid Pro example indexes', async () => {
        await exec('npx gulp dist-clean');
        await exec('npx gulp dist-examples --product Grid');

        for (const [product, link] of [
            ['grid-lite', 'examples/minimal/index.html'],
            ['grid-pro', 'examples/validation/index.html']
        ]) {
            await expectIndex({
                indexPath: `build/dist/${product}/index.html`,
                heading: 'General',
                link
            });
        }
    });
});
