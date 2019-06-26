QUnit.test('Whiskers set by number and by percentage (string)(#2801)', function (assert) {

    $('#container').highcharts({
        chart: {
            type: 'boxplot',
            width: 405
        },
        plotOptions: {
            series: {
                grouping: false
            }
        },
        series: [{
            whiskerLength: '50%',
            pointWidth: 50,
            data: [
                [760, 801, 848, 895, 965],
                [760, 801, 848, 895, 965]
            ]
        }, {
            whiskerLength: 42,
            data: [
                [2, 760, 801, 848, 895, 965]
            ]
        }]
    });

    var chart = $('#container').highcharts();

    assert.strictEqual(
        chart.series[0].points[0].whiskers.getBBox(true).width,
        25,
        'whiskerLength set by percent'
    );
    assert.strictEqual(
        chart.series[1].points[0].whiskers.getBBox(true).width,
        42,
        'whiskerLength set by number'
    );

});

QUnit.test('Individual fill color (#5770)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'boxplot'
        },

        plotOptions: {
            boxplot: {
                fillColor: 'blue'
            }
        },

        series: [{
            name: 'Observations',
            data: [
                {
                    low: 760,
                    q1: 801,
                    median: 848,
                    q3: 895,
                    high: 965,
                    fillColor: 'red'
                },
                [733, 853, 939, 980, 1080]
            ]
        }]

    });

    assert.strictEqual(
        chart.series[0].points[0].box.element.getAttribute('fill'),
        'red',
        'Individual fill'
    );
    assert.strictEqual(
        chart.series[0].points[1].box.element.getAttribute('fill'),
        'blue',
        'Generic fill'
    );
});

QUnit.test('Individual options and Point.update', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'boxplot'
        },

        series: [{
            data: [
                [760, 801, 848, 895, 965]
            ]
        }]
    });

    var point = chart.series[0].points[0];
    point.update({
        color: 'red',
        fillColor: '#F0F0E0',
        medianColor: '#0C5DA5',
        medianWidth: 3,
        stemColor: '#A63400',
        stemDashStyle: 'dot',
        stemWidth: 1,
        whiskerColor: '#3D9200',
        whiskerWidth: 3
    }, true, false);

    assert.strictEqual(
        point.box.attr('stroke'),
        'red',
        'color'
    );
    assert.strictEqual(
        point.box.attr('fill').toUpperCase(),
        '#F0F0E0',
        'fillColor'
    );
    assert.strictEqual(
        point.medianShape.attr('stroke'),
        '#0C5DA5',
        'medianColor'
    );
    assert.strictEqual(
        point.medianShape.attr('stroke-width'),
        3,
        'medianWidth'
    );

    assert.strictEqual(
        point.stem.attr('stroke'),
        '#A63400',
        'stemColor'
    );

    assert.strictEqual(
        point.stem.attr('stroke-dasharray').replace(/[ px]/g, ''),
        '1,3',
        'stemDashStyle'
    );
    assert.strictEqual(
        point.stem.attr('stroke-width'),
        1,
        'stemWidth'
    );
    assert.strictEqual(
        point.whiskers.attr('stroke'),
        '#3D9200',
        'whiskerColor'
    );
    assert.strictEqual(
        point.whiskers.attr('stroke-width'),
        3,
        'whiskerWidth'
    );
});

QUnit.test(
    'All-null data point should not affect Y axis scale (#7380)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'boxplot'
            },
            series: [{
                name: 'Observations',
                data: [
                    [], // comment this out to get a plot to show up
                    {
                        x: 1,
                        low: 714,
                        q1: 762,
                        median: 817,
                        q3: 870,
                        high: 918
                    }
                ]
            }],
            yAxis: {
                endOnTick: false,
                maxPadding: 0
            }
        });

        assert.strictEqual(
            chart.yAxis[0].max,
            918,
            'Y axis max should consider the one valid point'
        );
    }
);