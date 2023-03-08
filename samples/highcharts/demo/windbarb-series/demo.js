const data = [
    [4.9, 246],
    [4.1, 242],
    [3.2, 262],
    [1.5, 284],
    [1.1, 294],
    [0.4, 192],
    [0.2, 30],
    [1.1, 110],
    [1.4, 112],
    [2.1, 132],
    [1.6, 134],
    [1.5, 128],
    [0.7, 91],
    [0.7, 275],
    [0.6, 341],
    [4.5, 236],
    [4.9, 241],
    [3.4, 234],
    [0.7, 260],
    [1.1, 274],
    [0.9, 327],
    [0.5, 336],
    [0.4, 331],
    [1.4, 157]];

Highcharts.chart('container', {

    title: {
        text: 'Observed wind in Vik, 30. July 2022',
        align: 'left'
    },

    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.yr.no/nb/historikk/graf/1-137598/Norge/Vestland/Vik/Vik%C3%B8yri?q=2022-07-30"' +
            'target="_blank">YR</a>',
        align: 'left'
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
            pointStart: Date.UTC(2022, 6, 30),
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
