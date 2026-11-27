import Highcharts from 'highcharts/highstock';
import 'highcharts/indicators/indicators';

const chart = Highcharts.stockChart('chart', {
    accessibility: { enabled: false },
    chart: { animation: false },
    plotOptions: { series: { animation: false } },
    series: [{
        id: 'prices',
        type: 'line',
        data: [
            [Date.UTC(2026, 0, 1), 2],
            [Date.UTC(2026, 0, 2), 4],
            [Date.UTC(2026, 0, 3), 8]
        ]
    }, {
        type: 'sma',
        linkedTo: 'prices',
        params: { period: 2 }
    }]
});

Object.assign(window, { chart });
