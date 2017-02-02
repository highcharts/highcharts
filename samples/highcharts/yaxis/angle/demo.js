
Highcharts.setOptions({
    colors: ['#5c95cc', '#70cd5d']
});

Highcharts.chart('container', {

    chart: {
        polar: true
    },

    title: {
        text: 'Dual axis polar chart'
    },

    yAxis: [{
        lineWidth: 3,
        lineColor: Highcharts.getOptions().colors[0],
        tickAmount: 5,
        labels: {
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }
    }, {
        angle: 90,
        lineWidth: 3,
        lineColor: Highcharts.getOptions().colors[1],
        tickAmount: 5,
        labels: {
            align: 'center',
            y: -3,
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }],

    xAxis: {
        min: 0,
        max: 360,
        tickInterval: 30
    },

    plotOptions: {
        series: {
            pointInterval: 30,
            lineWidth: 1
        }
    },
    series: [{
        data: [2, 4, 7, 3, 5, 4, 7, 6, 9, 7, 3],
        yAxis: 0
    }, {
        data: [454, 123, 648, 443, 123, 465, 762, 487, 234, 153, 232],
        yAxis: 1
    }]

});
