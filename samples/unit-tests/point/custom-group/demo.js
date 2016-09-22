$(function () {

    QUnit.test('Custom point.group option (#5681)', function (assert) {

        assert.expect(0);
        Highcharts.chart('container', {

            chart: {
                type: 'column'
            },

            series: [{
                data: [{
                    y: 95,
                    group: 'test'
                }, {
                    y: 102.9
                }]
            }]

        });
    });
});