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
            jsx.includes("import Highcharts from 'highcharts/esm/highcharts.js';"),
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
});
