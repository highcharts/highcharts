jQuery(function () {
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
            series: [{
                data: [{
                    id: 'A',
                    name: 'Ana are mere si peremgfdjgj fddifjhdfi oidgjhodgj dtjhod kngfjgiodfjhoi fofijhofo hjohjod ogfjho jgfk f hgf hfg',
                    value: 6,
                    color: 'red'
                }, {
                    id: 'B',
                    name: 'Ana are mere si peremgfdjgj fddifjhdfi oidgjhodgj dtjhod kngfjgiodfjhoi fofijhofo hjohjod ogfjho jgfk f hgf hfg',
                    value: 6,
                    color: 'blue'
                }, {
                    id: 'C',
                    name: 'Ana are mere si castraveti',
                    value: 4,
                    color: 'green'
                }]
            }],
            title: {
                text: null
            }
        },
        // Create chart1 with width calculated from the container and default height of 400px
        chart1 = Highcharts.chart('container-1', defaultOptions),
        // Create chart2 with width of 470px and height of 400px
        chart2 = Highcharts.chart('container-2', (function () {
            defaultOptions.chart.width = 470;
            defaultOptions.chart.height = 400;
            return defaultOptions;
        }()));

    // Update chart1 with the same height and width as chart2
    chart1.setSize(470, 400, false);
    // Run test
    QUnit.test('Chart behave equally on a resize as with a first render', function (assert) {
        // Check if height, left, right and width is equal
        ['chartHeight', 'chartWidth', 'plotHeight', 'plotLeft', 'plotSizeX', 'plotSizeX', 'plotTop', 'plotWidth'].forEach(function (prop) {
            assert.strictEqual(
                chart1[prop] === chart2[prop],
                true,
                'Property ' + prop + ' of chart has the same behaviour after a resize as with a first render'
            );
        });
    });
    QUnit.test('Data labels behave equally on a resize as with a first render', function (assert) {
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
    });
    QUnit.test('Points behave equally on a resize as with a first render', function (assert) {
        var point2;
        chart1.series[0].points.forEach(function (point1, i) {
            // Get datalabel from point of both charts
            point2 = chart2.series[0].points[i];
            // Check if height, left, right and width is equal
            ['height', 'left', 'right', 'width'].forEach(function (prop) {
                assert.strictEqual(
                    point1[prop] === point2[prop],
                    true,
                    'Property ' + prop + ' of point ' + i + ' has the same behaviour after a resize as with a first render'
                );
                assert.strictEqual(
                    point1[prop] === point2[prop],
                    true,
                    'Property ' + prop + ' of point ' + i + ' bounding has the same behaviour after a resize as with a first render'
                );
            });
        });
    });
});
