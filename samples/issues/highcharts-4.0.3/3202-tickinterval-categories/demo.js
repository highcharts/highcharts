$(function () {
    $('#container').highcharts({
        title: {
            text: 'Tick marks should be <em>on</em> tick when tickInterval != 1'
        },
        xAxis: {
            categories: Highcharts.getOptions().lang.months,
            tickInterval: 5
        },
        series: [{
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ]
        }]
    });
});