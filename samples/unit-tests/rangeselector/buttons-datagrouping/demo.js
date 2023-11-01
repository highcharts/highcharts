QUnit.test('getUnionExtremes', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            animation: false,
            width: 600
        },

        rangeSelector: {
            allButtonsEnabled: true,
            buttons: [
                {
                    type: 'month',
                    count: 3,
                    text: '3M',
                    dataGrouping: {
                        forced: true,
                        units: [['month', [1]]]
                    }
                },
                {
                    type: 'month',
                    count: 6,
                    text: '6M'
                },
                {
                    type: 'all',
                    text: 'All'
                },
                {
                    type: 'all',
                    text: 'ALL G',
                    dataGrouping: {
                        forced: true,
                        units: [['year', null]]
                    }
                }
            ],
            selected: 4
        },

        series: [
            {
                data: (function () {
                    var arr = [];
                    for (var i = 0; i < 1000; i++) {
                        arr.push(i);
                    }
                    return arr;
                }()),
                animation: false,
                pointStart: Date.UTC(2009, 0, 1),
                pointInterval: 24 * 36e5
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].currentDataGrouping.unitName,
        'day',
        'Day grouping'
    );

    assert.strictEqual(
        chart.series[0].currentDataGrouping.count,
        1,
        'Day grouping'
    );

    assert.strictEqual(chart.xAxis[0].min, Date.UTC(2009, 0, 1), 'All');

    assert.strictEqual(chart.xAxis[0].max, Date.UTC(2011, 8, 27), 'All');

    chart.rangeSelector.clickButton(0);

    assert.strictEqual(
        chart.series[0].currentDataGrouping.unitName,
        'month',
        'Month grouping'
    );

    assert.strictEqual(
        chart.series[0].currentDataGrouping.count,
        1,
        'Month grouping'
    );

    assert.strictEqual(chart.xAxis[0].min, Date.UTC(2011, 5, 27), 'All');

    assert.strictEqual(chart.xAxis[0].max, Date.UTC(2011, 8, 27), 'All');

    chart.series[0].update({
        type: 'column',
        data: [
            [1501632000000, 0],
            [1504310400000, 0],
            [1506643200000, 4],
            [1506729600000, 0],
            [1506816000000, 2],
            [1506902400000, 4],
            [1506988800000, 2],
            [1507075200000, 1],
            [1507161600000, 2],
            [1507248000000, 1],
            [1507334400000, 2],
            [1507420800000, 2],
            [1507507200000, 1],
            [1507593600000, 1],
            [1507680000000, 3],
            [1507766400000, 0],
            [1507852800000, 0],
            [1507939200000, 0],
            [1508025600000, 1],
            [1509494400000, 0]
        ]
    });

    chart.rangeSelector.clickButton(0);
    chart.rangeSelector.clickButton(3);

    assert.ok(
        chart.series[0].points[0].isInside,
        'Column rendered inside the given range (#7827).'
    );

    assert.strictEqual(
        chart.xAxis[0].tickPositions.length,
        2,
        'Two xAxis ticks rendered (#7827).'
    );

    chart.update({
        rangeSelector: {
            selected: 0,
            buttons: [
                {
                    type: 'month',
                    count: 3,
                    text: '3M',
                    preserveDataGrouping: true,
                    dataGrouping: {
                        forced: true,
                        units: [['month', [1]]]
                    }
                }
            ]
        }
    });

    chart.xAxis[0].setExtremes(1507507200000, 1507766400000);

    assert.strictEqual(
        chart.series[0].currentDataGrouping &&
            chart.series[0].currentDataGrouping.totalRange,
        2419200000,
        'Correct button selected when preserveDataGrouping=true (#8433).'
    );
});

(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@2c6e89641888ae94c988649d96552c06c4e47351/samples/data/aapl-ohlcv.json'
    ).then(response => response.json());

    QUnit.test('Range selector with Stock charts', function (assert) {
        const ohlc = [],
            volume = [],
            dataLength = data.length;

        for (let i = 0; i < dataLength; i += 1) {
            ohlc.push([
                data[i][0], // the date
                data[i][1], // open
                data[i][2], // high
                data[i][3], // low
                data[i][4] // close
            ]);

            volume.push([
                data[i][0], // the date
                data[i][5] // the volume
            ]);
        }

        const chart = Highcharts.stockChart('container', {
            yAxis: [{
                labels: {
                    align: 'left'
                }
            }, {
                labels: {
                    align: 'left'
                },
                top: '80%',
                height: '20%',
                offset: 0
            }],
            navigator: {
                enabled: true
            },
            // Two series are needed for this test due to how getGroupPixelWidth
            // works
            series: [{
                type: 'heikinashi',
                id: 'aapl-ohlc',
                name: 'AAPL Stock Price',
                data: ohlc
            }, {
                type: 'column',
                id: 'aapl-volume',
                name: 'AAPL Volume',
                data: volume,
                yAxis: 1
            }]
        });

        chart.rangeSelector.clickButton(0);
        assert.ok(true, 'HeikinAshi chart should not throw errors after selecting 1m.');

        chart.rangeSelector.clickButton(5); // Reset rangeSelector to all

        chart.series[0].update({
            type: 'hollowcandlestick'
        });
        chart.rangeSelector.clickButton(0);
        assert.ok(true, 'Hollow candlestick chart should not throw errors after selecting 1m.');
    });
})();