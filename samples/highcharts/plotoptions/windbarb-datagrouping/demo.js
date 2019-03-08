var data = Highcharts
    .data({
        csv: document.getElementById('data').innerHTML
    })
    .getData();

Highcharts.chart('container', {

    title: {
        text: 'Highcharts Wind Barbs'
    },

    subtitle: {
        text: 'With Data Grouping'
    },

    xAxis: {
        type: 'datetime',
        offset: 40
    },

    yAxis: {
        title: {
            text: 'Wind Speed'
        },
        labels: {
            format: '{value} m/s'
        }
    },

    plotOptions: {
        series: {
            pointStart: Date.UTC(2017, 0, 29),
            pointInterval: 36e5,
            showInLegend: false
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
        }
    }]

});