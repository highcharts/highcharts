Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    palette: {
        colorScheme: 'dark'
    },
    title: {
        text: 'Dark mode chart with light export'
    },
    subtitle: {
        text: `Subtitle with
            <b style="color: var(--highcharts-highlight-color-100);">
            highlight color</b>`
    },
    xAxis: {
        type: 'datetime'
    },
    plotOptions: {
        series: {
            pointIntervalUnit: 'month',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [3, 6, 5, 6]
    }, {
        data: [2, 5, 4, 5]
    }],
    exporting: {
        chartOptions: {
            palette: {
                colorScheme: 'light'
            }
        }
    }
});
