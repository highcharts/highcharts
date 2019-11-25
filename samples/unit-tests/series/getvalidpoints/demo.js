QUnit.module('Series.getValidPoints', () => {

    function getData() {
        var arr = [];
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                if (x === 5 && y === 5) { // one null
                    arr.push([x, null]);
                } else {
                    arr.push([x, y]);
                }
            }
        }
        return arr;
    }
    function test(inverted) {
        QUnit.test(`chart.inverted: ${inverted}`, assert => {
            const {
                series: [series],
                series: [{ points }]
            } = Highcharts.chart('container', {
                chart: {
                    type: 'scatter',
                    inverted: inverted,
                    width: 800,
                    height: 400
                },
                xAxis: {
                    min: 0.1,
                    max: 8.9
                },
                yAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    min: 0.1,
                    max: 8.9
                },
                series: [{
                    data: getData()
                }]
            });

            assert.strictEqual(
                series.getValidPoints(points).length,
                99,
                'All valid points'
            );

            assert.strictEqual(
                series.getValidPoints(points, true).length,
                63,
                'Valid points inside plot area'
            );

            points[0].visible = false;
            assert.strictEqual(
                series.getValidPoints(points).length,
                98,
                'Should filter out points with visible equal to false'
            );
        });
    }

    test(false);
    test(true);

});