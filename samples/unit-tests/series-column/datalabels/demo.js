QUnit.test('Column series datal abels general tests.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                height: 240,
                width: 160,
                type: 'column'
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true
                    },
                    borderWidth: 0,
                    animation: false
                }
            },
            series: [
                {
                    data: [0.6, 46.6, 35.5, 59]
                }
            ]
        }),
        dl = chart.series[0].points[0].dataLabel;

    assert.ok(dl.y !== -9999, 'Data label should be visible (#12688).');

    chart.update({
        chart: {
            inverted: true
        }
    });

    dl = chart.series[0].points[0].dataLabel;
    assert.ok(
        dl.y !== -9999,
        'Data label should be visible when chart inverted (#12688).'
    );
});

QUnit.test('Cropping of rotated data labels (#4779)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            min: 10,
            startOnTick: false
        },
        plotOptions: {
            column: {
                animation: false,
                justify: false,
                stacking: 'normal',
                dataLabels: {
                    rotation: 270,
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'John',
                data: [1, 3, 4, 7, 0]
            },
            {
                name: 'Jane',
                data: [1, 2, 0, 20, 1]
            },
            {
                name: 'Joe',
                data: [1, 4, 4, 30, 5]
            }
        ]
    });

    var expected = [
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true
    ];
    chart.series.forEach(function (series) {
        series.points.forEach(function (point) {
            assert.strictEqual(
                point.dataLabel.attr('visibility') === 'hidden',
                expected.shift(),
                'Hidden as expected'
            );
        });
    });
});

QUnit.test(
    'Stacked column and bar should show matching data labels (#23585)',
    function (assert) {
        // Root cause: crispCol used crisp() which gives Math.round(y-0.5)+0.5
        // instead of the old Math.round(y)+yCrisp. For sub-pixel bars near
        // the zero baseline, the new formula produces height=1 for whichever
        // series crosses the rounding boundary — a boundary that falls on a
        // DIFFERENT series in column vs bar because plotHeight ≠ plotWidth.
        // labelrank = shapeArgs.height, so the height=1 bar "wins" the
        // overlap contest. The fix restores Math.round(y)+yCrisp, giving
        // height=0 for every sub-pixel bar so ranks are equal and the same
        // series wins in both chart types.
        var commonOptions = {
            chart: {
                animation: false,
                height: 400,
                width: 600
            },
            xAxis: {
                categories: [
                    'General Tasks', 'Steel Works',
                    'Concrete Works', 'Electrical Works', 'Finishing Works'
                ]
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    animation: false,
                    dataLabels: { enabled: true }
                }
            },
            // Wide value range: tiny values (near zero baseline) coexist
            // with large ones to reproduce the labelrank discrepancy.
            series: [
                { data: [8000, null, null, 12880000, 18000000] },
                { data: [2000, null, null, null, 750000] },
                { data: [60000, null, null, 6440000, null] },
                { data: [10000, 11550000, 2355000, null, null] },
                { data: [5000, 4295310, 157000, 6440000, 775080] }
            ]
        };

        // Find the series index whose data label is visible at point index 0
        // (the "General Tasks" category where all bars are sub-pixel).
        function visibleSeriesAtPoint(chart, pointIndex) {
            var result = -1;
            chart.series.forEach(function (s, si) {
                var p = s.points[pointIndex];
                if (
                    p &&
                    p.dataLabel &&
                    p.dataLabel.attr('visibility') !== 'hidden' &&
                    p.dataLabel.attr('opacity') !== 0
                ) {
                    result = si;
                }
            });
            return result;
        }

        // Collect column result first — the bar chart reuses the same
        // container element and destroys the column chart instance.
        var columnChart = Highcharts.chart(
            'container',
            Highcharts.merge(commonOptions, { chart: { type: 'column' } })
        );
        var colVisible = visibleSeriesAtPoint(columnChart, 0);

        var barChart = Highcharts.chart(
            'container',
            Highcharts.merge(commonOptions, { chart: { type: 'bar' } })
        );
        var barVisible = visibleSeriesAtPoint(barChart, 0);

        assert.notStrictEqual(
            colVisible,
            -1,
            'A data label should be visible at "General Tasks" in the ' +
                'column chart (#23585)'
        );
        assert.strictEqual(
            colVisible,
            barVisible,
            'The same series label should be visible at "General Tasks" ' +
                'in both column and bar (#23585)'
        );
    }
);
