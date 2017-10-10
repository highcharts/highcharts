(function () {

    function assertNonBoosted(assert, s) {
        assert.ok(
            !s.renderTarget || s.renderTarget.attr('href') === '',
            'No painted image'
        );
    }

    function assertBoosted(assert, s) {
        assert.strictEqual(
            s.renderTarget.attr('href').indexOf('data:image/png;base64,'),
            0,
            'Painted image for the visible series'
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
}());
