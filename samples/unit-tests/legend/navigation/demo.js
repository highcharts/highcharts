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
    }
);
