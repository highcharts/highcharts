import * as Highcharts from 'highcharts';
import StockModule from 'highcharts/modules/stock';

StockModule(Highcharts);

function test_seriesLine() {
    Highcharts.stockChart('container', {
        chart: {
            borderWidth: 1
        },
        rangeSelector: {
            selected: 1
        },
        series: [{
            type: 'line',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
}
