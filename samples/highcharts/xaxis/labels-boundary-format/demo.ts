Highcharts.chart('container', {
    title: {
        text: 'Demo of axis label boundary'
    },
    xAxis: {
        labels: {
            format: `{#if (eq boundary "year")}{value:%b<br>%Y}
        {else}{value:%b}{/if}`
        },
        type: 'datetime'
    },
    plotOptions: {
        series: {
            pointIntervalUnit: 'month',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [1, 3, 2, 6, 3, 5, 7, 5, 1, 2, 3, 2],
        pointInterval: 2
    }]
});
