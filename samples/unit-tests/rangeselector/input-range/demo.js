
QUnit.test('RangeSelector inputs setting not affecting each other.', function (assert) {
    var data = [],
        dayFactor = 1000 * 3600 * 24,
        startDate = Date.UTC(2000, 0, 1);

    for (var i = 0; i < 60; ++i) {
        data.push([startDate + i * dayFactor, i]);
    }

    var chart = Highcharts.stockChart('container', {
        series: [{
            data: data
        }]
    });

    chart.rangeSelector.minInput.value = '2000-01-16';
    chart.rangeSelector.minInput.onkeypress({ keyCode: 13 });

    chart.rangeSelector.maxInput.value = '2000-02-16';
    chart.rangeSelector.maxInput.onkeypress({ keyCode: 13 });

    assert.strictEqual(chart.xAxis[0].min, Date.UTC(2000, 0, 16), 'xAxis minumum remains correct');
});

QUnit.test('RangeSelector input: Re-setting same date after setting extremes in other fashion.', function (assert) {
    var data = [],
        dayFactor = 1000 * 3600 * 24,
        startDate = Date.UTC(2000, 0, 1);

    for (var i = 0; i < 60; ++i) {
        data.push([startDate + i * dayFactor, i]);
    }

    var chart = Highcharts.stockChart('container', {
        series: [{
            data: data
        }]
    });

    chart.rangeSelector.minInput.value = '2000-01-16';
    chart.rangeSelector.minInput.onkeypress({ keyCode: 13 });

    chart.rangeSelector.maxInput.value = '2000-02-16';
    chart.rangeSelector.maxInput.onkeypress({ keyCode: 13 });

    assert.strictEqual(chart.xAxis[0].max, Date.UTC(2000, 1, 16), 'xAxis maximum correct');

    chart.xAxis[0].setExtremes(startDate, startDate + dayFactor * 5);

    assert.strictEqual(chart.xAxis[0].min, Date.UTC(2000, 0, 1), 'xAxis minimum correct');

    chart.rangeSelector.maxInput.value = '2000-02-16';
    chart.rangeSelector.maxInput.onkeypress({ keyCode: 13 });

    assert.strictEqual(chart.xAxis[0].max, Date.UTC(2000, 1, 16), 'xAxis maximum correct');
});

QUnit.test('#6537 - 1M button should select range 28.02-31.03', function (assert) {

    Highcharts.setOptions({
        global: {
            useUTC: true
        }
    });
    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 0
        },
        series: [{
            data: [
                [1487721600000, 137.11],
                [1487808000000, 136.53],
                [1487894400000, 136.66],
                [1488153600000, 136.93],
                [1488240000000, 136.99],
                [1488326400000, 139.79],
                [1488412800000, 138.96],
                [1488499200000, 139.78],
                [1488758400000, 139.34],
                [1488844800000, 139.52],
                [1488931200000, 139],
                [1489017600000, 138.68],
                [1489104000000, 139.14],
                [1489363200000, 139.2],
                [1489449600000, 138.99],
                [1489536000000, 140.46],
                [1489622400000, 140.69],
                [1489708800000, 139.99],
                [1489968000000, 141.46],
                [1490054400000, 139.84],
                [1490140800000, 141.42],
                [1490227200000, 140.92],
                [1490313600000, 140.64],
                [1490572800000, 140.88],
                [1490659200000, 143.8],
                [1490745600000, 144.12],
                [1490832000000, 143.93],
                [1490918400000, 143.66]
            ]
        }]
    });

    assert.strictEqual(
        Highcharts.dateFormat(null, chart.xAxis[0].min),
        '2017-02-28 01:00:00',
        'xAxis minimum correct (Timezone: UTC ' +
        Math.round((new Date()).getTimezoneOffset() / -60) + ')'
    );
});

QUnit.test(
    '#3228 - RangeSelector inputs setting range based on navigator xAxis.',
    function (assert) {
        var min = Date.UTC(2000, 0, 1),
            middle = Date.UTC(2005, 0, 1),
            max = Date.UTC(20010, 0, 1),
            chart = $('#container').highcharts('StockChart', {
                navigator: {
                    adaptToUpdatedData: false,
                    series: []
                },
                xAxis: {
                    events: {
                        afterSetExtremes: function () {
                            this.series[0].setData([[middle, 20], [max, 100]]);
                        }
                    }
                },
                series: [{
                    data: [
              [min, 10],
              [middle, 11],
              [max, 10]
                    ]
                }]
            }).highcharts();


        chart.xAxis[0].setExtremes(middle, max);
        chart.rangeSelector.minInput.value = '2000-01-01';
        chart.rangeSelector.minInput.onkeypress({ keyCode: 13 });

        assert.strictEqual(
            chart.xAxis[0].min,
            min,
            'Correct extremes in xAxis'
        );
    }
);

QUnit.test('Input focus of previously hidden chart (#5231)', function (assert) {
    Highcharts.StockChart({
        chart: {
            renderTo: 'container'
        },
        series: [{
            data: [
          [1241136000000, 18.18],
          [1241395200000, 18.87],
          [1241481600000, 18.96],
          [1241568000000, 18.93],
          [1241654400000, 18.44],
          [1241740800000, 18.46],
          [1242000000000, 18.51],
          [1242086400000, 17.77],
          [1242172800000, 17.07]
            ]
        }]
    });
    $('#container').show();
    assert.strictEqual(
        !!$('#container').highcharts().renderTo.getElementsByTagName('input').length,
        true,
        'Chart has input fields'
    );
});
QUnit.test('Focusable inputs after setting chart\'s zIndex (#8899)', function (assert) {
    var chart = Highcharts.StockChart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1, 2, 3]
            }]
        }),
        testController = new TestController(chart);

    testController.click(
        chart.rangeSelector.inputGroup.translateX +
            chart.rangeSelector.minDateBox.x + 15,
        20
    );

    assert.strictEqual(
        document.activeElement.nodeName.toUpperCase(),
        'INPUT',
        'Focused correct elements.'
    );
});

QUnit.test('Check input format', function (assert) {

    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            buttons: [{
                type: 'millisecond',
                count: 10,
                text: '10ms'
            }, {
                type: 'all',
                text: 'All'
            }],
            buttonTheme: {
                width: 50
            },
            inputDateFormat: '%H:%M:%S.%L',
            inputEditDateFormat: '%H:%M:%S.%L',
            // Custom parser to parse the %H:%M:%S.%L format
            inputDateParser: function (value) {
                value = value.split(/[:\.]/);
                return Date.UTC(
                    1970,
                    0,
                    1,
                    parseInt(value[0], 10),
                    parseInt(value[1], 10),
                    parseInt(value[2], 10),
                    parseInt(value[3], 10)
                );
            }
        },
        title: {
            text: 'Milliseconds in range selector inputs'
        },
        xAxis: {
            tickPixelInterval: 120
        },
        series: [{
            data: [1, 4, 2, 5, 3, 6, 4, 4, 6, 6, 5, 5, 5, 6, 6, 5, 5, 4, 3, 3, 3, 4, 5, 5, 6, 6],
            tooltip: {
                valueDecimals: 2
            }
        }]
    });

    assert.strictEqual(
        chart.rangeSelector.minDateBox.element.textContent,
        '00:00:00.000',
        'Starts at 0'
    );

    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Axis is initiated'
    );

    // Activate it and set range
    chart.rangeSelector.showInput('min');
    chart.rangeSelector.minInput.value = '00:00:00.010';
    chart.rangeSelector.minInput.onchange();

    assert.strictEqual(
        chart.rangeSelector.minDateBox.element.textContent,
        '00:00:00.010',
        'Min has changed'
    );

    assert.strictEqual(
        chart.xAxis[0].min,
        10,
        'Axis has changed'
    );

});
