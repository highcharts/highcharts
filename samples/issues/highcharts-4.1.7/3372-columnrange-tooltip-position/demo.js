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
        chartInverted,
        chartInvertedOffsets,
        chart,
        chartOffsets;

    chartInvertedOffsets = $("#container_invertedOffsets").highcharts(options).highcharts();

    options.chart.inverted = false;
    chartOffsets = $("#containerOffsets").highcharts(options).highcharts();

    options.xAxis = UNDEFINED;
    options.yAxis = UNDEFINED;
    chart = $("#container").highcharts(options).highcharts();

    options.chart.inverted = true;
    chartInverted = $("#container_inverted").highcharts(options).highcharts();
});
