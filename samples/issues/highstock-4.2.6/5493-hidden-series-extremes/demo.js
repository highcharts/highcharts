$(function () {
    function getRandomData(start, end) {
        var data = [];

        for (; start <= end; start += (1000 * 60)) {
            data.push([start, Math.random()]);
        }

        return data;
    }

    function equal(a, b, c) {
        console.log(a, b, c);
        return a === b && b === c && c === a;
    }

    QUnit.test('Extremes for xAxis with hidden series and dataGrouping.', function (assert) {
        var min = Date.UTC(2000, 0, 2),
            max = Date.UTC(2000, 0, 4),
            chart = $('#container').highcharts('StockChart', {
                series: [{
                    data: getRandomData(Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 5))
                }, {
                    name: 'Data B',
                    data: getRandomData(min, max)
                }]
            }).highcharts(),
            extremes;

        chart.series[0].hide();
        extremes = chart.xAxis[0].getExtremes();

        assert.strictEqual(
      equal(extremes.dataMin, extremes.min, min),
      true,
      'Correct minimum'
    );
        assert.strictEqual(
      equal(extremes.dataMax, extremes.max, max),
      true,
      'Correct maximum'
    );
    });
});