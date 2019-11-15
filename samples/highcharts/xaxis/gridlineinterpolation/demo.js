Highcharts.chart('container', {
    chart: {
        type: 'column',
        polar: true,
        inverted: true
    },
    title: {
        text: 'Highcharts Inverted Polar Chart'
    },
    subtitle: {
        text: 'Showing <em>circle</em> and <em>polygon</em> grid line interpolation'
    },
    pane: [{
        startAngle: 0,
        endAngle: 360,
        center: ['25%', '50%'],
        size: '70%'
    }, {
        startAngle: 0,
        endAngle: 360,
        center: ['75%', '50%'],
        size: '70%'
    }],
    yAxis: [{
        pane: 0,
        min: 0,
        max: 10,
        lineWidth: 0,
        tickInterval: 1
    }, {
        pane: 1,
        min: 0,
        max: 10,
        lineWidth: 0,
        tickInterval: 1,
        reversed: true
    }],
    xAxis: [{
        pane: 0,
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
    plotOptions: {
        column: {
            pointPlacement: 'between',
            grouping: false,
            groupPadding: 0
        }
    },
    series: [{
        yAxis: 0,
        xAxis: 0,
        data: [8, 7, 6, 5, 4, 3, 2, 1]
    }, {
        yAxis: 1,
        xAxis: 1,
        data: [8, 7, 6, 5, 4, 3, 2, 1]
    }]
});