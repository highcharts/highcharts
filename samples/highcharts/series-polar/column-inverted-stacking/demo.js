Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 25
    },
    title: {
        text: 'Stacked inverted polar bars'
    },
    xAxis: {
        tickInterval: 1,
        labels: {
            y: 15
        }
    },
    yAxis: {
        min: 0,
        max: 45
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.15,
            pointPlacement: 'between',
            dataLabels: {
                enabled: true,
                allowOverlap: true,
                textPath: {
                    enabled: true,
                    attributes: {
                        textAnchor: 'start',
                        startOffset: 5,
                        dy: 11.5
                    }
                }
            }
        }
    },
    series: [{
        data: [7, 6, 9, 14, 18, 21, 25, 26, 23, 18]
    }, {
        data: [3, 4, 5, 8, 11, 15, 17, 16, 14, 10]
    }]
});