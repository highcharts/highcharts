
QUnit.test('Drilldown with Highstock (#5764)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'pie'
        },

        series: [{
            data: [{
                name: 'Cats',
                y: 3
            }, {
                name: 'Dogs',
                y: 2
            }, {
                name: 'Cars',
                y: 4,
                drilldown: 'cars'
            }],
            animation: false,
            name: 'Upper'
        }],
        drilldown: {
            series: [{
                id: 'cars',
                data: [{
                    name: 'Electric',
                    y: 3
                }, {
                    name: 'ICE',
                    y: 4
                }],
                name: 'Cars'
            }]
        }
    });

    assert.strictEqual(
        chart.series[0].name,
        'Upper',
        'Ready'
    );


    chart.series[0].points[2].doDrilldown();
    assert.strictEqual(
        chart.series[0].name,
        'Cars',
        'Drilled'
    );
});
