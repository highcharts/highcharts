// Highcharts 4.0.1, Issue #3017
// Column range - centered data labels
QUnit.test('Columnrange align datalabels (#3017)', function (assert) {

    TestTemplate.test('highcharts/columnrange', {
        chart: {
            inverted: true
        },
        series: [{
            data: [[0, 1], [2, 3], [1, 2]],
            dataLabels: {
                enabled: true,
                inside: true,
                align: 'center'
            }
        }]
    }, function (template) {

        var chart = template.chart,
            series = chart.series[0],
            points = series.points,
            label,
            labelBox,
            labelOffset,
            point,
            pointBox,
            pointOffset;

        for (var i = 0, ie = points.length; i < ie; ++i) {
            label = points[i].dataLabel;
            labelBox = label.getBBox();
            labelOffset = Highcharts.offset(label.element);
            point = points[i].graphic;
            pointBox = point.getBBox();
            pointOffset = Highcharts.offset(point.element);

            assert.close(
                labelOffset.top,
                (pointOffset.top + ((
                    pointBox.width -
                    labelBox.width
                ) / 2)),
                { // close tolerance
                    'Chrome': 4.5,
                    'Edge': 1.5,
                    'Firefox': 4,
                    'MSIE': 2.5,
                    'Safari': 2.5,
                    '': 1
                }[TestUtilities.browser || ''],
                'Data label #' + i + ' should be horizontal aligned in the' +
                ' center of the column.'
            );

            assert.close(
                labelOffset.left,
                (pointOffset.left + ((
                    pointBox.height -
                    labelBox.height
                ) / 2)),
                { // close tolerance
                    'Chrome': 9,
                    'Edge': 7.5,
                    'Firefox': 9.5,
                    'MSIE': 7.5,
                    'Safari': 8.5,
                    '': 1
                }[TestUtilities.browser || ''],
                'Data label #' + i + ' should be vertical aligned in the' +
                ' middle of the column.'
            );
        }

    });

});
