$(function () {
    var chart;
    QUnit.test('Set options on navigator series', function (assert) {
        chart = Highcharts.stockChart('container', {
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [{
                data: [1, 2, 5, 4]
            }, {
                data: [5, 5, 4, 5],
                navigatorOptions: {
                    color: '#f00'
                }
            }]
        });
        assert.strictEqual(chart.navigator.series[1].color, '#f00', 'Second navigator series is red');
    });

    QUnit.test('Set navigator options on chart', function (assert) {
        chart = Highcharts.stockChart('container', {
            navigator: {
                series: {
                    color: '#f00'
                }
            },
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [{
                data: [1, 2, 5, 4]
            }, {
                data: [5, 5, 4, 5]
            }]
        });
        assert.strictEqual(chart.navigator.series[0].color, '#f00', 'First navigator series is red');
        assert.strictEqual(chart.navigator.series[1].color, '#f00', 'Second navigator series is red');
    });

    QUnit.test('Set navigator options on both chart and series', function (assert) {
        chart = Highcharts.stockChart('container', {
            navigator: {
                series: {
                    color: '#f00'
                }
            },
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [{
                data: [1, 2, 5, 4]
            }, {
                data: [5, 5, 4, 5],
                navigatorOptions: {
                    color: '#0f0'
                }
            }]
        });
        assert.strictEqual(chart.navigator.series[0].color, '#f00', 'First navigator series is red');
        assert.strictEqual(chart.navigator.series[1].color, '#0f0', 'Second navigator series is green');
    });

    QUnit.test('Set navigator data on series', function (assert) {
        chart = Highcharts.stockChart('container', {
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [{
                data: [1, 2, 5, 4]
            }, {
                data: [5, 5, 4, 5],
                navigatorOptions: {
                    data: [2, 3, 2, 3, 2, 3, 2, 3]
                }
            }]
        });
        assert.strictEqual(chart.navigator.series[1].data.length, 8, 'Second navigator series data set');
    });

    QUnit.test('Set navigator data on chart', function (assert) {
        chart = Highcharts.stockChart('container', {
            navigator: {
                series: {
                    data: [2, 3, 2, 3, 2, 3, 2, 3]
                }
            },
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [{
                data: [1, 2, 5, 4]
            }, {
                data: [5, 5, 4, 5]
            }]
        });
        assert.strictEqual(chart.navigator.series[0].data.length, 8, 'First navigator series data set');
        assert.strictEqual(chart.navigator.series[1].data.length, 8, 'Second navigator series data set');
    });

    QUnit.test('Pure navigator series, data set on chart', function (assert) {
        chart = Highcharts.stockChart('container', {
            navigator: {
                series: {
                    data: [2, 3, 2, 3, 2, 3, 2, 3]
                }
            },
            series: [{
                showInNavigator: false,
                data: [1, 2, 5, 4]
            }, {
                showInNavigator: true
            }]
        });
        assert.strictEqual(chart.navigator.series[0].data.length, 8, 'Pure navigator series data set');
    });

    QUnit.test('Pure navigator series, data set on series', function (assert) {
        chart = Highcharts.stockChart('container', {
            series: [{
                showInNavigator: false,
                data: [1, 2, 5, 4]
            }, {
                showInNavigator: true,
                navigatorOptions: {
                    data: [2, 3, 2, 3, 2, 3, 2, 3]
                }
            }]
        });
        assert.strictEqual(chart.navigator.series[0].data.length, 8, 'Pure navigator series data set');
    });

    QUnit.test('Set navigator data on chart and series', function (assert) {
        chart = Highcharts.stockChart('container', {
            navigator: {
                series: {
                    data: [2, 3, 2, 3, 2, 3, 2, 3]
                }
            },
            plotOptions: {
                series: {
                    showInNavigator: true
                }
            },
            series: [{
                data: [1, 2, 5, 4]
            }, {
                data: [5, 5, 4, 5],
                navigatorOptions: {
                    data: [3, 2, 3, 2, 3, 2]
                }
            }]
        });
        assert.strictEqual(chart.navigator.series[0].data.length, 8, 'First navigator series data set');
        assert.strictEqual(chart.navigator.series[1].data.length, 6, 'Second navigator series data set');
    });
});
