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

QUnit.test('Linear-log axis with natural min at 0 (#6502)', function (assert) {
    var chart = Highcharts.chart('container', {
        "chart": {
            "height": 1800
        },

        "yAxis": [{
        }, {
            "type": "logarithmic",
            "opposite": true
        }],
        "series": [{
            "data": [5, 7]
        }, {
            "data": [90, 107],
            "yAxis": 1
        }, {
            "data": [4.9, 13],
            "yAxis": 1
        }]
    });

    assert.notEqual(
        chart.yAxis[1].min,
        -Infinity,
        'Axis min is ok'
    );
});

// Highcharts 4.0.1, Issue #3053
// Logarythmic xAxis for line series
QUnit.test('Cropping log axis (#3053)', function (assert) {

    var data = [];

    for (var i = 1; i < 901; i++) {
        data.push([i, i]);
    }

    TestTemplate.test('highcharts/scatter', {

        xAxis: {
            type: 'logarithmic'
        },

        plotOptions: {
            series: {
                lineWidth: 1
            }
        },

        series: [{
            data: data
        }]

    }, function (template) {

        var chart = template.chart;

        assert.strictEqual(
            chart.series[0].length,
            chart.options.series[0].length,
            'All points should be rendered.'
        );

        chart.update({
            plotOptions: {
                series: {
                    lineWidth: 2
                }
            }
        });

        assert.strictEqual(
            chart.series[0].length,
            chart.options.series[0].length,
            'Still all points should be rendered.'
        );

    });

});