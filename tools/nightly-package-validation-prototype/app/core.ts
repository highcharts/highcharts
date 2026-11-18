import Highcharts from 'highcharts';
import 'highcharts/modules/annotations';

const chart = Highcharts.chart('chart', {
    accessibility: { enabled: false },
    chart: { animation: false },
    series: [{ type: 'line', data: [1, 2], animation: false }]
});

chart.addAnnotation({
    id: 'annotation',
    labels: [{
        point: { x: 0, y: 1, xAxis: 0, yAxis: 0 },
        text: 'First point'
    }]
});

Object.assign(window, { chart });
