
QUnit.test('Update navigator data', function (assert) {
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
    assert.strictEqual(chart.navigator.series[1].data.length, 4, 'Navigator series has 4 points');
    chart.series[1].update({
        navigatorOptions: {
            data: [5, 5, 5, 5, 5, 5]
        }
    });
    assert.strictEqual(chart.navigator.series[1].data.length, 6, 'Navigator series has 6 points');
});


QUnit.test('Do not update navigator data', function (assert) {
    var chart = Highcharts.stockChart('container', {
        navigator: {
            adaptToUpdatedData: false
        },
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
    assert.strictEqual(chart.navigator.series[1].data.length, 4, 'Navigator series has 4 points');
    chart.series[1].update({
        navigatorOptions: {
            data: [5, 5, 5, 5, 5, 5]
        }
    });
    chart.series[1].setData([1, 2, 3, 5, 6, 7, 8, 9, 10]);
    chart.series[0].setData([5, 4, 8, 9, 1, 1, 2, 3, 4]);
    chart.series[0].update({
        color: '#f00'
    });
    assert.strictEqual(chart.navigator.series[0].data.length, 4, 'Navigator series still has 4 points');
    assert.strictEqual(chart.navigator.series[1].data.length, 4, 'Navigator series still has 4 points');
});


QUnit.test('Do not update navigator data with explicit data set', function (assert) {
    var chart = Highcharts.stockChart('container', {
        navigator: {
            adaptToUpdatedData: false,
            series: [{
                data: [1, 2, 3, 4, 5]
            }]
        },
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
    assert.strictEqual(chart.navigator.series[0].data.length, 5, 'Navigator series has 5 points');
    chart.series[1].update({
        navigatorOptions: {
            data: [5, 5, 5, 5, 5, 5]
        }
    });
    chart.series[1].setData([1, 2, 3, 5, 6, 7, 8, 9, 10]);
    chart.series[0].setData([5, 4, 8, 9, 1, 1, 2, 3, 4]);
    chart.series[0].update({
        color: '#f00'
    });
    assert.strictEqual(chart.navigator.series[0].data.length, 5, 'Navigator series still has 5 points');
});
