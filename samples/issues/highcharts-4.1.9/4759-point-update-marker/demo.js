$(function () {
    QUnit.test('Line series markers should be updated on redraw.', function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                data: [{
                    y: 55,
                    name: 'Item 1',
                    color: 'blue'
                }, {
                    y: 45,
                    name: 'Item 1',
                    color: 'green'
                }]
            }]
        }).highcharts();

        chart.series[0].points[0].update({
            marker: {
                fillColor: "red"
            }
        });

        chart.series[0].points[1].update({
            color: "orange"
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr("fill"),
            "red",
            'Proper color for a marker.'
        );

        assert.strictEqual(
            chart.series[0].points[1].graphic.attr("fill"),
            "orange",
            'Proper color for a marker.'
        );
    });

    QUnit.test('Column series point should be updated on redraw.', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'column'
            },
            series: [{
                data: [{
                    y: 55,
                    name: 'Item 1',
                    color: 'blue'
                }, {
                    y: 45,
                    name: 'Item 1',
                    color: 'green'
                }]
            }]
        }).highcharts();

        chart.series[0].points[0].update({
            color: 'red'
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr("fill"),
            "red",
            'Proper color for a marker.'
        );
    });

    QUnit.test('Pie series point should be updated on redraw.', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'pie'
            },
            series: [{
                data: [{
                    y: 55,
                    name: 'Item 1',
                    color: 'blue'
                }, {
                    y: 45,
                    name: 'Item 1',
                    color: 'green'
                }]
            }]
        }).highcharts();

        chart.series[0].points[0].update({
            color: 'red'
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr("fill"),
            "red",
            'Proper color for a marker.'
        );
    });
});