$(function () {
    function getRandomData(start, end) {
        var data = [];

        for (; start <= end; start += (1000 * 60)) {
            data.push([start, Math.random()]);
        }

        return data;
    }

    function equal(a, b, c) {
        return a === b && b === c && c === a;
    }

    QUnit.test('Extremes for xAxis with hidden series and dataGrouping.', function (assert) {
        var min = Date.UTC(2000, 0, 2),
            max = Date.UTC(2000, 0, 4),
            chart = $('#container').highcharts('StockChart', {
                legend: {
                    enabled: true
                },
                series: [{
                    data: getRandomData(Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 5))
                }, {
                    data: getRandomData(min, max)
                }, {
                    data: getRandomData(Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1)),
                    type: 'column',
                    visible: false
                }, {
                    data: getRandomData(Date.UTC(2000, 0, 1), Date.UTC(2001, 0, 1)),
                    type: 'column',
                    visible: false
                }]
            }).highcharts(),
            extremes,
            pointRange;

        chart.series[0].hide();
        extremes = chart.xAxis[0].getExtremes();

        assert.strictEqual(
          equal(extremes.dataMin, extremes.min, min),
          true,
          'Correct minimum: #5493'
        );
        assert.strictEqual(
          equal(extremes.dataMax, extremes.max, max),
          true,
          'Correct maximum: #5493'
        );

        // #5823
        chart.series[0].hide();
        chart.series[1].hide();
        chart.series[2].show();
        chart.series[3].show();
        pointRange = chart.xAxis[0].closestPointRange;
        chart.series[2].hide();

        assert.strictEqual(
          pointRange,
          chart.xAxis[0].closestPointRange,
          'Correct pointRange: #5823'
        );

    });
});