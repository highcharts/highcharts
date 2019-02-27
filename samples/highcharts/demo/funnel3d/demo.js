Highcharts.chart('container', {
    chart: {
        type: 'funnel3d',
        options3d: {
            enabled: true,
            alpha: 10,
            depth: 50,
            viewDistance: 50
        }
    },
    title: {
        text: 'Highcharts Funnel3D Chart'
    },
    series: [{
        data: [1, 1, 1, 1],
        width: '80%',
        neckWidth: '25%',
        height: '85%',
        neckHeight: '50%'
    }]
});