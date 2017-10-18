(function () {

    function assertNonBoosted(assert, s) {
        assert.ok(
            !s.renderTarget || s.renderTarget.attr('href') === '',
            'No painted image'
        );

        assert.strictEqual(
            s.directTouch,
            true,
            'Non-boosted directTouch'
        );

        assert.strictEqual(
            s.stickyTracking,
            false,
            'Non-boosted stickyTracking'
        );

        assert.strictEqual(
            s.allowDG,
            undefined,
            'Allow data grouping'
        );
    }

    function assertBoosted(assert, s) {
        assert.strictEqual(
            s.renderTarget.attr('href').indexOf('data:image/png;base64,'),
            0,
            'Painted image for the series'
        );

        assert.strictEqual(
            s.directTouch,
            false,
            'Boosted directTouch'
        );

        assert.strictEqual(
            s.stickyTracking,
            true,
            'Boosted stickyTracking'
        );

        assert.strictEqual(
            s.allowDG,
            false,
            'No data grouping'
        );
    }

    QUnit.test('Enter/exit boost mode by setting data', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },

            plotOptions: {
                series: {
                    boostThreshold: 10
                }
            },
            series: [{
                data: [1, 3, 2, 4],
                type: 'column'
            }]
        });

        var s = chart.series[0];

        assertNonBoosted(assert, s);

        s.setData([1, 3, 2, 4, 3, 5, 4, 7, 5, 8, 6, 4]);

        assertBoosted(assert, s);

        s.setData([1, 3, 2, 4]);

        assertNonBoosted(assert, s);

    });

    QUnit.test('Enter/exit boost mode by zooming', function (assert) {

        var chart = Highcharts.chart('container', {
            chart: {
                width: 600
            },

            plotOptions: {
                series: {
                    boostThreshold: 10
                }
            },
            series: [{
                data: [1, 3, 2, 4, 3, 5, 4, 7, 5, 8, 6, 4],
                type: 'column',
                cropThreshold: 1
            }],

            xAxis: {
                minRange: 1
            }
        });

        var s = chart.series[0];

        assertBoosted(assert, s);

        chart.xAxis[0].setExtremes(1, 2);

        assertNonBoosted(assert, s);

        chart.xAxis[0].setExtremes();

        assertBoosted(assert, s);

    });

    QUnit.test("Boost module should remove tracker after zoom", function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                boostThreshold: 100,
                data: (function () {
                    var d = [],
                        n = 5000;
                    while (n--) {
                        d.push(Math.random());
                    }
                    return d;
                }())
            }]
        }).highcharts();

        chart.xAxis[0].setExtremes(0, 10);
        chart.xAxis[0].setExtremes();

        assert.strictEqual(
            chart.series[0].tracker,
            null
        );
    });
}());
