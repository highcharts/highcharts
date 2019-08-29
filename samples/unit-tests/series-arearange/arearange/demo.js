QUnit.test('Range series data labels(#4421)', function (assert) {

    var data = [],
        i;
    for (i = 0; i < 100; i++) {
        data.push([i, i + 100]);
    }

    $('#container').highcharts({
        chart: {
            type: 'arearange'
        },
        rangeSelector: {
            selected: 0
        },
        series: [{
            data: data,
            dataLabels: {
                enabled: true
            }
        }]

    });

    var chart = $('#container').highcharts();

    assert.strictEqual(
        chart.series[0].points[0].dataLabelUpper.attr('opacity'),
        1,
        'First label visible'
    );
    assert.strictEqual(
        chart.series[0].points[1].dataLabelUpper.attr('opacity'),
        0,
        'Second label hidden'
    );

});

QUnit.test('Area range with compare (#4922) and NaN (#11513)', function (assert) {
    var chart = Highcharts.stockChart('container', {

        chart: {
            type: 'arearange'
        },

        plotOptions: {
            series: {
                compare: 'percent'
            }
        },

        series: [{
            data: [
                [0, NaN, NaN], // #11513
                [0, 3, 4],
                [1, 4, 6],
                [2, 2, 3]
            ]
        }]
    });

    assert.strictEqual(
        typeof chart.yAxis[0].min,
        'number',
        'The Y axis extremes should be valid (#11513)'
    );

    assert.ok(
        typeof chart.series[0].graph.element.getAttribute('d'),
        'string',
        'We have a graph'
    );
    assert.ok(
        typeof chart.series[0].area.element.getAttribute('d'),
        'string',
        'We have an area'
    );

});