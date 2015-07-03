//Create HighStock with empty data and min max

var chart;
$(function () {
    chart = new Highcharts.StockChart({
        chart: {
            renderTo: "container"
        },
        xAxis: {
            min: 1378449361033,
            max: 1378452780067
        },
        series: [{
            data: []
        }]
    });
});