QUnit.test('Multiple series in navigator', function (assert) {
    var chart = Highcharts.stockChart('container', {
        plotOptions: {
            series: {
                showInNavigator: true
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }, {
            data: [5, 5, 4, 5]
        }]
    });
    assert.strictEqual(chart.navigator.series.length, 2, 'Navigator has two series');
});

QUnit.test('Setting base series on chart', function (assert) {
    var chart = Highcharts.stockChart('container', {
        navigator: {
            baseSeries: 1
        },
        series: [{
            data: [1, 2, 3, 4]
        }, {
            data: [5, 5, 4, 5]
        }, {
            showInNavigator: true,
            data: [7, 7, 7, 7]
        }, {
            data: [3, 2, 1, 0]
        }]
    });
    assert.strictEqual(chart.navigator.series.length, 2, 'Navigator has two series');
});

QUnit.test('Overriding base series option on chart', function (assert) {
    var chart = Highcharts.stockChart('container', {
        navigator: {
            baseSeries: 1
        },
        series: [{
            data: [1, 2, 3, 4]
        }, {
            showInNavigator: false,
            data: [5, 5, 4, 5]
        }, {
            showInNavigator: true,
            data: [7, 7, 7, 7]
        }, {
            data: [3, 2, 1, 0]
        }]
    });
    assert.strictEqual(chart.navigator.series.length, 1, 'Navigator has one series');
});

QUnit.test('3 of 4 series shown in navigator', function (assert) {
    var chart = Highcharts.stockChart('container', {
        plotOptions: {
            series: {
                showInNavigator: true
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }, {
            data: [5, 5, 4, 5]
        }, {
            showInNavigator: false,
            data: [7, 7, 7, 7]
        }, {
            data: [3, 2, 1, 0]
        }]
    });
    assert.strictEqual(chart.navigator.series.length, 3, 'Navigator has three series');
});

QUnit.test('No series in navigator', function (assert) {
    var chart = Highcharts.stockChart('container', {
        plotOptions: {
            series: {
                showInNavigator: false
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }, {
            data: [5, 5, 4, 5]
        }]
    });
    assert.strictEqual(chart.navigator.series.length, 0, 'Navigator has no series');
});
