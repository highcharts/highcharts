
$(function () {
    QUnit.test('Missing plotband when range is small', function (assert) {
        var chart = Highcharts.chart('container1', {
            xAxis: {
              min: 1452666442250,
              max: 1453899392750,
              type: 'datetime',
              plotBands: [{
                color: "#BDBDBD",
                from: 1453101708000,
                to: 1453109508000
              }, {
                color: "red",
                from: 1453726531000,
                to: 1453728606000
              }]
            },
            series: [{
            }]
        });
        
        assert.strictEqual(
            chart.xAxis[0].plotLinesAndBands[1].svgElem.d.split(' ')[1] !== chart.xAxis[0].plotLinesAndBands[1].svgElem.d.split(' ')[6],
            true,
            'Second plotband is visible'
        );
    });
});