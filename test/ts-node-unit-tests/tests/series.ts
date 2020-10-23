import assert from 'assert';
import baseSeries from '../test-data/highcharts-series';
import mapSeries from '../test-data/map-series';

export function testMapSeries() {
    const Highcharts = require('../../../code/highmaps.src.js')();

    console.log('Testing maps series...');

    // Check if the series are in seriesTypes
    const expected = [...baseSeries, ...mapSeries];

    expected.forEach(series => {
        assert.ok(
            Object.keys(Highcharts.seriesTypes).includes(series),
            `Highcharts.seriesTypes should contain ${series}`
        )
    })
}