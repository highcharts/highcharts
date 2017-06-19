/* eslint func-style:0 */


QUnit.test('Container initially hidden (#6693)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'column',
            data: [1, 3, 2, 4]
        }]
    });

    document.getElementById('container').style.display = 'block';
    document.getElementById('outer').style.display = 'block';
    document.getElementById('outer').style.visibility = 'visible';
    document.getElementById('outer-outer').style.display = 'block';
    document.getElementById('outer-outer').style.visibility = 'visible';

    assert.strictEqual(
        chart.chartHeight,
        300,
        'Correct chart height when hidden'
    );
});