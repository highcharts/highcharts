import { describe, it } from 'node:test';
import { ok } from 'node:assert';

import { getDemoJSX } from '../index.ts';

const axisMetaList = [{
    defaultValue: 'linear',
    path: 'xAxis.type'
}];

const genericMetaList = [{
    defaultValue: false,
    path: 'chart.inverted',
    controlOptions: {
        inTitle: false
    }
}];

const legendMetaList = [{
    defaultValue: '#aaaaaa40',
    path: 'legend.backgroundColor'
}];

describe('sample-generator getDemoJSX', () => {
    it('omits setHighcharts boilerplate when no modules are configured', async () => {
        const jsx = await getDemoJSX(
            {
                output: 'highcharts/react/unit-test/no-modules'
            },
            genericMetaList
        );

        ok(
            jsx.includes("import { Chart } from '@highcharts/react';"),
            'should import the default Chart component'
        );
        ok(
            !jsx.includes('import Highcharts from'),
            'should not import Highcharts when no modules are needed'
        );
        ok(
            !jsx.includes('setHighcharts('),
            'should not call setHighcharts when no modules are needed'
        );
    });

    it('includes setHighcharts boilerplate when modules are configured', async () => {
        const jsx = await getDemoJSX(
            {
                modules: ['modules/contour'],
                output: 'highcharts/react/unit-test/with-modules'
            },
            genericMetaList
        );

        ok(
            jsx.includes("import { Chart, setHighcharts } from '@highcharts/react';"),
            'should import setHighcharts alongside Chart'
        );
        ok(
            jsx.includes("import Highcharts from 'highcharts/esm/highcharts.src.js';"),
            'should import Highcharts when modules are used'
        );
        ok(
            jsx.includes("import 'highcharts/esm/modules/contour.src.js';"),
            'should import configured Highcharts modules'
        );
        ok(
            jsx.includes('setHighcharts(Highcharts);'),
            'should call setHighcharts when modules are used'
        );
    });

    it('uses @highcharts/react wrapper import for known wrapper modules (no setHighcharts)', async () => {
        const jsx = await getDemoJSX(
            {
                modules: ['modules/accessibility'],
                output: 'highcharts/react/unit-test/wrapper-module'
            },
            genericMetaList
        );

        ok(
            jsx.includes("import '@highcharts/react/modules/Accessibility';"),
            'should import Accessibility module wrapper as a side-effect import'
        );
        ok(
            !jsx.includes('setHighcharts('),
            'should not call setHighcharts when all modules have wrappers'
        );
        ok(
            !jsx.includes("import { Chart, setHighcharts }"),
            'should not import setHighcharts from @highcharts/react'
        );
    });

    it('uses setHighcharts fallback for modules without wrappers (highcharts-more)', async () => {
        const jsx = await getDemoJSX(
            {
                modules: ['highcharts-more'],
                output: 'highcharts/react/unit-test/no-wrapper-module'
            },
            genericMetaList
        );

        ok(
            jsx.includes('setHighcharts(Highcharts);'),
            'should call setHighcharts for modules without wrappers'
        );
        ok(
            !jsx.includes("@highcharts/react/modules"),
            'should not use wrapper imports for highcharts-more'
        );
    });

    it('supports mixed: wrapper module + non-wrapper module coexist', async () => {
        const jsx = await getDemoJSX(
            {
                modules: ['modules/accessibility', 'highcharts-more'],
                output: 'highcharts/react/unit-test/mixed-modules'
            },
            genericMetaList
        );

        ok(
            jsx.includes("import '@highcharts/react/modules/Accessibility';"),
            'should import Accessibility module wrapper as a side-effect import'
        );
        ok(
            jsx.includes('setHighcharts(Highcharts);'),
            'should call setHighcharts for the non-wrapper module'
        );
    });

    it('uses .src Highcharts entrypoint for stock factory when setHighcharts fallback is needed', async () => {
        const jsx = await getDemoJSX(
            {
                factory: 'stockChart',
                modules: ['highcharts-more'],
                output: 'highcharts/react/unit-test/stock-src-entrypoint'
            },
            genericMetaList
        );

        ok(
            jsx.includes("import Highcharts from 'highcharts/esm/highstock.src.js';"),
            'should import highstock.src.js so side-effect modules register on the same Highcharts instance'
        );
        ok(
            jsx.includes('setHighcharts(Highcharts);'),
            'should call setHighcharts for stock factory fallback modules'
        );
    });

    it('implicitly extracts title, series, xAxis, and legend from legend path-driven samples', async () => {
        const jsx = await getDemoJSX(
            {
                output: 'highcharts/react/unit-test/legend-backgroundcolor-full',
                controls: [{
                    path: 'legend.backgroundColor',
                    value: '#aaaaaa40'
                }]
            },
            legendMetaList
        );

        ok(
            jsx.includes("import { Chart, Title, Series, XAxis, Legend } from '@highcharts/react';"),
            'should import Title, Series, XAxis, and Legend components'
        );
        ok(
            jsx.includes('<Chart options={chartOptions}>'),
            'should render a non-self-closing Chart when option components are extracted'
        );
        ok(
            jsx.includes('<Title>Demo of &lt;em&gt;legend.backgroundColor&lt;/em&gt;</Title>'),
            'should extract the generated title text into a Title component'
        );
        ok(
            jsx.includes('<Series data={[1, 3, 2, 4]} />'),
            'should extract template series data into a Series component'
        );
        ok(
            jsx.includes('<XAxis options={{"categories":["Apples","Bananas","Oranges","Pears"]}} />'),
            'should extract xAxis options into an XAxis component'
        );
        ok(
            jsx.includes('<Legend backgroundColor={"#aaaaaa40"} />'),
            'should extract legend options into a Legend component'
        );
        ok(!jsx.includes('\n            title:'), 'should remove top-level title from chartOptions');
        ok(!jsx.includes('\n            series:'), 'should remove top-level series from chartOptions');
        ok(!jsx.includes('\n            xAxis:'), 'should remove top-level xAxis from chartOptions');
        ok(!jsx.includes('\n            legend:'), 'should remove top-level legend from chartOptions');
    });

    it('extracts title and series options into components', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    title: { text: 'My Title' },
                    series: [{ type: 'line', data: [1, 2, 3], name: 'Revenue' }]
                },
                output: 'highcharts/react/unit-test/title-series'
            },
            axisMetaList
        );

        ok(jsx.includes('<Title>My Title</Title>'), 'should extract title as a component');
        ok(jsx.includes('<Series type={"line"}'), 'should include series type as a prop');
        ok(jsx.includes('name={"Revenue"}'), 'should include series name as a prop');
        ok(jsx.includes('data={[1, 2, 3]}'), 'should include series data as a prop');
        ok(!jsx.includes('title:'), 'should remove title from chartOptions');
    });

    it('extracts tooltip simple props', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    tooltip: { showDelay: 500 }
                },
                output: 'highcharts/react/unit-test/tooltip-props'
            },
            axisMetaList
        );

        ok(jsx.includes('<Tooltip showDelay={500}'), 'should extract tooltip props');
    });

    it('extracts tooltip format children', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    tooltip: { pointFormat: '<b>{point.y}</b>' }
                },
                output: 'highcharts/react/unit-test/tooltip-format'
            },
            axisMetaList
        );

        ok(jsx.includes('<Tooltip>'), 'should open tooltip component');
        ok(
            jsx.includes('<data-hc-option name="pointFormat">'),
            'should emit tooltip format as a child option'
        );
        ok(jsx.includes('</Tooltip>'), 'should close tooltip component');
    });

    it('extracts legend children', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    legend: { labelFormat: '{name}' }
                },
                output: 'highcharts/react/unit-test/legend-children'
            },
            axisMetaList
        );

        ok(jsx.includes('<Legend>'), 'should open legend component');
        ok(
            jsx.includes('<data-hc-option name="labelFormat">'),
            'should emit legend label format as a child option'
        );
        ok(jsx.includes('</Legend>'), 'should close legend component');
    });

    it('extracts xAxis title children', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    xAxis: { title: { text: 'Time' } }
                },
                output: 'highcharts/react/unit-test/xaxis-title'
            },
            axisMetaList
        );

        ok(
            jsx.includes('<XAxis options={{') && jsx.includes('"categories":["Apples","Bananas","Oranges","Pears"]') && jsx.includes('"type":"linear"'),
            'should open xAxis component with remaining axis options'
        );
        ok(jsx.includes('<Title>Time</Title>'), 'should extract xAxis title');
        ok(jsx.includes('</XAxis>'), 'should close xAxis component');
    });

    it('implicitly extracts title and series when xAxis controls are extracted', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    xAxis: {
                        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
                        gridLineWidth: 1,
                        gridZIndex: 4
                    }
                },
                output: 'highcharts/react/unit-test/xaxis-options'
            },
            axisMetaList
        );

        ok(jsx.includes('<Title>Demo of &lt;em&gt;xAxis.type&lt;/em&gt;</Title>'), 'should extract the generated title');
        ok(jsx.includes('<Series data={[1, 3, 2, 4]} />'), 'should extract template series as a component');
        ok(
            jsx.includes('<XAxis options={{') && jsx.includes('"gridLineWidth":1') && jsx.includes('"gridZIndex":4') && jsx.includes('"type":"linear"'),
            'should extract xAxis options into the XAxis component'
        );
        ok(!jsx.includes('title:'), 'should remove title from chartOptions');
        ok(!jsx.includes('series:'), 'should remove series from chartOptions');
        ok(!jsx.includes('xAxis:'), 'should remove xAxis from chartOptions');
    });

    it('extracts yAxis title children', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    yAxis: { title: { text: 'Values' } }
                },
                output: 'highcharts/react/unit-test/yaxis-title'
            },
            axisMetaList
        );

        ok(jsx.includes('<YAxis>'), 'should open yAxis component');
        ok(jsx.includes('<Title>Values</Title>'), 'should extract yAxis title');
        ok(jsx.includes('</YAxis>'), 'should close yAxis component');
    });

    it('preserves non-text axis title options under YAxis options', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    yAxis: {
                        title: {
                            text: 'Values',
                            align: 'high'
                        },
                        opposite: true
                    }
                },
                output: 'highcharts/react/unit-test/yaxis-title-options'
            },
            axisMetaList
        );

        ok(
            jsx.includes('<YAxis options={{"title":{"align":"high"},"opposite":true}}>'),
            'should keep non-text axis title options on the YAxis component'
        );
        ok(jsx.includes('<Title>Values</Title>'), 'should still extract yAxis title text');
        ok(!jsx.includes('yAxis:'), 'should remove yAxis from chartOptions');
    });

    it('uses data identifier for series when dataFile is present', async () => {
        const jsx = await getDemoJSX(
            {
                dataFile: 'usdeur.json',
                chartOptionsExtra: {
                    series: [{ type: 'line', name: 'USD/EUR' }]
                },
                output: 'highcharts/react/unit-test/datafile-series'
            },
            axisMetaList
        );

        ok(jsx.includes('<Series'), 'should include a Series component');
        ok(jsx.includes('data={data}'), 'should use the data identifier for series data');
        ok(jsx.includes('type={"line"}'), 'should include series type as a prop');
        ok(jsx.includes('name={"USD/EUR"}'), 'should include series name as a prop');
    });

    it('keeps unsupported title keys in chartOptions', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    title: { text: 'Hello', useHTML: true, style: { color: 'red' } }
                },
                output: 'highcharts/react/unit-test/fallback-unsupported'
            },
            axisMetaList
        );

        ok(!jsx.includes('<Title>'), 'should not emit a Title component');
        ok(jsx.includes('title:'), 'should keep title in chartOptions');
    });

    it('keeps unsupported title/xAxis shapes in chartOptions in path-driven context', async () => {
        const jsx = await getDemoJSX(
            {
                controls: [{
                    path: 'legend.backgroundColor',
                    value: '#aaaaaa40'
                }],
                chartOptionsExtra: {
                    title: {
                        text: 'Hello',
                        useHTML: true
                    },
                    xAxis: [{
                        categories: ['A', 'B', 'C']
                    }],
                    legend: {
                        backgroundColor: '#aaaaaa40',
                        title: {
                            text: 'Legend title'
                        }
                    },
                    series: [{
                        data: [1, 2, 3]
                    }]
                },
                output: 'highcharts/react/unit-test/path-driven-fallback-shapes'
            },
            legendMetaList
        );

        ok(!jsx.includes('<Title>Hello</Title>'), 'should not extract unsupported title shape');
        ok(!jsx.includes('<XAxis'), 'should not extract array xAxis shape');
        ok(jsx.includes('<Legend'), 'should still extract supported legend object shape');

        ok(jsx.includes('title:'), 'should keep unsupported title in chartOptions');
        ok(jsx.includes('xAxis:'), 'should keep unsupported xAxis in chartOptions');
        ok(!jsx.includes('\n            legend:'), 'should remove top-level legend from chartOptions');
        ok(jsx.includes('<Series data={[1, 2, 3]} />'), 'should still extract supported series shape');
    });
});
