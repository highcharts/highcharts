Highcharts.chart('container', {

    chart: {
        type: 'bar',
        margin: 75,
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50
        }
    },
    title: {
        text: 'Highcharts 3D bar chart'
    },
    plotOptions: {
        series: {
            depth: 25,
            colorByPoint: true
        }
    },
    xAxis: {
        type: 'category'
    },
    series: [{
        data: [
            ['Birch', 34],
            ['Oak', 20],
            ['Pine', 44],
            ['Elm', 12],
            ['Aspen', 59],
            ['Maple', 41]
        ]
    }]
});
