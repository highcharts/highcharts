/* eslint func-style:0 */

QUnit.test('Option chart.type update', function (assert) {
    var cfg = {
            chart: {
                type: 'column',
                animation: false,
                height: 300
            },

            plotOptions: {
                series: {
                    animation: false
                }
            },

            series: [{
                data: [1, 3, 2, 4],
                name: 'First'
            }, {
                data: [5, 3, 4, 1],
                name: 'Last'
            }]
        },
        chart;

    cfg.series[1].type = 'pie';
    chart = Highcharts.chart('container', cfg);

    assert.strictEqual(
        chart.series[0].type,
        'column',
        'Initially column'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'rect',
        'Initially column'
    );


    chart.update({
        chart: {
            type: 'bar'
        }
    });
    assert.strictEqual(
        chart.series[0].type,
        'bar',
        'Changed to bar'
    );
    assert.ok(
        chart.inverted,
        'Chart should be inverted (#8481)'
    );
    chart.update({
        chart: {
            type: 'column'
        }
    });
    assert.strictEqual(
        chart.series[0].type,
        'column',
        'Changed to column'
    );
    assert.ok(
        !chart.inverted,
        'Chart should not be inverted (#8481)'
    );

    // Second series is set to pie in series options
    assert.strictEqual(
        chart.series[1].type,
        'pie',
        'Initially pie'
    );
    assert.strictEqual(
        chart.series[1].points[0].graphic.element.nodeName,
        'path',
        'Initially pie'
    );

    // Update to pie
    chart.update({
        chart: {
            type: 'pie'
        }
    });

    assert.strictEqual(
        chart.series[0].type,
        'pie',
        'Changed to pie'
    );
    assert.strictEqual(
        chart.series[0].points[0].graphic.element.nodeName,
        'path',
        'Changed to pie'
    );
    assert.strictEqual(
        chart.series[1].type,
        'pie',
        'Still pie'
    );
    assert.strictEqual(
        chart.series[1].points[0].graphic.element.nodeName,
        'path',
        'Still pie'
    );

    // Update to line
    chart.update({
        chart: {
            type: 'line'
        }
    });

    assert.strictEqual(
        chart.series[0].type,
        'line',
        'Changed to line'
    );
    assert.strictEqual(
        chart.series[0].graph.element.nodeName,
        'path',
        'Changed to line'
    );
    assert.strictEqual(
        chart.series[1].type,
        'pie',
        'Still pie'
    );
    assert.strictEqual(
        chart.series[1].points[0].graphic.element.nodeName,
        'path',
        'Still pie'
    );
});

QUnit.test('Chart.update with style', function (assert) {
    var chart = Highcharts.chart('container', Highcharts.merge({
        chart: {
            type: 'column',
            animation: false,
            height: 300
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 3, 2, 4],
            name: 'First'
        }, {
            data: [5, 3, 4, 1],
            name: 'Last'
        }]
    }, {
        chart: {
            style: {
                fontFamily: 'verdana'
            }
        }
    }));

    assert.strictEqual(
        window.getComputedStyle(chart.title.element, '').getPropertyValue('font-family'),
        'verdana',
        'Initial font family'
    );

    chart.update({
        chart: {
            style: {
                fontFamily: 'monospace'
            }
        }
    });

    assert.strictEqual(
        window.getComputedStyle(chart.title.element, '').getPropertyValue('font-family'),
        'monospace',
        'Updated font family'
    );
});

QUnit.test('Chart.update with with or height', function (assert) {
    var cfg = {
            chart: {
                type: 'column',
                animation: false,
                height: 300
            },

            plotOptions: {
                series: {
                    animation: false
                }
            },

            series: [{
                data: [1, 3, 2, 4],
                name: 'First'
            }, {
                data: [5, 3, 4, 1],
                name: 'Last'
            }]
        },
        chart;
    cfg.chart.width = 400;
    cfg.chart.height = 400;
    chart = Highcharts.chart('container', cfg);

    assert.strictEqual(
        chart.chartWidth,
        400,
        'Initial width'
    );
    assert.strictEqual(
        chart.chartHeight,
        400,
        'Initial height'
    );


    chart.update({
        chart: {
            width: 300,
            height: 300
        }
    });

    assert.strictEqual(
        chart.chartWidth,
        300,
        'New width'
    );
    assert.strictEqual(
        chart.chartHeight,
        300,
        'New height'
    );
});
