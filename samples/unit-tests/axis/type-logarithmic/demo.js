QUnit.test('Missing minor tick lines before and after extremes for a column chart.', function (assert) {
    var chart = $('#container').highcharts({
            xAxis: {
                minorTickInterval: 1 // easier for tests - otherwise floating numbers in JS gives error, for example: 0.9-0.3 = 0.6000000001 etc. but we need to test strict numbers
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                pointInterval: 10,
                type: 'column'
            }]
        }).highcharts(),
        minorTicks = chart.xAxis[0].minorTicks,
        firstTick = minorTicks['-6'],
        lastTick = minorTicks['116'],
        UNDEFINED;

    assert.strictEqual(
        firstTick !== UNDEFINED && firstTick.gridLine !== UNDEFINED && firstTick.gridLine.element instanceof SVGElement,
        true,
        "Proper first minor tick."
    );
    assert.strictEqual(
        lastTick !== UNDEFINED && lastTick.gridLine !== UNDEFINED && lastTick.gridLine.element instanceof SVGElement,
        true,
        "Proper last minor tick."
    );
});

QUnit.test('Minor ticks should not affect extremes (#6330)', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 'auto'
        },

        series: [{
            data: [3, 12, 3]
        }]

    });

    var extremes = chart.yAxis[0].getExtremes();
    assert.ok(
        extremes.max > extremes.dataMax,
        'Y axis max is bigger than data'
    );

});

QUnit.test(
    'Minor ticks should extend past major ticks (#6330)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 300
            },

            xAxis: {
                type: 'logarithmic',
                minorTickInterval: 'auto'
            },

            series: [{
                data: [
                    [0.42, 1],
                    [1.7, 2]
                ]
            }]
        });

        var gridLines = chart.container.querySelectorAll(
            '.highcharts-grid-line'
        );
        var minorGridLines = chart.container.querySelectorAll(
            '.highcharts-minor-grid-line'
        );
        assert.ok(
            minorGridLines[0].getBBox().x < gridLines[0].getBBox().x,
            'Minor grid lines outside major grid lines'
        );
        assert.ok(
            minorGridLines[minorGridLines.length - 1].getBBox().x >
                gridLines[gridLines.length - 1].getBBox().x,
            'Minor grid lines outside major grid lines'
        );
    }
);