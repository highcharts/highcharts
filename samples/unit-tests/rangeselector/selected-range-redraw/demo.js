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