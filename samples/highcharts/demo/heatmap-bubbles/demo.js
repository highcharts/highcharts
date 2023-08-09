// Substring template helper for the responsive labels
//Highcharts.Templating.helpers.substr = (s, from, length) =>
//    s.substr(from, length);

// Create the chart
Highcharts.chart('container', {

    title: {
        text: 'Days with rain and temperature combinations',
        style: {
            fontSize: '1em'
        }
    },

    xAxis: {
        categories: ['0mm', '1-5mm', '5-10mm', '10-20mm', '>20mm'],
        min: 0,
        max: 4
    },

    yAxis: {
        categories: ['>25°C', '15-25°C', '5-15°C', '<5°C'],
        title: null,
        reversed: true,
        min: 0,
        max: 3
    },

    chart: {
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
    },

    accessibility: {
        point: {
            descriptionFormat: '{(add index 1)}. ' +
                '{series.xAxis.categories.(x)} sales ' +
                '{series.yAxis.categories.(y)}, {value}.'
        }
    },

    tooltip: {
        format: '<b>{point.z}</b> days with<br>' +
            '<b>{series.xAxis.categories.(point.x)}</b> rain and<br>' +
            '<b>{series.yAxis.categories.(point.y)}</b> temperature'
    },
    colorAxis: {
        stops: [
            [0, '#FF0000'],
            [0.5, '#FFFF00'],
            [1, '#00FF00']
        ]
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            states: {
                inactive: {
                    opacity: 1
                }
            }
        }
    },

    series: [{
        type: 'heatmap',
        name: 'Sales per employee',
        borderWidth: 1,
        color: '#FFFFFF',
        data: [[0, 0, 8], [0, 1, 10], [0, 2, 8], [0, 3, 6],
            [1, 0, 7], [1, 1, 8], [1, 2, 7], [1, 3, 3],
            [2, 0, 6], [2, 1, 6], [2, 2, 5], [2, 3, 2],
            [3, 0, 5], [3, 1, 4], [3, 2, 3], [3, 3, 1],
            [4, 0, 4], [4, 1, 2], [4, 2, 1], [4, 3, 0]],
        dataLabels: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        enableMouseTracking: false
    },

    {
        type: 'bubble',
        name: 'Sales per employee',
        data: [[0, 0, 7], [0, 1, 15], [0, 2, 12], [0, 3, 23],
            [1, 0, 2], [1, 1, 21], [1, 2, 31], [1, 3, 7],
            [2, 0, 3], [2, 1, 21], [2, 2, 15], [2, 3, 3],
            [3, 0, 4], [3, 1, 32], [3, 2, 44], [3, 3, 13],
            [4, 0, 5], [4, 1, 20], [4, 2, 35], [4, 3, 23]],
        minSize: 12,
        colorAxis: false,
        color: '#000000',
        dataLabels: {
            enabled: true
        }
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                yAxis: {
                    labels: {
                        format: '{substr value 0 1}'
                    }
                }
            }
        }]
    }

});