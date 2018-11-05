import * as Highcharts from 'highcharts/highstock';

function test_seriesLine() {
    const series1: Highcharts.SeriesLineOptions = {
        type: 'line',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        tooltip: {
            valueDecimals: 2
        }
    };
    Highcharts.stockChart('container', {
        chart: {
            borderWidth: 1
        },
        rangeSelector: {
            selected: 1
        },
        series: [series1]
    });
}
