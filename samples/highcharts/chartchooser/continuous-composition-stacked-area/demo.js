Highcharts.setOptions({
    colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#FF9655', '#FFF263', '#6AF9C4']
});

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
            lineColor: '#666666',
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
            data: [78, 76, 38, 10, 2.5, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'O2',
            data: [21, 20, 2, 0.5, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'O',
            data: [0, 3, 59, 84, 70, 32, 8, 3, 1, 0, 0]
        },
        {
            name: 'Ar',
            data: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'He',
            data: [0, 0, 1, 5, 25, 62, 82, 82, 78, 71, 62]
        },
        {
            name: 'H',
            data: [0, 0, 0, 0.5, 2.5, 6, 10, 15, 21, 29, 38]
        }
    ]
});
