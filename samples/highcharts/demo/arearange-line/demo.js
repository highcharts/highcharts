const ranges = [
        [-4.4, 13.1],
        [-0.5, 8.9],
        [-0.6, 5.4],
        [-4.8, 1.0],
        [-7.7, 2.5],
        [-2.6, 6.4],
        [1.1, 13.4],
        [1.9, 13.0],
        [0.6, 11.2],
        [2.9, 10.4],
        [2.5, 15.3],
        [1.5, 17.0],
        [0.3, 14.6],
        [2.3, 10.5],
        [-3.5, 11.0],
        [-4.8, 12.6],
        [-4.9, 8.7],
        [-4.5, 9.1],
        [1.5, 6.8],
        [-1.9, 8.4],
        [-4.2, 11.3],
        [-4.7, 12.5],
        [1.8, 10.0],
        [0.2, 8.0],
        [-1.0, 10.1],
        [-0.2, 8.8],
        [-1.7, 11.7],
        [-3.4, 9.1],
        [1.6, 13.8],
        [-0.9, 14.5]

    ],
    averages = [
        [2.9],
        [3.4],
        [0.4],
        [-3.5],
        [-2.1],
        [1.6],
        [6.0],
        [7.1],
        [5.4],
        [6.4],
        [7.6],
        [8.5],
        [7.4],
        [6.1],
        [3.2],
        [3.7],
        [1.7],
        [2.9],
        [3.2],
        [2.5],
        [3.2],
        [4.4],
        [5.4],
        [4.4],
        [3.6],
        [4.8],
        [5.1],
        [0.9],
        [6.6],
        [7.2]
    ];


Highcharts.chart('container', {

    title: {
        text: 'April temperatures in Nesbyen, 2024',
        align: 'left'
    },

    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.yr.no/nb/historikk/graf/1-113585/Norge/Buskerud/Nesbyen/Nesbyen?q=2024-04"' +
            'target="_blank">YR</a>',
        align: 'left'
    },

    xAxis: {
        type: 'datetime',
        accessibility: {
            rangeDescription: 'Range: April 1st 2022 to April 30th 2024.'
        }
    },

    yAxis: {
        title: {
            text: null
        }
    },

    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°C'
    },

    plotOptions: {
        series: {
            pointStart: Date.UTC(2024, 4, 1),
            pointIntervalUnit: 'day'
        }
    },

    series: [{
        name: 'Temperature',
        data: averages,
        zIndex: 1,
        marker: {
            fillColor: 'white',
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[0]
        }
    }, {
        name: 'Range',
        data: ranges,
        type: 'arearange',
        lineWidth: 0,
        linkedTo: ':previous',
        color: Highcharts.getOptions().colors[0],
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
            enabled: false
        }
    }]
});
