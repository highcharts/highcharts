$(function () {
    QUnit.test('Columns were cut by cliprect, when resizing chart during initial animation.', function (assert) {

        var temp = [],
            rain = [],
        // Nearest hour to now
            done = assert.async(),
            chart;

        for (var i = 0; i < 24; i++) {
            temp.push([
                i * 3600000,
                Math.random()
            ]);
            rain.push([
                i * 3600000,
                Math.random()
            ]);
        }

    // create the chart
        $('#container').highcharts('StockChart', {
            chart: {
                animation: false,
                width: 550
            },
            yAxis: [{
                height: '63%'
            }, {
                top: '80%',
                height: '20%',
                offset: 0
            }],

            series: [{
                data: temp,
                yAxis: 0
            }, {
                type: 'column',
                data: rain,
                animation: true,
                yAxis: 1
            }]
        });

        setTimeout(function () {
            chart = $('#container').highcharts();

            chart.setSize(700, 450);

            assert.strictEqual(
                chart.series[1].clipBox.width,
                chart.series[1].xAxis.len,
                'Correct clipbox width.'
            );
            done();
        }, 10);
    });
});
