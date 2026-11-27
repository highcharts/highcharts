import Highcharts from 'highcharts';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';

const chart = Highcharts.chart('chart', {
    accessibility: { enabled: false },
    chart: { animation: false },
    xAxis: { categories: ['Monday', 'Tuesday'] },
    series: [{
        type: 'line',
        name: 'Orders',
        data: [4, 7],
        animation: false
    }]
});

const csv: string = chart.exporting.getCSV();
Object.assign(window, { csv });
