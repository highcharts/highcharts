import { deepStrictEqual, ok } from 'node:assert';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import mapping from '../../../ts/Extensions/Autoload/DependencyMapping.js';
import Loader from '../../../ts/Extensions/Autoload/Loader.js';

// Options, and the files that Loader.getFiles should return for them
const cases: Array<[object, Array<string>]> = [
    // Series options, wherever they are set
    [{ series: [{ label: {} }] }, ['modules/series-label']],
    [{ plotOptions: { series: { label: {} } } }, ['modules/series-label']],
    [{ plotOptions: { line: { label: {} } } }, ['modules/series-label']],
    [
        { series: [{ type: 'scatter3d', label: {} }] },
        ['highcharts-3d', 'modules/series-label']
    ],

    // Options documented for one series type only
    [
        { series: [{ type: 'scatter', cluster: {} }] },
        ['modules/marker-clusters']
    ],

    // Series types: dependencies first, modules instead of product bundles
    [{ series: [{ type: 'tilemap' }] }, ['modules/heatmap', 'modules/tilemap']],
    [{ series: [{ type: 'gantt' }] }, ['modules/gantt']],

    // Core options
    [{ chart: { zooming: { key: 'alt' } } }, []],
    [{ series: [{ type: 'column', dataLabels: { enabled: true } }] }, []]
];

describe('Autoload DependencyMapping', () => {
    it('refers to existing files', () => {
        Object.entries(mapping).forEach(([key, files]) => {
            files.forEach(file => {
                ok(
                    existsSync(join(
                        __dirname, '../../../ts/masters', `${file}.src.ts`
                    )),
                    `${key}: ${file}`
                );
            });
        });
    });
});

describe('Autoload Loader.getFiles', () => {
    cases.forEach(([options, files]) => {
        it(JSON.stringify(options), () => {
            deepStrictEqual(Loader.getFiles(options), files);
        });
    });
});
