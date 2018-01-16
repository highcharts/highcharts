
QUnit.test('#7677: Removing an annotations does not destroy its label collector', function (assert) {
    var labelCollector;
    var chart = Highcharts.chart('container', {
        chart: {
            events: {
                load: function () {
                    labelCollector = this.annotations[0].labelCollector;
                }
            }
        },

        series: [{
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }],

        annotations: [{
            id: '1',
            labels: [{
                point: {
                    x: 2,
                    y: 100000,
                    xAxis: 0,
                    yAxis: 0
                }
            }]
        }]
    });


    chart.removeAnnotation('1');

    assert.strictEqual(
        chart.labelCollectors.indexOf(labelCollector),
        -1,
        'Annotation label collector is not kept in the chart\'s label collectors'
    );
});
