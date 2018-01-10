QUnit.test('Column width calculated correctly when using a linked xAxis (#5923).', function (assert) {
    var chart = $('#container').highcharts('StockChart', {
        chart: {
            width: 700
        },
        plotOptions: {
            series: {
                pointStart: Date.UTC(2016, 1, 1),
                pointInterval: 36e5 * 24
            }
        },

        xAxis: [{}, {
            linkedTo: 0,
            visible: false
        }],

        series: [{
            data: (function () {
                var data = [],
                    i = 0;
                for (; i < 100; i++) {
                    data.push(i % 5);
                }
                return data;
            }()),
            tooltip: {
                valueDecimals: 2
            }
        }, {
            type: 'column',
            xAxis: 1,
            data: (function () {
                var data = [],
                    i = 0;
                for (; i < 100; i++) {
                    data.push(i % 5);
                }
                return data;
            }())
        }]
    }).highcharts();

    assert.strictEqual(
		chart.series[1].columnMetrics.width < 5,
		true,
		'column width is correctly calculated'
	);
});