QUnit.test(
    'Hide the data labels of hidden points (#18891)',
    function (assert) {
        const chart = Highcharts.chart('container', {
                series: [{
                    type: 'treegraph',
                    data: [{
                        id: 'A',
                        collapsed: true
                    }, {
                        parent: 'A',
                        id: 'BBB'
                    }],
                    dataLabels: {
                        pointFormat: '{point.id}'
                    }
                }]
            }),
            series = chart.series[0];

        assert.strictEqual(
            series.data[1].dataLabel.visibility,
            'hidden',
            'Hidden points shoud have hidden data labels.'
        );

        series.data[0].update({
            collapsed: false
        });

        assert.strictEqual(
            series.data[1].dataLabel.visibility,
            'inherit',
            'Visible points shoud have visible data labels.'
        );
    }
);
