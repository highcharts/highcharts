const data1 = [
    [1, 250],
    [2, 180],
    [3, 140],
    [4, 120],
    [5, 100],
    [6, 90],
    [7, 80],
    [8, 75],
    [9, 65],
    [10, 55],
    [11, 40],
    [12, 35],
    [13, 31]
];

const data2 = [
    [1, 350],
    [2, 250],
    [3, 200],
    [4, 170],
    [5, 140],
    [6, 110],
    [7, 85],
    [8, 70],
    [9, 60],
    [10, 51],
    [11, 45],
    [12, 40],
    [13, 36]
];

const data3 = [
    [1, 550],
    [2, 450],
    [3, 390],
    [4, 340],
    [5, 300],
    [6, 260],
    [7, 230],
    [8, 210],
    [9, 186],
    [10, 140],
    [11, 135],
    [12, 124],
    [13, 110]
];

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
            color: 'rgba(23, 83, 183, .9)'
        },
        name: 'measurement 1',
        color: 'rgba(23, 83, 183, 1)',
        data: data1
    }, {
        regression: true,
        regressionSettings: {
            type: 'logarithmic',
            color: 'rgba(20, 183, 83, .9)'
        },
        name: 'measurement 2',
        color: 'rgba(20, 183, 83, 1)',
        data: data2
    }, {
        type: 'column',
        regression: true,
        regressionSettings: {
            type: 'logarithmic',
            color: 'rgba(203, 83, 183, .9)'
        },
        name: 'measurement 3',
        color: 'rgba(203, 83, 183, .5)',
        data: data3
    }]
});
