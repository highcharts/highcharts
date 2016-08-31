$(function () {

    QUnit.test('Pie in Highstock, Chart constructor', function (assert) {

        var chart;

        chart = new Highcharts.Chart({
            chart: {
                type: 'pie',
                renderTo: 'container'
            },
            series: [{
                data: [1,2,3,4,5,6]
            }]

        });

        assert.strictEqual(
            typeof chart.series[0].points[0].graphic,
            'object',
            'Has slice'
        );
    });

    QUnit.test('Pie in Highstock, StockChart constructor', function (assert) {

        var chart;

        chart = new Highcharts.StockChart({
            chart: {
                renderTo: "container"
            },
            navigator: {
                enabled: false
            },
            series: [{
                type: "pie",
                data: [{
                    y: 36
                }]
            }]
        });

        assert.strictEqual(
            typeof chart.series[0].points[0].graphic,
            'object',
            'Has slice'
        );
    });
});