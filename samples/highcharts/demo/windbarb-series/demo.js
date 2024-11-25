const data = [
    [2.3, 147],
    [2.0, 120],
    [1.6, 90],
    [2.8, 127],
    [3.6, 131],
    [2.1, 132],
    [5.6, 132],
    [4.0, 121],
    [5.4, 129],
    [6.6, 134],
    [7.1, 133],
    [5.2, 132],
    [2.1, 69],
    [2.2, 75],
    [1.2, 65],
    [1.5, 87],
    [5.1, 133],
    [4.6, 130],
    [5.4, 138],
    [1.2, 70],
    [2.1, 139],
    [2.0, 126],
    [0.5, 29],
    [1.0, 108]
];

Highcharts.chart('container', {

    title: {
        text: 'Observed wind in Vik, 10. July 2024'
    },

    subtitle: {
        text: 'Source: ' +
            '<a href="https://seklima.met.no/"' +
            'target="_blank">seklima</a>'
    },

    xAxis: {
        type: 'datetime',
        offset: 40
    },

    yAxis: {
        title: {
            text: 'Wind speed (m/s)'
        }
    },


    plotOptions: {
        series: {
            pointStart: Date.UTC(2024, 6, 11),
            pointInterval: 36e5
        }
    },

    series: [{
        type: 'windbarb',
        data: data,
        name: 'Wind',
        color: Highcharts.getOptions().colors[1],
        showInLegend: false,
        tooltip: {
            valueSuffix: ' m/s'
        }
    }, {
        type: 'area',
        keys: ['y'], // wind direction is not used here
        data: data,
        color: Highcharts.getOptions().colors[0],
        fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                    1,
                    Highcharts.color(Highcharts.getOptions().colors[0])
                        .setOpacity(0.25).get()
                ]
            ]
        },
        name: 'Wind speed',
        tooltip: {
            valueSuffix: ' m/s'
        },
        states: {
            inactive: {
                opacity: 1
            }
        }
    }]

});
