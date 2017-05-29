

// #6138
QUnit.test('Reset colors and marker symbols after all series removed',
function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            data: [1, 4, 2, 5]
        }]
    });
    chart.addSeries({
        data: [1, 2, 3]
    });
    chart.series[0].remove();
    chart.series[0].remove();
    chart.addSeries({
        data: [1, 2, 3]
    });

    assert.strictEqual(chart.series[0].color,
        Highcharts.getOptions().colors[0],
        'Color of new series is same as first color in colors array');

    assert.strictEqual(chart.series[0].symbol,
        Highcharts.getOptions().symbols[0],
        'Symbol of new series is same as first symbol in symbols array');
});


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