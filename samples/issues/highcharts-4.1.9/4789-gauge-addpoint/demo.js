
$(function () {
    QUnit.test('Gauge pivot stays on top', function (assert) {
        var chart = $("#container").highcharts({
            chart: {
                type: 'gauge',
                animation: false
            },

            series: [{
                data: [0.66],
                dial: {
                    backgroundColor: 'green'
                },
                animation: false
            }, {
                data: null,
                dial: {
                    backgroundColor: 'red'
                },
                animation: false
            }]
        }).highcharts();

        assert.equal(
            chart.series[1].pivot.element === chart.series[1].group.element.lastChild,
            true,
            'Pivot is last (topmost) element in group'
        );

        var num = chart.series[1].group.element.childNodes.length;

        chart.series[1].addPoint(0.33);

        assert.equal(
            chart.series[1].group.element.childNodes.length,
            num + 1,
            'Element added'
        );
        assert.equal(
            chart.series[1].pivot.element === chart.series[1].group.element.lastChild,
            true,
            'Pivot is still last (topmost) element in group'
        );
    });
});