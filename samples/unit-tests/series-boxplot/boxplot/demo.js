$(function () {

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
});