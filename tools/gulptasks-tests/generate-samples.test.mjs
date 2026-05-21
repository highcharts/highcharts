import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { getOutputDir } = require('../gulptasks/generate-samples.js');

describe('getOutputDir', () => {

    describe('classic mode', () => {
        it('returns the sample dir unchanged', () => {
            strictEqual(
                getOutputDir('samples/highcharts/yaxis/labels-distance/config.ts', 'classic'),
                'highcharts/yaxis/labels-distance'
            );
        });

        it('handles top-level (no subdirectory)', () => {
            strictEqual(
                getOutputDir('samples/highcharts/basic/config.ts', 'classic'),
                'highcharts/basic'
            );
        });

        it('preserves react segment in path (no stripping in classic mode)', () => {
            strictEqual(
                getOutputDir('samples/highcharts/react/basic/config.ts', 'classic'),
                'highcharts/react/basic'
            );
        });
    });

    describe('react mode — output path is react/<product>/<flattened>', () => {
        it('non-react source sample', () => {
            strictEqual(
                getOutputDir('samples/highcharts/yaxis/labels-distance/config.ts', 'react'),
                'react/highcharts/yaxis-labels-distance'
            );
        });

        it('source sample already under react/ segment is normalized (segment stripped)', () => {
            strictEqual(
                getOutputDir('samples/highcharts/react/basic/config.ts', 'react'),
                'react/highcharts/basic'
            );
        });

        it('stock product', () => {
            strictEqual(
                getOutputDir('samples/stock/navigator/enabled/config.ts', 'react'),
                'react/stock/navigator-enabled'
            );
        });

        it('maps product', () => {
            strictEqual(
                getOutputDir('samples/maps/demo/basic/config.ts', 'react'),
                'react/maps/demo-basic'
            );
        });

        it('gantt product', () => {
            strictEqual(
                getOutputDir('samples/gantt/gantt/simple/config.ts', 'react'),
                'react/gantt/gantt-simple'
            );
        });

        it('single-segment path (no subdirectory after product)', () => {
            strictEqual(
                getOutputDir('samples/highcharts/basic/config.ts', 'react'),
                'react/highcharts/basic'
            );
        });
    });

});
