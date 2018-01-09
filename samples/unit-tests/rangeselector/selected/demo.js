QUnit.test('Fixed range for initial range (#5930)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 600,
            animation: false
        },
        rangeSelector: {
            selected: 1
        },
        series: [{
            name: 'AAPL',
            data: (function () {
                var arr = [];
                for (var i = 0; i < 2000; i++) {
                    arr.push(i);
                }
                return arr;
            }()),
            pointInterval: 24 * 36e5,
            animation: false
        }]
    });

    assert.strictEqual(
        chart.rangeSelector.selected,
        1,
        'Initiallly selected'
    );

    chart.setSize(800);



    assert.strictEqual(
        chart.rangeSelector.selected,
        1,
        'Still selected'
    );
});

QUnit.test('Initially selected when crossing DST (#7458)', function (assert) {

    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 0
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL',
            data: [
                [Date.UTC(2016, 10, 25), 1],
                [Date.UTC(2016, 11, 25), 1],
                [Date.UTC(2017, 0, 25), 1],
                [Date.UTC(2017, 1, 25), 1],
                [Date.UTC(2017, 2, 25), 1],
                [Date.UTC(2017, 3, 25), 1],
                [Date.UTC(2017, 4, 25), 1],
                [Date.UTC(2017, 5, 25), 1],
                [Date.UTC(2017, 6, 25), 1],
                [Date.UTC(2017, 7, 25), 1],
                [Date.UTC(2017, 8, 25), 1],
                [Date.UTC(2017, 9, 25), 1],
                [Date.UTC(2017, 10, 23), 1],
                [Date.UTC(2017, 10, 24), 1],
                [Date.UTC(2017, 10, 25), 1]
            ],
            dataGrouping: {
                enabled: false
            }
        }]
    });

    assert.notEqual(
        chart.container.querySelectorAll(
            '.highcharts-range-selector-buttons g.highcharts-button'
        )[0]
            .getAttribute('class')
            .indexOf('highcharts-button-pressed'),
        -1,
        'The 1M button should be pressed initially'
    );
});

QUnit.test('Fixed range for initial range after add points (#6830)', function (assert) {
    var done = assert.async();

    Highcharts.stockChart('container', {
        chart: {
            events: {
                load: function () {
                    var chart = this,
                        now = +new Date(),
                        series = chart.series[0];

                    chart.addSeries({
                        showInNavigator: true,
                        data: [
                            [now - 10000, 50],
                            [now, 50]
                        ]
                    });

                    series.addPoint([now + 7000, Math.random() * 100], false, false, false);

                    chart.redraw();

                    assert.strictEqual(
                        chart.rangeSelector.buttonOptions[  // eslint-disable-line no-underscore-dangle
                            chart.rangeSelector.selected
                        ]._range,
                        chart.xAxis[0].max - chart.xAxis[0].min,
                        'Correct extremes on xAxis'
                    );
                    done();
                }
            }
        },
        rangeSelector: {
            buttons: [{
                count: 10,
                type: 'second',
                text: '10sec'
            }, {
                type: 'all',
                text: 'All'
            }],
            selected: 0
        },
        xAxis: {
            minRange: 10000
        },
        series: [{
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = +new Date(),
                    i;

                for (i = -3; i <= 0; i += 1) {
                    data.push([
                        time + i * 1000,
                        Math.round(Math.random() * 100)
                    ]);
                }
                return data;
            }())
        }]
    });
});

QUnit.test('Chart should be initialised when xAxis.min and rangeselector.selected are defined. (#602)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 3 // YTD
        },
        series: [{
            data: [1, 2, 3]
        }],
        xAxis: [{
            max: 1
        }]
    });

    assert.deepEqual(
        chart.xAxis[0].oldMax !== null,
        true,
        'Chart is initialised.'
    );
});

QUnit.test('JS error on range selector in non-Highstock (#5330)', function (assert) {

    assert.expect(0); // We just expect it to not throw

    Highcharts.chart('container', {
        rangeSelector: {
            enabled: true,
            selected: 1
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            name: 'AAPL',
            data: [1, 3, 2, 4, 3, 5, 4, 6],
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});

QUnit.test('1Y button should be selected. (#7467)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 0,
            buttons: [{
                type: 'year',
                count: 1,
                offsetMin: -1 * 24 * 3600 * 1000,
                text: '1y'
            }]
        },
        series: [{
            data: (function () {
                var arr = [];
                for (var i = 0; i < 2000; i++) {
                    arr.push(i);
                }
                return arr;
            }()),
            pointInterval: 24 * 36e5
        }]
    });

    assert.strictEqual(
        chart.container.querySelectorAll(
            '.highcharts-range-selector-buttons g.highcharts-button'
        )[0]
            .getAttribute('class')
            .indexOf('highcharts-button-pressed') > -1,
        true,
        '1Y initiallly selected'
    );
});