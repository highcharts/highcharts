$(function () {
    $('#container').highcharts({
        chart: {
            polar: true,
            height: 301,
            width: 400
        },
        title: {
            text: 'Highcharts <= 3.0.9:<br>Wrong rotation with reversed X axis'
        },
        xAxis: {
            tickInterval: 30,
            reversed: true,
            min: 0,
            max: 360
        },

        plotOptions: {
            series: {
                animation: false,
                pointInterval: 45
            }
        },

        series: [{
            type: 'area',
            data: [1,2,3,4,5,6,7,8]
        }]
    });
});