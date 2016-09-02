$(function () {

    QUnit.test('Remove event', function (assert) {
        var removed = 0,
            chart = Highcharts.chart('container', {

                chart: {
                    animation: false
                },

                plotOptions: {
                    series: {
                        animation: false
                    }
                },

                series: [{
                    id: 'first',
                    data: [1, 4, 2, 5],
                    type: 'column',
                    events: {
                        remove: function () {
                            removed++;
                        }
                    }
                }, {
                    id: 'second',
                    data: [5, 3, 1, 6],
                    type: 'column',
                    events: {
                        remove: function () {
                            removed++;
                        }
                    }
                }]

            });

        chart.get('first').remove();
        assert.strictEqual(
            removed,
            1,
            'One series removed'
        );

        chart.get('second').update({ color: 'red' });
        assert.strictEqual(
            removed,
            1,
            'Still one series removed (#5619)'
        );
    });
});