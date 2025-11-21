/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const log = require('../libs/log');

function treeToMappingRecursive(key, branch, keyPath, mapping = {}) {
    if (branch.children) {
        keyPath.push(key);
        Object.entries(branch.children).forEach(([subkey, child]) => {
            treeToMappingRecursive(subkey, child, keyPath, mapping);
        });
        keyPath.pop();
    }
    if (branch.doclet?.requires) {
        const fullKey = (keyPath.filter(Boolean).join('.') + '.' + key)
            .replace(/^\./u, '');
        mapping[
            fullKey
        ] = branch.doclet.requires.map(
            r => r
                .replace(/module:/u, '')
                .replace(/^stock\//u, '')
        );
    }
    return mapping;
}

async function buildTest(product, seriesTypes) {
    const fs = require('fs').promises,
        path = require('path');

    const testPath = path.join(
        __dirname,
        `../../samples/highcharts/esm/autoload-${product}`
    );

    const factory = {
        highcharts: 'chart',
        highstock: 'stockChart',
        highmaps: 'mapChart',
        gantt: 'ganttChart'
    }[product] || 'chart';

    await fs.mkdir(testPath, { recursive: true });
    await fs.writeFile(
        path.join(testPath, 'README.md'),
        `# ${product} dependency mapping test

This is a generated test that ensures that all series types have a mapping
in the DependencyMapping.ts file.

If you get an error that a series type is missing, ensure that the series type
has a corresponding entry in the DependencyMapping.ts file. If not, add it
there and run \`gulp dependency-mapping\` to update the file.

`,
        'utf8'
    );

    await fs.writeFile(
        path.join(testPath, 'demo.html'),
        `<h1>Autoload test for ${product} series types</h1>
<p>
    Do not edit these test files, they are generated using the
    <code>gulp dependency-mapping</code> task.
    <br>
    When testing, remember to run
    <code>npx gulp scripts && npx gulp scripts-compile</code>.
</p>
<p id="results">
    <span id="success">0</span> success,
    <span id="failed">0</span> failed
</p>

<div id="container"></div>`
    );

    await fs.writeFile(
        path.join(testPath, 'demo.details'),
        `---
name: Autoload ${product}
authors:
  - Torstein Hønsi
requiresManualTesting: true
js_wrap: b
...
`
    );

    await fs.writeFile(
        path.join(testPath, 'demo.css'),
        `* {
    font-family: sans-serif;
}

h1 {
    text-align: center;
}

p {
    text-align: center;
}

code {
    font-family: monospace;
    background-color: #eee;
    padding: 2px 4px;
    border-radius: 2px;
}

#results {
    margin: 1em;
    border-radius: 4px;
}

#results span {
    font-size: 2em;
}

.test-container {
    width: 400px;
    height: 300px;
    float: left;
    border: 1px solid silver;
    border-radius: 4px;
    margin: 5px;
}

.failed {
    border-color: red;
    background-color: #f003;
    color: red;
    font-weight: bold;
    text-align: center;
    line-height: 300px;
    white-space: pre-wrap;
}
`
    );

    let js = 'let success = 0,\n    failed = 0;\n';
    seriesTypes.forEach(seriesType => {

        let data = '[1, 3, 2, 4]',
            options3d = '';
        if (['arcdiagram', 'dependencywheel', 'sankey'].includes(seriesType)) {
            data = `[
                    ['A', 'B', 1],
                    ['A', 'C', 1],
                    ['A', 'D', 1],
                    ['B', 'D', 1],
                    ['C', 'D', 1]
                ]`;
        } else if ([
            'arearange',
            'areasplinerange',
            'columnrange',
            'dumbbell',
            'errorbar',
            'variwide'
        ].includes(seriesType)) {
            data = `[
                    [0, 1, 2],
                    [1, 2, 3],
                    [2, 3, 4]
                ]`;
        } else if (['boxplot'].includes(seriesType)) {
            data = `[
                    [1, 2, 3, 4, 5],
                    [2, 3, 4, 5, 6],
                    [3, 4, 5, 6, 7]
                ]`;
        } else if (seriesType === 'networkgraph') {
            data = `[
                    ['A', 'B'],
                    ['A', 'C'],
                    ['A', 'D'],
                    ['B', 'D'],
                    ['C', 'D']
                ]`;
        } else if (seriesType === 'scatter3d') {
            data = `[
                    [1, 2, 3],
                    [2, 3, 4],
                    [3, 4, 5]
                ]`;
            options3d = `
            chart: {
                options3d: {
                    enabled: true
                }
            },`;
        } else if (seriesType === 'vector') {
            data = `[
                    [0, 0, 1, 1],
                    [1, 2, 1, -1],
                    [2, 0, -1, 1]
                ]`;
        } else if (seriesType === 'venn') {
            data = `[
                    { sets: ['A'], value: 2 },
                    { sets: ['B'], value: 2 },
                    { sets: ['C'], value: 2 },
                    { sets: ['A', 'B'], value: 1 },
                    { sets: ['A', 'C'], value: 2 },
                    { sets: ['B', 'C'], value: 3 }
                ]`;
        } else if (seriesType === 'wordcloud') {
            data = `[
                    { name: 'Lorem', weight: 13 },
                    { name: 'Ipsum', weight: 10.5 },
                    { name: 'Dolor', weight: 9.4 },
                    { name: 'Sit', weight: 8 },
                    { name: 'Amet', weight: 6.2 }
                ]`;
        } else if (seriesType === 'xrange') {
            data = `[
                    { x: 1, x2: 2, y: 0 },
                    { x: 1, x2: 3, y: 1 },
                    { x: 2, x2: 5, y: 2 }
                ]`;
        } else if (seriesType === 'gantt') {
            data = `[
                    { start: 1, end: 2, y: 0 },
                    { start: 1, end: 3, y: 1 },
                    { start: 2, end: 5, y: 2 }
                ]`;
        }

        // Allow the whole series structure to be overridden in some cases
        let series = `[{
                type: '${seriesType.replace('series.', '')}',
                data: ${data}
            }]`;

        if (seriesType === 'supertrend') {
            series = `[{
                data: [1, 3, 2, 4]
            }, {
                type: '${seriesType}',
                linkedTo: ':previous'
            }]`;
        } else if (seriesType === 'vbp') {
            series = `[{
                type: 'line',
                id: 'volume',
                data: [1, 3, 2, 4]
            },
            {
                type: '${seriesType}',
                params: {
                    volumeSeriesID: 'volume'
                }
            }]`;
        }

        js += `
// ${seriesType} test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.${factory}(container, {
            title: {
                text: 'Testing ${seriesType}'
            },${options3d}
            series: ${series}
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = '${seriesType} failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load ${seriesType}', e);
    }
})();
`;
    });
    await fs.writeFile(
        path.join(testPath, 'demo.js'),
        js
    );


}

/**
 * Create the DependencyMapping module file
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function dependencyMapping() {
    const fs = require('fs').promises,
        path = require('path');

    const mapping = {};

    for (const product of ['highcharts', 'highstock', 'highmaps', 'gantt']) {
        const treeJsonPath = path.join(
                __dirname,
                `../../build/api/${product}/tree.json`
            ),
            treeJson = await fs.readFile(treeJsonPath, 'utf8'),
            tree = JSON.parse(treeJson);

        log.message(`Reading ${treeJsonPath} ...`);

        const productSpecificMapping = treeToMappingRecursive(
            void 0,
            { children: tree },
            []
        );

        Object.assign(mapping, productSpecificMapping);

        await buildTest(
            product,
            Object.entries(tree.plotOptions.children)
                .filter(([key, value]) =>
                    (value.doclet.products?.includes(product) ?? true) &&
                    key !== 'series')
                .map(([key]) => key)
        );
    }

    // Remove plotOptions.* entries, and combine them with series.* entries
    let seriesMismatch = false;
    Object.keys(mapping).forEach(key => {
        if (key.startsWith('plotOptions.')) {
            const seriesType = key.replace('plotOptions.', 'series.');
            if (
                /^series\.[a-zA-Z]+$/u.test(seriesType) &&
                mapping[key].join(',') !== mapping[seriesType]?.join(',')
            ) {
                log.warn(
                    `Mismatched dependencies for ${key} and ${seriesType}:\n` +
                    ` ${mapping[key]} vs ${mapping[seriesType]}`
                );
                seriesMismatch = true;
            }
            delete mapping[key];
        }
    });
    if (seriesMismatch) {
        throw new Error(
            'Mismatched dependencies between plotOptions and series types'
        );
    }

    // Rename key series.series to plotOptions.series
    const deepSeriesRegex = /^series\.[a-zA-Z]+\./u;
    Object.entries(mapping).forEach(([key, value]) => {
        if (deepSeriesRegex.test(key)) {
            mapping[
                key.replace(deepSeriesRegex, 'plotOptions.series.')
            ] = value;
            delete mapping[key];
        }
    });

    // Remove all `lang.*` entries, as these are not features per se
    Object.keys(mapping).forEach(key => {
        if (key.startsWith('lang.')) {
            delete mapping[key];
        }
    });

    // Remove unnecessary definitions at lower levels. For example if both
    // `exporting` and `exporting.buttons` are defined, remove the latter.
    Object.entries(mapping).forEach(([key, value]) => {
        const parentKey = key.split('.').slice(0, -1).join('.');
        if (
            mapping[parentKey] &&
            mapping[parentKey].toString() === value.toString()
        ) {
            delete mapping[key];
        }
    });

    // Sort the object by key name
    const sortedMapping = {};
    Object.keys(mapping).sort().forEach(key => {
        sortedMapping[key] = mapping[key];
    });

    const mappingString = JSON
        .stringify(sortedMapping, null, 4)
        .replace(/"/gu, '\'');

    await fs.writeFile(
        path.join(
            __dirname,
            '../../ts/Extensions/Autoload/DependencyMapping.ts'
        ),
        `/**
 * Dependencies for the autoload feature.
 *
 * DO NOT EDIT THIS FILE. This file is generated using the
 * 'gulp dependency-mapping' task.
 */
const DependencyMapping: Record<string, Array<string>> = ${mappingString};
export default DependencyMapping;
`,
        'utf8'
    );
    log.success(
        'Wrote references to ts/Extensions/Autoload/DependencyMapping.ts'
    );

}

require('./jsdoc');

const buildTreeJS = true;
gulp.task(
    'dependency-mapping',
    buildTreeJS ?
        gulp.series('jsdoc', dependencyMapping) :
        dependencyMapping
);
