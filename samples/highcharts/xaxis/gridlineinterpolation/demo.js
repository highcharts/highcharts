Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 50
    },
    title: {
        text: 'Inverted Polar Chart'
    },
    subtitle: {
        text: 'Showing <em>circle</em> and <em>polygon</em> grid line interpolation'
    },
    pane: [{
        size: '60%',
        center: ['25%', '50%']
    }, {
        size: '60%',
        center: ['75%', '50%']
    }],
    xAxis: [{
        tickInterval: 2,
        gridLineInterpolation: 'circle'
    }, {
        pane: 1,
        tickInterval: 2,
        gridLineInterpolation: 'polygon',
        labels: {
            x: 0,
            align: 'left'
        }
    }],
    yAxis: [{
        pane: 0,
        min: 0,
        max: 10,
        lineWidth: 0
    }, {
        pane: 1,
        min: 0,
        max: 10,
        lineWidth: 0,
        reversed: true
    }],
    plotOptions: {
        column: {
            grouping: false,
            groupPadding: 0,
            pointPlacement: 'between'
        }
    },
    series: [{
        data: [8, 7, 6, 5, 4, 3, 2, 1]
    }, {
        yAxis: 1,
        xAxis: 1,
        data: [8, 7, 6, 5, 4, 3, 2, 1]
    }]
});