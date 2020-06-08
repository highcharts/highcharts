QUnit.test('innerSize cannot be greater than size.(#3623)', function (assert) {

    $('#container').highcharts({
        chart: {
            width: 200,
            type: 'pie'
        },
        plotOptions: {
            pie: {
                innerSize: 200
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6]
        }]
    });

    var chart = $('#container').highcharts(),
        center = chart.series[0].center;

    assert.strictEqual(
        center[3] > center[2],
        false,
        'Ok - innerSize is not greater than size'
    );

});

QUnit.test('Percentage inner size', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        plotOptions: {
            pie: {
                innerSize: '50%'
            }
        },
        series: [{
            data: [['Firefox', 44.2], ['IE7', 26.6], ['IE6', 20], ['Chrome', 3.1], ['Other', 5.4]]
        }]
    });

    var series = chart.series[0],
        innerSize = series.options.innerSize;

    assert.equal(
        series.center[3],
        series.center[2] * parseInt(innerSize, 10) / 100,
        'Inner size should be 50% of outer size'
    );

});

QUnit.test('The inner size of a pie with an additional gauge series (#13629).', function (assert) {

    var chart = Highcharts.chart('container', {
        series: [{
            type: 'gauge',
            data: [10]
        }, {
            type: 'pie',
            innerSize: '50%',
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '60%'],
            data: [1, 2, 3]
        }]
    });

    assert.notEqual(
        chart.series[1].center[3],
        0,
        'The innerSize is not equal 0.'
    );
});