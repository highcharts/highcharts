$(function () {
    var chart;
    QUnit.test('Adding and removing series, reflect in navigator', function (assert) {
        chart = Highcharts.stockChart('container', {
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
                data: [3, 2, 1, 0]
            }]
        });
        assert.strictEqual(chart.navigator.series.length, 3, 'Navigator has three series');
        chart.addSeries({
            data: [7, 7, 7, 7]
        });
        assert.strictEqual(chart.navigator.series.length, 4, 'Navigator has four series');
        chart.series[0].remove();
        assert.strictEqual(chart.navigator.series.length, 3, 'Navigator has three series');
        chart.series[1].remove();
        assert.strictEqual(chart.navigator.series.length, 2, 'Navigator has two series');
    });

    QUnit.test('Adding and removing points', function (assert) {
        chart = Highcharts.stockChart('container', {
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
                data: [3, 2, 1, 0]
            }]
        });
        assert.strictEqual(chart.navigator.series[1].data.length, 4, 'Navigator series has 4 points');
        chart.series[1].addPoint(5);
        assert.strictEqual(chart.navigator.series[1].data.length, 5, 'Navigator series has 5 points');
        chart.series[1].setData([5, 5, 4, 5, 5, 6]);
        assert.strictEqual(chart.navigator.series[1].data.length, 6, 'Navigator series has 6 points');
        chart.series[1].removePoint(0);
        assert.strictEqual(chart.navigator.series[1].data.length, 5, 'Navigator series has 5 points');
        chart.series[1].points[3].remove();
        assert.strictEqual(chart.navigator.series[1].data.length, 4, 'Navigator series has 4 points');
    });

    QUnit.test('Update options', function (assert) {
        chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 3, 4]
            }, {
                data: [5, 5, 4, 5]
            }]
        });
        assert.strictEqual(chart.navigator.series.length, 1, 'Navigator has one series');
        assert.strictEqual(chart.navigator.series[0], chart.series[0].navigatorSeries, 'Navigator series is first series');
        chart.update({
            navigator: {
                baseSeries: 1
            }
        });
        assert.strictEqual(chart.navigator.series.length, 1, 'Navigator has one series');
        assert.strictEqual(chart.navigator.series[0], chart.series[1].navigatorSeries, 'Navigator series is second series');
        chart.update({
            plotOptions: {
                series: {
                    showInNavigator: false
                }
            }
        });
        assert.strictEqual(chart.navigator.series.length, 0, 'Navigator has no series');
        chart.series[0].update({
            showInNavigator: true,
            navigatorOptions: {
                color: '#f00'
            }
        });
        assert.strictEqual(chart.navigator.series[0].color, '#f00', 'Navigator has one series with changed color');
    });
});
