
$(function () {
    function test(key, options) {
        QUnit.test('In a crossing point, tooltip should show top series, ' + key, function (assert) {
            var chart = Highcharts.chart('container', options);

            var offset = $("#container").offset(),
                point = chart.series[0].points[1],
                x = offset.left + chart.plotLeft + point.plotX,
                y = offset.top + chart.plotTop + point.plotY;

            chart.pointer.onContainerMouseMove({
                pageX: x,
                pageY: y,
                target: point.graphic.element
            });

            assert.equal(
                chart.hoverPoint.series.name,
                'Put me on top',
                'Correct series on top'
            );
        });
    }

    // No z-index
    test('no z-index', {
        plotOptions: {
            series: {
                kdNow: true
            }
        },

        series: [{
            data: [1, 2, 3]
        }, {
            data: [3, 2, 1]
        }, {
            data: [1.5, 2, 2.5],
            name: 'Put me on top'
        }]

    });

    // z-index is set
    test('zIndexed', {
        plotOptions: {
            series: {
                kdNow: true
            }
        },

        series: [{
            data: [1, 2, 3],
            zIndex: 1
        }, {
            data: [3, 2, 1],
            name: 'Put me on top',
            zIndex: 3
        }, {
            data: [1.5, 2, 2.5],
            zIndex: 2
        }]

    });

    // Mixed
    test('mixed', {
        plotOptions: {
            series: {
                kdNow: true
            }
        },

        series: [{
            data: [1, 2, 3]
        }, {
            data: [3, 2, 1],
            name: 'Put me on top',
            zIndex: 1
        }, {
            data: [1.5, 2, 2.5]
        }]

    });
});