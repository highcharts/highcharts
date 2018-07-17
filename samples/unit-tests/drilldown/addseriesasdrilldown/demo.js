

QUnit.test('Async addSeriesAsDrilldown', function (assert) {

    var clock = TestUtilities.lolexInstall();

    try {

        var done = assert.async();

        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                events: {
                    drilldown: function (e) {
                        if (!e.seriesOptions) {

                            var chart = this,
                                drilldowns = {
                                    'Animals': {
                                        name: 'Animals',
                                        data: [
                                            ['Cows', 2],
                                            ['Sheep', 3]
                                        ]
                                    },
                                    'Fruits': {
                                        name: 'Fruits',
                                        data: [
                                            ['Apples', 5],
                                            ['Oranges', 7],
                                            ['Bananas', 2]
                                        ]
                                    },
                                    'Cars': {
                                        name: 'Cars',
                                        data: [
                                            ['Toyota', 1],
                                            ['Volkswagen', 2],
                                            ['Opel', 5]
                                        ]
                                    }
                                },
                                series = drilldowns[e.point.name];

                            // Show the loading label
                            chart.showLoading('Simulating Ajax ...');

                            setTimeout(function () {
                                chart.hideLoading();
                                chart.addSeriesAsDrilldown(e.point, series);
                            }, 1000);
                        }

                    }
                }
            },
            title: {
                text: 'Async drilldown'
            },
            xAxis: {
                type: 'category'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Things',
                colorByPoint: true,
                data: [{
                    name: 'Animals',
                    y: 5,
                    drilldown: true
                }, {
                    name: 'Fruits',
                    y: 2,
                    drilldown: true
                }, {
                    name: 'Cars',
                    y: 4,
                    drilldown: true
                }]
            }],
            drilldown: {
                series: []
            }
        });

        chart.options.drilldown.animation = false;

        assert.equal(
            chart.series[0].name,
            'Things',
            'Warming up'
        );

        // Click first point
        Highcharts.fireEvent(chart.series[0].points[0], 'click');
        assert.equal(
            chart.series[0].name,
            'Things',
            '0 ms - no changes'
        );

        setTimeout(function () {
            assert.equal(
                chart.series[0].name,
                'Things',
                '600 ms - no changes'
            );
            assert.equal(
                chart.loadingShown,
                true,
                '600 ms - loading shown'
            );
        }, 600);

        setTimeout(function () {
            assert.equal(
                chart.series[0].name,
                'Animals',
                '1200 ms - drilled down'
            );

            assert.equal(
                chart.loadingShown,
                false,
                '1200 ms - loading hidden'
            );

            done();
        }, 1200);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }
});