$(function () {
    QUnit.test('normal:lineWidth and hover:lineWidthPlus', function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1,3,2,4],
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidthPlus: 2
                    }
                }
            }]
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
    });

    QUnit.test('hover:lineWidth and hover:lineWidthPlus', function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1,3,2,4],
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 4,
                        lineWidthPlus: 2
                    }
                }
            }]
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
    });

    QUnit.test('Highstock hover:lineWidth and hover:lineWidthPlus', function (assert) {
        var chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'container'
            },
            series: [{
                data: [1,3,2,4],
                lineWidth: 3,
                states: {
                    hover: {
                        lineWidthPlus: 3
                    }
                }
            }]
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
    });

});