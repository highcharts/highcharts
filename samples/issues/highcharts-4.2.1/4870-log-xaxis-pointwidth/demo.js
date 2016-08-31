
$(function () {
    QUnit.test('Automatic column width on log X axis', function (assert) {
        var chart = Highcharts.chart('container', {

            "xAxis": {
                type: 'logarithmic'
            },
            "series": [{

                "type": "column",
                //"pointWidth": 10,
                "data": [{
                    "x": 1,
                    "y": 1
                }, {

                    "x": 2,
                    "y": 2
                }, {

                    "x": 3,
                    "y": 3
                }, {

                    "x": 4,
                    "y": 4
                }, {

                    "x": 5,
                    "y": 5
                }]
            }]
        });

        var bBox3 = chart.series[0].points[3].graphic.getBBox(),
            bBox4 = chart.series[0].points[4].graphic.getBBox();

        assert.strictEqual(
            typeof bBox3.x,
            'number',
            'Box is ok'
        );
        assert.strictEqual(
            typeof bBox3.width,
            'number',
            'Box is ok'
        );
        assert.strictEqual(
            typeof bBox4.x,
            'number',
            'Box is ok'
        );
        assert.ok(
            bBox3.x + bBox3.width < bBox4.x,
            'No overlapping points'
        );
    });
});