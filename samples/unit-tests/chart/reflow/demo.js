/* eslint func-style:0 */


QUnit.test('Reflow height only (#6968)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false,
            width: 500
        },
        series: [{
            type: 'column',
            data: [1, 3, 2, 4]
        }]
    });

    var container = document.getElementById('container');
    assert.strictEqual(
        chart.chartHeight,
        400,
        'Default height'
    );

    container.style.height = '500px';
    chart.reflow();
    assert.strictEqual(
        chart.chartHeight,
        500,
        'Reflowed height'
    );
});