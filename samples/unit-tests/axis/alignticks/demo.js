QUnit.test('Align ticks on logarithmic axis (#6021)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            height: 500
        },
        yAxis: [{
            type: 'logarithmic'
        }, {
            type: 'linear'
        }],

        series: [{
            data: [10319, 12060],
            yAxis: 0
        }, {
            data: [1, 2],
            yAxis: 1
        }]
    });

    assert.notEqual(
        chart.yAxis[0].tickPositions.length,
        chart.yAxis[1].tickPositions.length,
        'Ticks are not aligned'
    );

});
QUnit.test('Align ticks on opposite axis (#150)', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            height: 200,
            width: 400
        },

        title: {
            text: ''
        },

        series: [{
            yAxis: 0,
            data: [1, 2]
        }, {
            yAxis: 1,
            data: [1, 2]
        }],

        yAxis: [{
            opposite: true
        }, {
            min: -100,
            max: 100
        }]
    });

    var gridNodes1 = chart.yAxis[0].gridGroup.element.childNodes;
    var gridNodes2 = chart.yAxis[1].gridGroup.element.childNodes;

    assert.equal(
        gridNodes1[gridNodes1.length - 1].getAttribute('d'),
        gridNodes2[gridNodes2.length - 1].getAttribute('d'),
        'Ticks are not aligned'
    );
});
