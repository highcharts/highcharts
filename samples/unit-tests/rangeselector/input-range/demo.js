QUnit.test(
    'RangeSelector inputs setting not affecting each other.',
    assert => {
        var data = [],
            dayFactor = 1000 * 3600 * 24,
            startDate = Date.UTC(2000, 0, 1);

        for (var i = 0; i < 60; ++i) {
            data.push([startDate + i * dayFactor, i]);
        }

        var chart = Highcharts.stockChart('container', {
            series: [
                {
                    data: data
                }
            ]
        });

        chart.rangeSelector.minInput.value = '2000-01-16';
        chart.rangeSelector.minInput.onkeypress({ keyCode: 13 });

        chart.rangeSelector.maxInput.value = '2000-02-16';
        chart.rangeSelector.maxInput.onkeypress({ keyCode: 13 });

        assert.strictEqual(
            chart.xAxis[0].min,
            Date.UTC(2000, 0, 16),
            'xAxis minumum remains correct'
        );
    }
);

QUnit.test(
    'RangeSelector input: Re-setting same ' +
        'date after setting extremes in other fashion.',
    assert => {
        var data = [],
            dayFactor = 1000 * 3600 * 24,
            startDate = Date.UTC(2000, 0, 1);

        for (var i = 0; i < 60; ++i) {
            data.push([startDate + i * dayFactor, i]);
        }

        var chart = Highcharts.stockChart('container', {
            series: [
                {
                    data: data
                }
            ]
        });

        chart.rangeSelector.minInput.value = '2000-01-16';
        chart.rangeSelector.minInput.onkeypress({ keyCode: 13 });

        chart.rangeSelector.maxInput.value = '2000-02-16';
        chart.rangeSelector.maxInput.onkeypress({ keyCode: 13 });

        assert.strictEqual(
            chart.xAxis[0].max,
            Date.UTC(2000, 1, 16),
            'xAxis maximum correct'
        );

        chart.xAxis[0].setExtremes(startDate, startDate + dayFactor * 5);

        assert.strictEqual(
            chart.xAxis[0].min,
            Date.UTC(2000, 0, 1),
            'xAxis minimum correct'
        );

        chart.rangeSelector.maxInput.value = '2000-02-16';
        chart.rangeSelector.maxInput.onkeypress({ keyCode: 13 });

        assert.strictEqual(
            chart.xAxis[0].max,
            Date.UTC(2000, 1, 16),
            'xAxis maximum correct'
        );
    }
);

QUnit.test('#6537 - 1M button should select range 28.02-31.03', assert => {
    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 0
        },
        time: {
            useUTC: true
        },
        series: [
            {
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
            }
        ]
    });

    assert.strictEqual(
        Highcharts.dateFormat(null, chart.xAxis[0].min),
        '2017-02-28 00:00:00',
        'xAxis minimum shoule be 1 month prior'
    );
});

QUnit.test(
    '#3228 - RangeSelector inputs setting range based on navigator xAxis.',
    function (assert) {
        var min = Date.UTC(2000, 0, 1),
            middle = Date.UTC(2005, 0, 1),
            max = Date.UTC(20010, 0, 1),
            chart = $('#container')
                .highcharts('StockChart', {
                    navigator: {
                        adaptToUpdatedData: false,
                        series: []
                    },
                    xAxis: {
                        events: {
                            afterSetExtremes: function () {
                                this.series[0].setData([
                                    [middle, 20],
                                    [max, 100]
                                ]);
                            }
                        }
                    },
                    series: [
                        {
                            data: [
                                [min, 10],
                                [middle, 11],
                                [max, 10]
                            ]
                        }
                    ]
                })
                .highcharts();

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
    Highcharts.stockChart({
        chart: {
            renderTo: 'container'
        },
        series: [
            {
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
            }
        ]
    });
    $('#container').show();
    assert.strictEqual(
        !!$('#container').highcharts().renderTo.getElementsByTagName('input')
            .length,
        true,
        'Chart has input fields'
    );
});
QUnit.test(
    'Focusable inputs after setting chart\'s zIndex (#8899)',
    assert => {
        var chart = Highcharts.stockChart({
                chart: {
                    renderTo: 'container'
                },
                series: [
                    {
                        data: [1, 2, 3]
                    }
                ]
            }),
            testController = new TestController(chart);

        testController.click(
            chart.rangeSelector.inputGroup.translateX +
                chart.rangeSelector.minDateBox.x +
                15,
            20
        );

        if (
            navigator.userAgent.indexOf('Linux') === -1 &&
            navigator.userAgent.indexOf('Chrome') !== -1
        ) {
            assert.strictEqual(
                document.activeElement.nodeName.toUpperCase(),
                'INPUT',
                'Focused correct elements.'
            );
        } else {
            assert.ok(
                true,
                'Focused correct elements only runs on select browsers'
            );
        }
    }
);

QUnit.test('Check input format', function (assert) {
    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            buttons: [
                {
                    type: 'millisecond',
                    count: 10,
                    text: '10ms'
                },
                {
                    type: 'all',
                    text: 'All'
                }
            ],
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
        series: [
            {
                data: [
                    1,
                    4,
                    2,
                    5,
                    3,
                    6,
                    4,
                    4,
                    6,
                    6,
                    5,
                    5,
                    5,
                    6,
                    6,
                    5,
                    5,
                    4,
                    3,
                    3,
                    3,
                    4,
                    5,
                    5,
                    6,
                    6
                ],
                tooltip: {
                    valueDecimals: 2
                }
            }
        ]
    });

    assert.strictEqual(
        chart.rangeSelector.minDateBox.element.textContent,
        '00:00:00.000',
        'Starts at 0'
    );

    assert.strictEqual(chart.xAxis[0].min, 0, 'Axis is initiated');

    // Activate it and set range
    chart.rangeSelector.showInput('min');
    chart.rangeSelector.minInput.value = '00:00:00.010';
    chart.rangeSelector.minInput.onchange();

    assert.strictEqual(
        chart.rangeSelector.minDateBox.element.textContent,
        '00:00:00.010',
        'Min has changed'
    );

    assert.strictEqual(chart.xAxis[0].min, 10, 'Axis has changed');
});

QUnit.test('Set extremes on inputs blur (#4710)', function (assert) {
    var chart = new Highcharts.StockChart('container', {
            chart: {
                width: 650
            },
            title: false,
            xAxis: {
                min: Date.UTC(2007, 8, 5),
                max: Date.UTC(2007, 8, 20)
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            series: [
                {
                    data: [
                        [Date.UTC(2007, 8, 3), 0.7342],
                        [Date.UTC(2007, 8, 4), 0.7349],
                        [Date.UTC(2007, 8, 5), 0.7326],
                        [Date.UTC(2007, 8, 6), 0.7306],
                        [Date.UTC(2007, 8, 7), 0.7263],
                        [Date.UTC(2007, 8, 10), 0.7247],
                        [Date.UTC(2007, 8, 11), 0.7227],
                        [Date.UTC(2007, 8, 12), 0.7191],
                        [Date.UTC(2007, 8, 13), 0.7209],
                        [Date.UTC(2007, 8, 14), 0.7207],
                        [Date.UTC(2007, 8, 17), 0.7211],
                        [Date.UTC(2007, 8, 18), 0.7153],
                        [Date.UTC(2007, 8, 19), 0.7165],
                        [Date.UTC(2007, 8, 20), 0.7107],
                        [Date.UTC(2007, 8, 21), 0.7097],
                        [Date.UTC(2007, 8, 24), 0.7098],
                        [Date.UTC(2007, 8, 25), 0.7069]
                    ]
                },
                {
                    data: [
                        [Date.UTC(2007, 8, 3), 0.8342],
                        [Date.UTC(2007, 8, 4), 0.8349],
                        [Date.UTC(2007, 8, 5), 0.8326],
                        [Date.UTC(2007, 8, 6), 0.8306],
                        [Date.UTC(2007, 8, 7), 0.8263],
                        [Date.UTC(2007, 8, 10), 0.8247],
                        [Date.UTC(2007, 8, 11), 0.8227],
                        [Date.UTC(2007, 8, 12), 0.8191],
                        [Date.UTC(2007, 8, 13), 0.8209],
                        [Date.UTC(2007, 8, 14), 0.8207],
                        [Date.UTC(2007, 8, 17), 0.8211],
                        [Date.UTC(2007, 8, 18), 0.8153],
                        [Date.UTC(2007, 8, 19), 0.8165],
                        [Date.UTC(2007, 8, 20), 0.8107],
                        [Date.UTC(2007, 8, 21), 0.8097],
                        [Date.UTC(2007, 8, 24), 0.8098],
                        [Date.UTC(2007, 8, 25), 0.8069],
                        [Date.UTC(2007, 8, 26), 0.8078],
                        [Date.UTC(2007, 8, 27), 0.8066],
                        [Date.UTC(2007, 8, 28), 0.8006],
                        [Date.UTC(2007, 8, 29), 0.8050],
                        [Date.UTC(2007, 8, 30), 0.8080]
                    ]
                }
            ]
        }),
        newMin,
        newMax,
        test = new TestController(chart);


    const chartOffset = Highcharts.offset(chart.container);

    const updateExtremes = (dateBoxElement, type, year, month, day) => {

        const dateBoxOffset = Highcharts.offset(
            dateBoxElement
        );

        test.triggerEvent(
            'click',
            dateBoxOffset.left - chartOffset.left + 10,
            dateBoxOffset.top - chartOffset.top + 10,
            {},
            true
        );

        const formattedMonth = month < 10 ? '0' + month : month;

        document.activeElement.value = `${year}-${formattedMonth}-${day}`;

        test.mouseDown(400, 120);
        test.mouseUp();

        const expectedDate = Date.UTC(year, month - 1, day);

        if (type === 'min') {
            newMin = chart.xAxis[0].min;

            assert.strictEqual(
                newMin,
                expectedDate,
                'Min extremes should be updated, considering all relevant series.'
            );
        } else if (type === 'max') {
            newMax = chart.xAxis[0].max;

            assert.strictEqual(
                newMax,
                expectedDate,
                'Max extremes should be updated, considering all relevant series. (#18251)'
            );
        }
    };

    updateExtremes(chart.rangeSelector.maxDateBox.element, 'max', 2007, 9, 29);

    chart.update({
        navigator: {
            enabled: true
        }
    });

    updateExtremes(chart.rangeSelector.maxDateBox.element, 'max', 2007, 9, 27);

    updateExtremes(chart.rangeSelector.minDateBox.element, 'min', 2007, 9, 13);
});

QUnit.test('#13205, #14544: Timezone issues', assert => {
    const chart = Highcharts.stockChart('container', {
        rangeSelector: {
            inputDateFormat: '%Y/%m/%d %H:%M:%S.%L',
            inputBoxWidth: 170,
            inputEditDateFormat: '%Y/%m/%d %H:%M:%S.%L'
        },
        xAxis: {
            tickPixelInterval: 120
        },
        series: [
            {
                name: 0,
                data: [
                    {
                        y: 50000000,
                        x: 1576886400000
                    },
                    {
                        y: 50000000,
                        x: 1577491200000
                    },
                    {
                        y: 50000000,
                        x: 1578096000000
                    },
                    {
                        y: 50000000,
                        x: 1578700800000
                    },
                    {
                        y: 26452797.5,
                        x: 1579305600000
                    },
                    {
                        y: 26477800,
                        x: 1579910400000
                    },
                    {
                        y: 50000000,
                        x: 1580515200000
                    },
                    {
                        y: 50000000,
                        x: 1581120000000
                    },
                    {
                        y: 50000000,
                        x: 1581724800000
                    },
                    {
                        y: 50000000,
                        x: 1582329600000
                    },
                    {
                        y: 50000000,
                        x: 1582934400000
                    },
                    {
                        y: 50000000,
                        x: 1583539200000
                    },
                    {
                        y: 50000000,
                        x: 1584144000000
                    }
                ]
            }
        ]
    });

    const min = chart.xAxis[0].min;

    chart.rangeSelector.minInput.value = '2019/12/23 00:00:00.000';
    chart.rangeSelector.minInput.onchange();
    assert.strictEqual(
        chart.rangeSelector.minInput.value,
        '2019/12/23 00:00:00.000',
        'The input value should not change'
    );

    assert.ok(chart.xAxis[0].min > min, 'Extremes should have been updated');
});

QUnit.test(
    '#14416: Range selector ignored chart.time.timezoneOffset',
    assert => {
        const chart = Highcharts.stockChart('container', {
            time: {
                timezoneOffset: 420
            },
            xAxis: {
                minRange: 3600 * 1000 // one hour
            },
            series: [
                {
                    pointInterval: 24 * 3600 * 1000,
                    data: [1, 3, 2, 4, 3, 5, 4, 6, 3, 4, 2, 3, 1, 2, 1]
                }
            ]
        });

        chart.rangeSelector.minInput.value = '1970-01-10';
        chart.rangeSelector.minInput.onchange();
        assert.strictEqual(
            chart.rangeSelector.minInput.value,
            '1970-01-10',
            'The input value should not change'
        );

        chart.update({
            time: {
                useUTC: false
            }
        });

        chart.rangeSelector.minInput.value = '1970-01-10';
        chart.rangeSelector.minInput.onchange();
        assert.strictEqual(
            chart.rangeSelector.minInput.value,
            '1970-01-10',
            'The input value should not change'
        );
    }
);

QUnit.test('Input types', assert => {
    const supports = type => {
        const el = document.createElement('input');
        el.type = type;
        return el.type === type;
    };

    const chart = Highcharts.stockChart('container', {
        xAxis: {
            minRange: 3600 * 1000 // one hour
        },
        series: [
            {
                pointInterval: 24 * 3600 * 1000,
                data: [1, 3, 2, 4, 3, 5, 4, 6, 3, 4, 2, 3, 1, 2, 1]
            }
        ]
    });

    const axis = chart.xAxis[0];

    const parse = str =>
        Highcharts.RangeSelector.prototype.defaultInputDateParser(
            str,
            chart.time.useUTC,
            chart.time
        );

    [
        () => chart.rangeSelector.minInput,
        () => chart.rangeSelector.maxInput
    ].forEach(input => {
        chart.update({
            rangeSelector: {
                inputDateFormat: '%b %e, %Y'
            }
        });

        if (supports('date')) {
            assert.strictEqual(
                input().type,
                'date',
                'Default format should result in date input'
            );

            assert.notStrictEqual(input().min, '', 'Input min should be set');
            const min = parse(input().min);
            assert.ok(
                min >= axis.min && min <= axis.max - axis.minRange,
                'Min should be within extremes'
            );

            assert.notStrictEqual(input().max, '', 'Input max should be set');
            const max = parse(input().max);
            assert.ok(
                max >= axis.min + axis.minRange && max <= axis.max,
                'Max should be within extremes'
            );
        } else {
            assert.strictEqual(
                input().type,
                'text',
                'Input type should be text when there is no support'
            );
        }

        if (supports('datetime-local')) {
            chart.update({
                rangeSelector: {
                    inputDateFormat: '%b %e, %Y %H:%M:%S'
                }
            });

            assert.strictEqual(
                input().type,
                'datetime-local',
                'Format with date + time should result in datetime-local input'
            );
        }

        if (supports('time')) {
            chart.update({
                rangeSelector: {
                    inputDateFormat: '%H:%M:%S'
                }
            });

            assert.strictEqual(
                input().type,
                'time',
                'Format with time should result in time input'
            );

            chart.update({
                rangeSelector: {
                    inputDateFormat: '%H:%M:%S.%L'
                }
            });

            assert.strictEqual(
                input().type,
                'text',
                'Format with milliseconds should result in text input'
            );
        }
    });
});
