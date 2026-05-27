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
});
