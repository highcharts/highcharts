$(function () {

    QUnit.test('Adapt height', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 400,
                animation: false
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            series: [{
                data: [1, 3, 2, 5]
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 300
                        }
                    }
                }]
            }
        });

        chart.setSize(400);

        assert.strictEqual(
            chart.chartWidth,
            400,
            'Width updated'
        );
        assert.strictEqual(
            chart.chartHeight,
            300,
            'Height updated'
        );

        chart.setSize(600);

        assert.strictEqual(
            chart.chartWidth,
            600,
            'Width reset'
        );
        assert.strictEqual(
            chart.chartHeight,
            400,
            'Height reset'
        );
    });

    QUnit.test('Callback', function (assert) {

        var condition = true;

        var chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 400,
                animation: false
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            series: [{
                data: [1, 3, 2, 5]
            }],
            responsive: {
                rules: [{
                    condition: {
                        callback: function () {
                            return condition;
                        }
                    },
                    chartOptions: {
                        chart: {
                            width: 300
                        }
                    }
                }]
            }
        });

        assert.strictEqual(
            chart.chartWidth,
            300,
            'Width updated'
        );
    });
});
