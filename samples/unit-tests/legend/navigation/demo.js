QUnit.test(
    'Pages and navigation of legend',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 250
            },
            legend: {
                maxHeight: 47,
                itemStyle: {
                    fontSize: '11px'
                }
            },
            series: [{}, {}, {}, {}, {}, {}, {}, {}]
        });

        assert.strictEqual(
            chart.legend.pages.length,
            4,
            'There should be enough pages to fully fit all elements (#13683)'
        );

        chart.update({
            chart: {
                width: 440
            },
            legend: {
                maxHeight: 40,
                itemStyle: {
                    fontSize: '12px'
                }
            }
        }, false);
        chart.addSeries({});

        assert.strictEqual(
            chart.legend.pages.length,
            3,
            'The last item should not be omitted (#18768)'
        );
    }
);
