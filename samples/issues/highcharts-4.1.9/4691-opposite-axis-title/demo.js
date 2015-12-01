
$(function () {
    QUnit.test('Default alignment of opposite axis titles', function (assert) {
        var chart = $('#container').highcharts({
            yAxis: [{
                lineWidth: 1,
                title: {
                    text: 'Primary Axis',
                    align: 'high'
                }
            }, {
                lineWidth: 1,
                opposite: true,
                title: {
                    text: 'Secondary Axis',
                    align: 'high'
                }
            }],

            series: [{
                data: [1, 2, 3],
                yAxis: 0
            }, {
                data: [4, 2, 3],
                yAxis: 1
            }]
        }).highcharts();

        assert.strictEqual(
            chart.yAxis[0].axisTitle.element.getAttribute('text-anchor'),
            'end',
            'Left text anchored at end'
        );

        assert.strictEqual(
            chart.yAxis[1].axisTitle.element.getAttribute('text-anchor'),
            'start',
            'Right text anchored at end'
        );

        // Try low align
        chart.yAxis[0].update({
            title: {
                align: 'low'
            }
        });
        chart.yAxis[1].update({
            title: {
                align: 'low'
            }
        });

        assert.strictEqual(
            chart.yAxis[0].axisTitle.element.getAttribute('text-anchor'),
            'start',
            'Left text anchored at end'
        );

        assert.strictEqual(
            chart.yAxis[1].axisTitle.element.getAttribute('text-anchor'),
            'end',
            'Right text anchored at end'
        );
    });
});