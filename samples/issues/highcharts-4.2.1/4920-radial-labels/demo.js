$(function () {
    QUnit.test('Check that tick labels do not move', function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                polar: true,
                animation: false
            },

            xAxis: {
                tickmarkPlacement: 'on',
                categories: ['Category Alpha', 'Category Beta', 'Category Gamma', 'Category Delta']
            },

            yAxis: {
                labels: {
                    enabled: false
                }
            },

            series: [{
                animation: false,
                pointPlacement: 'on',
                data: [150, 100, 125, 150]
            }]

        });

        assert.strictEqual(
            chart.xAxis[0].ticks[1].label.attr('text-anchor'),
            'start',
            'Initially left aligned'
        );


        chart.series[0].data[0].update({
            y: 155
        });

        assert.strictEqual(
            chart.xAxis[0].ticks[1].label.attr('text-anchor'),
            'start',
            'Dynamically left aligned'
        );
    });
});