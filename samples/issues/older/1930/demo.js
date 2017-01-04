$(function () {
    Highcharts.chart('container', {

        chart: {
            type: 'arearange',
            inverted: true
        },

        xAxis: {
            type: 'category'
        },

        yAxis: {
            minTickInterval: 1
        },

        series: [{
            data: [
                ['Ein', 1, 2],
                ['To', 2, 3],
                ['Tre', 3, 4]
            ]
        }]
    });
});
