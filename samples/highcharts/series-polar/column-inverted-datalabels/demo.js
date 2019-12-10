Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 40
    },
    title: {
        text: 'Data labels enabled'
    },
    subtitle: {
        text: 'The inside option is set to true'
    },
    pane: [{
        size: '80%',
        startAngle: 225,
        endAngle: 405,
        center: ['50%', '48%']
    }, {
        size: '80%',
        startAngle: 45,
        endAngle: 225,
        center: ['50%', '52%']
    }],
    xAxis: [{
        tickInterval: 1,
        labels: {
            enabled: false
        }
    }, {
        pane: 1,
        tickInterval: 1,
        labels: {
            enabled: false
        }
    }],
    yAxis: [{
        tickInterval: 1,
        showEmpty: false
    }, {
        pane: 1,
        tickInterval: 1,
        showEmpty: false
    }],
    plotOptions: {
        series: {
            grouping: false,
            dataLabels: {
                enabled: true,
                inside: true
            }
        }
    },
    series: [{
        data: [10, 9, 8, 7, 6]
    }, {
        xAxis: 1,
        yAxis: 1,
        data: [10, 9, 8, 7, 6]
    }]
});