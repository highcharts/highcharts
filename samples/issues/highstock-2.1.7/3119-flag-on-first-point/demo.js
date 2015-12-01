$(function () {

    QUnit.test('Flag on first point', function (assert) {

        $('#container').highcharts('StockChart', {
            series: [{
                data: [1, 2],
                id: 'first'
            }, {
                type: "flags",
                data: [{
                    x: 0,
                    title: "A",
                    text: "something"
                }, {
                    x: 1,
                    title: "B",
                    text: "something"
                }],
                onSeries: "first",
                shape: "squarepin"
            }]
        });

        var chart = $('#container').highcharts(),
            points = chart.series[1].points;


        assert.strictEqual(
            typeof points[0].graphic,
            'object',
            'Has flag'
        );
    });
});