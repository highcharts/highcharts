QUnit.test('Treemap', assert => {
    const container1 = document.createElement('div');
    document.getElementById('container').appendChild(container1);
    const container2 = document.createElement('div');
    document.getElementById('container').appendChild(container2);

    try {
        var defaultOptions = {
                chart: {
                    type: 'treemap',
                    spacing: 0
                },
                plotOptions: {
                    treemap: {
                        shadow: null,
                        layoutAlgorithm: 'squarified',
                        datalabels: {
                            crop: false
                        }
                    }
                },
                credits: false,
                series: [
                    {
                        data: [
                            {
                                id: 'A',
                                name:
                                    'Ana are mere si peremgfdjgj fddifjhdfi oidgjhodgj dtjhod kngfjgiodfjhoi fofijhofo hjohjod ogfjho jgfk f hgf hfg',
                                value: 6,
                                color: 'red'
                            },
                            {
                                id: 'B',
                                name:
                                    'Ana are mere si peremgfdjgj fddifjhdfi oidgjhodgj dtjhod kngfjgiodfjhoi fofijhofo hjohjod ogfjho jgfk f hgf hfg',
                                value: 6,
                                color: 'blue'
                            },
                            {
                                id: 'C',
                                name: 'Ana are mere si castraveti',
                                value: 4,
                                color: 'green'
                            }
                        ]
                    }
                ],
                title: {
                    text: null
                }
            },
            // Create chart1 with width calculated from the container and default height of 400px
            chart1 = Highcharts.chart(container1, defaultOptions),
            // Create chart2 with width of 470px and height of 400px
            chart2 = Highcharts.chart(
                container2,
                (function () {
                    defaultOptions.chart.width = 470;
                    defaultOptions.chart.height = 400;
                    return defaultOptions;
                }())
            );

        // Update chart1 with the same height and width as chart2
        chart1.setSize(470, 400, false);

        // Check if height, left, right and width is equal
        [
            'chartHeight',
            'chartWidth',
            'plotHeight',
            'plotLeft',
            'plotSizeX',
            'plotSizeX',
            'plotTop',
            'plotWidth'
        ].forEach(function (prop) {
            assert.strictEqual(
                chart1[prop] === chart2[prop],
                true,
                'Property ' +
                    prop +
                    ' of chart has the same behaviour after a resize as with a first render'
            );
        });

        // This failed since #8160. A more robust solution would be to clip or ellipsis
        // long words in the buildText function itself.
        /*
        var dataLabel1,
            bounding1,
            dataLabel2,
            bounding2;
        chart1.series[0].points.forEach(function (point, i) {
            // Get datalabel from point of both charts
            dataLabel1 = point.dataLabel;
            dataLabel2 = chart2.series[0].points[i].dataLabel;
            bounding1 = dataLabel1.element.getBoundingClientRect();
            bounding2 = dataLabel2.element.getBoundingClientRect();
            // Check if height, left, right and width is equal
            // @notice left, right varied for some reason,
            // and caused tests to fail in Firefox
            // ['height', 'left', 'right', 'width'].forEach(function (prop) {
            ['height', 'width'].forEach(function (prop) {
                assert.close(
                    dataLabel1[prop],
                    dataLabel2[prop],
                    0.01,
                    'Property ' + prop + ' of point ' + i + ' has the same behaviour after a resize as with a first render'
                );
                assert.close(
                    bounding1[prop],
                    bounding2[prop],
                    0.01,
                    'Property ' + prop + ' of point ' + i + ' bounding has the same behaviour after a resize as with a first render'
                );
            });
        });
        */

        var point2;
        chart1.series[0].points.forEach(function (point1, i) {
            // Get datalabel from point of both charts
            point2 = chart2.series[0].points[i];
            // Check if height, left, right and width is equal
            ['height', 'left', 'right', 'width'].forEach(function (prop) {
                assert.strictEqual(
                    point1[prop] === point2[prop],
                    true,
                    'Property ' +
                        prop +
                        ' of point ' +
                        i +
                        ' should have the same behaviour after a resize as with a first render'
                );
                assert.strictEqual(
                    point1[prop] === point2[prop],
                    true,
                    'Property ' +
                        prop +
                        ' of point ' +
                        i +
                        ' bounding should have the same behaviour after a resize as with a first render'
                );
            });
        });
    } finally {
        chart1.destroy();
        chart2.destroy();

        document.getElementById('container').removeChild(container1);
        document.getElementById('container').removeChild(container2);
    }
});

QUnit.test('point.isValid', function (assert) {
    var isValid =
            Highcharts.Series.types.treemap.prototype.pointClass.prototype
                .isValid,
        context = {};
    assert.strictEqual(typeof isValid, 'function', 'point.isValid exists');

    // Check against an undefined value
    context.value = undefined;
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Undefined should return false'
    );

    // Check against a null value
    context.value = null;
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Null should return false'
    );

    // Check against a boolean value
    context.value = true;
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Boolean should return false'
    );

    // Check against a number value
    context.value = 1;
    assert.strictEqual(
        isValid.call(context),
        true,
        'point.value with type of Number should return true'
    );

    // Check against a string value
    context.value = '1';
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of String should return false'
    );

    // Check against a function value
    context.value = function () {};
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Function should return false'
    );

    // Check against a object value
    context.value = {};
    assert.strictEqual(
        isValid.call(context),
        false,
        'point.value with type of Object should return false'
    );
});
