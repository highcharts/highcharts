import * as Highcharts from 'highcharts';

test_Series();

function test_Series() {
    const chart = new Highcharts.Chart('container', {});
    const series = new Highcharts.Series(chart, {
        type: 'line',
        data: [1, 2, 3, 4, 5]
    });
    series.render();
}
