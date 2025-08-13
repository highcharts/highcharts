const colors = Highcharts.getOptions().colors;

// Create the chart
Highcharts.chart('container', {
    chart: {
        type: 'arearange',
        zooming: {
            type: 'x'
        }
    },
    title: {
        text: 'Predicted net income'
    },
    subtitle: {
        text: 'Shaded areas representing 1, 2, and 3 ' +
              'standard deviance confidence intervals.'
    },
    xAxis: {
        type: 'category',
        accessibility: {
            rangeDescription: 'Range: 2022 to 2024.'
        },
        min: 1,
        max: 12,
        endOnTick: false,
        plotBands: [{
            color: 'rgba(255, 75, 66, 0.07)',
            from: 5,
            to: 99,
            label: {
                text: 'Forecast'
            }
        }],
        plotLines: [{
            dashStyle: 'dash',
            color: colors[4],
            width: 2,
            value: 5
        }]
    },
    yAxis: {
        opposite: true,
        title: {
            text: 'Norwegian Kroner'
        },
        labels: {
            format: '{value}M'
        },
        min: 0
    },
    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: 'm NOK'
    },
    responsive: {
        rules: [{
            chartOptions: {
                xAxis: {
                    labels: {
                        staggerLines: 2
                    }
                }
            },
            condition: {
                minWidth: 540
            }
        }]
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        },
        arearange: {
            enableMouseTracking: false,
            states: {
                inactive: {
                    enabled: false
                }
            },
            color: colors[7],
            fillOpacity: 1 / 3,
            lineWidth: 0
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Net Income',
        type: 'line',
        data: [
            ['2023',    18.4],
            ['Q1.2024', 18.7],
            ['Q2.2024', 19.4],
            ['Q3.2024', 22.6],
            ['Q4.2024', 17.7],
            ['Q1.2025', 18.3],
            ['Q2.2025', 21.6],
            ['Q3.2025', 21.6],
            ['Q4.2025', 25.1],
            ['Q1.2026', 23.3],
            ['Q2.2026', 24.5],
            ['Q3.2026', 24.6],
            ['Q4.2026', 26.7],
            ['2027',    27.7]
        ],
        zIndex: 2,
        color: colors[1],
        lineWidth: 3
    }, {
        name: '1σ',
        data: [
            ['Q1.2025', 18.4, 18.4],
            ['Q2.2025', 21.258, 21.942],
            ['Q3.2025', 20.842, 22.358],
            ['Q4.2025', 24.026, 26.174],
            ['Q1.2026', 21.721, 24.879],
            ['Q2.2026', 22.608, 26.392],
            ['Q3.2026', 22.303, 26.897],
            ['Q4.2026', 24.338, 29.062],
            ['2027',    24.893, 30.507]
        ]
    }, {
        name: '2σ',
        data: [
            ['Q1.2025', 18.4, 18.4],
            ['Q2.2025', 20.917, 22.283],
            ['Q3.2025', 20.083, 23.117],
            ['Q4.2025', 22.951, 27.249],
            ['Q1.2026', 20.142, 26.458],
            ['Q2.2026', 20.716, 28.284],
            ['Q3.2026', 20.005, 29.195],
            ['Q4.2026', 21.975, 31.425],
            ['2027',    22.085, 33.315]
        ]
    }, {
        name: '3σ',
        data: [
            ['Q1.2025', 18.4, 18.4],
            ['Q2.2025', 20.575, 22.625],
            ['Q3.2025', 19.325, 23.875],
            ['Q4.2025', 21.877, 28.323],
            ['Q1.2026', 18.564, 28.036],
            ['Q2.2026', 18.823, 30.177],
            ['Q3.2026', 17.708, 31.492],
            ['Q4.2026', 19.613, 33.787],
            ['2027',    19.278, 36.122]
        ]
    }]
});
