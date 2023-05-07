import * as Highcharts from 'highcharts';

test_Series();
test_Series_registerType();

function test_Series() {
    const chart = new Highcharts.Chart('container', {});
    const series = new Highcharts.Series(chart, {
        type: 'line',
        data: [1, 2, 3, 4, 5]
    });
    series.render();
}

function test_Series_registerType() {
    const LineSeries = Highcharts.Series.types.line;
    class MySeries extends LineSeries {
    }
    Highcharts.Series.registerType('myseries', MySeries);
}
