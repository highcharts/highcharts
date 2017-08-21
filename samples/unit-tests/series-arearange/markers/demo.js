QUnit.test('Markers for arearange.', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'arearange'
        },

        tooltip: {
            shared: true
        },

        series: [{
            data: [
                [0, 10],
                [10, 20],
                [30, 35],
                [30, 31]
            ]
        }]
    });

    Highcharts.each(chart.series[0].points, function(point) {
        assert.ok(
            point.lowerGraphic !== undefined,
            'Bottom marker for point: x=' + (point.x) + ' exists.'
        );
        assert.ok(
            point.upperGraphic !== undefined,
            'Top marker for point: x=' + (point.x) + ' exists.'
        );
    });
});


QUnit.test('Shared tooltip marker.', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'arearange'
        },

        tooltip: {
            shared: true
        },

        series: [{
            data: (function () {
                var ranges = [];
                for (var i = 0; i < 100; i++) {
                    ranges.push([Math.random(), 10 + Math.random()]);
                }
                return ranges;
            })()
        }]
    });

    chart.tooltip.refresh([
        chart.series[0].points[10]
    ]);

    assert.ok(
        chart.series[0].upperStateMarkerGraphic,
        'Top shared marker exists'
    );
    assert.ok(
        chart.series[0].stateMarkerGraphic,
        'Bottom shared marker exists (stored at stateMarkerGraphic due to #7021)'
    );
    assert.ok(
        chart.series[0].upperStateMarkerGraphic.d !== chart.series[0].stateMarkerGraphic.d,
        'Shared markers are not rendered in the same position'
    );

    chart.destroy()
    assert.ok(
        true,
        'Destroyed without any errors (#7021)'
    );
});