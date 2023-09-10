const colors = Highcharts.getOptions().colors;

// Create the chart
Highcharts.chart('container', {
    chart: {
        type: 'arearange',
        zoomType: 'x'
    },
    title: {
        text: 'EU GDP'
    },
    subtitle: {
        text: '<a href="https://economy-finance.ec.europa.eu/system/files/2023-05/SF_2023_Statistical%20Annex.pdf" target="_blank">European Economic Forecast, Spring 2023</a>'
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
            from: 5.5,
            to: 99,
            label: {
                text: 'Forecast'
            }
        }],
        plotLines: [{
            dashStyle: 'dash',
            color: colors[4],
            width: 2,
            value: 5.5
        }]
    },
    yAxis: {
        opposite: true,
        title: {
            text: 'GDP change<br/>on preceding year'
        },
        labels: {
            format: '{value}%'
        },
        max: 30
    },
    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '%',
        valuePrefix: '+'
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
        name: 'EU GDP',
        type: 'line',
        data: [
            ['2021', 5.4],
            ['Q1.2022', 5.7],
            ['Q2.2022', 4.4],
            ['Q3.2022', 2.6],
            ['Q4.2022', 1.7],
            ['Q1.2023', 1.3],
            ['Q2.2023', 0.6],
            ['Q3.2023', 0.6],
            ['Q4.2023', 1.1],
            ['Q1.2024', 1.3],
            ['Q2.2024', 1.5],
            ['Q3.2024', 1.6],
            ['Q4.2024', 1.7],
            ['2025', 1.7]
        ],
        zIndex: 2,
        color: colors[7],
        lineWidth: 4
    }, {
        name: '1σ',
        data: [
            ['Q1.2023', 1.3, 1.3],
            ['Q2.2023', -3.4, 4.6],
            ['Q3.2023', -3.4, 4.6],
            ['Q4.2023', -2.9, 5.1],
            ['Q1.2024', -2.7, 5.3],
            ['Q2.2024', -2.5, 5.5],
            ['Q3.2024', -2.4, 5.6],
            ['Q4.2024', -2.3, 5.7],
            ['2025', -2.3, 5.7]
        ]
    }, {
        name: '2σ',
        data: [
            ['Q1.2023', 1.3, 1.3],
            ['Q2.2023', -7.4, 8.6],
            ['Q3.2023', -7.4, 8.6],
            ['Q4.2023', -6.9, 9.1],
            ['Q1.2024', -6.7, 9.3],
            ['Q2.2024', -6.5, 9.5],
            ['Q3.2024', -6.4, 9.6],
            ['Q4.2024', -6.3, 9.7],
            ['2025', -6.3, 9.7]
        ]
    }, {
        name: '3σ',
        data: [
            ['Q1.2023', 1.3, 1.3],
            ['Q2.2023', -11.4, 12.6],
            ['Q3.2023', -11.4, 12.6],
            ['Q4.2023', -10.9, 13.1],
            ['Q1.2024', -10.7, 13.3],
            ['Q2.2024', -10.5, 13.5],
            ['Q3.2024', -10.4, 13.6],
            ['Q4.2024', -10.3, 13.7],
            ['2025', -10.3, 13.7]
        ]
    }]
});
