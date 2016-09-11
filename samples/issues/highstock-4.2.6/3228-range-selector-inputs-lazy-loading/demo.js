$(function () {
    QUnit.test('RangeSelector inputs setting range based on navigator xAxis.', function (assert) {
        var min = Date.UTC(2000, 0, 1),
            middle = Date.UTC(2005, 0, 1),
            max = Date.UTC(20010, 0, 1),
            chart = $('#container').highcharts('StockChart', {
                navigator: {
                    adaptToUpdatedData: false,
                    series: []
                },
                xAxis: {
                    events: {
                        afterSetExtremes: function () {
                            this.series[0].setData([[middle, 20], [max, 100]]);
                        }
                    }
                },
                series: [{
                    data: [
              [min, 10],
              [middle, 11],
              [max, 10]
                    ]
                }]
            }).highcharts();


        chart.xAxis[0].setExtremes(middle, max);
        chart.rangeSelector.minInput.value = '2000-01-01';
        chart.rangeSelector.minInput.onkeypress({ keyCode: 13 });
    // onkeypress

        assert.strictEqual(
      chart.xAxis[0].min,
      min,
      'Correct extremes in xAxis'
    );
    });
});