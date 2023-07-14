Highcharts.chart('container', {
    chart: {
        type: 'scatter'
    },
    title: {
        text: 'Sound pressure level'
    },
    xAxis: {
        title: {
            enabled: true,
            text: 'Distance (m)'
        }
    },
    yAxis: {
        title: {
            text: 'SPL (dB)'
        }
    },
    tooltip: {
        pointFormat: '{point.series.name}: {point.y:.2f}'
    },
    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            }
        }
    },
    series: [{
        regression: true,
        regressionSettings: {
            type: 'logarithmic',
            color: 'rgba(223, 83, 83, .9)'
        },
        name: 'measurement',
        color: 'rgba(223, 83, 83, .5)',
        data: [{
            x: 1,
            y: 100
        }, {
            x: 2,
            y: 70
        }, {
            x: 3,
            y: 55
        }, {
            x: 4,
            y: 45
        }, {
            x: 5,
            y: 38
        }, {
            x: 6,
            y: 33
        }, {
            x: 7,
            y: 30
        }, {
            x: 8,
            y: 26
        }, {
            x: 9,
            y: 23
        }]
    }]
});
