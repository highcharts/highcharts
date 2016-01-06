$(function () {
    var UNDEFINED,
        options = {
            chart: {
                inverted: true,
                type: "columnrange",
                width: 450,
                height: 450
            },
            yAxis: {
                top: 200,
                height: 200,
                left: 200,
                width: 200
            },
            xAxis: {
                top: 200,
                height: 200,
                left: 200,
                width: 200
            },
            series: [{
                data: [
                    [34, 50],
                    [40, 42]
                ]
            }, {
                data: [
                    [45, 58],
                    [46, 59]
                ]
            }]
        },
        chart_inverted,
        chart_inverted_offsets,
        chart,
        chart_offsets;

    chart_inverted_offsets = $("#container_inverted_offsets").highcharts(options).highcharts();

    options.chart.inverted = false;
    chart_offsets = $("#container_offsets").highcharts(options).highcharts();  

    options.xAxis = UNDEFINED;
    options.yAxis = UNDEFINED;
    chart = $("#container").highcharts(options).highcharts();

    options.chart.inverted = true;
    chart_inverted = $("#container_inverted").highcharts(options).highcharts();
});
