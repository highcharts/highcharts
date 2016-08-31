
$(function () {
    QUnit.test('Shadow follows bubble', function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                type: 'bubble',
                animation: false
            },

            plotOptions: {
                series: {
                    animation: false
                }
            },

            series: [{
                shadow: {
                    enabled: true
                },
                data: [
                    [9, 81, 63],
                    [98, 5, 89],
                    [51, 50, 73]
                ]
            }, {
                data: [
                    [42, 38, 20],
                    [6, 18, 1],
                    [1, 93, 55]
                ]
            }]

        });

        var point = chart.series[0].points[0],
            graphic = point.graphic.element,
            shadow = point.graphic.shadows[0];

        assert.strictEqual(
            graphic.getAttribute('cx'),
            shadow.getAttribute('cx'),
            'Initial cx'
        );
        assert.strictEqual(
            graphic.getAttribute('cy'),
            shadow.getAttribute('cy'),
            'Initial cy'
        );
        assert.strictEqual(
            graphic.getAttribute('r'),
            shadow.getAttribute('r'),
            'Initial r'
        );


        // Let's move
        chart.series[1].hide();

        assert.strictEqual(
            graphic.getAttribute('cx'),
            shadow.getAttribute('cx'),
            'Updated cx'
        );
        assert.strictEqual(
            graphic.getAttribute('cy'),
            shadow.getAttribute('cy'),
            'Updated cy'
        );
        assert.strictEqual(
            graphic.getAttribute('r'),
            shadow.getAttribute('r'),
            'Updated r'
        );

    });


    QUnit.test('Updating shadow on column', function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                type: 'column',
                animation: false
            },

            plotOptions: {
                series: {
                    shadow: true
                }
            },

            series: [{
                data: [1, 2, 3]
            }]

        });

        chart.series[0].points[0].setState('hover');
        assert.ok(true, 'No JS error thrown');

    });
});