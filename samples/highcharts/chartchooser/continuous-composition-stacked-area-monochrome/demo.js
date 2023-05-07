Highcharts.chart('container', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'MSIS atmospheric composition by height'
    },
    subtitle: {
        text:
        'Source: <a href="https://en.wikipedia.org/wiki/Atmosphere_of_Earth" target="_blank">Wikipedia.org</a>'
    },
    xAxis: {
        tickmarkPlacement: 'on',
        title: {
            text: 'Height (km)'
        }
    },
    yAxis: {
        title: {
            text: 'Volume fraction'
        },
        labels: {
            format: '{value} %'
        }
    },
    tooltip: {
        shared: true,
        headerFormat: null,
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y}<br/>',
        valueSuffix: ' %'
    },
    plotOptions: {
        areaspline: {
            stacking: 'percent',
            lineColor: '#808080',
            pointInterval: 100,
            lineWidth: 1,
            marker: {
                enabled: false
            },
            label: {
                style: {
                    fontSize: '16px',
                    opacity: 0.6
                }
            }
        }
    },

    series: [
        {
            name: 'N2',
            color: '#a0d9ff',
            data: [78, 76, 38, 10, 2.5, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'O2',
            clor: '#c4fdff',
            data: [21, 20, 2, 0.5, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'O',
            color: '#5891c8',
            data: [0, 3, 59, 84, 70, 32, 8, 3, 1, 0, 0]
        },
        {
            name: 'Ar',
            color: '#346da4',
            data: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'He',
            color: '#0f487f',
            data: [0, 0, 1, 5, 25, 62, 82, 82, 78, 71, 62]
        },
        {
            name: 'H',
            color: '#0c3965',
            data: [0, 0, 0, 0.5, 2.5, 6, 10, 15, 21, 29, 38]
        }
    ]
});