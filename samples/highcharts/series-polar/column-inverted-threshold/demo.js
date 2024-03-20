Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 50
    },
    title: {
        text: 'Custom thresholds'
    },
    subtitle: {
        text: 'Left pane <b>(-5.5)</b> and right pane <b>(5.5)</b>'
    },
    pane: [{
        size: '60%',
        center: ['25%', '50%']
    }, {
        size: '60%',
        center: ['75%', '50%']
    }],
    xAxis: [{
        tickInterval: 1
    }, {
        pane: 1,
        tickInterval: 1
    }],
    yAxis: [{
        min: -10,
        max: 10,
        tickInterval: 1
    }, {
        pane: 1,
        min: -10,
        max: 10,
        tickInterval: 1
    }],
    plotOptions: {
        series: {
            grouping: false,
            pointPadding: 0,
            groupPadding: 0
        }
    },
    series: [{
        threshold: -5.5,
        data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    }, {
        xAxis: 1,
        yAxis: 1,
        threshold: 5.5,
        data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    }]
});