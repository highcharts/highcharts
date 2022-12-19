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
    }, {
        type: 'errorbar',
        color: 'rgba(223, 83, 83, .5)',
        data: [{
            x: 1,
            high: 108,
            low: 93
        }, {
            x: 2,
            high: 75,
            low: 65
        }, {
            x: 3,
            high: 60,
            low: 50
        }, {
            x: 4,
            high: 49,
            low: 41
        }, {
            x: 5,
            high: 42,
            low: 34
        }, {
            x: 6,
            high: 36,
            low: 30
        }, {
            x: 7,
            high: 33,
            low: 27
        }, {
            x: 8,
            high: 28,
            low: 24
        }, {
            x: 9,
            high: 25,
            low: 21
        }]
    }]
});