import { deepStrictEqual } from 'assert';

export function testMapSeries() {
    const Highmaps = require('../../../code/highmaps.src.js')();
    console.log('Testing maps series...');

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
    const Highstock = require('../../../code/highstock.src.js')();
    console.log('Testing stock series...');

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
    const Gantt = require('../../../code/highcharts-gantt.src.js')();
    console.log('Testing Gantt series...');

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
    const Highcharts = require('../../../code/highcharts.src.js')();
    console.log('Testing Highcharts Basic series...');

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
    const Highcharts = require('../../../code/highcharts.src.js')();
    require('../../../code/highcharts-more.src.js')(Highcharts);
    console.log('Testing Highcharts-more series...');

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
