QUnit.test('Point.dataLabels options should have higher priority than activeDataLabelStyle (#6752).',
    function (assert) {
        var red = 'red',
            chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                series: [{
                    data: [{
                        y: 5,
                        drilldown: 'main',
                        dataLabels: {
                            enabled: true,
                            style: {
                                color: red
                            }
                        }
                    }, {
                        y: 2,
                        drilldown: 'fruits',
                        dataLabels: {
                            enabled: true,
                            color: red
                        }
                    }]
                }]
            }),
            points = chart.series[0].points;

        assert.strictEqual(
            points[0].dataLabel.text.styles.color,
            red,
            'Point dataLabels.style.color works.'
        );

        assert.strictEqual(
            points[1].dataLabel.text.styles.color,
            red,
            'Point dataLabels.color works.'
        );
    }
);
