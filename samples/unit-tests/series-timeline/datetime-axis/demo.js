QUnit.test('Timeline: General tests.', function (assert) {
    // Returns true if axis etremes are equal to first and last visible point.
    function checkExtremes(chart) {
        var timeline = chart.series[0],
            visiblePoints = timeline.visibilityMap.filter(function (p) {
                return p;
            }),
            ext = chart.xAxis[0].getExtremes();

        return (
            (ext.min === visiblePoints[0].x &&
                ext.max === visiblePoints[visiblePoints.length - 1].x) ||
            false
        );
    }

    var chart = Highcharts.chart('container', {
        accessibility: { enabled: false }, // silence deprecation warnings
        chart: {
            width: 600,
            height: 400,
            zoomType: 'x'
        },
        xAxis: {
            type: 'datetime',
            minPadding: 0,
            maxPadding: 0,
            minRange: 1
        },
        series: [
            {
                showInLegend: true,
                dataLabels: {
                    allowOverlap: false
                },
                type: 'timeline',
                data: [
                    {
                        x: Date.UTC(1951, 5, 22),
                        name: 'Event 1',
                        label: 'Event 1',
                        description: 'Some description'
                    },
                    {
                        x: Date.UTC(1957, 9, 4),
                        name: 'Event 2',
                        label: 'Event 2',
                        description: 'Some description'
                    },
                    {
                        x: Date.UTC(1959, 0, 4),
                        name: 'Event 3',
                        label: 'Event 3',
                        description: 'Some description'
                    },
                    {
                        x: Date.UTC(1961, 3, 12),
                        name: 'Event 4',
                        label: 'Event 4',
                        description: 'Some description'
                    },
                    {
                        x: Date.UTC(1966, 1, 3),
                        name: 'Event 5',
                        label: 'Event 5',
                        description: 'Some description'
                    }
                ]
            }
        ]
    });

    var timeline = chart.series[0];

    timeline.addPoint({
        x: Date.UTC(1968, 1, 3),
        name: 'Event 6',
        label: 'Event 6',
        description: 'Some description'
    });

    assert.strictEqual(
        timeline.points.length,
        6,
        'Point added to timeline series.'
    );

    assert.strictEqual(
        checkExtremes(chart),
        true,
        'Axis extremes are set correctly after addPoint.'
    );

    timeline.points[0].setVisible();
    timeline.points[5].setVisible();

    assert.strictEqual(
        checkExtremes(chart),
        true,
        'Axis extremes are set correctly after hiding first and last points.'
    );

    timeline.points[1].remove();
    timeline.points[3].remove();

    assert.strictEqual(
        checkExtremes(chart),
        true,
        'Extremes are set corectly after removing first and last visible points.'
    );

    timeline.setData([
        {
            x: Date.UTC(1912, 5, 22),
            name: 'New Event 1',
            label: 'New Event 1',
            description: 'Some description'
        },
        {
            x: Date.UTC(1934, 9, 4),
            name: 'New Event 2',
            label: 'New Event 2',
            description: 'Some description'
        },
        {
            x: Date.UTC(1941, 0, 4),
            name: 'New Event 3',
            label: 'New Event 3',
            description: 'Some description'
        }
    ]);

    assert.strictEqual(
        timeline.points.length,
        3,
        'New data is set correctly on timeline.'
    );

    chart = Highcharts.chart('container', {
        accessibility: { enabled: false }, // silence deprecation warnings
        chart: {
            width: 600,
            height: 400
        },
        xAxis: {
            type: 'datetime',
            min: Date.UTC(1951, 5, 23),
            minPadding: 0,
            maxPadding: 0,
            minRange: 1
        },
        series: [
            {
                type: 'timeline',
                data: [
                    {
                        x: Date.UTC(1951, 5, 22),
                        name: 'Event 1',
                        label: 'Event 1',
                        description: 'Some description'
                    },
                    {
                        x: Date.UTC(1957, 9, 4),
                        name: 'Event 2',
                        label: 'Event 2',
                        description: 'Some description'
                    },
                    {
                        x: Date.UTC(1959, 0, 4),
                        name: 'Event 3',
                        label: 'Event 3',
                        description: 'Some description'
                    }
                ]
            }
        ]
    });

    timeline = chart.series[0];

    var point = timeline.points[0],
        dataLabel = point.dataLabel,
        connector = point.connector;

    assert.strictEqual(
        !chart.isInsidePlot(dataLabel.x, dataLabel.y),
        connector['stroke-width'] === undefined,
        'Connector is hidden when the data label is not visible on init.'
    );

    chart.update({
        series: [
            {
                dataLabels: {
                    allowOverlap: false
                },
                data: [
                    {
                        x: Date.UTC(1951, 5, 22),
                        label: 'First long data label with some description'
                    },
                    {
                        x: Date.UTC(1957, 9, 4),
                        label: 'Second long data label with some description'
                    },
                    {
                        x: Date.UTC(1959, 0, 4),
                        label: 'Third long data label with some description'
                    },
                    {
                        x: Date.UTC(1961, 0, 4),
                        label: 'Fourth long data label with some description'
                    }
                ]
            }
        ]
    });

    chart.xAxis[0].setExtremes(Date.UTC(1958, 11, 31), Date.UTC(1961, 0, 4));

    point = timeline.points[3];
    dataLabel = point.dataLabel;
    connector = point.connector;

    assert.strictEqual(
        dataLabel.opacity,
        connector.opacity,
        'Connector is visible together with data label, after setting extremes.'
    );

    chart.update({
        chart: {
            marginLeft: 100
        }
    });

    chart.xAxis[0].setExtremes(Date.UTC(1959, 3, 1), Date.UTC(1961, 0, 4));
    assert.strictEqual(
        timeline.points[2].isInside,
        false,
        'The third point is hidden, when it\'s outside of plot area.'
    );
});
