import Highcharts from 'highcharts/highcharts-gantt';

Highcharts.ganttChart('chart', {
    accessibility: { enabled: false },
    chart: { animation: false },
    plotOptions: { series: { animation: false } },
    series: [{
        type: 'gantt',
        data: [{
            id: 'design',
            name: 'Design',
            start: Date.UTC(2026, 0, 1),
            end: Date.UTC(2026, 0, 3)
        }, {
            name: 'Build',
            start: Date.UTC(2026, 0, 4),
            end: Date.UTC(2026, 0, 6),
            dependency: 'design'
        }]
    }]
});
