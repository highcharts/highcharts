$(function () {
    QUnit.test('Navigator series\' should keep it\'s position in series array, even after series.update()', function (assert) {
        var chart = Highcharts.stockChart('container', {
                series: [{
                    data: [1, 2, 3],
                    id: '1'
                }, {
                    data: [1, 2, 3],
                    id: '2'
                }, {
                    data: [1, 2, 3],
                    id: '3'
                }]
            }),
            initialIndexes = chart.series.map(function (s) {
                return s.options.id;
            }),
            afterUpdateIndexes;


        Highcharts.each(chart.series, function (s, i) {
            s.update({
                name: 'Name ' + i
            }, false);
        });
        chart.redraw();

        afterUpdateIndexes = chart.series.map(function (s) {
            return s.options.id;
        });

        assert.deepEqual(
            initialIndexes,
            afterUpdateIndexes,
            'Correct zIndexes after update'
        );
    });
});