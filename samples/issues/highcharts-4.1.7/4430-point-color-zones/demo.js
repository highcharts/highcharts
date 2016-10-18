$(function () {
    QUnit.test('Point colors within color zones', function (assert) {
        var chart = $('#container').highcharts({
            chart: {
                type: 'area'
            },
            series: [{
                color: '#00FFFF',
                negativeColor: '#FF0000',
                data: [-1, -1, 1]
            }]
        }).highcharts();


        assert.strictEqual(
            chart.series[0].points[0].color,
            '#FF0000',
            'Negative color'
        );
        assert.strictEqual(
            chart.series[0].points[2].color,
            '#00FFFF',
            'Positive color'
        );

    });
});