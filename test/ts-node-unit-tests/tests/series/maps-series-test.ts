import assert from 'assert';
import baseSeries from '../../test-data/highcharts-series';
import mapSeries from '../../test-data/map-series';

const Highcharts = require('../../../../code/highmaps.src.js')();

console.log('Testing maps series');
// Check if the series are in seriesTypes
[...baseSeries, ...mapSeries].forEach(series =>{
    assert.ok(
        Object.keys(Highcharts.seriesTypes).includes(series)
    )
})