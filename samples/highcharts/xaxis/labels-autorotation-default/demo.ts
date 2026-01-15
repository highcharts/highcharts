Highcharts.chart('container', {
    chart: {
        width: 360
    },
    title: {
        text: 'Auto rotated X axis labels'
    },
    subtitle: {
        text: 'Drag slider to see the effect of auto rotation'
    },
    xAxis: {
        categories: [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ]
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
} satisfies Highcharts.Options);
