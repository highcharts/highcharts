QUnit.test(
    'hover:lineWidth and hover:lineWidthPlus (#4035)',
    function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
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
                    data: [1, 3, 2, 4],
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 4,
                            lineWidthPlus: 2
                        }
                    }
                }
            ]
        });

        assert.equal(
            chart.series[0].graph.element.getAttribute('stroke-width'),
            '2',
            'normal'
        );

        chart.series[0].points[0].onMouseOver();

        assert.equal(
            chart.series[0].graph.element.getAttribute('stroke-width'),
            '4',
            'hover'
        );

        assert.strictEqual(
            chart.options.plotOptions.line.dataLabels[0].y,
            -10,
            'Multiple data labels in plot options (#21928).' +
            'Distance should not be merged with defaults'
        );

        assert.strictEqual(
            chart.options.plotOptions.line.dataLabels[0].x,
            0,
            'Multiple data labels in plot options (#21928).' +
            'x should be merged with defaults'
        );
    }
);

QUnit.test(
    'Highcharts Stock hover:lineWidth and hover:lineWidthPlus',
    function (assert) {
        var chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'container'
            },
            series: [
                {
                    data: [1, 3, 2, 4],
                    lineWidth: 3,
                    states: {
                        hover: {
                            lineWidthPlus: 3
                        }
                    }
                }
            ]
        });

        assert.equal(
            chart.series[0].graph.element.getAttribute('stroke-width'),
            '3',
            'normal'
        );

        chart.series[0].points[0].onMouseOver();

        assert.equal(
            chart.series[0].graph.element.getAttribute('stroke-width'),
            '6',
            'hover'
        );
    }
);
