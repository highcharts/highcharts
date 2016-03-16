jQuery(function () {

    QUnit.test('Single point marker surrounded by null', function (assert) {

        var chart = Highcharts.chart('container', {
            "xAxis": {
                "labels": {
                    "autoRotationLimit": 0,
                    "format": "0.0000000000000000000000"
                },
                "tickInterval": 1
            },
            "chart": {
                "type": 'scatter',
                "width": 734,
                "height": 300
            },
            "series": [{

                "data": [{
                    "x": 0,
                    "y": 0
                }, {
                    "x": 10,
                    "y": 10
                }]
            }]
        });

        var label = chart.xAxis[0].ticks[1].label.element.textContent;
        assert.ok(
            label.indexOf('…') !== -1,
            'Label has ellipsis'
        );


        chart.redraw();
        assert.strictEqual(
            chart.xAxis[0].ticks[1].label.element.textContent,
            label,
            'Label has not changed after redraw'
        );
    });
});