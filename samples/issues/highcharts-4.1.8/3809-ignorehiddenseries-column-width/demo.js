$(function () {
    QUnit.test('ignoreHiddenSeries after hiding and showing series', function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    ignoreHiddenSeries: false,
                    type: 'column'
                },
                series: [{
                    data: [1, 2, 3]
                }, {
                    data: [1, 2, 3]
                }]
            }).highcharts();

        chart.series[0].hide();
        chart.series[1].hide();
        chart.series[0].show();
        chart.series[1].show();

        assert.strictEqual(
            chart.series[0].barW,
            chart.series[1].barW,
            'All series have the same width.'
        );
        
    });

});