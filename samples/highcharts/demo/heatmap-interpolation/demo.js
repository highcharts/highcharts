Highcharts.chart('container', {
    chart: {
        height: '100%',
        type: 'heatmap',
        plotBackgroundImage: 'https://www.highcharts.com/samples/graphics/example-screenshot.png'
    },
    title: {
        text: 'Interpolated heatmap image displaying user activity on a website'
    },
    yAxis: {
        title: {
            text: undefined
        },
        endOnTick: false,
        visible: false,
        minPadding: 0,
        maxPadding: 0
    },
    xAxis: {
        visible: false,
        margin: 0,
        minPadding: 0,
        maxPadding: 0
    },
    tooltip: {
        pointFormat: '{point.value:.0f} interactions in this region'
    },
    legend: {
        title: {
            text: 'User interactions per region'
        }
    },
    colorAxis: {
        stops: [
            [0.00, 'rgba(68, 1, 84, 0)'],
            [0.10, 'rgba(68, 1, 84, 0.5)'],
            [0.25, 'rgba(59, 82, 139, 0.6)'],
            [0.50, 'rgba(33, 145, 140, 0.7)'],
            [0.75, 'rgba(94, 201, 98, 0.8)'],
            [1.00, 'rgba(253, 231, 37, 0.9)']
        ]
    },
    series: [{
        name: 'User activity',
        data: JSON.parse(document.getElementById('data').innerText),
        interpolation: true
    }],
    responsive: {
        rules: [{
            condition: {
                minWidth: 600
            },
            chartOptions: {
                chart: {
                    height: 550
                }
            }
        }]
    }
});
