QUnit.test('fixedRenderer options', function (assert) {

    var chart = new Highcharts.Chart('container', {
        chart: {
            type: 'spline',
            style: {
                fontFamily: 'Papyrus'
            },
            scrollablePlotArea: {
                minWidth: 2000,
                scrollPositionX: 0,
                scrollPositionY: 0
            }
        },
        series: [{
            name: 'Hestavollane',
            data: [0.2, 0.8, 0.8, 0.8, 1, 1.3, 1.5, 2.9, 1.9, 2.6, 1.6, 3, 4, 3.6,
                5.5, 6.2, 5.5, 4.5, 4, 3.1, 2.7, 4, 2.7, 2.3, 2.3, 4.1, 7.7, 7.1,
                5.6, 6.1, 5.8, 8.6, 7.2, 9, 10.9, 11.5, 11.6, 11.1, 12, 12.3, 10.7,
                9.4, 9.8, 9.6, 9.8, 9.5, 8.5, 7.4, 7.6]

        }]
    });
    assert.equal(
        chart.fixedRenderer.style.fontFamily,
        chart.options.chart.style.fontFamily,
        'fixedRenderer should inherit style from options'
    );
});
