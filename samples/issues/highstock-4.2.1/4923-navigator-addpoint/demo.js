$(function () {
    QUnit.test('Update navigator series on series update', function (assert) {

        var chart = Highcharts.stockChart('container', {
                series: [{
                    animation: false,
                    data: [
                        { x: 0, y: 0 },
                        { x: 1, y: 1 },
                        { x: 2, y: 2 },
                        { x: 3, y: 3 },
                        { x: 4, y: 4 },
                        { x: 5, y: 5 },
                        { x: 6, y: 6 },
                        { x: 7, y: 7 },
                        { x: 8, y: 8 },
                        { x: 9, y: 9 }
                    ],
                    dataGrouping: {
                        enabled: false
                    }
                }]
            }),
            done = assert.async();

        var pathWidth = chart.series[1].graph.getBBox().width;

        assert.strictEqual(
            typeof pathWidth,
            'number',
            'Path width is set'
        );
        assert.ok(
            pathWidth > 500,
            'Path is more than 500px wide'
        );

        setTimeout(function () {
            chart.series[0].addPoint([10, 10]);
            assert.strictEqual(
                chart.series[1].graph.getBBox().width,
                pathWidth,
                'Path width is updated'
            );
            done();
        }, 1);

    });
});