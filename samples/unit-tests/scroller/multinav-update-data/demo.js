$(function () {
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
});
