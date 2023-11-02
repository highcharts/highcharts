import { deepStrictEqual, ok, strictEqual } from 'assert';
import { describe, loadHCWithModules } from '../test-utils';

export function testMapSeries() {
    describe('Testing maps series...');

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

    deepStrictEqual(
        seriesTypes,
        expected,
        'The Maps source file should contain these series'
    );

    strictEqual(
        Highmaps.product,
        'Highmaps',
        'The loaded module has the correct product name'
    );
}

export function testStockSeries() {
    describe('Testing stock series...');
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

    const seriesTypes = Object.keys(Highstock.seriesTypes);

    deepStrictEqual(
        seriesTypes,
        expected,
        'The Stock source file should contain these series'
    );

    strictEqual(
        Highstock.product,
        'Highstock',
        'The loaded module has the correct product name'
    )
}

export function testGanttSeries() {
    describe('Testing Gantt series...');
    const Gantt = loadHCWithModules('highcharts-gantt');

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
        'xrange',
        'gantt'
    ];

    const seriesTypes = Object.keys(Gantt.seriesTypes);

    deepStrictEqual(
        seriesTypes,
        expected,
        'The Gantt source file should contain these series'
    );

    strictEqual(
        Gantt.product,
        'Highcharts Gantt',
        'The loaded module has the correct product name'
    )
}

export function testHighchartsSeries() {
    describe('Testing Highcharts Basic series...');

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

    const seriesTypes = Object.keys(Highcharts.seriesTypes);

    deepStrictEqual(
        seriesTypes,
        expected,
        'The Highcharts source file should contain these series'
    );

    strictEqual(
        Highcharts.product,
        'Highcharts',
        'The loaded module has the correct product name'
    )
}

export function testHighchartsMoreSeries() {
    describe('Testing Highcharts-more series...');
    const Highcharts = loadHCWithModules('highcharts', ['highcharts-more']);

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

    deepStrictEqual(
        seriesTypes,
        expected,
        'The Highcharts-more source file should contain these series'
    );
}

export function test3dSeries() {
    describe('Testing Highcharts-3d series...');

    const Highcharts = loadHCWithModules('highcharts', ['highcharts-3d']);
    const seriesTypes = Object.keys(Highcharts.seriesTypes);

    const added = [
        'scatter3d'
    ];

    added.forEach(
        series => ok(
            seriesTypes.includes(series),
            `Series "${series}" should be added with the 3d values`
        )
    );
}
export function testStockIndicators() {
    describe('Testing stock indicators series...');

    const Highcharts = loadHCWithModules('highstock', ['indicators/indicators-all']);
    const seriesTypes = Object.keys(Highcharts.seriesTypes);

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
        'flags',
        'sma',
        'ema',
        'ad',
        'ao',
        'aroon',
        'aroonoscillator',
        'atr',
        'bb',
        'cci',
        'cmf',
        'dmi',
        'dpo',
        'chaikin',
        'cmo',
        'dema',
        'tema',
        'trix',
        'apo',
        'ikh',
        'keltnerchannels',
        'klinger',
        'macd',
        'mfi',
        'momentum',
        'natr',
        'obv',
        'pivotpoints',
        'ppo',
        'pc',
        'priceenvelopes',
        'psar',
        'roc',
        'rsi',
        'stochastic',
        'slowstochastic',
        'supertrend',
        'vbp',
        'vwap',
        'williamsr',
        'wma',
        'zigzag',
        'linearRegression',
        'linearRegressionSlope',
        'linearRegressionIntercept',
        'linearRegressionAngle',
        'abands',
        'trendline',
        'disparityindex'
    ];

    deepStrictEqual(
        seriesTypes,
        expected,
        'Highstock with the indicators-all module should add the indicators as series'
    );
}

export function testHighchartsWithModules() {
    describe('Testing Highcharts in use with modules');

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
}
