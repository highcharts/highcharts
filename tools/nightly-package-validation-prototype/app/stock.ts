import Highcharts from 'highcharts/highstock';

Highcharts.stockChart('chart', {
    accessibility: { enabled: false },
    chart: { animation: false },
    navigator: { enabled: true },
    plotOptions: { series: { animation: false } },
    series: [{
        type: 'line',
        data: [
            [Date.UTC(2026, 0, 1), 4],
            [Date.UTC(2026, 0, 2), 6],
            [Date.UTC(2026, 0, 3), 5]
        ]
    }]
});
