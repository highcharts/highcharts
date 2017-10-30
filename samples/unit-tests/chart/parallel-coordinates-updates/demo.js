QUnit.test('Update parallel coordinates plot', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            parallelCoordinates: true,
            parallelAxes: {
                tickAmount: 2
            }
        },
        yAxis: [{
            reversed: true
        }, {
            reversed: false
        }, {
            type: 'category'
        }, {
            type: 'datetime'
        }, {
            type: 'logarithmic'
        }],
        series: [{
            data: [1, 2, 3, 1, 10000, 3, 1, 2, 3, 1000]
        }, {
            data: [5, 10, 12, 3, 0.5, 5, -20, 1000, 9, 10]
        }]
    });

    chart.update({
        chart: {
            parallelAxes: {
                tickAmount: 4
            }
        }
    });
    assert.strictEqual(
        chart.yAxis[0].tickPositions.length,
        4,
        'Number of tick positions changed properly.'
    );


    chart.series[0].update({
        color: 'red'
    });
    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('stroke'),
        'red',
        'Series updated without issues.'
    );


    chart.yAxis[3].update({
        title: {
            text: 'New'
        }
    });

    assert.strictEqual(
        chart.yAxis[3].axisTitle !== undefined,
        true,
        'yAxis updated with new title.'
    );

    chart.update({
        chart: {
            parallelCoordinates: false
        }
    });
    assert.strictEqual(
        chart.hasParallelCoordinates,
        false,
        'Chart is not a parallel coords type.'
    );

    chart.update({
        chart: {
            parallelCoordinates: true
        }
    });
    assert.strictEqual(
        chart.hasParallelCoordinates,
        true,
        'Chart is a parallel coords type again!'
    );

    chart.addSeries({
        data: [null, null, null, 5, 5, 5, null, null, 5, null],
        dataLabels: {
            enabled: true
        }
    });
    assert.strictEqual(
        chart.series[2].points[0].isNull,
        true,
        'First point is null.'
    );
    assert.strictEqual(
        chart.series[2].points[4].dataLabel instanceof Highcharts.SVGElement,
        true,
        'Fourth point has a datalabel.'
    );


});