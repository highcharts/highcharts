import { deepStrictEqual, ok, strictEqual } from 'assert';
import { describe } from '../test-utils';

export function testMapSeries() {
    describe('Testing maps series...');

    const Highmaps = require('../../../code/highmaps.src.js')();

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
}

export function testStockSeries() {
    describe('Testing stock series...');

    const Highstock = require('../../../code/highstock.src.js')();

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
}

export function testGanttSeries() {
    describe('Testing Gantt series...');

    const Gantt = require('../../../code/highcharts-gantt.src.js')();

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
}

export function testHighchartsSeries() {
    describe('Testing Highcharts Basic series...');

    const Highcharts = require('../../../code/highcharts.src.js')();

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
}

export function testHighchartsMoreSeries() {
    describe('Testing Highcharts-more series...');

    const Highcharts = require('../../../code/highcharts.src.js')();
    require('../../../code/highcharts-more.src.js')(Highcharts);

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
        'columnrange',
        'columnpyramid',
        'gauge',
        'boxplot',
        'errorbar',
        'waterfall',
        'polygon',
        'bubble',
        'packedbubble'
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

    const Highcharts = require('../../../code/highcharts.src.js')();
    require('../../../code/highcharts-3d.src.js')(Highcharts);

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

    const Highcharts = require('../../../code/highstock.src.js')();
    require('../../../code/indicators/indicators-all.src.js')(Highcharts);

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
        'ohlc',
        'candlestick',
        'flags',
        'sma',
        'ad',
        'ao',
        'aroon',
        'aroonoscillator',
        'atr',
        'bb',
        'cci',
        'cmf',
        'dpo',
        'ema',
        'chaikin',
        'dema',
        'tema',
        'trix',
        'apo',
        'ikh',
        'keltnerchannels',
        'macd',
        'mfi',
        'momentum',
        'natr',
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
        'trendline'
    ];

    deepStrictEqual(
        seriesTypes,
        expected,
        'Highstock with the indicators-all module should add the indicators as series'
    );
}
