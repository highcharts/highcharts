$(function () {
    QUnit.test('Hidden series after setData should call \'updatedData\' callback just once. #6012', function (assert) {
        var iterator = 0,
            chart = Highcharts.chart('container', {
                series: [{
                    data: [5, 10, 15],
                    visible: false
                }, {
                    data: [5, 10, 15],
                }, {
                    data: [15, 10, 5],
                }]
            }, function(chart) {
                Highcharts.addEvent(chart.series[0], 'updatedData', function() {
                    iterator++;
                });
            });

        chart.series[0].setData([3, 4, 5]);
        chart.series[1].hide();
        chart.series[1].show();

        assert.deepEqual(
            iterator,
            1,
            'Just one \'updatedData\' call'
        );
    });
});