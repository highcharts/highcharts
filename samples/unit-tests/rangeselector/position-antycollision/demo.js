QUnit.test('Inputs and buttons aligning.', function (assert) {

    var align = ['left', 'center', 'right'],
        series = [{
            data: (function () {
                var arr = [];
                for (var i = 0; i < 2000; i++) {
                    arr.push(i);
                }
                return arr;
            }()),
            pointInterval: 24 * 36e5
        }],
        chart,
        inputGroup,
        buttonGroup,
        inputPosition,
        buttonPosition,
        inputGroupX,
        inputGroupWidth,
        buttonGroupX,
        buttonGroupWidth;

    for (var i = 0; i < align.length; i++) {
        chart = Highcharts.stockChart('container', {

            chart: {
                width: 400
            },

            rangeSelector: {
                buttonPosition: {
                    align: align[i]
                },
                inputPosition: {
                    align: align[align.length - i - 1]
                }
            },

            series: series
        });

        inputGroup = chart.rangeSelector.inputGroup;
        buttonGroup = chart.rangeSelector.buttonGroup;
        inputPosition = chart.options.rangeSelector.inputPosition || {};
        buttonPosition = chart.options.rangeSelector.buttonPosition || {};

        inputGroupX = inputGroup.translateX + (inputGroup.alignOptions && inputGroup.alignOptions.x);
        inputGroupWidth = inputGroup.alignOptions && inputGroup.alignOptions.width;

        buttonGroupX = buttonGroup.translateX;
        buttonGroupWidth = buttonGroup.getBBox().width + 10;

        assert.strictEqual( // detect collision
            ((inputPosition.align === buttonPosition.align) ||
            ((buttonGroupX + buttonGroupWidth > inputGroupX) &&
            (inputGroupX + inputGroupWidth > buttonGroupX))) &&
            (inputGroup.translateY > buttonGroup.translateY), // check if input group is lower
            true,
            'rangeSelector'
        );
    }
});

QUnit.test('Aligning after updates.', function (assert) {

    var series = [{
            data: (function () {
                var arr = [];
                for (var i = 0; i < 2000; i++) {
                    arr.push(i);
                }
                return arr;
            }()),
            pointInterval: 24 * 36e5
        }],
        inputGroup,
        buttonGroup,
        inputPosition,
        buttonPosition,
        inputGroupX,
        inputGroupWidth,
        buttonGroupX,
        buttonGroupWidth;

    var chart = Highcharts.stockChart('container', {

        chart: {
            width: 800
        },

        rangeSelector: {
            buttonPosition: {
                align: 'left'
            },
            inputPosition: {
                align: 'right'
            }
        },

        series: series
    });

    chart.setSize(400);

    inputGroup = chart.rangeSelector.inputGroup;
    buttonGroup = chart.rangeSelector.buttonGroup;
    inputPosition = chart.options.rangeSelector.inputPosition || {};
    buttonPosition = chart.options.rangeSelector.buttonPosition || {};

    inputGroupX = inputGroup.translateX + (inputGroup.alignOptions && inputGroup.alignOptions.x);
    inputGroupWidth = inputGroup.alignOptions && inputGroup.alignOptions.width;

    buttonGroupX = buttonGroup.translateX;
    buttonGroupWidth = buttonGroup.getBBox().width + 10;

    assert.strictEqual( // detect collision
        ((inputPosition.align === buttonPosition.align) ||
        ((buttonGroupX + buttonGroupWidth > inputGroupX) &&
        (inputGroupX + inputGroupWidth > buttonGroupX))) &&
        (inputGroup.translateY > buttonGroup.translateY), // check if input group is lower
        true,
        'rangeSelector'
    );

    chart.update({
        rangeSelector: {
            buttonPosition: {
                align: 'right',
                y: 20
            },
            inputPosition: {
                align: 'left'
            }
        }

    });

    inputGroup = chart.rangeSelector.inputGroup;
    buttonGroup = chart.rangeSelector.buttonGroup;
    inputPosition = chart.options.rangeSelector.inputPosition || {};
    buttonPosition = chart.options.rangeSelector.buttonPosition || {};

    inputGroupX = inputGroup.translateX + (inputGroup.alignOptions && inputGroup.alignOptions.x);
    inputGroupWidth = inputGroup.alignOptions && inputGroup.alignOptions.width;

    buttonGroupX = buttonGroup.translateX;
    buttonGroupWidth = buttonGroup.getBBox().width + 10;

    assert.strictEqual( // detect collision
        ((inputPosition.align === buttonPosition.align) ||
        ((buttonGroupX + buttonGroupWidth > inputGroupX) &&
        (inputGroupX + inputGroupWidth > buttonGroupX))) &&
        (inputGroup.translateY > buttonGroup.translateY), // check if input group is lower
        true,
        'rangeSelector'
    );
});

QUnit.test('Collision with bottom legend', function (assert) {

    var series = [{
        data: (function () {
            var arr = [];
            for (var i = 0; i < 2000; i++) {
                arr.push(i);
            }
            return arr;
        }()),
        pointInterval: 24 * 36e5
    }];

    var chart = Highcharts.stockChart('container', {

        chart: {
            width: 400
        },

        legend: {
            enabled: true
        },

        rangeSelector: {
            verticalAlign: 'bottom'
        },

        series: series
    });

    assert.strictEqual(
        chart.legend.group.translateY > chart.rangeSelector.group.translateY,
        true,
        'rangeSelector'
    );
});


QUnit.test('x and y parameters', function (assert) {

    var series = [{
        data: (function () {
            var arr = [];
            for (var i = 0; i < 2000; i++) {
                arr.push(i);
            }
            return arr;
        }()),
        pointInterval: 24 * 36e5
    }];

    var chart = Highcharts.stockChart('container', {

        chart: {
            width: 800
        },

        legend: {
            enabled: true
        },

        rangeSelector: {
            verticalAlign: 'top',
            inputPosition: {
                align: 'right',
                y: 150
            },
            buttonPosition: {
                align: 'left',
                y: 0
            }
        },

        series: series
    });

    assert.strictEqual(
        chart.rangeSelector.inputGroup.translateY > chart.options.rangeSelector.inputPosition.y,
        true,
        'rangeSelector'
    );
});


QUnit.test('button width', function (assert) {

    var series = [{
            data: (function () {
                var arr = [];
                for (var i = 0; i < 2000; i++) {
                    arr.push(i);
                }
                return arr;
            }()),
            pointInterval: 24 * 36e5
        }],
        inputGroup,
        buttonGroup,
        inputPosition,
        buttonPosition,
        inputGroupX,
        inputGroupWidth,
        buttonGroupX,
        buttonGroupWidth;

    var chart = Highcharts.stockChart('container', {

        chart: {
            width: 800
        },

        legend: {
            enabled: true
        },

        rangeSelector: {
            buttonTheme: {
                width: 200
            },
            buttons: [{
                type: 'ytd',
                count: 1,
                text: 'YTD - 31 of Dec',
                offsetMin: -24 * 3600 * 1000
            }, {
                type: 'ytd',
                count: 1,
                text: 'YTD - 1st of Jan',
                offsetMax: 0 // default
            }, {
                type: 'all',
                text: 'All'
            }]
        },

        series: series
    });

    inputGroup = chart.rangeSelector.inputGroup;
    buttonGroup = chart.rangeSelector.buttonGroup;
    inputPosition = chart.options.rangeSelector.inputPosition || {};
    buttonPosition = chart.options.rangeSelector.buttonPosition || {};

    inputGroupX = inputGroup.translateX + (inputGroup.alignOptions && inputGroup.alignOptions.x);
    inputGroupWidth = inputGroup.alignOptions && inputGroup.alignOptions.width;

    buttonGroupX = buttonGroup.translateX;
    buttonGroupWidth = buttonGroup.getBBox().width + 10;

    assert.strictEqual(
        ((inputPosition.align === buttonPosition.align) ||
        ((buttonGroupX + buttonGroupWidth > inputGroupX) &&
        (inputGroupX + inputGroupWidth > buttonGroupX))) &&
        (inputGroup.translateY > buttonGroup.translateY), // check if input group is lower
        true,
        'rangeSelector'
    );
});