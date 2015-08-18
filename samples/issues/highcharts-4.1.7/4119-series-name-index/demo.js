$(function () {
    QUnit.test('Series names with series.index.', function (assert) {
        var chart = $('#container').highcharts({ 
            series: [{
                    index: 5,
                    data: [1, 2, 3]
            },  {
                    index: 3,
                    data: [3, 2, 1]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].name,
            'Series 1',
            'Proper name'
        );

        assert.strictEqual(
            chart.series[1].name,
            'Series 2',
            'Proper name'
        );
        
    });

});