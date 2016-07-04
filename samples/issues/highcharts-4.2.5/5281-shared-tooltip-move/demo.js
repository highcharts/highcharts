QUnit.test('Shared tooltip updated on mousemove', function (assert) {

    var iterator = 0,
        chart,
        offset;

    $('#container').highcharts({
        tooltip: {
            shared: true,
            formatter: function() {
                return iterator++;
            }
        },
        series: [{
            data: [-5, -5, -5]
        }, {
            data: [5, 5, 5]
        }, {
            data: [0, 0, 0]
        }]
    });

    chart = $('#container').highcharts();
    offset = $(chart.container).offset();

    chart.tooltip.refresh([chart.series[0].points[1]]);

    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: offset.left + 110,
        pageY: offset.top + 100,
        target: chart.container
    });

    assert.strictEqual(
        iterator,
        2,
        'Correct number of calls for tooltip formatter'
    );
});