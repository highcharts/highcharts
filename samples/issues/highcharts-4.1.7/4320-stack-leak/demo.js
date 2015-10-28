$(function () {
    function sizeof(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    }


    QUnit.test('Stack memory build-up', function (assert) {
        var chart = $('#container').highcharts({
            plotOptions: {
                area: {
                    stacking: 'normal'
                }
            },
            series: [{
                type: 'area',
                data: [1, 1, 1, 1, 1]
            }, {
                type: 'area',
                data: [2, 2, 2, 2, 2]
            }]
        }).highcharts();

        assert.strictEqual(
            sizeof(chart.yAxis[0].stacks.area),
            5,
            'Stack is 5'
        );

        // Now add and shift a few times
        for (var i = 0; i < 100; i++) {
            chart.series[0].addPoint(i, false, true);
            chart.series[1].addPoint(i, false, true);
        }
        chart.redraw();

        // Check that stacks have been removed.
        // Note: the size of the stacks is now 10, while we would ideally have 5.
        // It seems like the initial 5 are not removed at all.
        assert.strictEqual(
            sizeof(chart.yAxis[0].stacks.area) < 11,
            true,
            'Stacks have been removed'
        );

    });

});