//Create HighStock with empty data and min max
$(function () {
    Highcharts.stockChart('container', {
        xAxis: {
            min: 1378449361033,
            max: 1378452780067
        },
        series: [{
            data: []
        }]
    });
});