$(function () {
    QUnit.test("Errors on stacked area with log axis and odd series length", function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'area'
            },

            plotOptions: {
                area: {
                    stacking: 'normal'
                }
            },

            yAxis: {
                type: 'logarithmic'
            },

            series: [
                {
                    data: [1, 1, 1]
                },
                {
                    data: [1, 1]
                }
            ]

        }).highcharts();

        assert.strictEqual(
            chart.series[1].area.attr('d').indexOf('Infinity'),
            -1,
            'Valid path'
        );

    });

});