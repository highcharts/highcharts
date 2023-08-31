// Create the chart
Highcharts.chart('container', {

    title: {
        text: 'Riskmap',
        style: {
            fontSize: '1em'
        }
    },

    xAxis: {
        categories: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'],
        min: 0,
        max: 4
    },

    yAxis: {
        categories: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Critical'],
        title: null,
        min: 0,
        max: 4
    },

    chart: {
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
    },

    tooltip: {
        format: '<b>{point.z}</b> Vulnerabilities'
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
        // Heatmap
        type: 'heatmap',
        name: 'Criticality of data',
        borderWidth: 1,
        color: '#FFFFFF',
        data: [[0, 4, 3], [1, 4, 2], [2, 4, 1], [3, 4, 0], [4, 4, 0],
            [0, 3, 4], [1, 3, 3], [2, 3, 2], [3, 3, 1], [4, 3, 0],
            [0, 2, 6], [1, 2, 5], [2, 2, 4], [3, 2, 2], [4, 2, 1],
            [0, 1, 8], [1, 1, 7], [2, 1, 6], [3, 1, 5], [4, 1, 3],
            [0, 0, 10], [1, 0, 10], [2, 0, 8], [3, 0, 6], [4, 0, 5]],
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
        name: 'Vulnerabilities',
        data: [[0, 4, 2], [1, 4, 1], [2, 4, null], [3, 4, null], [4, 4, 1],
            [0, 3, 3], [1, 3, null], [2, 3, 5], [3, 3, 7], [4, 3, null],
            [0, 2, 8], [1, 2, 2], [2, 2, 3], [3, 2, null], [4, 2, 1],
            [0, 1, 3], [1, 1, 3], [2, 1, 12], [3, 1, null], [4, 1, null],
            [0, 0, 5], [1, 0, null], [2, 0, 2], [3, 0, 6], [4, 0, 8]],
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