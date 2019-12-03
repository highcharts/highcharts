Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 25
    },
    title: {
        text: 'Custom start and end angles of pane'
    },
    subtitle: {
        text: 'The startAngle <b>(45)</b> and endAngle <b>(315)</b>'
    },
    pane: {
        startAngle: 45,
        endAngle: 315
    },
    xAxis: {
        tickInterval: 1,
        labels: {
            allowOverlap: true,
            y: -5
        }
    },
    yAxis: {
        max: 220,
        showLastLabel: true
    },
    plotOptions: {
        series: {
            pointPadding: 0,
            groupPadding: 0,
            dataLabels: {
                enabled: true,
                inside: true,
                allowOverlap: true
            }
        }
    },
    series: [{
        colorByPoint: true,
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 94]
    }]
});