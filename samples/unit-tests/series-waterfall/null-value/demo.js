QUnit.test(
    'The connector line in waterfall in case of a null value (#18636)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                series: [
                    {
                        type: 'waterfall',
                        data: [120000, null, 231000, -342000, -233000]
                    }
                ]
            }),
            series = chart.series[0];

        assert.strictEqual(
            series.graph.pathArray.length, 4,
            'Connector lines should display correctly with false connectNulls'
        );

        series.update({ connectNulls: true });

        assert.strictEqual(
            series.graph.pathArray.length, 6,
            'Connector lines should display correctly with true connectNulls'
        );
    }
);
