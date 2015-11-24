$(function () {
    QUnit.test('Reversed yAxis for bar charts cause detached columns from axis.', function (assert) {
        var options = {
                chart: {
                    type: "column"
                },
                plotOptions: {
                    series: {
                        borderWidth: 1,
                        borderColor: "red"
                    }
                },
                yAxis: {
                    reversed: false
                },
                series: [{
                    data: [0, 1, 2, 3]
                }]
            },
            charts = [],
            point,
            y, height;

        charts[0] = $("#container_1").highcharts(options).highcharts();
        options.yAxis.reversed = true;
        charts[1] = $("#container_2").highcharts(options).highcharts();
        options.chart.type = "bar";
        charts[2] = $("#container_3").highcharts(options).highcharts();
        options.yAxis.reversed = false;
        charts[3] = $("#container_4").highcharts(options).highcharts();

        $.each([charts[0], charts[3]], function (i, chart) {
            point = chart.series[0].data[1].graphic;
            y = parseFloat(point.attr("y"));
            height = parseFloat(point.attr("height"));
            assert.strictEqual(
                y + height > chart.plotHeight,
                true,
                [
                    'Chart:',
                    chart.options.chart.type,
                    ', reversed:',
                    chart.options.yAxis[0].reversed
                ].join(" ")
            );

            assert.strictEqual(
                parseFloat(chart.series[0].data[0].graphic.attr('height')),
                0,
                'Zero point should be zero height (#4656)'
            );
        });

        $.each([charts[1], charts[2]], function (i, chart) {
            point = chart.series[0].data[1].graphic;
            y = parseFloat(point.attr("y"));
            assert.strictEqual(
                y < 0,
                true,
                [
                    'Chart:',
                    chart.options.chart.type,
                    ', reversed:',
                    chart.options.yAxis[0].reversed
                ].join(" ")
            );


            assert.strictEqual(
                parseFloat(chart.series[0].data[0].graphic.attr('height')),
                0,
                'Zero point should be zero height (#4656)'
            );
        });
    });

});