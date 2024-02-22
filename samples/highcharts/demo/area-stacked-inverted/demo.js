Highcharts.setOptions({
    colors: ['#331E36', '#41337A', '#6EA4BF', '#98CAD5', '#C2EFEB', '#ECFEE8', '#ECFEE8']
});

Highcharts.chart('container', {
    chart: {
        type: 'areaspline',
        inverted: true
    },
    title: {
        text: 'MSIS atmospheric composition by height',
        align: 'left'
    },
    subtitle: {
        text:
          'Source: <a href="https://en.wikipedia.org/wiki/Atmosphere_of_Earth" target="_blank">Wikipedia.org</a>',
        align: 'left'
    },
    xAxis: {
        tickmarkPlacement: 'on',
        title: {
            text: 'Height (km)'
        },
        opposite: 'true',
        reversed: false
    },
    yAxis: {
        title: {
            text: 'Volume fraction'
        },
        labels: {
            format: '{value} %'
        },
        reversedStacks: false
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
                    fontSize: '16px'
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
