import { deepStrictEqual, ok, strictEqual } from 'assert';
import { loadHCWithModules } from '../test-utils';
import { describe, it } from 'node:test';

describe('Highmaps module', () =>{
    const Highmaps = loadHCWithModules('highmaps');

    // Check if the series are in seriesTypes
    const expected = [
        'line',
        'area',
        'spline',
        'areaspline',
        'column',
        'bar',
        'scatter',
        'pie',
        'map',
        'mapline',
        'mappoint',
        'bubble',
        'mapbubble',
        'heatmap'
    ];

    const seriesTypes = Object.keys(Highmaps.seriesTypes);

    it('should contain all series types', () => {
        deepStrictEqual(
            seriesTypes.sort(),
            expected.sort()
        );
    });

    it('has the correct product name', () => {
        strictEqual(
            Highmaps.product,
            'Highmaps',
            'The loaded module has the correct product name'
        );
    });
});

describe('Testing stock series', () => {
    const Highstock = loadHCWithModules('highstock');

    // Check if the series are in seriesTypes
    const expected = [
        'line',
        'area',
        'spline',
        'areaspline',
        'column',
        'bar',
        'scatter',
        'pie',
        'hlc',
        'ohlc',
        'candlestick',
        'flags'
    ];

    it('should contain the expected series', () => {
        const seriesTypes = Object.keys(Highstock.seriesTypes);
        deepStrictEqual(
            seriesTypes.sort(),
            expected.sort()
        );
    });

    it('The loaded module has the correct product name', () => {
        strictEqual(
            Highstock.product,
            'Highstock'
        );
    });

});

describe('Gantt module', () => {
    const Gantt = loadHCWithModules('highcharts-gantt');

    it('contains expected series', () => {
        const expected = [
            'line',
            'area',
            'spline',
            'areaspline',
            'column',
            'bar',
            'scatter',
            'pie',
            'xrange',
            'gantt'
        ];
        const seriesTypes = Object.keys(Gantt.seriesTypes);

        deepStrictEqual(
            seriesTypes.sort(),
            expected.sort(),
            'The Gantt source file should contain these series'
        );
    });

    it('has the correct product name', () => {
        strictEqual(
            Gantt.product,
            'Highcharts Gantt'
        );
    });
});

describe('Highcharts Basic module', () => {
    const Highcharts = loadHCWithModules();

    // Check if the series are in seriesTypes
    const expected = [
        'line',
        'area',
        'spline',
        'areaspline',
        'column',
        'bar',
        'scatter',
        'pie'
    ];

    it('contains the expected series', () => {
        const seriesTypes = Object.keys(Highcharts.seriesTypes);

        for (const series of expected) {
            ok(
                seriesTypes.includes(series),
                `${series} is not in seriesTypes`
            );
        }
    });

    it ('has the correct product name', () => {
        strictEqual(
            Highcharts.product,
            'Highcharts',
            'The loaded module has the correct product name'
        );
    });
});

describe('Testing Highcharts-more series...', () => {
    const Highcharts = loadHCWithModules('highcharts', ['highcharts-more']);

    it('contains the expected series', () => {
        // Check if the series are in seriesTypes
        const expected = [
            'line',
            'area',
            'spline',
            'areaspline',
            'column',
            'bar',
            'scatter',
            'pie',
            'arearange',
            'areasplinerange',
            'boxplot',
            'bubble',
            'columnrange',
            'columnpyramid',
            'errorbar',
            'gauge',
            'packedbubble',
            'polygon',
            'waterfall'
        ];

        const seriesTypes = Object.keys(Highcharts.seriesTypes);

        for (const series of expected) {
            ok(
                seriesTypes.includes(series),
                `${series} is not added to seriesTypes`
            );
        }
    });
});

describe('Highcharts-3d module', () => {
    const Highcharts = loadHCWithModules('highcharts', ['highcharts-3d']);
    const seriesTypes = Object.keys(Highcharts.seriesTypes);

    it('adds the expected series', () => {
        const added = [
            'scatter3d'
        ];

        for (const series of added) {
            ok(
                seriesTypes.includes(series),
                `${series} is not added to seriesTypes`
            );
        }
    });

});

describe('Stock indicators module', () => {
    const Highcharts = loadHCWithModules('highcharts', ['modules/stock', 'indicators/indicators-all']);

    it ('adds the expected series', () => {
        const seriesTypes = Object.keys(Highcharts.seriesTypes);

        const expected = [
            'abands',
            'ad',
            'ao',
            'apo',
            'area',
            'arearange',
            'areaspline',
            'areasplinerange',
            'aroon',
            'aroonoscillator',
            'atr',
            'bar',
            'bb',
            'boxplot',
            'bubble',
            'candlestick',
            'cci',
            'chaikin',
            'cmf',
            'cmo',
            'column',
            'columnpyramid',
            'columnrange',
            'dema',
            'disparityindex',
            'dmi',
            'dpo',
            'ema',
            'errorbar',
            'flags',
            'gauge',
            'hlc',
            'ikh',
            'keltnerchannels',
            'klinger',
            'line',
            'linearRegression',
            'linearRegressionAngle',
            'linearRegressionIntercept',
            'linearRegressionSlope',
            'macd',
            'mfi',
            'momentum',
            'natr',
            'obv',
            'ohlc',
            'packedbubble',
            'pc',
            'pie',
            'pivotpoints',
            'polygon',
            'ppo',
            'priceenvelopes',
            'psar',
            'roc',
            'rsi',
            'scatter',
            'scatter3d',
            'slowstochastic',
            'sma',
            'spline',
            'stochastic',
            'supertrend',
            'tema',
            'trendline',
            'trix',
            'vbp',
            'vwap',
            'waterfall',
            'williamsr',
            'wma',
            'zigzag'
        ];

        for (const series of expected) {
            ok(seriesTypes.includes(series), `${series} is not in seriesTypes`);
        }
    });
});

describe('Testing Highcharts in use with modules', () => {
    const Highcharts = loadHCWithModules('highcharts', [
        'modules/annotations',
        'modules/broken-axis',
        'modules/data',
        'modules/drilldown',
        'modules/exporting',
        'modules/funnel',
        'modules/heatmap',
        'modules/map',
        'modules/no-data-to-display',
        'modules/offline-exporting',
        'modules/series-label',
        'modules/treemap'
    ]);

    it('adds properties and methods', () => {
        // Annotations
        strictEqual(
            typeof Highcharts.Annotation,
            'function',
            'Annotations is loaded.'
        );

        // Boost
        // require('../../../code/modules/boost.src')(Highcharts);
        // strictEqual(
        //     typeof Highcharts.Series.prototype.renderCanvas,
        //     'function',
        //     'Boost is loaded.'
        // );

        // Broken Axis
        strictEqual(
            typeof Highcharts.Series.prototype.drawBreaks,
            'function',
            'Broken Axis is loaded.'
        );

        // Data
        strictEqual(
            !!Highcharts.Data,
            true,
            'Data is loaded.'
        );

        // Drilldown
        strictEqual(
            typeof Highcharts.Point.prototype.doDrilldown,
            'function',
            'Drilldown is loaded.'
        );

        // Exporting
        strictEqual(
            !!Highcharts.getOptions().exporting,
            true,
            'Exporting is loaded.'
        );

        // Funnel
        strictEqual(
            !!Highcharts.seriesTypes.funnel,
            true,
            'Funnel is loaded.'
        );

        // Heatmap
        strictEqual(
            !!Highcharts.seriesTypes.heatmap,
            true,
            'Heatmap is loaded.'
        );

        // Map
        strictEqual(
            !!Highcharts.seriesTypes.map,
            true,
            'Map is loaded.'
        );

        // No Data To Display
        strictEqual(
            typeof Highcharts.Chart.prototype.showNoData,
            'function',
            'No Data To Display is loaded.'
        );

        // Offline Exporting
        strictEqual(
            typeof Highcharts.Chart.prototype.exportChartLocal,
            'function',
            'Offline Exporting is loaded.'
        );

        // Series Label
        strictEqual(
            typeof Highcharts.SVGRenderer.prototype.symbols.connector,
            'function',
            'Series Label is loaded.'
        );

        // Treemap
        strictEqual(
            !!Highcharts.seriesTypes.treemap,
            true,
            'Treemap is loaded.'
        );
    });
});
