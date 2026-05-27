import { describe, it } from 'node:test';
import { ok } from 'node:assert';

import { getDemoJSX } from '../index.ts';

const metaList = [{
    defaultValue: 'linear',
    path: 'xAxis.type'
}];

describe('sample-generator getDemoJSX', () => {
    it('omits setHighcharts boilerplate when no modules are configured', async () => {
        const jsx = await getDemoJSX(
            {
                output: 'highcharts/react/unit-test/no-modules'
            },
            metaList
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
            metaList
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
            metaList
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
            metaList
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
            metaList
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
            metaList
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

    it('extracts title and series options into components', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    title: { text: 'My Title' },
                    series: [{ type: 'line', data: [1, 2, 3], name: 'Revenue' }]
                },
                output: 'highcharts/react/unit-test/title-series'
            },
            metaList
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
            metaList
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
            metaList
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
            metaList
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
            metaList
        );

        ok(jsx.includes('<XAxis>'), 'should open xAxis component');
        ok(jsx.includes('<Title>Time</Title>'), 'should extract xAxis title');
        ok(jsx.includes('</XAxis>'), 'should close xAxis component');
    });

    it('extracts yAxis title children', async () => {
        const jsx = await getDemoJSX(
            {
                chartOptionsExtra: {
                    yAxis: { title: { text: 'Values' } }
                },
                output: 'highcharts/react/unit-test/yaxis-title'
            },
            metaList
        );

        ok(jsx.includes('<YAxis>'), 'should open yAxis component');
        ok(jsx.includes('<Title>Values</Title>'), 'should extract yAxis title');
        ok(jsx.includes('</YAxis>'), 'should close yAxis component');
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
            metaList
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
            metaList
        );

        ok(!jsx.includes('<Title>'), 'should not emit a Title component');
        ok(jsx.includes('title:'), 'should keep title in chartOptions');
    });
});
