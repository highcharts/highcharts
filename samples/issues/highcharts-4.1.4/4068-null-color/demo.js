$(function () {
    QUnit.test('Null color in pie', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'pie'
            },

            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },

            series: [{
                data: [1, 2, {
                    y: 3,
                    color: null
                }, 4]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].points[2].graphic.attr('fill'),
            Highcharts.getOptions().colors[2],
            'Null'
        );
    });


    QUnit.test('Null color in column', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'column'
            },

            plotOptions: {
                series: {
                    colorByPoint: true
                }
            },

            series: [{
                data: [1, 2, {
                    y: 3,
                    color: null
                }, 4]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].points[2].graphic.attr('fill'),
            Highcharts.getOptions().colors[2],
            'Null'
        );
    });

});