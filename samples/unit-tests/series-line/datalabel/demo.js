QUnit.test(
    'Multiple data labels in line plot options (#21928).',
    function (assert) {
        var chart = Highcharts.chart('container', {
            plotOptions: {
                line: {
                    dataLabels: [{
                        enabled: true,
                        y: -10
                    }, {
                        enabled: true,
                        y: 30
                    }]
                }
            },
            series: [
                {
                    type: 'line',
                    name: 'Percentage',
                    colorByPoint: true,
                    data: [4, 3, 5, 6, 2, 3]
                }
            ]
        });

        assert.strictEqual(
            chart.options.plotOptions.line.dataLabels[0].y,
            -10,
            'Distance is defined by user, should not be merged with defaults'
        );

        assert.strictEqual(
            chart.options.plotOptions.line.dataLabels[0].x,
            0,
            'x is not defined by user, merged with defaults'
        );
    });