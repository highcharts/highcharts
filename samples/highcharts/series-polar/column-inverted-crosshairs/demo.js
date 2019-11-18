Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 40
    },
    title: {
        text: 'Crosshair enabled on both axes'
    },
    subtitle: {
        text: 'The snap option is set to false'
    },
    xAxis: {
        tickInterval: 1,
        crosshair: {
            snap: false,
            width: 2,
            zIndex: 5,
            color: 'red'
        }
    },
    yAxis: {
        min: 0,
        max: 250,
        tickInterval: 25,
        crosshair: {
            snap: false,
            width: 2,
            zIndex: 5,
            color: 'red'
        }
    },
    series: [{
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54]
    }]
});