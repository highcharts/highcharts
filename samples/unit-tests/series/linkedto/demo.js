$(function () {

    QUnit.test('Mutually linked (#3341)', function (assert) {

        // #3341 caused exceeded stack size
        assert.expect(0);
        var chart = Highcharts.chart('container', {

            series: [{
                data: [1, 3, 2, 4],
                type: 'column',
                id: 'A',
                linkedTo: 'B'
            }, {
                data: [1, 4, 3, 5],
                type: 'line',
                id: 'B',
                linkedTo: 'A'
            }]

        });

        chart.get('A').hide();
    });
});