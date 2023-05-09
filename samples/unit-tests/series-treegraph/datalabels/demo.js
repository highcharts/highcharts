QUnit.test(
    'Disable the pointer events on collapsed points dataLabels (#18891)',
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
            series.data[1].dataLabel.element.style['pointer-events'],
            'none',
            'Hidden data label should have pointer events disabled.'
        );

        series.data[0].update({
            collapsed: false
        });

        assert.notEqual(
            series.data[1].dataLabel.element.style['pointer-events'],
            'none',
            'Visible data label should have pointer events enabled.'
        );
    }
);
